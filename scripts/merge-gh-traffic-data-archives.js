import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findMatchingFiles, getFilenameFromPath, parseTimestamp } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function mergeArchiveData(archiveGroups) {
  const dataByRepo = {};

  for (let key of Object.keys(archiveGroups)) {
    const archiveData = archiveGroups[key];

    const dataByDate = {};

    archiveData.forEach(({ views, clones, timestamp }) => {
      const archiveTimestamp = new Date(timestamp);
      const viewsData = views.views || [];
      const clonesData = clones.clones || [];

      viewsData.forEach((entry) => {
        const { dateStr, datetime } = parseTimestamp(entry.timestamp);
        if (!dataByDate[dateStr]) {
          dataByDate[dateStr] = { 
            date: dateStr, 
            clones: 0, 
            uniqueCloners: 0, 
            views: 0, 
            uniqueVisitors: 0, 
            datetime,
            viewsArchiveTimestamp: archiveTimestamp,
            clonesArchiveTimestamp: archiveTimestamp
          };
        }
        if (archiveTimestamp >= dataByDate[dateStr].viewsArchiveTimestamp) {
          dataByDate[dateStr].views = entry.count;
          dataByDate[dateStr].uniqueVisitors = entry.uniques;
          dataByDate[dateStr].viewsArchiveTimestamp = archiveTimestamp;
          if (datetime > dataByDate[dateStr].datetime) {
            dataByDate[dateStr].datetime = datetime;
          }
        }
      });

      clonesData.forEach((entry) => {
        const { dateStr, datetime } = parseTimestamp(entry.timestamp);
        if (!dataByDate[dateStr]) {
          dataByDate[dateStr] = { 
            date: dateStr, 
            clones: 0, 
            uniqueCloners: 0, 
            views: 0, 
            uniqueVisitors: 0, 
            datetime,
            viewsArchiveTimestamp: archiveTimestamp,
            clonesArchiveTimestamp: archiveTimestamp
          };
        }
        if (archiveTimestamp >= dataByDate[dateStr].clonesArchiveTimestamp) {
          dataByDate[dateStr].clones = entry.count;
          dataByDate[dateStr].uniqueCloners = entry.uniques;
          dataByDate[dateStr].clonesArchiveTimestamp = archiveTimestamp;
          if (datetime > dataByDate[dateStr].datetime) {
            dataByDate[dateStr].datetime = datetime;
          }
        }
      });
    });

    const values = Object.values(dataByDate)
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
      .map(({ datetime, viewsArchiveTimestamp, clonesArchiveTimestamp, ...rest }) => rest);

    dataByRepo[key] = values;
  }

  return dataByRepo;
}

async function main() {
  const archiveDir = path.join(rootDir, 'gh_traffic_data_archive');

  // if archiveDir doesn't exist create it
  if (!fs.existsSync(archiveDir)){
    fs.mkdirSync(archiveDir);
  }
  const archiveFolders = fs.readdirSync(archiveDir)
    .filter(folder => folder.startsWith('gh_traffic_data_'))
    .sort()
    .reverse();

  const archiveGroups = {};

  for (const folder of archiveFolders) {
    const folderPath = path.join(archiveDir, folder);

    const viewsPaths = await findMatchingFiles(`${folderPath}/*_traffic_views.json`);
    const clonesPaths = await findMatchingFiles(`${folderPath}/*_traffic_clones.json`);

    // sort them to ensure the repos line up
    viewsPaths.sort();
    clonesPaths.sort();

    if (viewsPaths.length != clonesPaths.length) {
      console.warn(`Failed to process ${folder}`);
      exit(1);
    }

    for (let i = 0; i < viewsPaths.length; i++) {
      const viewsPath = viewsPaths[i];
      const clonesPath = clonesPaths[i];

      if (fs.existsSync(viewsPath) && fs.existsSync(clonesPath)) {
        try {
          const views = JSON.parse(fs.readFileSync(viewsPath, 'utf-8'));
          const clones = JSON.parse(fs.readFileSync(clonesPath, 'utf-8'));
          const timestampStr = folder.replace('gh_traffic_data_', '');
          const year = timestampStr.substring(0, 4);
          const month = timestampStr.substring(4, 6);
          const day = timestampStr.substring(6, 8);
          const hour = timestampStr.substring(9, 11);
          const minute = timestampStr.substring(11, 13);
          const second = timestampStr.substring(13, 15);
          const timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;

          const viewsArchiveGroupName = getFilenameFromPath(viewsPath, false).split('_traffic_views')[0];
          const clonesArchiveGroupName = getFilenameFromPath(clonesPath, false).split('_traffic_clones')[0];

          if (viewsArchiveGroupName != clonesArchiveGroupName) {
            console.warn("Repository name mismatch for ${folder}. Cannot proceed. Aborting process.`);");
            exit(1);
          }
         
          if (!(viewsArchiveGroupName in archiveGroups)) {
            archiveGroups[viewsArchiveGroupName] = [];
          }

          archiveGroups[viewsArchiveGroupName].push({ views, clones, timestamp });
        } catch (err) {
          console.warn(`Failed to process ${folder}:`, err.message);
        }
      }
    }
  }

  for (let key of Object.keys(archiveGroups)) {
    archiveGroups[key].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  const merged = mergeArchiveData(archiveGroups);

  const arbitraryKey = Object.keys(archiveGroups)[0];
  const latestTimestamp = archiveGroups[arbitraryKey].length > 0 ? archiveGroups[arbitraryKey][0].timestamp : new Date().toISOString();
  
  const latestSummaryPaths = await findMatchingFiles(`${path.join(rootDir, "gh_traffic_data_latest")}/*_summary.md`);

  let retrievedTimestamp = latestTimestamp;
  for (let latestSummaryPath of latestSummaryPaths) {
    if (fs.existsSync(latestSummaryPath)) {
      try {
        const summaryContent = fs.readFileSync(latestSummaryPath, 'utf-8');
        const retrievedMatch = summaryContent.match(/\*\*Retrieved:\*\* (.+)/);
        if (retrievedMatch) {
          const retrievedStr = retrievedMatch[1].replace(' UTC', '');
          const retrievedDate = new Date(retrievedStr + ' UTC');
          if (!isNaN(retrievedDate.getTime())) {
            retrievedTimestamp = retrievedDate.toISOString();
          }
        }
      } catch (err) {
        console.warn('Failed to parse latest summary.md:', err.message);
      }
    }
  }
  

  const outputPath = path.join(rootDir, 'src', 'data', 'merged-gh-traffic-data.ts');
  const output = `// Auto-generated merged archive data
// Generated from: ${archiveFolders.join(', ')}
// Last updated: ${new Date().toISOString()}

export const MERGED_ARCHIVE_DATA = ${JSON.stringify(merged, null, 2)};
export const LAST_UPDATED_TIMESTAMP = '${retrievedTimestamp}';
`;

  fs.writeFileSync(outputPath, output, 'utf-8');
  for (let key of Object.keys(merged)) {
    console.log(`✅ Generated merged traffic data for ${key} with ${merged[key].length} entries`);
  }
  console.log(`   Output: ${outputPath}`);
}

await main();


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function parseTimestamp(timestamp) {
  const dt = new Date(timestamp);
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return { dateStr: `${month}/${day}`, datetime: dt };
}

function mergeArchiveData(archiveData) {
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

  return Object.values(dataByDate)
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .map(({ datetime, viewsArchiveTimestamp, clonesArchiveTimestamp, ...rest }) => rest);
}

function main() {
  const archiveDir = path.join(rootDir, 'traffic_data_archive');
  const archiveFolders = fs.readdirSync(archiveDir)
    .filter(folder => folder.startsWith('traffic_data_'))
    .sort()
    .reverse();

  const archiveGroups = [];

  for (const folder of archiveFolders) {
    const folderPath = path.join(archiveDir, folder);
    const viewsPath = path.join(folderPath, 'traffic_views.json');
    const clonesPath = path.join(folderPath, 'traffic_clones.json');

    if (fs.existsSync(viewsPath) && fs.existsSync(clonesPath)) {
      try {
        const views = JSON.parse(fs.readFileSync(viewsPath, 'utf-8'));
        const clones = JSON.parse(fs.readFileSync(clonesPath, 'utf-8'));
        const timestampStr = folder.replace('traffic_data_', '');
        const year = timestampStr.substring(0, 4);
        const month = timestampStr.substring(4, 6);
        const day = timestampStr.substring(6, 8);
        const hour = timestampStr.substring(9, 11);
        const minute = timestampStr.substring(11, 13);
        const second = timestampStr.substring(13, 15);
        const timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
        archiveGroups.push({ views, clones, timestamp });
      } catch (err) {
        console.warn(`Failed to process ${folder}:`, err.message);
      }
    }
  }

  archiveGroups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const merged = mergeArchiveData(archiveGroups);

  const latestTimestamp = archiveGroups.length > 0 ? archiveGroups[0].timestamp : new Date().toISOString();
  
  const latestSummaryPath = path.join(rootDir, 'traffic_data_latest', 'summary.md');
  let retrievedTimestamp = latestTimestamp;
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

  const outputPath = path.join(rootDir, 'src', 'merged-archive-data.ts');
  const output = `// Auto-generated merged archive data
// Generated from: ${archiveFolders.join(', ')}
// Last updated: ${new Date().toISOString()}

export const MERGED_ARCHIVE_DATA = ${JSON.stringify(merged, null, 2)};
export const LAST_UPDATED_TIMESTAMP = '${retrievedTimestamp}';
`;

  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ Generated merged archive data with ${merged.length} entries`);
  console.log(`   Output: ${outputPath}`);
}

main();


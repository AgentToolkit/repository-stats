import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findMatchingFiles, getFilenameFromPath, parseTimestamp } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function mergeStarsData(archiveGroups) {
  const dataByRepo = {};

  for (let key of Object.keys(archiveGroups)) {
    const archiveData = archiveGroups[key];
    const dataByDate = {};


    archiveData.forEach(({ stars, timestamp }) => {
      const archiveTimestamp = new Date(timestamp);
      const { dateStr, datetime } = parseTimestamp(stars.timestamp || timestamp);
      
      if (!dataByDate[dateStr] || archiveTimestamp >= new Date(dataByDate[dateStr].archiveTimestamp || 0)) {
        dataByDate[dateStr] = {
          date: dateStr,
          stars: stars.count,
          datetime,
          archiveTimestamp
        };
      }
    });

    const values = Object.values(dataByDate)
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
      .map(({ datetime, archiveTimestamp, ...rest }) => rest);

    dataByRepo[key] = values;
  }

  return dataByRepo;
}

async function main() {
  const archiveDir = path.join(rootDir, 'gh_stars_data_archive');
  
  if (!fs.existsSync(archiveDir)) {
    console.log('⚠️  No gh_stars_data_archive directory found. Creating empty merged data.');
    const outputPath = path.join(rootDir, 'src', 'data', 'merged-stars-data.ts');
    const lastUpdatedTimestamp = new Date().toISOString();
    const output = `// Auto-generated merged stars data
// No archive data found yet
// Last updated: ${lastUpdatedTimestamp}

export const MERGED_STARS_DATA = [];
export const LAST_UPDATED_STARS_TIMESTAMP = '${lastUpdatedTimestamp}';
`;

    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`✅ Generated empty merged stars data`);
    console.log(`   Output: ${outputPath}`);
    return;
  }

  const archiveFolders = fs.readdirSync(archiveDir)
    .filter(folder => folder.startsWith('gh_stars_data_'))
    .sort()
    .reverse();

  const archiveGroups = {};

  for (const folder of archiveFolders) {
    // find all the stars.json files
    const folderPath = path.join(archiveDir, folder);
    const starsPaths = await findMatchingFiles(`${folderPath}/*_stars.json`);

    for (let starsPath of starsPaths) {
      if (fs.existsSync(starsPath)) {
        try {
          const stars = JSON.parse(fs.readFileSync(starsPath, 'utf-8'));
          const timestampStr = folder.replace('gh_stars_data_', '');
          const year = timestampStr.substring(0, 4);
          const month = timestampStr.substring(4, 6);
          const day = timestampStr.substring(6, 8);
          const hour = timestampStr.substring(9, 11);
          const minute = timestampStr.substring(11, 13);
          const second = timestampStr.substring(13, 15);
          const timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;

          const archiveGroupName = getFilenameFromPath(starsPath, false).split("_stars")[0];
          if (!(archiveGroupName in archiveGroups)) {
            archiveGroups[archiveGroupName] = [];
          }

          archiveGroups[archiveGroupName].push({ stars, timestamp });
        } catch (err) {
          console.warn(`Failed to process ${folder}:`, err.message);
        }
      }
    }
  }

  // sort all the groups for each key
  for (let key of Object.keys(archiveGroups)) {
    archiveGroups[key].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  const merged = mergeStarsData(archiveGroups);

  // fix this
  const arbitraryKey = Object.keys(archiveGroups)[0];
  const latestTimestamp = archiveGroups[arbitraryKey].length > 0 ? archiveGroups[arbitraryKey][0].timestamp : new Date().toISOString();
  
  const latestSummaryPaths = await findMatchingFiles(`${path.join(rootDir, "gh_stars_data_latest")}/*_summary.md`);

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
  

  const outputPath = path.join(rootDir, 'src', 'data', 'merged-gh-stars-data.ts');
  const output = `// Auto-generated merged stars data
// Generated from: ${archiveFolders.join(', ')}
// Last updated: ${new Date().toISOString()}

import { StarsData } from "../types/stars-data";

export const MERGED_STARS_DATA: {[key: string]: StarsData[]} = ${JSON.stringify(merged, null, 2)};
export const LAST_UPDATED_STARS_TIMESTAMP = '${retrievedTimestamp}';
`;

  fs.writeFileSync(outputPath, output, 'utf-8');
  for (let key of Object.keys(merged)) {
    console.log(`✅ Generated merged stars data for ${key} with ${merged[key].length} entries`);
  }
  console.log(`   Output: ${outputPath}`);
}

await main();


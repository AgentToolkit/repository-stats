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

function mergeStarsData(archiveData) {
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

  return Object.values(dataByDate)
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .map(({ datetime, archiveTimestamp, ...rest }) => rest);
}

function main() {
  const archiveDir = path.join(rootDir, 'stars_data_archive');
  
  if (!fs.existsSync(archiveDir)) {
    console.log('⚠️  No stars_data_archive directory found. Creating empty merged data.');
    const outputPath = path.join(rootDir, 'src', 'merged-stars-data.ts');
    const output = `// Auto-generated merged stars data
// No archive data found yet
// Last updated: ${new Date().toISOString()}

export const MERGED_STARS_DATA = [];
`;

    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`✅ Generated empty merged stars data`);
    console.log(`   Output: ${outputPath}`);
    return;
  }

  const archiveFolders = fs.readdirSync(archiveDir)
    .filter(folder => folder.startsWith('stars_data_'))
    .sort()
    .reverse();

  const archiveGroups = [];

  for (const folder of archiveFolders) {
    const folderPath = path.join(archiveDir, folder);
    const starsPath = path.join(folderPath, 'stars.json');

    if (fs.existsSync(starsPath)) {
      try {
        const stars = JSON.parse(fs.readFileSync(starsPath, 'utf-8'));
        const timestampStr = folder.replace('stars_data_', '');
        const year = timestampStr.substring(0, 4);
        const month = timestampStr.substring(4, 6);
        const day = timestampStr.substring(6, 8);
        const hour = timestampStr.substring(9, 11);
        const minute = timestampStr.substring(11, 13);
        const second = timestampStr.substring(13, 15);
        const timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
        archiveGroups.push({ stars, timestamp });
      } catch (err) {
        console.warn(`Failed to process ${folder}:`, err.message);
      }
    }
  }

  archiveGroups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const merged = mergeStarsData(archiveGroups);

  const latestTimestamp = archiveGroups.length > 0 ? archiveGroups[0].timestamp : new Date().toISOString();
  
  const latestSummaryPath = path.join(rootDir, 'stars_data_latest', 'summary.md');
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

  const outputPath = path.join(rootDir, 'src', 'merged-stars-data.ts');
  const output = `// Auto-generated merged stars data
// Generated from: ${archiveFolders.join(', ')}
// Last updated: ${new Date().toISOString()}

export const MERGED_STARS_DATA = ${JSON.stringify(merged, null, 2)};
export const LAST_UPDATED_STARS_TIMESTAMP = '${retrievedTimestamp}';
`;

  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ Generated merged stars data with ${merged.length} entries`);
  console.log(`   Output: ${outputPath}`);
}

main();


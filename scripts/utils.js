import { glob } from "glob";

export function parseTimestamp(timestamp) {
  const dt = new Date(timestamp);
  const year = String(dt.getFullYear()).padStart(4, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return { dateStr: `${month}/${day}/${year}`, datetime: dt };
}


export function getFilenameFromPath(path, with_extension=true) {
  const pathParts = path.split(/[\\/]/);
  const filename = pathParts.pop();

  if (!with_extension) {
    return filename.split('.')[0];
  }

  return filename;
}

export async function findMatchingFiles(pattern) {
  try {
    const files = await glob(pattern);

    return files;
  } catch (err) {
    console.warn("Error finding matching files: ", err);
  }
}

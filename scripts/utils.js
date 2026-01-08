import { glob } from "glob";

export async function findMatchingFiles(pattern) {
  try {
    const files = await glob(pattern);
    console.log("Found matching files: ", files);

    files.forEach(file => {
      console.log(file);
    });

    return files;
  } catch (err) {
    console.log("Error finding matching files: ", err);
  }
}

import { readdir } from 'fs';
import { promisify } from 'util';

const readDirAsync = promisify(readdir);

export class DirectoryNotFound extends Error {
  constructor(message: string) {
    super(`Failed to read directory: ${message}`);
    this.name = 'DirectoryNotFound';
  }
}

export default async function isDirectoryEmpty(
  directoryPath: string,
  treatNonexistentAsEmpty: boolean = false
): Promise<boolean> {
  try {
    const files = await readDirAsync(directoryPath);
    return files.length === 0;
  } catch (error) {
    if (error.code === 'ENOENT' && treatNonexistentAsEmpty) {
      return true;
    }
    throw new DirectoryNotFound(error.message);
  }
}

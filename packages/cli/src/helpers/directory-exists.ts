import { existsSync, lstatSync } from 'fs';

export default function directoryExists(dirPath: string): boolean {
  try {
    return existsSync(dirPath) && lstatSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

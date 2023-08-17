import * as fs from 'fs';
import * as path from 'path';

let cachedRebelRoot: string | undefined;

export const root = (suffix?: string, dir = process.cwd()): string => {
  if (!cachedRebelRoot) {
    let currentDir = dir;

    while (!fs.existsSync(path.join(currentDir, '.rebel'))) {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        throw new Error(
          'Cannot find Rebel root: .rebel directory not found in any parent directory'
        );
      }
      currentDir = parentDir;
    }

    cachedRebelRoot = currentDir;
  }

  return suffix ? path.join(cachedRebelRoot, suffix) : cachedRebelRoot;
};

export const resetRootCache = (): void => {
  cachedRebelRoot = undefined;
};

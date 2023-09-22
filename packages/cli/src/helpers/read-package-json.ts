import { readFileSync } from 'fs';
import { join } from 'path';

export class PackageJsonNotFound extends Error {
  constructor(path: string) {
    super(`Failed to read or parse package.json at path ${path}.`);
    this.name = 'PackageJsonNotFoundError';
  }
}

export default function readPackageJson(
  directory: string
): Record<string, any> | null {
  const packageJsonPath = join(directory, 'package.json');
  try {
    const content = readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new PackageJsonNotFound(packageJsonPath);
  }
}

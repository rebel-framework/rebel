import readPackageJson, { PackageJsonNotFound } from './read-package-json';
import { readFileSync } from 'fs';

jest.mock('fs');

describe('readPackageJson', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should read and parse a valid package.json', () => {
    const fakeContent = JSON.stringify({
      name: 'fake-package',
      version: '1.0.0',
    });
    (readFileSync as jest.Mock).mockReturnValueOnce(fakeContent);

    const result = readPackageJson('/fake/directory');
    expect(result).toEqual({ name: 'fake-package', version: '1.0.0' });
  });

  it('should throw PackageJsonNotFound if the file does not exist or is not readable', () => {
    (readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    const attemptRead = () => readPackageJson('/nonexistent/directory');
    expect(attemptRead).toThrow(PackageJsonNotFound);
    expect(attemptRead).toThrow(
      'Failed to read or parse package.json at path /nonexistent/directory/package.json.'
    );
  });

  it('should throw PackageJsonNotFound if the content is not valid JSON', () => {
    (readFileSync as jest.Mock).mockReturnValueOnce('Invalid JSON Content');

    const attemptRead = () => readPackageJson('/invalid/content/directory');
    expect(attemptRead).toThrow(PackageJsonNotFound);
    expect(attemptRead).toThrow(
      'Failed to read or parse package.json at path /invalid/content/directory/package.json.'
    );
  });
});

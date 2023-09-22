import isDirectoryEmpty, { DirectoryNotFound } from './is-directory-empty';
import { readdir } from 'fs';

jest.mock('fs');

describe('isDirectoryEmpty', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return true for an empty directory', async () => {
    (readdir as unknown as jest.Mock).mockImplementationOnce((_, callback) =>
      callback(null, [])
    );

    const result = await isDirectoryEmpty('/fake/empty/directory');
    expect(result).toBe(true);
  });

  it('should return false for a non-empty directory', async () => {
    (readdir as unknown as jest.Mock).mockImplementationOnce((_, callback) =>
      callback(null, ['file1.txt', 'file2.txt'])
    );

    const result = await isDirectoryEmpty('/fake/nonempty/directory');
    expect(result).toBe(false);
  });

  it('should return true for a non-existent directory with treatNonexistentAsEmpty=true', async () => {
    (readdir as unknown as jest.Mock).mockImplementationOnce((_, callback) =>
      callback({ code: 'ENOENT' }, null)
    );

    const result = await isDirectoryEmpty('/fake/nonexistent/directory', true);
    expect(result).toBe(true);
  });

  it('should throw DirectoryNotFound for a non-existent directory with treatNonexistentAsEmpty=false', async () => {
    (readdir as unknown as jest.Mock).mockImplementationOnce((_, callback) =>
      callback({ code: 'ENOENT' }, null)
    );

    await expect(
      isDirectoryEmpty('/fake/nonexistent/directory', false)
    ).rejects.toThrow(DirectoryNotFound);
  });

  it('should throw DirectoryNotFound for other errors', async () => {
    (readdir as unknown as jest.Mock).mockImplementationOnce((_, callback) =>
      callback(new Error('Some error'), null)
    );

    await expect(isDirectoryEmpty('/fake/error/directory')).rejects.toThrow(
      DirectoryNotFound
    );
  });
});

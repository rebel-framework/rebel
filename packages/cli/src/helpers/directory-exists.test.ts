import directoryExists from './directory-exists';
import { existsSync, lstatSync } from 'fs';

jest.mock('fs');

describe('directoryExists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for an existing directory', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(true);
    (lstatSync as jest.Mock).mockReturnValueOnce({
      isDirectory: () => true,
    });

    const result = directoryExists('/fake/directory/path');
    expect(result).toBe(true);
  });

  it('should return false if the path is a file', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(true);
    (lstatSync as jest.Mock).mockReturnValueOnce({
      isDirectory: () => false,
    });

    const result = directoryExists('/fake/file/path');
    expect(result).toBe(false);
  });

  it('should return false if the directory does not exist', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(false);

    const result = directoryExists('/nonexistent/directory/path');
    expect(result).toBe(false);
  });

  it('should return false if there is an error checking the directory', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(true);
    (lstatSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Some error');
    });

    const result = directoryExists('/error/directory/path');
    expect(result).toBe(false);
  });
});

import { success, fail } from '@rebel-framework/terminal';
import fs from 'fs';
import mkdir from './mkdir';

jest.mock('@rebel-framework/terminal', () => ({
  success: jest.fn(),
  fail: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('mkdir', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fail if no directory is provided', async () => {
    await mkdir.command({ directory: undefined, recursive: true });

    expect(fail).toHaveBeenCalledWith('Please provide a directory');
  });

  it('should fail if directory already exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await mkdir.command({ directory: 'someDir', recursive: true });

    expect(fail).toHaveBeenCalledWith('Directory already exists');
  });

  it('should successfully create a directory if it does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await mkdir.command({ directory: 'someDir', recursive: true });

    expect(fs.mkdirSync).toHaveBeenCalledWith('someDir', { recursive: true });
    expect(success).toHaveBeenCalledWith('Directory was successfully created');
  });

  it('should fail with an error message if fs.mkdirSync throws an error', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Some fs error');
    });

    await mkdir.command({ directory: 'someDir', recursive: true });

    expect(fail).toHaveBeenCalledWith(
      'Could not create directory: Some fs error'
    );
  });

  it('should create directory non-recursively if recursive option is set to false', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await mkdir.command({ directory: 'someDir', recursive: false });

    expect(fs.mkdirSync).toHaveBeenCalledWith('someDir', { recursive: false });
  });

  describe('signature', () => {
    it('should have the correct signature', () => {
      expect(mkdir.signature).toEqual({
        arguments: {
          directory: {
            type: 'string',
          },
        },
        options: {
          recursive: {
            type: 'flag',
            name: '--recursive',
            short: '-r',
          },
        },
      });
    });
  });
});

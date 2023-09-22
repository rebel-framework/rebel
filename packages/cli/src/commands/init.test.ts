import { exec } from 'child_process';
import { join } from 'path';
import init from './init';
import { success, fail } from '@rebel-framework/terminal';
import isDirectoryEmpty from '../helpers/is-directory-empty';

jest.mock('child_process');
jest.mock('@rebel-framework/terminal');
jest.mock('../helpers/is-directory-empty');

describe('init', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fail if the directory is not empty', async () => {
    (isDirectoryEmpty as jest.Mock).mockResolvedValue(false);
    await init.command({ directory: './' });
    expect(fail).toHaveBeenCalledWith('Directory is not empty');
    expect(success).not.toHaveBeenCalled();
  });

  it('should initialize Rebel in an empty directory', async () => {
    (isDirectoryEmpty as jest.Mock).mockResolvedValue(true);
    (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => null);

    await init.command({ directory: './test-dir' });

    expect(fail).not.toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith('Rebel was successfully installed.');
  });

  it('should use default directory if not provided', async () => {
    (isDirectoryEmpty as jest.Mock).mockResolvedValue(true);
    (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => null);

    await init.command({ directory: undefined });

    const defaultDirectory = init.signature.options?.directory.default;
    expect(exec).toHaveBeenCalledWith(`mkdir "${defaultDirectory}"`);
    expect(exec).toHaveBeenCalledWith(
      `npx degit https://github.com/rebel-framework/skeleton.git "${defaultDirectory}" --force`
    );
    expect(exec).toHaveBeenCalledWith(`git init "${defaultDirectory}"`);
    expect(exec).toHaveBeenCalledWith(
      `mkdir "${join(defaultDirectory, '.rebel')}"`
    );
  });
});

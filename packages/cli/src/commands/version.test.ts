import { line } from '@rebel-framework/terminal';
import readPackageJson from '../helpers/read-package-json';
import version from './version';

jest.mock('@rebel-framework/terminal', () => ({
  line: jest.fn(),
}));

jest.mock('../helpers/read-package-json', () => {
  return jest.fn(() => Promise.resolve({ version: '1.2.3' }));
});

describe('version command', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the version from package.json and print it', async () => {
    await version.command();

    expect(readPackageJson).toHaveBeenCalledWith('./');
    expect(line).toHaveBeenCalledWith('Rebel v1.2.3');
  });

  it('should handle different versions', async () => {
    (readPackageJson as jest.Mock).mockResolvedValueOnce({ version: '2.0.0' });

    await version.command();

    expect(readPackageJson).toHaveBeenCalledWith('./');
    expect(line).toHaveBeenCalledWith('Rebel v2.0.0');
  });
});

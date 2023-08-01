import * as fs from 'fs';
import { root, resetRootCache } from '../../src/helpers/root';

jest.mock('fs');

beforeEach(() => {
  resetRootCache();
  (fs.existsSync as jest.Mock).mockReset();
});

describe('root', () => {
  it('finds Rebel root', () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      p.includes('.rebel')
    );

    expect(root(undefined, '/path/to/project')).toEqual('/path/to/project');
  });

  it('finds Rebel root with suffix', () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      p.includes('.rebel')
    );

    expect(root('src', '/path/to/project')).toEqual('/path/to/project/src');
  });

  it('throws error when Rebel root not found', () => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (p) => !p.includes('.rebel')
    );

    expect(() => root(undefined, '/path/to')).toThrow(
      'Cannot find Rebel root: .rebel directory not found in any parent directory'
    );
  });
});

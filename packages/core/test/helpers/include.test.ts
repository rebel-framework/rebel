import { include } from '../../src/helpers/include';
import { root } from '../../src/helpers/root';
import path from 'path';

jest.mock('../../src/helpers/root', () => {
  return {
    root: jest.fn((param) => param),
  };
});

describe('include', () => {
  const rootMock = root as jest.MockedFunction<typeof root>;

  it('should call root with the correct path', () => {
    // Resolve the absolute path to the current directory
    const absolutePath = path.resolve(__dirname);

    // The string parameter to be passed to root
    const filePathToInclude = 'include.js';
    const mockIncludedFilePath = `${absolutePath}/${filePathToInclude}`;
    rootMock.mockReturnValue(mockIncludedFilePath);

    // Call the include function with the filePathToInclude
    const inclusion = include(filePathToInclude);

    // Check if root is called with the correct parameter
    expect(rootMock).toHaveBeenCalledWith(`bin/${filePathToInclude}`);

    // Check if include returns the expected value
    expect(inclusion).toEqual({ test: { passes: true } });
  });
});

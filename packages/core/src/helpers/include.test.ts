import { include } from './include';
import { root } from './root';
import path from 'path';

jest.mock('./root', () => {
  return {
    root: jest.fn((param) => param),
  };
});

describe('include', () => {
  const rootMock = root as jest.MockedFunction<typeof root>;

  it('should call root with the correct path', () => {
    const absolutePath = path.resolve(__dirname);
    const filePathToInclude = 'include.fixture.js';
    const mockIncludedFilePath = `${absolutePath}/${filePathToInclude}`;
    rootMock.mockReturnValue(mockIncludedFilePath);

    const inclusion = include(filePathToInclude);
    expect(rootMock).toHaveBeenCalledWith(filePathToInclude);
    expect(inclusion).toEqual({ test: { passes: true } });
  });
});

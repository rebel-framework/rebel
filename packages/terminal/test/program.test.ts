import { exit } from '../src/program';

describe('program.ts', () => {
  let mockExit: jest.SpyInstance;

  beforeEach(() => {
    // This will replace process.exit with a mock function for the duration of the test
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit was called');
    });
  });

  afterEach(() => {
    mockExit.mockRestore(); // Restore original process.exit after each test
  });

  it('should call process.exit with provided code', () => {
    const exitCode = 3;

    // We'll wrap the call in a try-catch because our mock implementation of process.exit throws an error
    try {
      exit(exitCode);
    } catch (error) {
      expect(error.message).toBe('process.exit was called');
    }

    expect(mockExit).toHaveBeenCalledWith(exitCode);
  });
});

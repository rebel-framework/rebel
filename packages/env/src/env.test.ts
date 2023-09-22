import fs from 'fs';
import { useEnv } from '.';
import { EnvFileDoesNotExist } from './errors';

jest.mock('@rebel-framework/core', () => ({
  root: jest.fn((path) => `./mockRoot/${path}`),
}));

describe('useEnv', () => {
  // Mock file path for the tests
  const testEnvPath = './.testenv';

  beforeEach(() => {
    // Create a dummy file first
    if (!fs.existsSync(testEnvPath)) {
      fs.writeFileSync(testEnvPath, '');
    }
    const { clear } = useEnv(testEnvPath);
    clear(); // Clear the cache after the initial read
  });

  afterEach(() => {
    // Clean up mock env file after each test
    if (fs.existsSync(testEnvPath)) {
      fs.unlinkSync(testEnvPath);
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should read env variables correctly', () => {
    fs.writeFileSync(
      testEnvPath,
      'TEST_KEY=TEST_VALUE\nSECOND_KEY=SECOND_VALUE'
    );

    const { env } = useEnv(testEnvPath);

    expect(env('TEST_KEY')).toBe('TEST_VALUE');
    expect(env('SECOND_KEY')).toBe('SECOND_VALUE');
  });

  it('should throw EnvFileDoesNotExist if file is missing', () => {
    // Explicitly remove the file before the test
    if (fs.existsSync(testEnvPath)) {
      fs.unlinkSync(testEnvPath);
    }

    expect(() => {
      useEnv(testEnvPath);
    }).toThrow(EnvFileDoesNotExist);
  });

  it('should ignore malformed lines', () => {
    const mockEnvVariables = [
      'TEST_KEY=TEST_VALUE',
      'MALFORMED_LINE',
      'SECOND_KEY=SECOND_VALUE',
    ].join('\n');

    fs.writeFileSync(testEnvPath, mockEnvVariables);

    const { env } = useEnv(testEnvPath);

    expect(env('TEST_KEY')).toBe('TEST_VALUE');
    expect(env('SECOND_KEY')).toBe('SECOND_VALUE');
    expect(env('MALFORMED_LINE', null)).toBeNull(); // Using a default value to check non-existent keys.
  });

  it('should remove quotes from env variables if present', () => {
    fs.writeFileSync(testEnvPath, 'TEST_KEY="TEST_VALUE"');

    const { env } = useEnv(testEnvPath);

    expect(env('TEST_KEY')).toBe('TEST_VALUE');
  });

  it('should retain quotes within the string value', () => {
    fs.writeFileSync(testEnvPath, 'TEST_KEY="Some TEST_VALUE with "quotes""');

    const { env } = useEnv(testEnvPath);

    expect(env('TEST_KEY')).toBe('Some TEST_VALUE with "quotes"');
  });

  it('should handle default values correctly', () => {
    fs.writeFileSync(testEnvPath, 'BOOLEAN_KEY=true\nNUMBER_KEY=123');

    const { env } = useEnv(testEnvPath);

    expect(env('BOOLEAN_KEY', false)).toBe(true);
    expect(env('NON_EXISTENT_BOOLEAN_KEY', false)).toBe(false);
    expect(env('NUMBER_KEY', 0)).toBe(123);
    expect(env('NON_EXISTENT_NUMBER_KEY', 0)).toBe(0);
    expect(env('NON_EXISTENT_KEY')).toBeUndefined();
  });

  it('should interpret binary numbers as booleans', () => {
    fs.writeFileSync(testEnvPath, 'BOOLEAN_ONE=1\nBOOLEAN_ZERO=0');

    const { env } = useEnv(testEnvPath);

    expect(env('BOOLEAN_ONE', true)).toBe(true);
    expect(env('BOOLEAN_ZERO', true)).toBe(false);
  });

  it('should read from the default .env file if no filePath is provided', () => {
    const mockDefaultEnvPath = './mockRoot/.env'; // This is where the mocked root points to

    // Create a dummy file at the mock default location
    if (!fs.existsSync(mockDefaultEnvPath)) {
      fs.mkdirSync('./mockRoot', { recursive: true });
      fs.writeFileSync(mockDefaultEnvPath, 'DEFAULT_KEY=DEFAULT_VALUE');
    }

    const { env } = useEnv(); // Notice we're not passing in any path

    expect(env('DEFAULT_KEY')).toBe('DEFAULT_VALUE');

    // Clean up the mock .env file after the test
    if (fs.existsSync(mockDefaultEnvPath)) {
      fs.unlinkSync(mockDefaultEnvPath);
    }

    // Delete the mockRoot directory after cleaning up the .env file
    if (fs.existsSync('./mockRoot')) {
      fs.rmSync('./mockRoot', { recursive: true });
    }
  });
});

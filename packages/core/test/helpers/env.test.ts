import { env } from '../../src/helpers/env';

describe('env helper function', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it('should return the default value if the environment variable is not set', () => {
    const defaultValue = 'default';
    const result = env('NON_EXISTENT_ENV_VAR', defaultValue);
    expect(result).toBe(defaultValue);
  });

  it('should return the environment variable value for string type', () => {
    process.env.STRING_ENV_VAR = 'hello';
    const result = env('STRING_ENV_VAR', 'fallback');
    expect(result).toBe('hello');
  });

  it('should convert string "true" to boolean true', () => {
    process.env.BOOLEAN_ENV_VAR = 'true';
    const result = env('BOOLEAN_ENV_VAR', false);
    expect(result).toBe(true);
  });

  it('should convert string "false" to boolean false', () => {
    process.env.BOOLEAN_ENV_VAR = 'false';
    const result = env('BOOLEAN_ENV_VAR', true);
    expect(result).toBe(false);
  });

  it('should return false value for invalid boolean strings', () => {
    process.env.INVALID_BOOLEAN_ENV_VAR = 'invalid';
    const result = env('INVALID_BOOLEAN_ENV_VAR', true);
    expect(result).toBe(false);
  });

  it('should convert string to number when default value is a number', () => {
    process.env.NUMERIC_ENV_VAR = '42';
    const result = env('NUMERIC_ENV_VAR', 0);
    expect(result).toBe(42);
  });

  it('should return NaN for invalid numeric strings', () => {
    process.env.INVALID_NUMERIC_ENV_VAR = 'invalid';
    const result = env('INVALID_NUMERIC_ENV_VAR', 100);
    expect(result).toBe(NaN);
  });
});

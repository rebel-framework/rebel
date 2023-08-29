import fs from 'fs';
import { EnvFileDoesNotExist } from './errors';
import { root } from './helpers/root';

export function useEnv(filePath?: string) {
  const setKeys: string[] = []; // Track the keys that are set by read()

  const read = (filePath: string): void => {
    if (!fs.existsSync(filePath)) {
      throw new EnvFileDoesNotExist(filePath);
    }

    const contents = fs.readFileSync(filePath, 'utf-8');
    const lines = contents.split('\n');

    for (const line of lines) {
      const [key, rawValue] = line.split('=');

      if (key && rawValue) {
        let value = rawValue.trim();

        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        const trimmedKey = key.trim();

        if (process.env[trimmedKey] === undefined) {
          setKeys.push(trimmedKey); // Keep track of the keys set by this function
        }

        process.env[trimmedKey] = value;
      }
    }
  };

  const env = <T>(key: string, defaultValue?: T): T => {
    const value = process.env[key];

    if (value === undefined) {
      return defaultValue as T;
    }

    switch (typeof defaultValue) {
      case 'boolean':
        return (value.toLowerCase() === 'true' ||
          value === '1') as unknown as T;
      case 'number':
        return parseFloat(value) as unknown as T;
      default:
        return value as unknown as T;
    }
  };

  const clear = () => {
    for (const key of setKeys) {
      delete process.env[key];
    }
    setKeys.length = 0; // Clear the tracking array
  };

  // Perform initial read
  read(filePath || root('.env'));

  return {
    read,
    env,
    clear,
  };
}

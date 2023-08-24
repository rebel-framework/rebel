import fs from 'fs';
import { EnvFileDoesNotExist } from './errors';

const variables: Record<string, string> = {};

export function useEnv(filePath: string) {
  const read = (filePath: string): Record<string, string> => {
    if (Object.keys(variables).length > 0) {
      return variables;
    }

    if (!fs.existsSync(filePath)) {
      throw new EnvFileDoesNotExist(filePath);
    }

    const contents = fs.readFileSync(filePath, 'utf-8');
    const lines = contents.split('\n');

    for (const line of lines) {
      const [key, rawValue] = line.split('=');

      if (key && rawValue) {
        let value = rawValue.trim();

        // Check if the value is wrapped with double quotes and remove them
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        variables[key.trim()] = value;
      }
    }

    return variables;
  };

  const env = <T>(key: string, defaultValue?: T): T => {
    const value = variables[key];

    if (value === undefined) {
      return defaultValue as T;
    }

    switch (typeof defaultValue) {
      case 'boolean':
        return value.toLowerCase() === 'true' || value === '1'
          ? (true as T)
          : (false as T);
      case 'number':
        return parseFloat(value) as T;
      default:
        return value as T;
    }
  };

  const clear = () => {
    for (const key in variables) {
      delete variables[key];
    }
  };

  read(filePath);

  return {
    read,
    env,
    clear,
  };
}

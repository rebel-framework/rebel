import { root } from './helpers/root';

let hasRegisteredEnvironmentVariables = false;

export function registerEnvironmentVariables() {
  // Only run this once
  if (hasRegisteredEnvironmentVariables) {
    return;
  }

  // File path from the project root
  const envFilePath = root('.env');

  // Load env file using dotenv
  require('dotenv').config(envFilePath);

  // Ensure we won't do this twice
  hasRegisteredEnvironmentVariables = true;
}

export function env<T>(key: string, defaultValue?: T): T {
  if (!hasRegisteredEnvironmentVariables) {
    console.warn(
      'Rebel: Trying to access env variable before .env file was loaded'
    );
  }

  const value = process.env[key];

  if (value === undefined) {
    return defaultValue as T;
  }

  switch (typeof defaultValue) {
    case 'boolean':
      return value === 'true' || value === '1' ? (true as T) : (false as T);
    case 'number':
      return parseFloat(value) as T;
    default:
      return value as T;
  }
}

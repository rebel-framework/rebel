import { ConfigNotFoundError } from './errors';
import { include } from './helpers/include';
import { Config } from './types';

export function useConfig(): Config {
  const { default: config } = include('build/config');

  if (!config) {
    throw new ConfigNotFoundError();
  }

  return config as Config;
}

import { include } from './helpers/include';
import { Config } from './types';

export function useConfig(): Config {
  const { default: config } = include('config');
  return config;
}

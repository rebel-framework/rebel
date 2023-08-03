import { include } from './helpers/include';
import { Manifest } from './types';

export const useManifest = (): Manifest => {
  const { default: manifest } = include('manifest');
  return manifest;
};

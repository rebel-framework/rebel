import { root } from './helpers/root';
import { Manifest } from './types';

export const useManifest = (): Manifest => {
  const { default: manifest } = require(root('bin/manifest'));
  return manifest;
};

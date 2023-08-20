import { Module } from '../types';
import { root } from './root';

export function _require(path: string): any {
  return require(path);
}

export const include = (path: string): Module =>
  _require(root(`build/${path}`));

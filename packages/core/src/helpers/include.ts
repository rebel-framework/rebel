import { Module } from '../types';
import { root } from './root';

export const include = (path: string): Module => require(root(`bin/${path}`));

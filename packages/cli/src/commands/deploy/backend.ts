#!/usr/bin/env node
import { root, useStack } from '@rebel/core';

// TODO:
// - Load stack from project
// - Deploy stack
// - Make command to destroy stack
// - Investigate how to revert

const from = (path): NodeRequire => require(root(`bin/${path}`));

const stack = from('stack');
// const backend = useStack('Lads');

// backend.deploy();

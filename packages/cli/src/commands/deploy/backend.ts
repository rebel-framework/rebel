#!/usr/bin/env node
import { include } from '@rebel/core';

// TODO:
// ✓ Load stack from project
// - Deploy stack
// - Make command to destroy stack
// - Investigate how to revert

const stack = include('stack');

stack.deploy();

// const backend = useStack('Lads');

// backend.deploy();

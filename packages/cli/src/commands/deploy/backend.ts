#!/usr/bin/env node
import path from 'path';
import { useDeployer } from '@rebel/core';

const { deploy } = useDeployer('RebelStack');

deploy();

// Get the current working directory
const currentDirectory = process.cwd();

// Optionally, you can resolve the absolute path if needed.
const absolutePath = path.resolve(currentDirectory);

// const fileToImportAsJavascript = `${absolutePath}/bin/backend/index.js`;
const routesFilePath = path.resolve(`${absolutePath}/bin/backend/routes.js`);

console.log('Current directory:', currentDirectory);
console.log('Absolute path:', absolutePath);
console.log('Routes path:', routesFilePath);

// deploy();

#!/usr/bin/env node
import { useDeployer } from '@rebel/core';

const { deploy } = useDeployer('CdkTemplateStack');

deploy();

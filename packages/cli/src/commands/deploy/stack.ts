import { include, root } from '@rebel-framework/core';

/**
 * This file is used to load the stack from the
 * local project and make it available to CDK.
 */

const name = process.env.REBEL_CURRENT_STACK;
const path = `.rebel/stacks/${name}/stack.js`;

include(path);

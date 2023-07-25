import { Command } from '@rebel/core';

const hello: Command = async (args: string[]) => {
  console.log('Hello!');
};

export default hello;

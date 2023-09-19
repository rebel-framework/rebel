import {
  ask,
  choice,
  confirm,
  line,
  success,
  fail,
  bold,
} from '@rebel-framework/terminal';

import { Signature } from '../types';

export const signature: Signature = {
  name: {
    type: 'string',
    longFlag: '--name',
    shortFlag: '-N',
    default: 'anon',
  },
  fruit: {
    type: 'choice',
    longFlag: '--fruit',
    shortFlag: '-F',
    choices: ['Apple', 'Banana', 'Cherry'],
    default: 'Apple',
  },
};

async function hello({ fruit, name }) {
  console.log({ fruit, name });

  success('');

  const selectedFruit = await choice("What's your favourite fruit?", [
    'Apple',
    'Banana',
    'Cherry',
  ]);

  const selectedName = await ask(`What's your name?`, 'anon');

  const pluralizedFruit =
    selectedFruit[selectedFruit.length - 1] === 'y'
      ? selectedFruit.slice(0, -1) + 'ies'
      : selectedFruit;

  line(
    `Nice to meet you ${bold(selectedName)}! I heard you liked ${bold(
      pluralizedFruit
    )}`
  );

  const areYouSure = await confirm('Is that correct?', true);

  if (!areYouSure) {
    fail('Too bad!');
  }

  success('Alright, see ya!');
}

export default {
  signature,
  command: hello,
};

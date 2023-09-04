import {
  ask,
  choice,
  confirm,
  line,
  write,
  success,
  fail,
  clearScreen,
  lineBreak,
  bold,
} from '@rebel-framework/terminal';

export default async function hello(args: string[]) {
  const selected = await choice("What's your favourite fruit?", [
    'Apple',
    'Banana',
    'Cherry',
  ]);

  const name = await ask(`What's your name?`, 'anon');

  const fruit =
    selected[selected.length - 1] === 'y'
      ? selected.slice(0, -1) + 'ies'
      : selected;

  line(`Nice to meet you ${bold(name)}! I heard you liked ${bold(fruit)}`);

  const sure = await confirm('Is that correct?', true);

  if (!sure) {
    fail('Too bad!');
  }

  success('Alright, see ya!');
}

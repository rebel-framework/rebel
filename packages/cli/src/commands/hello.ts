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
  secret,
  input,
  bold,
} from '@rebel-framework/terminal';

export default async function hello(args: string[]) {
  // const name = await ask(`What's your name?`, 'anon');
  // line(`Your name is: ${bold(name)}`);

  // const sure = await confirm('Are you sure?', false);

  // if (!sure) {
  //   fail();
  // }

  const selected = await choice("What's your favourite fruit?", [
    'Apple',
    'Banana',
    'Cherry',
  ]);

  line('You selected: ' + selected + '\n');

  success('Done!');
}

import {
  choice,
  confirm,
  line,
  write,
  success,
  fail,
} from '@rebel-framework/terminal';

export default async function hello(args: string[]) {
  const sure = await confirm('Are you sure?', false);

  if (!sure) {
    fail();
  }

  const reallySure = await confirm('Are you really sure though?', true);

  if (sure && reallySure) {
    line('you know what you want in life.');
  } else {
    fail("You're not sure.");
  }

  const selected = await choice("What's your favourite fruit?", [
    'Apple',
    'Banana',
    'Cherry',
  ]);

  line('You selected: ' + selected + '\n');

  success('Done!');
}

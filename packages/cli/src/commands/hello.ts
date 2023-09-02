import { confirm, line, write, success } from '@rebel-framework/terminal';

export default async function hello(args: string[]) {
  const sure = await confirm('Are you sure?', true);
  const reallySure = await confirm('Are you really sure though?', true);

  if (sure && reallySure) {
    line('you know what you want in life.');
  }

  success('We done here');
}

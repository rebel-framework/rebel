import { input, lineBreak, setRawMode, write } from './io';
import { Writable } from 'stream';

const stdout = process.stdout as Writable;
const stdin = process.stdin as any;

export async function confirm(question: string): Promise<boolean> {
  write(`${question} (y/n):`);
  return (await input()).toLowerCase().startsWith('y');
}
let lastRenderedLines = 0;
export async function choice(
  question: string,
  choices: string[]
): Promise<string> {
  const stdin = process.stdin as any;
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');

  let selectedIndex = 0;

  function render() {
    stdout.write('\x1b[2J'); // Clear screen
    stdout.write('\x1b[H'); // Move cursor to top-left
    stdout.write(question + '\n');

    for (let i = 0; i < choices.length; i++) {
      if (i === selectedIndex) {
        stdout.write(`> ${choices[i]}\n`);
      } else {
        stdout.write(`  ${choices[i]}\n`);
      }
    }
  }

  return new Promise((resolve) => {
    stdin.on('data', function keyListener(char: string) {
      const upArrow = '\u001B\u005B\u0041';
      const downArrow = '\u001B\u005B\u0042';
      const enter = '\r';

      if (char === upArrow) {
        selectedIndex = Math.max(selectedIndex - 1, 0);
      } else if (char === downArrow) {
        selectedIndex = Math.min(selectedIndex + 1, choices.length - 1);
      } else if (char === enter) {
        stdin.setRawMode(false);
        stdin.removeListener('data', keyListener);
        resolve(choices[selectedIndex]);
        return;
      }

      render();
    });

    render();
  });
}

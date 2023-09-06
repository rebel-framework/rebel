import { TerminalKey } from './enums';
import * as output from './output';
import * as styles from './styles';

const stdin = process.stdin;

export function input(): Promise<string> {
  return new Promise((resolve) => {
    output.setRawMode(true);
    stdin.once('data', (data: unknown) => {
      output.setRawMode(false);
      resolve(data.toString());
    });
  });
}

export async function ask(
  question: string,
  defaultAnswer?: string
): Promise<string> {
  const hint =
    defaultAnswer === undefined ? '' : styles.lightGray(` (${defaultAnswer})`);
  output.write(`${styles.bold(styles.cyan(question))}${hint} `);
  const answer = (await input()).trim();
  return answer || defaultAnswer || '';
}

export async function confirm(
  question: string,
  defaultAnswer?: boolean
): Promise<boolean> {
  const hint =
    defaultAnswer === undefined
      ? '(y/n)'
      : defaultAnswer === true
      ? '(Y/n)'
      : '(y/N)';

  output.write(
    `${styles.bold(styles.cyan(question))} ${styles.lightGray(hint)}: `
  );

  const answer = (await input()).trim().toLowerCase();

  return answer ? answer.startsWith('y') : defaultAnswer || false;
}

export async function choice(
  question: string,
  choices: string[]
): Promise<string> {
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');

  let selectedIndex = 0;

  function render() {
    output.clearScreen();
    output.resetCursor();
    output.line(styles.bold(styles.cyan(question)));

    for (let i = 0; i < choices.length; i++) {
      if (i === selectedIndex) {
        output.line(
          `${styles.bold(styles.cyan(`>`))} ${styles.bold(choices[i])}`
        );
      } else {
        output.write(`  ${styles.lightGray(choices[i])}\n`);
      }
    }
  }

  return new Promise((resolve) => {
    stdin.on('data', function keyListener(char: string) {
      if (char === TerminalKey.UpArrow) {
        selectedIndex = Math.max(selectedIndex - 1, 0);
      } else if (char === TerminalKey.DownArrow) {
        selectedIndex = Math.min(selectedIndex + 1, choices.length - 1);
      } else if (char === TerminalKey.Enter) {
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

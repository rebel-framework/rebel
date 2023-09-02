import { Writable } from 'stream';
import { ConfirmQuestion, Question } from './types';

const stdout = process.stdout as Writable;

export function setRawMode(value: boolean) {
  const tty = stdout as any;
  if (tty && tty.isTTY && tty.setRawMode) {
    tty.setRawMode(value);
  }
}

export function readChar(): Promise<string> {
  return new Promise((resolve) => {
    setRawMode(true);
    process.stdin.once('data', (data) => {
      const char = data.toString();
      setRawMode(false);
      resolve(char);
    });
  });
}

type Answer = Record<string, any>;
type ConfirmAnswer = boolean;

export function write(message: string) {
  stdout.write(message);
}

export function lineBreak() {
  write('\n');
}

export function line(message: string) {
  write(message);
  lineBreak();
}

export function exit(success: boolean = true) {
  process.exit(success ? 0 : 1);
}

export function error(message: string = 'Command exited with an error') {
  line(message);
  exit(false);
}

export function success(message: string = 'Success!') {
  line(message);
  exit(false);
}

export async function confirm(
  question: string,
  defaultValue?: boolean
): Promise<ConfirmAnswer> {
  const confirmDefault =
    defaultValue === undefined ? 'y/n' : defaultValue ? 'Y/n' : 'y/N';
  write(`${question} (${confirmDefault}):`);
  const confirmAnswer = await readChar();
  return confirmAnswer.toLowerCase().startsWith('y');
}

export async function prompt(
  questions: Question[]
): Promise<Record<string, any>> {
  const answers: Record<string, any> = {};

  for (const question of questions) {
    switch (question.type) {
      case 'confirm':
        const confirmDefault =
          question.default === undefined
            ? 'y/n'
            : question.default
            ? 'Y/n'
            : 'y/N';
        stdout.write(`${question.message} (${confirmDefault}): `);
        const confirmAnswer = await readChar();
        stdout.write('\n');
        answers[question.name] = confirmAnswer.toLowerCase().startsWith('y');
        break;
      case 'list':
        stdout.write(`${question.message}\n`);
        question.choices.forEach((choice, index) => {
          stdout.write(`${index + 1}. ${choice}\n`);
        });
        const listDefault = question.default ? question.default : '1';
        stdout.write(`Choose an option (Default is ${listDefault}): `);
        const listAnswer = await readChar();
        stdout.write('\n');
        const choiceIndex = parseInt(listAnswer) - 1 || 0;
        answers[question.name] = question.choices[choiceIndex];
        break;
    }
  }

  return answers;
}

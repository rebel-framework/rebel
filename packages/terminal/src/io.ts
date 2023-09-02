import { Writable } from 'stream';
import { backgroundRed, bold, green } from './styling';

const stdout = process.stdout as Writable;

export function setRawMode(value: boolean) {
  const tty = stdout as any;
  if (tty && tty.isTTY && tty.setRawMode) {
    tty.setRawMode(value);
  }
}

export function input(): Promise<string> {
  return new Promise((resolve) => {
    setRawMode(true);
    process.stdin.once('data', (data) => {
      const char = data.toString();
      setRawMode(false);
      resolve(char);
    });
  });
}

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

export function fail(message: string = 'Fail') {
  line(backgroundRed(message));
  process.exit(1);
}

export function success(message: string = 'Success') {
  line(bold(green(message)));
  process.exit(0);
}

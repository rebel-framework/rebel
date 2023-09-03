import { Writable } from 'stream';
import { backgroundRed, bold, green } from './styles';
import { escapeAnsii } from './ansii';

const stdout = process.stdout as Writable;

export function setRawMode(value: boolean) {
  const tty = stdout as any;
  if (tty && tty.isTTY && tty.setRawMode) {
    tty.setRawMode(value);
  }
}

export function clearScreen() {
  write(escapeAnsii('2J'));
}

export function resetCursor() {
  write(escapeAnsii('H'));
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

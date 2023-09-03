import { escapeAnsii } from './ansii';
import { TextStyle, TextColor, BackgroundColor } from './enums';

const e = escapeAnsii;

// Text Styles
export function reset(): string {
  return `${e(TextStyle.Reset)}`;
}

export function bold(text: string): string {
  return `${e(TextStyle.Bold)}${text}${reset()}`;
}

export function dim(text: string): string {
  return `${e(TextStyle.Dim)}${text}${reset()}`;
}

export function italic(text: string): string {
  return `${e(TextStyle.Italic)}${text}${reset()}`;
}

export function underline(text: string): string {
  return `${e(TextStyle.Underline)}${text}${reset()}`;
}

export function blink(text: string): string {
  return `${e(TextStyle.Blink)}${text}${reset()}`;
}

export function reverse(text: string): string {
  return `${e(TextStyle.Reverse)}${text}${reset()}`;
}

export function hidden(text: string): string {
  return `${e(TextStyle.Hidden)}${text}${reset()}`;
}

export function strikethrough(text: string): string {
  return `${e(TextStyle.Strikethrough)}${text}${reset()}`;
}

// Text Colors
export function defaultColor(text: string): string {
  return `${e(TextColor.Default)}${text}${reset()}`;
}

export function black(text: string): string {
  return `${e(TextColor.Black)}${text}${reset()}`;
}

export function red(text: string): string {
  return `${e(TextColor.Red)}${text}${reset()}`;
}

export function green(text: string): string {
  return `${e(TextColor.Green)}${text}${reset()}`;
}

export function yellow(text: string): string {
  return `${e(TextColor.Yellow)}${text}${reset()}`;
}

export function blue(text: string): string {
  return `${e(TextColor.Blue)}${text}${reset()}`;
}

export function magenta(text: string): string {
  return `${e(TextColor.Magenta)}${text}${reset()}`;
}

export function cyan(text: string): string {
  return `${e(TextColor.Cyan)}${text}${reset()}`;
}

export function lightGray(text: string): string {
  return `${e(TextColor.LightGray)}${text}${reset()}`;
}

export function darkGray(text: string): string {
  return `${e(TextColor.DarkGray)}${text}${reset()}`;
}

export function lightRed(text: string): string {
  return `${e(TextColor.LightRed)}${text}${reset()}`;
}

export function lightGreen(text: string): string {
  return `${e(TextColor.LightGreen)}${text}${reset()}`;
}

export function lightYellow(text: string): string {
  return `${e(TextColor.LightYellow)}${text}${reset()}`;
}

export function lightBlue(text: string): string {
  return `${e(TextColor.LightBlue)}${text}${reset()}`;
}

export function lightMagenta(text: string): string {
  return `${e(TextColor.LightMagenta)}${text}${reset()}`;
}

export function lightCyan(text: string): string {
  return `${e(TextColor.LightCyan)}${text}${reset()}`;
}

export function white(text: string): string {
  return `${e(TextColor.White)}${text}${reset()}`;
}

// Background Colors
export function backgroundDefault(text: string): string {
  return `${e(BackgroundColor.Default)}${text}${reset()}`;
}

export function backgroundBlack(text: string): string {
  return `${e(BackgroundColor.Black)}${text}${reset()}`;
}

export function backgroundRed(text: string): string {
  return `${e(BackgroundColor.Red)}${text}${reset()}`;
}

export function backgroundGreen(text: string): string {
  return `${e(BackgroundColor.Green)}${text}${reset()}`;
}

export function backgroundYellow(text: string): string {
  return `${e(BackgroundColor.Yellow)}${text}${reset()}`;
}

export function backgroundBlue(text: string): string {
  return `${e(BackgroundColor.Blue)}${text}${reset()}`;
}

export function backgroundMagenta(text: string): string {
  return `${e(BackgroundColor.Magenta)}${text}${reset()}`;
}

export function backgroundCyan(text: string): string {
  return `${e(BackgroundColor.Cyan)}${text}${reset()}`;
}

export function backgroundLightGray(text: string): string {
  return `${e(BackgroundColor.LightGray)}${text}${reset()}`;
}

export function backgroundDarkGray(text: string): string {
  return `${e(BackgroundColor.DarkGray)}${text}${reset()}`;
}

export function backgroundLightRed(text: string): string {
  return `${e(BackgroundColor.LightRed)}${text}${reset()}`;
}

export function backgroundLightGreen(text: string): string {
  return `${e(BackgroundColor.LightGreen)}${text}${reset()}`;
}

export function backgroundLightYellow(text: string): string {
  return `${e(BackgroundColor.LightYellow)}${text}${reset()}`;
}

export function backgroundLightBlue(text: string): string {
  return `${e(BackgroundColor.LightBlue)}${text}${reset()}`;
}

export function backgroundLightMagenta(text: string): string {
  return `${e(BackgroundColor.LightMagenta)}${text}${reset()}`;
}

export function backgroundLightCyan(text: string): string {
  return `${e(BackgroundColor.LightCyan)}${text}${reset()}`;
}

export function backgroundWhite(text: string): string {
  return `${e(BackgroundColor.White)}${text}${reset()}`;
}

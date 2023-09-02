export function bold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}

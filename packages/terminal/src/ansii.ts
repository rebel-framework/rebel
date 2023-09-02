import * as os from 'os';

export const ANSI_ESCAPE_CODE = supportsAnsiEscapes() ? '\x1b[' : '';

export function supportsAnsiEscapes(): boolean {
  if (process.platform === 'win32') {
    // Check Windows build number for ANSI support (Windows 10 and above)
    const release = os.release().split('.');
    return parseInt(release[0]) >= 10;
  }
  // Assume other platforms support ANSI escape codes
  return true;
}

export function escapeAnsii(code: string): string {
  return `${ANSI_ESCAPE_CODE}${code}`;
}

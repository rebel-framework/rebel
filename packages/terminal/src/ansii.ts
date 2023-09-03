import * as os from 'os';

export const ANSII_ESCAPE_CODE = '\x1b[';

export function supportsAnsiiEscapes(): boolean {
  if (process.platform === 'win32') {
    // Check Windows build number for ANSI support (Windows 10 and above)
    const release = os.release().split('.');
    return parseInt(release[0]) >= 10;
  }

  // Assume other platforms support ANSI escape codes
  return true;
}

export function escapeAnsii(code: string): string {
  if (supportsAnsiiEscapes()) {
    return `${ANSII_ESCAPE_CODE}${code}`;
  } else {
    return code;
  }
}

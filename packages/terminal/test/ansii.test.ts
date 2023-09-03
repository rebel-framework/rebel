import * as os from 'os';
import {
  supportsAnsiiEscapes,
  escapeAnsii,
  ANSII_ESCAPE_CODE,
} from '../src/ansii'; // Replace with your actual import path

jest.mock('os');

describe('ansii', () => {
  let originalPlatform: NodeJS.Platform;

  beforeAll(() => {
    originalPlatform = process.platform;
  });

  afterEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  describe('supportsAnsiiEscapes()', () => {
    it('should return true for non-Windows platforms', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      });
      expect(supportsAnsiiEscapes()).toBe(true);
    });

    it('should return true for Windows 10 and above', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      (os.release as jest.Mock).mockReturnValue('10.0.0');
      expect(supportsAnsiiEscapes()).toBe(true);
    });

    it('should return false for Windows versions below 10', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      (os.release as jest.Mock).mockReturnValue('6.1.7601');
      expect(supportsAnsiiEscapes()).toBe(false);
    });
  });

  describe('escapeAnsii()', () => {
    it('should return the code with escape code if platform supports ANSI', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      });
      expect(escapeAnsii('1m')).toBe('\x1b[1m');
    });

    it('should return the code without escape if platform does not support ANSI', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      (os.release as jest.Mock).mockReturnValue('6.1.7601');
      const result = escapeAnsii('1m');
      expect(result).toBe('1m');
    });
  });
});

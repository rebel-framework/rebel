import { input, ask, confirm, choice } from '../src/input';

jest.mock('../src/output');
jest.mock('../src/styles');

const mockStdinOnce = (data: any) => {
  (process.stdin.once as any) = jest.fn((event, callback) => {
    callback(data);
  });
};

const mockStdinOn = (data: any, setRawMode: Function = jest.fn()) => {
  (process.stdin.on as any) = jest.fn((event, callback) => {
    callback(data);
  });
  (process.stdin.setRawMode as any) = setRawMode;
};

describe('input', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('input()', () => {
    it('should resolve to the user input', async () => {
      mockStdinOnce('testInput');
      const res = await input();
      expect(res).toBe('testInput');
    });
  });

  describe('ask()', () => {
    it('should return defaultAnswer if no input is provided', async () => {
      mockStdinOnce(' ');
      const res = await ask('Do you like testing?', 'Yes');
      expect(res).toBe('Yes');
    });
  });

  describe('confirm()', () => {
    it('should return false if no default and no input', async () => {
      mockStdinOnce(' ');
      const res = await confirm('Continue?');
      expect(res).toBe(false);
    });

    it('should return true if the user inputs "y"', async () => {
      mockStdinOnce('y');
      const res = await confirm('Continue?', false);
      expect(res).toBe(true);
    });
  });

  describe('choice()', () => {
    it('should return the selected choice', async () => {
      const setRawModeMock = jest.fn();
      mockStdinOn('\r', setRawModeMock); // Simulating Enter key
      const res = await choice('Choose one', ['option1', 'option2']);
      expect(res).toBe('option1');
      expect(setRawModeMock).toHaveBeenCalledWith(true);
    });
  });
});

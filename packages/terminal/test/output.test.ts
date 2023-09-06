import * as output from '../src/output';
import { backgroundRed, bold, green } from '../src/styles';
import { escapeAnsii } from '../src/ansii';
import * as program from '../src/program';

jest.mock('../src/styles', () => ({
  backgroundRed: jest.fn((text) => text),
  bold: jest.fn((text) => text),
  green: jest.fn((text) => text),
}));

jest.mock('../src/ansii', () => ({
  escapeAnsii: jest.fn((code) => code),
}));

jest.mock('../src/program', () => ({
  exit: jest.fn(),
}));

describe('Terminal functions', () => {
  let mockExit: jest.MockedFunction<typeof program.exit>;
  let mockWrite: jest.SpyInstance;

  beforeEach(() => {
    mockExit = program.exit as jest.MockedFunction<typeof program.exit>;
    mockWrite = jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('setRawMode should call setRawMode if tty and isTTY are true', () => {
    const setRawMock = jest.fn();
    (process.stdout as any).isTTY = true;
    (process.stdout as any).setRawMode = setRawMock;

    output.setRawMode(true);

    expect(setRawMock).toHaveBeenCalledWith(true);
  });

  it('clearScreen should write escapeAnsii("2J")', () => {
    output.clearScreen();

    expect(escapeAnsii).toHaveBeenCalledWith('2J');
    expect(mockWrite).toHaveBeenCalled();
  });

  it('resetCursor should write escapeAnsii("H")', () => {
    output.resetCursor();

    expect(escapeAnsii).toHaveBeenCalledWith('H');
    expect(mockWrite).toHaveBeenCalled();
  });

  it('write should call stdout.write', () => {
    const message = 'Hello, World!';
    output.write(message);

    expect(mockWrite).toHaveBeenCalledWith(message);
  });

  it('lineBreak should call write with newline', () => {
    output.lineBreak();

    expect(mockWrite).toHaveBeenCalledWith('\n');
  });

  it('line should write message and a newline', () => {
    const message = 'Hello, World!';
    output.line(message);

    expect(mockWrite).toHaveBeenCalledWith(message);
    expect(mockWrite).toHaveBeenCalledWith('\n');
  });

  it('fail should write with backgroundRed and exit with 1', () => {
    const failMessage = 'TestFail';
    output.fail(failMessage);

    expect(backgroundRed).toHaveBeenCalledWith(failMessage);
    expect(mockWrite).toHaveBeenCalledWith(failMessage);
    expect(mockWrite).toHaveBeenCalledWith('\n');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('fail should have a default message', () => {
    output.fail();

    expect(backgroundRed).toHaveBeenCalledWith('Fail');
    expect(mockWrite).toHaveBeenCalledWith('Fail');
    expect(mockWrite).toHaveBeenCalledWith('\n');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('success should write with bold and green styles and exit with 0', () => {
    const successMessage = 'TestSuccess';
    output.success(successMessage);

    expect(bold).toHaveBeenCalled();
    expect(green).toHaveBeenCalledWith(successMessage);
    expect(mockWrite).toHaveBeenCalledWith(successMessage);
    expect(mockWrite).toHaveBeenCalledWith('\n');
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('success should have a default message', () => {
    output.success();

    expect(bold).toHaveBeenCalled();
    expect(green).toHaveBeenCalledWith('Success');
    expect(mockWrite).toHaveBeenCalledWith('Success');
    expect(mockWrite).toHaveBeenCalledWith('\n');
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});

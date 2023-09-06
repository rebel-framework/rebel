import * as input from '../src/input';
import * as output from '../src/output';
import { TerminalKey } from '../src/enums';

jest.mock('../src/output');
jest.mock('../src/styles', () => ({
  bold: jest.fn((str) => `bold(${str})`),
  cyan: jest.fn((str) => `cyan(${str})`),
  lightGray: jest.fn((str) => `lightGray(${str})`),
}));

describe('input.ts', () => {
  const mockSetRawMode = output.setRawMode as jest.MockedFunction<
    typeof output.setRawMode
  >;

  const mockWrite = output.write as jest.MockedFunction<typeof output.write>;

  // Mocking stdin's functions
  let mockOnce: jest.SpyInstance;
  let mockOn: jest.SpyInstance;
  let mockRemoveListener: jest.SpyInstance;
  let mockSetEncoding: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(process.stdin, 'setRawMode').mockImplementation();

    mockOnce = jest.spyOn(process.stdin, 'once').mockImplementation();
    mockOn = jest.spyOn(process.stdin, 'on').mockImplementation();
    mockRemoveListener = jest
      .spyOn(process.stdin, 'removeListener')
      .mockImplementation();
    mockSetEncoding = jest
      .spyOn(process.stdin, 'setEncoding')
      .mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('input should return user input as string', async () => {
    const mockData = 'mockData';

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const result = await input.input();
    expect(result).toBe(mockData);
    expect(mockSetRawMode).toHaveBeenCalledWith(true);
    expect(mockSetRawMode).toHaveBeenCalledWith(false);
  });

  it('ask should return user answer when no default is provided and user provides input', async () => {
    const mockData = 'userAnswer';

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'What is your name?';
    const answer = await input.ask(question);

    expect(answer).toBe(mockData);
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(`bold(cyan(${question}))`)
    );
  });

  it('ask should return an empty string when no default and no user input is provided', async () => {
    const mockData = ''; // User provides no input

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'What is your name?';
    const answer = await input.ask(question);

    expect(answer).toBe(''); // Expecting an empty string as the answer
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(`bold(cyan(${question}))`)
    );
  });

  it('ask should resort to default option when no answer is provided by user', async () => {
    const mockData = '';

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'Any ideas to share?';
    const defaultAnswer = 'None';
    const answer = await input.ask(question, defaultAnswer);

    expect(answer).not.toBe(mockData);
    expect(answer).toBe(defaultAnswer);
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(
        `bold(cyan(${question}))lightGray( (${defaultAnswer}))`
      )
    );
  });

  it('confirm should handle y/n confirmation', async () => {
    const mockData = 'y';

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'Are you sure?';
    const answer = await input.confirm(question);

    expect(answer).toBe(true);
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(`bold(cyan(${question}))`)
    );
  });

  it('confirm should return the default answer (true) if no user input is provided', async () => {
    const mockData = ''; // User provides no input

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'Confirm this action?';
    const defaultAnswer = true; // Providing a default answer of true

    const answer = await input.confirm(question, defaultAnswer);

    expect(answer).toBe(defaultAnswer); // Expecting the answer to be the default answer provided
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(`bold(cyan(${question}))`)
    );
  });

  it('confirm should return the default answer (false) if no user input is provided', async () => {
    const mockData = ''; // User provides no input

    // Make the mock implementation of once invoke its callback with mockData
    mockOnce.mockImplementation((_event, callback) => callback(mockData));

    const question = 'Confirm this action?';
    const defaultAnswer = false; // Providing a default answer of true

    const answer = await input.confirm(question, defaultAnswer);

    expect(answer).toBe(defaultAnswer); // Expecting the answer to be the default answer provided
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining(`bold(cyan(${question}))`)
    );
  });

  it('choice should return selected choice', async () => {
    const mockChoices = ['choice1', 'choice2', 'choice3'];
    const question = 'Choose one:';

    // Mocking the keyListener to simulate user selecting the second choice
    mockOn.mockImplementation((_event, keyListener) => {
      keyListener(TerminalKey.DownArrow); // Select second choice
      keyListener(TerminalKey.Enter); // Confirm choice
    });

    const selected = await input.choice(question, mockChoices);
    expect(selected).toBe(mockChoices[1]);
  });

  it('choice should return selected choice when navigating down and back up', async () => {
    const mockChoices = ['choice1', 'choice2', 'choice3'];
    const question = 'Choose one:';

    // Mocking the keyListener to simulate user selecting the second choice
    mockOn.mockImplementation((_event, keyListener) => {
      keyListener(TerminalKey.DownArrow); // Select second choice
      keyListener(TerminalKey.DownArrow); // Select third choice
      keyListener(TerminalKey.UpArrow); // Go back to second choice
      keyListener(TerminalKey.Enter); // Confirm choice
    });

    const selected = await input.choice(question, mockChoices);
    expect(selected).toBe(mockChoices[1]);
  });
});

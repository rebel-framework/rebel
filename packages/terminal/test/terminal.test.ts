import { Readable, Writable } from 'stream';
import { prompt } from '../src/terminal';
import { Question } from '../src/types';

describe('terminal', () => {
  let stdinMock: Readable;
  let stdoutMock: Writable;

  beforeEach(() => {
    stdinMock = new Readable();
    stdinMock._read = () => {}; // _read is required but you can noop it
    stdoutMock = new Writable();
    stdoutMock._write = (chunk, encoding, done) => {
      done();
    };
    jest.spyOn(process, 'stdin', 'get').mockReturnValue(stdinMock as any);
    jest.spyOn(process, 'stdout', 'get').mockReturnValue(stdoutMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle confirm type questions', async () => {
    const questions: Question[] = [
      {
        type: 'confirm',
        name: 'isAdult',
        message: 'Are you over 18?',
        default: true,
      },
    ];

    const promptPromise = prompt(questions);

    // Simulate user input
    process.nextTick(() => {
      stdinMock.push('y\n');
    });

    const answers = await promptPromise;

    expect(answers).toEqual({ isAdult: true });
  });
});

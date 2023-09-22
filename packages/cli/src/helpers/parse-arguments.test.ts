import { Signature } from '../types';
import parseArguments from './parse-arguments';

describe('parseArguments', () => {
  const signature: Signature = {
    arguments: {},
    options: {
      name: {
        type: 'string',
        name: '--name',
        short: '-N',
        default: 'anon',
      },
      age: {
        type: 'number',
        name: '--age',
        short: '-A',
        default: 25,
      },
      fruit: {
        type: 'choice',
        name: '--fruit',
        short: '-F',
        default: 'Apple',
        choices: ['Apple', 'Banana', 'Cherry'],
      },
    },
  };

  const positionalSignature: Signature = {
    arguments: {
      username: {
        type: 'string',
        default: 'guest',
      },
      age: {
        type: 'number',
        default: 25,
      },
    },
    options: {},
  };

  it('should parse string arguments', () => {
    const args = ['--name', 'Ben'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      name: 'Ben',
    });
  });

  it('should parse number arguments', () => {
    const args = ['--age', '30'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      age: 30,
    });
  });

  it('should parse choice arguments', () => {
    const args = ['--fruit', 'Banana'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      fruit: 'Banana',
    });
  });

  it('should default to signature default values when invalid choice provided', () => {
    const args = ['--fruit', 'Grape'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      fruit: 'Apple',
    });
  });

  it('should parse string arguments with = sign', () => {
    const args = ['--name=Ben'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      name: 'Ben',
    });
  });

  it('should parse choice arguments with = sign', () => {
    const args = ['--fruit=Banana'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({
      fruit: 'Banana',
    });
  });

  it('should ignore arguments not in signature', () => {
    const args = ['--unknown', 'value'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({});
  });

  it('should ignore unrecognized flags', () => {
    const args = ['--randomFlag', 'value', '-R', 'otherValue'];
    const result = parseArguments(args, signature);
    expect(result).toEqual({});
  });

  it('should handle absence of a short flag', () => {
    const customSignature: Signature = {
      arguments: {},
      options: {
        customArg: {
          type: 'string',
          name: '--customArg',
        },
      },
    };
    const args = ['-C', 'value'];
    const result = parseArguments(args, customSignature);
    expect(result).toEqual({});
  });

  it('should correctly parse boolean arguments with value "true"', () => {
    const booleanSignature: Signature = {
      arguments: {},
      options: {
        active: {
          type: 'boolean',
          name: '--active',
          short: '-a',
          default: false,
        },
      },
    };
    const args = ['--active', 'true'];
    const result = parseArguments(args, booleanSignature);
    expect(result).toEqual({ active: true });
  });

  it('should default to signature default value when non-true/false value provided for boolean', () => {
    const booleanSignature: Signature = {
      arguments: {},
      options: {
        active: {
          type: 'boolean',
          name: '--active',
          short: '-a',
          default: true,
        },
      },
    };
    const args = ['--active', 'someRandomValue'];
    const result = parseArguments(args, booleanSignature);
    expect(result).toEqual({ active: true });
  });

  it('should use default value for string arguments when no value is provided', () => {
    const stringSignature: Signature = {
      arguments: {},
      options: {
        name: {
          type: 'string',
          name: '--name',
          short: '-n',
          default: 'DefaultName',
        },
      },
    };
    const args = ['--name'];
    const result = parseArguments(args, stringSignature);
    expect(result).toEqual({ name: 'DefaultName' });
  });

  it('should use default value for number arguments when no valid number is provided', () => {
    const numberSignature: Signature = {
      arguments: {},
      options: {
        age: {
          type: 'number',
          name: '--age',
          short: '-a',
          default: 20,
        },
      },
    };
    const args = ['--age', 'notANumber'];
    const result = parseArguments(args, numberSignature);
    expect(result).toEqual({ age: 20 });
  });

  it('should parse valid choice arguments', () => {
    const choiceSignature: Signature = {
      arguments: {},
      options: {
        color: {
          type: 'choice',
          name: '--color',
          short: '-c',
          default: 'red',
          choices: ['red', 'blue', 'green'],
        },
      },
    };
    const args = ['--color', 'blue'];
    const result = parseArguments(args, choiceSignature);
    expect(result).toEqual({ color: 'blue' });
  });

  it('should correctly parse positional arguments', () => {
    const args = ['Alice', '30'];
    const result = parseArguments(args, positionalSignature);
    expect(result).toEqual({
      username: 'Alice',
      age: 30,
    });
  });

  it('should use default values when positional arguments are missing', () => {
    const args = ['Alice']; // age is missing
    const result = parseArguments(args, positionalSignature);
    expect(result).toEqual({
      username: 'Alice',
      age: 25, // default age
    });
  });

  it('should use default values for all positional arguments if none provided', () => {
    const args = [];
    const result = parseArguments(args, positionalSignature);
    expect(result).toEqual({
      username: 'guest', // default username
      age: 25, // default age
    });
  });

  it('should ignore extra positional arguments not defined in signature', () => {
    const args = ['Alice', '30', 'extraValue'];
    const result = parseArguments(args, positionalSignature);
    expect(result).toEqual({
      username: 'Alice',
      age: 30,
    });
  });

  it('should return input value for unknown argument types', () => {
    const customSignature: Signature = {
      options: {
        customArg: {
          type: 'unknownType' as any, // Intentionally setting a wrong type
          name: '--customArg',
        },
      },
    };

    const args = ['--customArg', 'someValue'];
    const result = parseArguments(args, customSignature);
    expect(result).toEqual({
      customArg: 'someValue',
    });
  });

  it('should return input value even if a default is provided for unknown types', () => {
    const customSignature: Signature = {
      options: {
        customArg: {
          type: 'unknownType' as any, // Intentionally setting a wrong type
          name: '--customArg',
          default: 'defaultValue',
        },
      },
    };

    const args = ['--customArg', 'someValue'];
    const result = parseArguments(args, customSignature);
    expect(result).toEqual({
      customArg: 'someValue',
    });
  });

  it('should return the provided value if it is a valid choice', () => {
    const choiceSignature: Signature = {
      options: {
        color: {
          type: 'choice',
          name: '--color',
          default: 'red',
          choices: ['red', 'blue', 'green'],
        },
      },
    };

    const args = ['--color', 'blue'];
    const result = parseArguments(args, choiceSignature);
    expect(result).toEqual({ color: 'blue' });
  });

  it('should return the default value if the provided choice is not valid', () => {
    const choiceSignature: Signature = {
      options: {
        color: {
          type: 'choice',
          name: '--color',
          default: 'red',
          choices: ['red', 'blue', 'green'],
        },
      },
    };

    const args = ['--color', 'yellow']; // "yellow" is not in the allowed choices
    const result = parseArguments(args, choiceSignature);
    expect(result).toEqual({ color: 'red' }); // Should default to 'red'
  });

  const flagSignature: Signature = {
    options: {
      force: {
        type: 'flag',
        name: '--force',
      },
    },
  };

  it('should return true whenever a flag is provided as an option', () => {
    const args = ['--force'];
    const result = parseArguments(args, flagSignature);
    expect(result).toEqual({ force: true });
  });

  it('should return undefined whenever a flag is absent', () => {
    const args = [];
    const result = parseArguments(args, flagSignature);
    expect(result).toEqual({ force: undefined });
  });
});

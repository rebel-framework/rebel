import { Signature } from '../../src/types';
import parseArguments from '../../src/helpers/parse-arguments';

describe('parseArguments', () => {
  const signature: Signature = {
    name: {
      type: 'string',
      longFlag: '--name',
      shortFlag: '-N',
      default: 'anon',
    },
    age: {
      type: 'number',
      longFlag: '--age',
      shortFlag: '-A',
      default: 25,
    },
    fruit: {
      type: 'choice',
      longFlag: '--fruit',
      shortFlag: '-F',
      default: 'Apple',
      choices: ['Apple', 'Banana', 'Cherry'],
    },
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
      customArg: {
        type: 'string',
        longFlag: '--customArg',
      },
    };
    const args = ['-C', 'value'];
    const result = parseArguments(args, customSignature);
    expect(result).toEqual({});
  });

  it('should correctly parse boolean arguments with value "true"', () => {
    const booleanSignature: Signature = {
      active: {
        type: 'boolean',
        longFlag: '--active',
        shortFlag: '-a',
        default: false,
      },
    };
    const args = ['--active', 'true'];
    const result = parseArguments(args, booleanSignature);
    expect(result).toEqual({ active: true });
  });

  it('should default to signature default value when non-true/false value provided for boolean', () => {
    const booleanSignature: Signature = {
      active: {
        type: 'boolean',
        longFlag: '--active',
        shortFlag: '-a',
        default: true,
      },
    };
    const args = ['--active', 'someRandomValue'];
    const result = parseArguments(args, booleanSignature);
    expect(result).toEqual({ active: true });
  });

  it('should use default value for string arguments when no value is provided', () => {
    const stringSignature: Signature = {
      name: {
        type: 'string',
        longFlag: '--name',
        shortFlag: '-n',
        default: 'DefaultName',
      },
    };
    const args = ['--name'];
    const result = parseArguments(args, stringSignature);
    expect(result).toEqual({ name: 'DefaultName' });
  });

  it('should use default value for number arguments when no valid number is provided', () => {
    const numberSignature: Signature = {
      age: {
        type: 'number',
        longFlag: '--age',
        shortFlag: '-a',
        default: 20,
      },
    };
    const args = ['--age', 'notANumber'];
    const result = parseArguments(args, numberSignature);
    expect(result).toEqual({ age: 20 });
  });

  it('should parse valid choice arguments', () => {
    const choiceSignature: Signature = {
      color: {
        type: 'choice',
        longFlag: '--color',
        shortFlag: '-c',
        default: 'red',
        choices: ['red', 'blue', 'green'],
      },
    };
    const args = ['--color', 'blue'];
    const result = parseArguments(args, choiceSignature);
    expect(result).toEqual({ color: 'blue' });
  });
});

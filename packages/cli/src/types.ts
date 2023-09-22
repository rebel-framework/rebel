export type Command = {
  (args: string[]): void;
};

export type ArgumentType = 'string' | 'number' | 'boolean' | 'choice';

export interface Argument {
  type: ArgumentType;
  // eslint-disable-next-line
  default?: any;
  choices?: string[];
}

export interface OptionalArgument extends Argument {
  name: string;
  short?: string;
}

export interface Signature {
  arguments?: { [argumentName: string]: Argument };
  options?: { [optionName: string]: OptionalArgument };
}

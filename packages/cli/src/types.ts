export type Command = {
  (args: string[]): void;
};

export type ArgumentType = 'string' | 'number' | 'boolean' | 'choice';

export interface ArgumentBase {
  type: ArgumentType;
  default?: any;
  choices?: string[];
}

export interface PositionalArgument extends ArgumentBase {}

export interface OptionalArgument extends ArgumentBase {
  name: string;
  short?: string;
}

export interface Signature {
  arguments?: { [argumentName: string]: PositionalArgument };
  options?: { [optionName: string]: OptionalArgument };
}

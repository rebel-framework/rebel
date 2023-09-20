export type Command = {
  (args: string[]): void;
};

export type ArgumentType = 'string' | 'number' | 'boolean' | 'choice';

export interface Argument {
  type: ArgumentType;
  name: string;
  short?: string;
  default?: any;
  choices?: string[];
}

export interface Signature {
  [argumentName: string]: Argument;
}

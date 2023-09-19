export type Command = {
  (args: string[]): void;
};

export type ArgumentType = 'string' | 'number' | 'boolean' | 'choice';

export interface Argument {
  type: ArgumentType;
  longFlag: string;
  shortFlag?: string;
  default?: any;
  choices?: string[];
}

export interface Signature {
  [argName: string]: Argument;
}

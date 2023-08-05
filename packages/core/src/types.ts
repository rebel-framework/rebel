import { HttpMethod } from './enums';

export interface Command {
  (args: string[]): void;
}

export interface Config {
  name: string;
  domain: string;
  environment: string;
  debug: boolean;
  aws: {
    key: string;
    secret: string;
    region: string;
  };
  database: {
    softDeletes: boolean;
  };
  app?: {
    [key: string]: any;
  };
}

export interface Module {
  default: any;
  [key: string]: any;
}

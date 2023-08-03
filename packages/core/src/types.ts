import { HttpMethod } from './enums';

export interface Command {
  (args: string[]): void;
}

export interface Manifest {
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

export type Middleware = (
  request: any,
  next: (request: any) => Promise<any>
) => Promise<any>;

export interface Route {
  path: RegExp;
  method: HttpMethod;
  handler: (request: any) => Promise<any>;
  middleware?: Middleware[];
  keys: string[];
}

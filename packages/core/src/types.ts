import { HttpMethod } from './enums';

export interface Command {
  (args: string[]): void;
}

export type Middleware = (
  request: any,
  next: () => Promise<any>
) => Promise<any>;

export interface Route {
  path: RegExp;
  method: HttpMethod;
  handler: (request: any) => Promise<any>;
  middleware?: Middleware[];
  keys: string[];
}

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
  github: {
    username: string;
    repository: string;
    token: string;
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

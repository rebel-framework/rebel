export type Command = {
  (args: string[]): void;
};

export type Config = {
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
    [key: string]: boolean | number | string;
  };
};

export type Module = {
  default: unknown;
  [key: string]: unknown;
};

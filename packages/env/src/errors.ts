export class EnvFileDoesNotExist extends Error {
  constructor(filePath: string) {
    super(`Environment file ${filePath} does not exist.`);
    this.name = 'EnvFileDoesNotExist';
    // Setting the prototype explicitly ensures that the instanceof check works.
    // This is needed for custom errors in TypeScript when targeting ES6+.
    Object.setPrototypeOf(this, EnvFileDoesNotExist.prototype);
  }
}

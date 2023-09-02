export class ConfigNotFoundError extends Error {
  constructor() {
    super('Configuration not found or is invalid.');
    this.name = 'ConfigNotFoundError';
  }
}

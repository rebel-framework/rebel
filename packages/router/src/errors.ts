export class MethodNotAllowedError extends Error {
  constructor(message = 'Method Not Allowed') {
    super(message);
    this.name = 'MethodNotAllowedError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

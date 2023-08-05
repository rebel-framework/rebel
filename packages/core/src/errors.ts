import { response } from './response';

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message = 'Method Not Allowed') {
    super(message);
    this.name = 'MethodNotAllowedError';
  }
}

export function errorHandler(error: Error) {
  console.error(error);

  if (error instanceof NotFoundError) {
    return response(404, {
      message: error.message,
    });
  }

  if (error instanceof MethodNotAllowedError) {
    return response(405, {
      message: error.message,
    });
  }

  // Fallback for unknown errors
  return response(500, {
    message: 'Internal Server Error',
  });
}

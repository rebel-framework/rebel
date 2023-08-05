import { response, Response } from '../src/response'; // adjust the import as per your file location

describe('response', () => {
  let headers: any;
  let body: string | object;
  let statusCode: number;

  beforeEach(() => {
    headers = { 'Content-Type': 'application/json' };
    body = { data: 'test data' };
    statusCode = 200;
  });

  it('should return a response object with correct structure', () => {
    const result: Response = response(statusCode, body, headers);
    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('headers');
    expect(result).toHaveProperty('body');
  });

  it('should return the status code passed into the function', () => {
    const result: Response = response(statusCode, body, headers);
    expect(result.statusCode).toEqual(statusCode);
  });

  it('should return the stringified body passed into the function', () => {
    const result: Response = response(statusCode, body, headers);
    expect(result.body).toEqual(JSON.stringify(body));
  });

  it('should return the headers passed into the function', () => {
    const result: Response = response(statusCode, body, headers);
    expect(result.headers).toEqual(headers);
  });

  it('should return default headers if none are provided', () => {
    const result: Response = response(statusCode, body);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    expect(result.headers).toEqual(defaultHeaders);
  });
});

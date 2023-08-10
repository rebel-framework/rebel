export type Response = {
  statusCode: number;
  headers: any;
  body: string;
};

export function response(
  statusCode: number,
  body: string | object,
  headers?: any
): Response {
  body = JSON.stringify(body);

  headers = headers || {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  return {
    statusCode,
    headers,
    body,
  };
}
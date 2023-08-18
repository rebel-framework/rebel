export type Response = {
  statusCode: number;
  headers: object;
  body: string;
};

export function response(
  statusCode: number,
  body: string | object,
  headers?: object
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

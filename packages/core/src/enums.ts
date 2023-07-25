/**
 * Enum representing various HTTP methods used in web requests.
 */
export enum HttpMethod {
  /**
   * Represents the HTTP GET method used to retrieve data from the server.
   */
  GET = 'GET',

  /**
   * Represents the HTTP POST method used to send data to the server for processing.
   */
  POST = 'POST',

  /**
   * Represents the HTTP PUT method used to update or replace data on the server.
   */
  PUT = 'PUT',

  /**
   * Represents the HTTP PATCH method used to apply partial modifications to a resource.
   */
  PATCH = 'PATCH',

  /**
   * Represents the HTTP DELETE method used to request the removal of a resource.
   */
  DELETE = 'DELETE',

  /**
   * Represents the HTTP HEAD method used to request the headers of a resource without the response body.
   */
  HEAD = 'HEAD',

  /**
   * Represents the HTTP OPTIONS method used to describe the communication options for the target resource.
   */
  OPTIONS = 'OPTIONS',

  /**
   * Represents the HTTP CONNECT method used to establish a network connection through a proxy.
   */
  CONNECT = 'CONNECT',

  /**
   * Represents the HTTP TRACE method used to retrieve a diagnostic trace of a request-response cycle.
   */
  TRACE = 'TRACE',
}

import { HttpMethod } from '../enums';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (request: any) => any;
}

// Initialize an empty global state for the router.
export const routes: Route[] = [];

export const route = (
  method: HttpMethod,
  path: string,
  handler: (request: any) => any
): void => {
  const route: Route = { method, path, handler };
  routes.push(route);
};

export const get = (path: string, handler: (request: any) => any): void =>
  route(HttpMethod.GET, path, handler);

export const post = (path: string, handler: (request: any) => any): void =>
  route(HttpMethod.POST, path, handler);

export const handleRequest = (request: any) => {
  const matchingRoute = routes.find(
    (route) => route.path === request.path && route.method === request.method
  );

  if (matchingRoute) {
    return matchingRoute.handler(request);
  } else {
    throw new Error('Not Found');
  }
};

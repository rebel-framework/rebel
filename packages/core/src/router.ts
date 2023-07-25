import { HttpMethod } from './enums';
import { Route, Middleware } from './types';

// Initialize an empty global state for the router.
export const routes: Route[] = [];

export const route = (
  method: HttpMethod,
  path: string,
  handler: (request: any) => Promise<any>,
  middleware?: Middleware[]
): void => {
  const route: Route = { method, path, handler, middleware };
  routes.push(route);
};

export const get = (
  path: string,
  handler: (request: any) => Promise<any>,
  middleware?: Middleware[]
): void => route(HttpMethod.GET, path, handler, middleware);

export const post = (
  path: string,
  handler: (request: any) => Promise<any>,
  middleware?: Middleware[]
): void => route(HttpMethod.POST, path, handler, middleware);

export const handleRequest = async (request: any) => {
  const matchingRoute = routes.find(
    (route) => route.path === request.path && route.method === request.method
  );

  if (matchingRoute) {
    if (matchingRoute.middleware) {
      // If middleware is defined for the route, execute it before the main handler.
      for (const middleware of matchingRoute.middleware) {
        await middleware(
          request,
          async () => await matchingRoute.handler(request)
        );
      }
    }

    // Execute the main handler.
    return await matchingRoute.handler(request);
  } else {
    throw new Error('Not Found');
  }
};

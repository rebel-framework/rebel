import { HttpMethod } from './enums';
import { Route, Middleware } from './types';

// Helper function to transform the path string into a RegExp and extract parameter names
export const parsePath = (path: string) => {
  const keys: string[] = [];
  path = path.replace(/:([^\s/]+)/g, (_, key) => {
    keys.push(key);
    return '([\\w-]+)';
  });
  return { pattern: new RegExp(`^${path}$`), keys };
};

export const useRouter = () => {
  // Initialize an empty state for the router.
  const routes: Route[] = [];

  const route = (
    method: HttpMethod,
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => {
    const { pattern, keys } = parsePath(path);
    const route: Route = { method, path: pattern, handler, middleware, keys };
    routes.push(route);
  };

  const get = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.GET, path, handler, middleware);

  const post = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.POST, path, handler, middleware);

  const put = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.PUT, path, handler, middleware);

  const patch = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.PATCH, path, handler, middleware);

  const del = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.DELETE, path, handler, middleware);

  const head = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.HEAD, path, handler, middleware);

  const options = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.OPTIONS, path, handler, middleware);

  const connect = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.CONNECT, path, handler, middleware);

  const trace = (
    path: string,
    handler: (request: any) => Promise<any>,
    middleware?: Middleware[]
  ): void => route(HttpMethod.TRACE, path, handler, middleware);

  const handleRequest = async (request: any) => {
    // First, find a route that matches the path
    const matchingRoutes = routes.filter((route) =>
      request.path.match(route.path)
    );

    if (matchingRoutes.length === 0) {
      // No route matches the path
      throw new Error('Not Found');
    }

    for (const route of matchingRoutes) {
      if (request.method === route.method) {
        const match = request.path.match(route.path);
        const params = match.slice(1).reduce((accum, val, index) => {
          accum[route.keys[index]] = val;
          return accum;
        }, {});

        request.params = params;

        let middlewareResponse;
        if (route.middleware) {
          for (const middleware of route.middleware) {
            middlewareResponse = await middleware(request, route.handler);
          }
        }

        return middlewareResponse || (await route.handler(request));
      }
    }

    // A route matches the path, but none match the method
    throw new Error('Method Not Allowed');
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    head,
    options,
    connect,
    trace,
    handleRequest,
  };
};

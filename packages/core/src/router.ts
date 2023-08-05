import { HttpMethod } from './enums';

export type Router = any;

export type Request = {
  path: string;
  httpMethod: HttpMethod;
  params?: RequestParams;
  [key: string]: any;
};

export type RequestParams = {
  [key: string]: any;
};

export type Handler = (request: Request, context: any) => Promise<any>;

export type Middleware = (
  request: Request,
  context: any,
  next: Handler
) => Promise<any>;

export interface Route {
  path: RegExp;
  httpMethod: HttpMethod;
  handler: Handler;
  middleware?: Middleware[];
  keys: string[];
}

// Helper function to transform the path string into a RegExp and extract parameter names
export function parsePath(path: string) {
  const keys: string[] = [];
  path = path.replace(/:([^\s/]+)/g, (_, key) => {
    keys.push(key);
    return '([\\w-]+)';
  });
  return { pattern: new RegExp(`^${path}$`), keys };
}

export function useRouter(): Router {
  // Initialize an empty state for the router.
  const routes: Route[] = [];

  const route = (
    httpMethod: HttpMethod,
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => {
    const { pattern, keys } = parsePath(path);
    const route: Route = {
      httpMethod,
      path: pattern,
      handler,
      middleware,
      keys,
    };
    routes.push(route);
  };

  const get = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.GET, path, handler, middleware);

  const post = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.POST, path, handler, middleware);

  const put = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.PUT, path, handler, middleware);

  const patch = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.PATCH, path, handler, middleware);

  const del = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.DELETE, path, handler, middleware);

  const head = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.HEAD, path, handler, middleware);

  const options = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.OPTIONS, path, handler, middleware);

  const connect = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.CONNECT, path, handler, middleware);

  const trace = (
    path: string,
    handler: Handler,
    middleware?: Middleware[]
  ): void => route(HttpMethod.TRACE, path, handler, middleware);

  const handle = async (request: Request, context: any) => {
    // First, find a route that matches the path
    const matchingRoutes = routes.filter((route) =>
      request.path.match(route.path)
    );

    if (matchingRoutes.length === 0) {
      // No route matches the path
      throw new Error('Not Found');
    }

    for (const route of matchingRoutes) {
      if (request.httpMethod === route.httpMethod) {
        const match = request.path.match(route.path);
        const params = match.slice(1).reduce((accum, val, index) => {
          accum[route.keys[index]] = val;
          return accum;
        }, {});

        request.params = params;

        let middlewareResponse;

        if (route.middleware) {
          for (const middleware of route.middleware) {
            middlewareResponse = await middleware(
              request,
              context,
              route.handler
            );
          }
        }

        return middlewareResponse || (await route.handler(request, context));
      }
    }

    // A route matches the path, but none match the method
    throw new Error('Method Not Allowed');
  };

  return {
    routes,
    get,
    post,
    put,
    patch,
    delete: del,
    head,
    options,
    connect,
    trace,
    handle,
  };
}

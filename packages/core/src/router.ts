import { HttpMethod } from './enums';
import { MethodNotAllowedError, NotFoundError } from './errors';

export type HttpMethodRoute = (
  path: string,
  handler: Handler,
  middleware?: Middleware[]
) => void;

export type Router = {
  routes: Route[];
  get: HttpMethodRoute;
  post: HttpMethodRoute;
  put: HttpMethodRoute;
  patch: HttpMethodRoute;
  delete: HttpMethodRoute;
  head: HttpMethodRoute;
  options: HttpMethodRoute;
  connect: HttpMethodRoute;
  trace: HttpMethodRoute;
  handle: (request: Request, context: Context) => Promise<unknown>;
};

export type Request = {
  path: string;
  httpMethod: HttpMethod;
  params?: RequestParams;
  [key: string]: unknown;
};

export type Context = unknown;

export type RequestParams = {
  [key: string]: unknown;
};

export type Handler = (request: Request, context: Context) => Promise<unknown>;

export type Middleware = (
  request: Request,
  context: Context,
  next: Handler
) => Promise<unknown>;

export type Route = {
  path: RegExp;
  httpMethod: HttpMethod;
  handler: Handler;
  middleware?: Middleware[];
  keys: string[];
};

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

  const get: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.GET, path, handler, middleware);

  const post: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.POST, path, handler, middleware);

  const put: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.PUT, path, handler, middleware);

  const patch: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.PATCH, path, handler, middleware);

  const del: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.DELETE, path, handler, middleware);

  const head: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.HEAD, path, handler, middleware);

  const options: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.OPTIONS, path, handler, middleware);

  const connect: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.CONNECT, path, handler, middleware);

  const trace: HttpMethodRoute = (path, handler, middleware) =>
    route(HttpMethod.TRACE, path, handler, middleware);

  const handle = async (request: Request, context: Context) => {
    // First, find a route that matches the path
    const matchingRoutes = routes.filter((route) =>
      request.path.match(route.path)
    );

    if (matchingRoutes.length === 0) {
      // No route matches the path
      throw new NotFoundError();
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
    throw new MethodNotAllowedError();
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

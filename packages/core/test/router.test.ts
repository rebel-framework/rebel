import { HttpMethod } from '../src/enums';
import { useRouter } from '../src/router';

describe('Router', () => {
  const mockContext = { some: 'context' };

  it('sets up GET route and handles request', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.get('/test/:id', mockHandler);

    await router.handle({ path: '/test/1', httpMethod: HttpMethod.GET });

    expect(mockHandler).toBeCalledWith(
      {
        httpMethod: HttpMethod.GET,
        params: { id: '1' },
        path: '/test/1',
      },
      undefined
    );
  });

  it('sets up GET route and handles request with context', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.get('/test/:id', mockHandler);

    await router.handle(
      { path: '/test/1', httpMethod: HttpMethod.GET },
      mockContext
    );

    expect(mockHandler).toBeCalledWith(
      {
        httpMethod: HttpMethod.GET,
        params: { id: '1' },
        path: '/test/1',
      },
      mockContext
    );
  });

  it('handles GET request with multi-segment dynamic route and correctly parses path parameters', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.get('/book/:genre/:bookId/:action', mockHandler);

    await router.handle({
      path: '/book/science-fiction/42/read',
      httpMethod: HttpMethod.GET,
    });

    expect(mockHandler).toBeCalledWith(
      {
        path: '/book/science-fiction/42/read',
        httpMethod: HttpMethod.GET,
        params: { genre: 'science-fiction', bookId: '42', action: 'read' },
      },
      undefined
    );
  });

  it('sets up POST route and handles request', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.post('/test/:id', mockHandler);

    await router.handle({ path: '/test/1', httpMethod: HttpMethod.POST });

    expect(mockHandler).toBeCalledWith(
      {
        path: '/test/1',
        httpMethod: HttpMethod.POST,
        params: { id: '1' },
      },
      undefined
    );
  });
  // PUT httpMethod
  it('should route a PUT request to the correct handler', async () => {
    const router = useRouter();

    router.put('/user/:id', async ({ params }) => {
      return { success: true, userId: params?.id };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.PUT,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // DELETE httpMethod
  it('should route a DELETE request to the correct handler', async () => {
    const router = useRouter();

    router.delete('/user/:id', async ({ params }) => {
      return { success: true, userId: params?.id };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.DELETE,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // PATCH httpMethod
  it('should route a PATCH request to the correct handler', async () => {
    const router = useRouter();

    router.patch('/user/:id', async ({ params }) => {
      return { success: true, userId: params?.id };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.PATCH,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // OPTIONS httpMethod
  it('should route an OPTIONS request to the correct handler', async () => {
    const router = useRouter();

    router.options('/user', async () => {
      return { success: true };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.OPTIONS,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // Note: In most cases, HEAD, CONNECT, and TRACE httpMethods are used less frequently and
  //       handling for these httpMethods may vary based on the use case. They're included here for completeness.
  // HEAD httpMethod
  it('should route a HEAD request to the correct handler', async () => {
    const router = useRouter();

    router.head('/user', async () => {
      return { success: true };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.HEAD,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // CONNECT httpMethod
  it('should route a CONNECT request to the correct handler', async () => {
    const router = useRouter();

    router.connect('/user', async () => {
      return { success: true };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.CONNECT,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // TRACE httpMethod
  it('should route a TRACE request to the correct handler', async () => {
    const router = useRouter();

    router.trace('/user', async () => {
      return { success: true };
    });

    const response = await router.handle({
      httpMethod: HttpMethod.TRACE,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  it('should throw "Method Not Allowed" when an incorrect method is used', async () => {
    const router = useRouter();

    router.get('/article/:id', async ({ id }) => ({ id }));

    const request = { httpMethod: HttpMethod.POST, path: '/article/123' };

    await expect(router.handle(request)).rejects.toThrow('Method Not Allowed');
  });
});

describe('Middleware', () => {
  it('handles request with middleware', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    const mockMiddleware = jest.fn((request, context, next) => next());

    router.get('/test/:id', mockHandler, [mockMiddleware]);

    await router.handle({ path: '/test/1', httpMethod: HttpMethod.GET });

    expect(mockMiddleware).toBeCalled();
    expect(mockHandler).toBeCalledWith(
      {
        path: '/test/1',
        httpMethod: HttpMethod.GET,
        params: { id: '1' },
      },
      undefined
    );
  });
});

describe('Errors', () => {
  it('throws error for unhandled route', async () => {
    const router = useRouter();

    await expect(
      router.handle({ path: '/test/1', httpMethod: HttpMethod.GET })
    ).rejects.toThrow('Not Found');
  });
});

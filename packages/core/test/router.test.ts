import { HttpMethod } from '../src/enums';
import { useRouter } from '../src/router';

describe('Router', () => {
  it('sets up GET route and handles request', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.get('/test/:id', mockHandler);

    await router.handleRequest({ path: '/test/1', method: HttpMethod.GET });

    expect(mockHandler).toBeCalledWith({
      path: '/test/1',
      method: HttpMethod.GET,
      params: { id: '1' },
    });
  });

  it('handles GET request with multi-segment dynamic route and correctly parses path parameters', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.get('/book/:genre/:bookId/:action', mockHandler);

    await router.handleRequest({
      path: '/book/science-fiction/42/read',
      method: HttpMethod.GET,
    });

    expect(mockHandler).toBeCalledWith({
      path: '/book/science-fiction/42/read',
      method: HttpMethod.GET,
      params: { genre: 'science-fiction', bookId: '42', action: 'read' },
    });
  });

  it('sets up POST route and handles request', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    router.post('/test/:id', mockHandler);

    await router.handleRequest({ path: '/test/1', method: HttpMethod.POST });

    expect(mockHandler).toBeCalledWith({
      path: '/test/1',
      method: HttpMethod.POST,
      params: { id: '1' },
    });
  });
  // PUT method
  it('should route a PUT request to the correct handler', async () => {
    const router = useRouter();

    router.put('/user/:id', async ({ params }) => {
      return { success: true, userId: params.id };
    });

    const response = await router.handleRequest({
      method: HttpMethod.PUT,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // DELETE method
  it('should route a DELETE request to the correct handler', async () => {
    const router = useRouter();

    router.delete('/user/:id', async ({ params }) => {
      return { success: true, userId: params.id };
    });

    const response = await router.handleRequest({
      method: HttpMethod.DELETE,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // PATCH method
  it('should route a PATCH request to the correct handler', async () => {
    const router = useRouter();

    router.patch('/user/:id', async ({ params }) => {
      return { success: true, userId: params.id };
    });

    const response = await router.handleRequest({
      method: HttpMethod.PATCH,
      path: '/user/123',
    });

    expect(response).toEqual({ success: true, userId: '123' });
  });

  // OPTIONS method
  it('should route an OPTIONS request to the correct handler', async () => {
    const router = useRouter();

    router.options('/user', async () => {
      return { success: true };
    });

    const response = await router.handleRequest({
      method: HttpMethod.OPTIONS,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // Note: In most cases, HEAD, CONNECT, and TRACE methods are used less frequently and
  //       handling for these methods may vary based on the use case. They're included here for completeness.
  // HEAD method
  it('should route a HEAD request to the correct handler', async () => {
    const router = useRouter();

    router.head('/user', async () => {
      return { success: true };
    });

    const response = await router.handleRequest({
      method: HttpMethod.HEAD,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // CONNECT method
  it('should route a CONNECT request to the correct handler', async () => {
    const router = useRouter();

    router.connect('/user', async () => {
      return { success: true };
    });

    const response = await router.handleRequest({
      method: HttpMethod.CONNECT,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  // TRACE method
  it('should route a TRACE request to the correct handler', async () => {
    const router = useRouter();

    router.trace('/user', async () => {
      return { success: true };
    });

    const response = await router.handleRequest({
      method: HttpMethod.TRACE,
      path: '/user',
    });

    expect(response).toEqual({ success: true });
  });

  it('should throw "Method Not Allowed" when an incorrect method is used', async () => {
    const router = useRouter();

    router.get('/article/:id', async ({ id }) => ({ id }));

    const request = { method: HttpMethod.POST, path: '/article/123' };

    await expect(router.handleRequest(request)).rejects.toThrow(
      'Method Not Allowed'
    );
  });
});

describe('Middleware', () => {
  it('handles request with middleware', async () => {
    const router = useRouter();

    const mockHandler = jest.fn();
    const mockMiddleware = jest.fn((request, next) => next());

    router.get('/test/:id', mockHandler, [mockMiddleware]);

    await router.handleRequest({ path: '/test/1', method: HttpMethod.GET });

    expect(mockMiddleware).toBeCalled();
    expect(mockHandler).toBeCalledWith({
      path: '/test/1',
      method: HttpMethod.GET,
      params: { id: '1' },
    });
  });
});

describe('Errors', () => {
  it('throws error for unhandled route', async () => {
    const router = useRouter();

    await expect(
      router.handleRequest({ path: '/test/1', method: HttpMethod.GET })
    ).rejects.toThrow('Not Found');
  });
});

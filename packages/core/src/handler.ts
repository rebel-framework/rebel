import { include } from './helpers/include';
import { errorHandler } from './errors';
import { Context, Request } from './router';

export async function handler(request: Request, context: Context) {
  try {
    const router = include('backend/routes');
    return await router.handle(request, context);
  } catch (error) {
    return errorHandler(error);
  }
}

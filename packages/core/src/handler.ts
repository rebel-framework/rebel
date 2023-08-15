import { include } from './helpers/include';
import { errorHandler } from './errors';
import { Context, Request, Router } from './router';

export async function handler(request: Request, context: Context) {
  try {
    const module = include('backend/routes');
    const router = module.default as Router;
    return await router.handle(request, context);
  } catch (error) {
    return errorHandler(error);
  }
}

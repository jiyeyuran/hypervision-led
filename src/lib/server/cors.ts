import type { APIContext, APIRoute } from 'astro';
import { jsonError } from './response';

function setCorsHeaders(headers: Headers) {
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET,POST,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type,cf-access-jwt-assertion');
}

export function withCors(response: Response): Response {
  setCorsHeaders(response.headers);
  return response;
}

export function corsPreflightResponse(): Response {
  const headers = new Headers();
  setCorsHeaders(headers);
  return new Response(null, { status: 204, headers });
}

type RouteHandler = (context: APIContext) => Promise<Response>;

export function apiHandler(handler: RouteHandler): APIRoute {
  return async (context) => {
    try {
      const response = await handler(context);
      setCorsHeaders(response.headers);
      return response;
    } catch (err) {
      console.error('API error:', err);
      const message = err instanceof Error ? err.message : 'Internal server error';
      return withCors(jsonError(message, 500));
    }
  };
}

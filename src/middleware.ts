import { defineMiddleware } from 'astro:middleware';
import { getSessionCookieName, validateSession } from '@/lib/auth';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdmin = pathname.startsWith('/admin');
  const isApiWrite =
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/health') &&
    !pathname.startsWith('/api/auth/login') &&
    context.request.method !== 'GET';

  if (!isAdmin && !isApiWrite) {
    return next();
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return next();
  }

  const sessionId = context.cookies.get(getSessionCookieName())?.value;
  const kv = context.locals.runtime?.env?.CACHE;

  if (!kv || !(await validateSession(kv, sessionId))) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect('/admin/login');
  }

  return next();
});

import type { APIRoute } from 'astro';
import {
  createSession,
  getSessionCookieName,
  verifyPassword,
} from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = locals.runtime?.env;
  if (!env?.CACHE) {
    return new Response(JSON.stringify({ error: 'Cache binding unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  let password = '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? '';
  } else {
    const form = await request.formData();
    password = String(form.get('password') ?? '');
  }

  const expected = env.ADMIN_PASSWORD ?? import.meta.env.ADMIN_PASSWORD ?? '';
  if (!verifyPassword(password, expected)) {
    return redirect('/admin/login?error=1');
  }

  const sessionId = await createSession(env.CACHE);
  cookies.set(getSessionCookieName(), sessionId, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return redirect('/admin');
};

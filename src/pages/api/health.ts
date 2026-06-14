import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const hasDb = Boolean(locals.runtime?.env?.DB);
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'uzine-today',
      bindings: { db: hasDb },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

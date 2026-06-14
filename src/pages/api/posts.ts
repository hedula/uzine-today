import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createPost, getDb, listAdminPosts } from '@/lib/db';

const editorBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
});

const editorOutputSchema = z.object({
  time: z.number().optional(),
  version: z.string().optional(),
  blocks: z.array(editorBlockSchema).default([]),
});

const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  cover_image_url: z.string().trim().url().optional().or(z.literal('')),
  content: editorOutputSchema,
});

function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

function mapSqliteError(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : 'Unexpected database error';

  if (message.includes('UNIQUE constraint failed: posts.slug')) {
    return json({ error: 'Slug already exists' }, { status: 409 });
  }

  return json({ error: message }, { status: 500 });
}

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals);
  const posts = await listAdminPosts(db);
  return json({ items: posts });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const payload = await request.json().catch(() => null);
  const parsed = createPostSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        error: 'Invalid payload',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const db = getDb(locals);
  const nowIso = new Date().toISOString();

  try {
    await createPost(db, {
      id: crypto.randomUUID(),
      slug: data.slug,
      title: data.title,
      summary: data.summary?.trim() ? data.summary.trim() : null,
      content_json: JSON.stringify(data.content),
      cover_image_url: data.cover_image_url?.trim() ? data.cover_image_url.trim() : null,
      category_id: null,
      author_id: 'admin',
      status: data.status,
      published_at: data.status === 'published' ? nowIso : null,
    });

    return json(
      {
        ok: true,
        slug: data.slug,
        title: data.title,
        status: data.status,
      },
      { status: 201 },
    );
  } catch (error) {
    return mapSqliteError(error);
  }
};

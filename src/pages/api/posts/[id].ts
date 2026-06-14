import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getDb, getPostById, updatePost } from '@/lib/db';

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

const updatePostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
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

export const GET: APIRoute = async ({ params, locals }) => {
  const postId = params.id;
  if (!postId) {
    return json({ error: 'Missing post id' }, { status: 400 });
  }

  const db = getDb(locals);
  const post = await getPostById(db, postId);

  if (!post) {
    return json({ error: 'Post not found' }, { status: 404 });
  }

  return json({ item: post });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const postId = params.id;
  if (!postId) {
    return json({ error: 'Missing post id' }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updatePostSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        error: 'Invalid payload',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const db = getDb(locals);
  const existing = await getPostById(db, postId);

  if (!existing) {
    return json({ error: 'Post not found' }, { status: 404 });
  }

  const data = parsed.data;
  const publishedAt =
    data.status === 'published'
      ? existing.published_at ?? new Date().toISOString()
      : null;

  try {
    await updatePost(db, postId, {
      slug: data.slug,
      title: data.title,
      summary: data.summary?.trim() ? data.summary.trim() : null,
      content_json: JSON.stringify(data.content),
      cover_image_url: data.cover_image_url?.trim() ? data.cover_image_url.trim() : null,
      category_id: existing.category_id,
      status: data.status,
      published_at: publishedAt,
    });

    return json({
      ok: true,
      id: postId,
      slug: data.slug,
      title: data.title,
      status: data.status,
    });
  } catch (error) {
    return mapSqliteError(error);
  }
};

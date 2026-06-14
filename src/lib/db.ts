import type {
  CreatePostInput,
  Post,
  PostListItem,
  PostStatus,
} from '@/types/database';

export function getDb(locals: App.Locals): D1Database {
  return locals.runtime.env.DB;
}

export async function listPublishedPosts(
  db: D1Database,
  limit = 20,
): Promise<PostListItem[]> {
  const { results } = await db
    .prepare(
      `SELECT
        p.id, p.slug, p.title, p.summary, p.cover_image_url,
        p.status, p.published_at,
        c.slug AS category_slug, c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT ?`,
    )
    .bind(limit)
    .all<PostListItem>();

  return results ?? [];
}

export async function listAdminPosts(
  db: D1Database,
  limit = 50,
): Promise<PostListItem[]> {
  const { results } = await db
    .prepare(
      `SELECT
        p.id, p.slug, p.title, p.summary, p.cover_image_url,
        p.status, p.published_at,
        c.slug AS category_slug, c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.updated_at DESC
      LIMIT ?`,
    )
    .bind(limit)
    .all<PostListItem>();

  return results ?? [];
}

export async function getPostBySlug(
  db: D1Database,
  slug: string,
): Promise<Post | null> {
  return await db
    .prepare('SELECT * FROM posts WHERE slug = ? LIMIT 1')
    .bind(slug)
    .first<Post>();
}

export async function createPost(
  db: D1Database,
  input: CreatePostInput,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO posts (
        id, slug, title, summary, content_json, cover_image_url,
        category_id, author_id, status, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      input.id,
      input.slug,
      input.title,
      input.summary,
      input.content_json,
      input.cover_image_url,
      input.category_id,
      input.author_id,
      input.status,
      input.published_at,
    )
    .run();
}

export async function updatePostStatus(
  db: D1Database,
  id: string,
  status: PostStatus,
): Promise<void> {
  const publishedAt = status === 'published' ? new Date().toISOString() : null;
  await db
    .prepare(
      `UPDATE posts
       SET status = ?, published_at = COALESCE(?, published_at), updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(status, publishedAt, id)
    .run();
}

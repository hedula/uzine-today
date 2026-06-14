export type PostStatus = 'draft' | 'published' | 'archived';

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content_json: string;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_image_url: string | null;
  status: PostStatus;
  published_at: string | null;
  category_slug: string | null;
  category_name: string | null;
}

export interface CreatePostInput {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content_json: string;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  status: PostStatus;
  published_at: string | null;
}

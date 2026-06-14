---
ID: SRC-001
Status: Active
Tags: [Schema, D1]
References: [PLAN-001, DEC-003]
Date: 20260612
---

# D1 Schema 說明

實際 migration：`/migrations/0001_init.sql`

## ER 關係

```text
users 1───* posts
categories 1───* posts
posts *───* tags  (via post_tags)
site_settings (key-value)
```

## 表摘要

### `posts`

| 欄位 | 型別 | 說明 |
|------|------|------|
| `content_json` | TEXT | Editor.js OutputData JSON |
| `category_id` | TEXT FK | 單一分類（MVP） |
| `author_id` | TEXT FK | 預設 `admin` |
| `status` | TEXT | `draft` / `published` / `archived` |

### `site_settings` vs KV

- **D1 `site_settings`**：唯一真相來源
- **KV `CACHE`**：讀取快取，key 如 `settings:all`、`posts:home`

## 套用 migration

```bash
# 本地
npx wrangler d1 execute uzine-db --local --file=./migrations/0001_init.sql

# 遠端
npx wrangler d1 execute uzine-db --remote --file=./migrations/0001_init.sql
```

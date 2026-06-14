# 隅誌今時 uZine Today

輕量內容出版平台 — Astro + Cloudflare + Editor.js

## 快速開始

```bash
npm install
cp .dev.vars.example .dev.vars   # 設定 ADMIN_PASSWORD
npm run db:migrate               # 本地 D1 schema
npm run dev
```

## 架構

- **渲染**：Astro Hybrid（前台 prerender、後台 SSR）
- **資料**：D1（結構化）、R2（媒體）、KV（快取 / session）
- **認證**：Zero Trust + 管理員密碼（見 `.development_document/3_decisions/DEC-001_*`）

## 文件

開發文件位於 [`.development_document/`](.development_document/README.md)。

任務進度：[`4_task/todo.md`](.development_document/4_task/todo.md)

## Cloudflare 設定

1. 建立 D1 database `uzine-db`，更新 `wrangler.jsonc` 的 `database_id`
2. 建立 KV namespace，更新 `id`
3. 建立 R2 bucket `uzine-media`
4. 設定 secret：`wrangler secret put ADMIN_PASSWORD`
5. Zero Trust Access policy 保護 `/admin`

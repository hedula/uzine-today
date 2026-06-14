---
ID: CTX-002
Status: Active
Tags: [Context, Tech-Stack]
References: [PLAN-001, DEC-001, DEC-002, DEC-003]
Date: 20260612
---

# 技術棧

## 前端與網站

| 項目 | 選型 | 備註 |
|------|------|------|
| 框架 | Astro 5.x | `output: 'hybrid'` |
| 語言 | TypeScript (strict) | |
| 樣式 | Tailwind CSS | 隨 Astro 骨架引入 |
| 部署 | Cloudflare Pages + Workers | `@astrojs/cloudflare` adapter |

## 編輯器

| 項目 | 選型 | 備註 |
|------|------|------|
| 後台編輯 | Editor.js | block JSON 儲存於 D1 |
| 前台渲染 | 自訂 Astro 元件 | 依 block type 對應 renderer |

## Cloudflare 服務

| 服務 | Binding | 用途 |
|------|---------|------|
| D1 | `DB` | 文章、分類、標籤、使用者、設定 |
| R2 | `MEDIA` | 封面、內文圖片 |
| KV | `CACHE` | 列表快取、session、站點設定快取 |

## 認證

- **邊界**：Cloudflare Zero Trust（保護 `/admin` 路徑）
- **應用層**：單一管理員密碼 + KV session cookie（見 DEC-001）

## 資料存取

- D1：原生 SQL migration（`migrations/`）
- 型別：`src/types/` 手寫 TypeScript interfaces
- 驗證：Zod（API 請求 body）

## 本地開發

```bash
npm run dev          # Astro dev
npm run db:migrate   # 本地 D1 migration（wrangler）
```

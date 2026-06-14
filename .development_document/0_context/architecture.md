---
ID: CTX-003
Status: Active
Tags: [Context, Architecture]
References: [PLAN-001, DEC-001, DEC-002, DEC-003]
Date: 20260612
---

# 系統架構

## 高階架構

```text
                    ┌─────────────────────┐
                    │ Cloudflare Zero Trust│
                    │  (/admin/* 邊界保護)  │
                    └──────────┬──────────┘
                               │
┌──────────────┐    ┌──────────▼──────────┐    ┌─────────────┐
│ Astro 前台    │◄───│  Astro Hybrid App   │───►│ Editor.js   │
│ (prerender)  │    │  @astrojs/cloudflare │    │ 後台編輯頁   │
└──────┬───────┘    └──────────┬──────────┘    └──────┬──────┘
       │                       │                      │
       │              ┌────────▼────────┐             │
       └──────────────►│  API Routes      │◄────────────┘
                       │  /api/posts/*    │
                       │  /api/media/*    │
                       │  /api/auth/*     │
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
           D1 (DB)          R2 (MEDIA)        KV (CACHE)
         結構化資料          圖片物件           快取 / session
```

## 渲染策略（Hybrid）

| 路由 | 模式 | 說明 |
|------|------|------|
| `/`, `/posts/*`, `/category/*`, `/tag/*`, `/about` | `prerender = true` | 靜態或 build 時生成；發布後可觸發 rebuild |
| `/admin/*` | SSR | 需 runtime、session、Editor.js |
| `/api/*` | SSR | D1 / R2 / KV 讀寫 |

## 資料流

### 發布文章

1. 管理員在 `/admin/posts/[id]` 用 Editor.js 編輯
2. `POST /api/posts` 或 `PATCH /api/posts/:id` 寫入 D1（`content_json`）
3. 圖片上傳走 `POST /api/media` → R2，回傳 URL 寫入 block JSON
4. 狀態改為 `published` 後，清除 KV 列表快取；觸發前台 revalidate / rebuild

### 前台讀取

1. 列表頁優先讀 KV 快照；miss 時查 D1 並寫回 KV
2. 文章頁 build 時從 D1 讀取，或以 SSR fallback（Phase 3 實作細節）

## 認證分層

1. **Zero Trust**：未授權使用者無法到達 `/admin`
2. **App session**：通過 Zero Trust 後，仍需應用層密碼登入取得 session cookie
3. **API middleware**：`/api/posts/*`、`/api/media/*` 驗證 session

## 目錄對應（程式碼）

```
src/
├── pages/           # 路由
├── pages/api/       # API routes
├── components/      # UI + Editor block renderers
├── lib/             # db, auth, cache helpers
├── types/           # Post, Category, EditorJS types
└── middleware.ts    # session 檢查
```

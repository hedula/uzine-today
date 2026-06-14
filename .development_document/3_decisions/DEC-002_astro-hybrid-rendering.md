---
ID: DEC-002
Status: Accepted
Tags: [Astro, Rendering, Cloudflare]
References: [PLAN-001, CTX-003]
Date: 20260612
---

# [DEC-002] Astro Hybrid 渲染模式

## 狀態

Accepted

## 背景

前台以內容為主、需良好 SEO 與效能；後台需瀏覽器端 Editor.js 與即時 API。需在單一 Astro 專案內兼顧兩者。

## 決策

使用 Astro **`output: 'hybrid'`**（Astro 4.2+ / 5.x 支援；若環境不支援則 fallback 為 `output: 'server'` 並對前台頁面個別設定 `prerender = true`）。

| 區塊 | 設定 |
|------|------|
| 全域 | `output: 'hybrid'` + `@astrojs/cloudflare` |
| 前台頁面 | `export const prerender = true` |
| 後台 `/admin/*` | 預設 SSR（不 prerender） |
| API `/api/*` | SSR |

Adapter 設定：

```js
adapter: cloudflare({
  mode: 'directory',
  platformProxy: { enabled: true },
})
```

## 理由

- Hybrid 讓多數讀取路徑靜態化，降低 Workers 執行成本
- 後台與 API 保留 edge runtime，可存取 D1 / R2 / KV
- 比全站 SSR 更符合內容站需求

## 後果

### 正面

- 前台 LCP / SEO 佳
- 單一 codebase 部署至 Cloudflare Pages

### 負面 / 取捨

- 發布新文章後需 **rebuild 或 on-demand revalidation** 更新靜態頁（Phase 3 實作）
- Hybrid 行為需在 CI 與本地 `wrangler pages dev` 驗證

## 相關

- `astro.config.mjs`
- `wrangler.jsonc`

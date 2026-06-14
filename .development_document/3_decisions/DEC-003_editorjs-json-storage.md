---
ID: DEC-003
Status: Accepted
Tags: [Editor.js, Content, D1]
References: [PLAN-001, CTX-003]
Date: 20260612
---

# [DEC-003] Editor.js JSON 儲存與前台渲染

## 狀態

Accepted

## 背景

文章內容需結構化、可擴充 block，並能快速上線 MVP。

## 決策

1. **儲存**：將 Editor.js 完整 `OutputData` JSON 字串存入 D1 `posts.content_json`（`TEXT`）。
2. **不另建 block 正規化表**：MVP 不做 per-block 資料表。
3. **前台渲染**：自訂 Astro 元件對應初期 block type：

   | Block | Renderer |
   |-------|----------|
   | `paragraph` | `EditorParagraph.astro` |
   | `header` | `EditorHeader.astro` |
   | `list` | `EditorList.astro` |
   | `quote` | `EditorQuote.astro` |
   | `image` | `EditorImage.astro` |
   | `delimiter` | `EditorDelimiter.astro` |

4. **Embed**：列為 Phase 2，MVP 不啟用 Editor.js Embed tool。
5. **圖片**：Image block 的 `file.url` 指向 R2 公開 URL（或 `/media/` proxy）。

## 理由

- JSON 欄位開發最快，符合 Editor.js 原生格式
- 自訂 renderer 控制 HTML 與 SEO，無需額外 runtime
- 未來可再加 migration 將 JSON 拆表或轉 MDX

## 後果

### 正面

- 編輯器與 API 簡單
- 型別可用 `OutputData` from `@editorjs/editorjs`

### 負面 / 取捨

- 全文搜尋需另建索引（非 MVP）
- 極長文章需注意 D1 SQLite `TEXT` 上限（實務上單篇部落格足夠）
- 新增 block type 需同步後台 tool 與前台 renderer

## 相關

- `src/types/editorjs.ts`
- `src/components/editor/`
- `src/lib/render-editorjs.ts`

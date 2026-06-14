---
ID: PLAN-001
Status: Active
Tags: [Product, Astro, Cloudflare, D1, R2, KV, Editor.js, Phase-1]
References: [DEC-001, DEC-002, DEC-003, CTX-001, CTX-002, CTX-003]
Date: 20260612
---

# [PLAN-001] 隅誌今時 uZine Today Phase 1 規劃

## 專案定位

**隅誌今時（uZine Today）** 是一個輕量、可擴充的內容出版平台，定位為個人或小型編輯團隊使用的部落格系統。

核心目標：
- 以 **Astro** 建立高效能、內容導向的前台網站
- 以 **Editor.js** 作為文章編輯器，支援 block-based 內容編排
- 以 **Cloudflare D1 / R2 / KV** 作為主要資料基礎設施
- 優先支援繁體中文內容與簡潔的編輯發布流程

## 名詞說明

| 名稱 | 含義 |
|------|------|
| **規劃階段**（本文件） | 產品與技術定義，不含大量程式開發 |
| **開發 Phase 1–4** | 見下方「開發 Phase 建議」，為實作里程碑 |

## 本階段目標（規劃階段）

規劃階段先完成「產品與技術基礎定義」，不直接進入複雜功能開發。

本階段交付內容：
- 專案資訊架構與功能範圍定義
- Astro + Cloudflare 架構規劃
- 資料儲存責任切分（D1 / R2 / KV）
- Editor.js 編輯資料流設計
- MVP 開發順序與後續 Phase 草案

## 技術選型

### 1. 前端與網站框架
- **Astro**
- 理由：
  - 適合內容型網站，靜態輸出與混合渲染彈性高
  - 預設效能佳，SEO 友善
  - 容易與 Cloudflare Pages / Workers 整合

### 2. 編輯器
- **Editor.js**
- 理由：
  - 內容以 block JSON 儲存，便於未來轉換、渲染、版本化
  - 比傳統 WYSIWYG 更適合結構化內容與自訂 block
  - 可逐步加入圖片、引用、標題、清單、嵌入等能力

### 3. 基礎設施
- **Cloudflare D1**：文章、分類、標籤、使用者、設定等結構化資料
- **Cloudflare R2**：封面圖、內文圖片、附件等物件儲存
- **Cloudflare KV**：快取、網站設定、熱門文章索引、ISR / 頁面輔助資料

## 系統架構草案

```text
Editor.js Admin
   -> API / Server Actions
      -> D1: 文章 metadata、內容 JSON、分類、標籤、狀態
      -> R2: 圖片與媒體檔案
      -> KV: 快取資料、站點設定、熱門/最新列表快照

Astro Frontend
   -> 讀取 D1 / KV
   -> 渲染文章列表、文章頁、分類頁、標籤頁
   -> 必要時透過 Worker API 做動態查詢或後台操作
```

## 資料責任分工

### D1 儲存內容
- `posts`
  - id
  - slug
  - title
  - summary
  - content_json
  - cover_image_url
  - category_id（FK → categories）
  - author_id（FK → users）
  - status（draft / published / archived）
  - published_at
  - created_at
  - updated_at
- `categories`
- `tags`
- `post_tags`
- `users`（若 MVP 就做登入）
- `site_settings`（若不放 KV）

### R2 儲存內容
- 文章封面圖
- Editor.js 圖片 block 上傳檔案
- 可能的附件或未來媒體素材

### KV 儲存內容
- 網站讀取快取
- 首頁文章列表快照
- 分類 / 標籤頁快取
- 全站設定快取
- Rate limiting 或短期 session 輔助資料（若需要）

## 內容模型初稿

### 文章狀態
- `draft`：草稿
- `published`：已發布
- `archived`：封存

### 文章必要欄位
- 標題
- slug
- 摘要
- 封面圖
- Editor.js JSON 內容
- 分類
- 標籤
- 發布狀態
- 發布時間

### Editor.js Block 初期支援
- Paragraph
- Header
- List
- Quote
- Image
- Delimiter
- Embed（可列為第二階段）

## MVP 功能範圍

### 前台
- 首頁文章列表
- 文章詳細頁
- 分類頁
- 標籤頁
- About / 關於頁
- 基本 SEO（title, meta description, Open Graph）

### 後台
- 管理員登入
- 文章列表
- 新增文章
- 編輯文章
- 儲存草稿
- 發布 / 取消發布
- 圖片上傳到 R2

### 暫不納入 MVP
- 多作者權限分級
- 評論系統
- 全文搜尋
- 電子報整合
- 排程發布
- 文章版本回溯

## 路由與頁面規劃

### 前台路由
- `/`
- `/posts/[slug]`
- `/category/[slug]`
- `/tag/[slug]`
- `/about`

### 後台路由
- `/admin`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/[id]`
- `/admin/media`

## 開發 Phase 建議

### Phase 1：規劃與骨架
- 建立 Astro 專案
- 接上 Cloudflare 部署基礎
- 定義資料表 schema
- 建立文件與開發規範

### Phase 2：資料層與管理後台
- 建 D1 schema / migration
- 建立文章 CRUD API
- 接上 Editor.js
- 建立 R2 圖片上傳流程

### Phase 3：前台渲染
- 完成首頁與文章頁
- 完成分類 / 標籤頁
- 串接 SEO metadata
- 使用 KV 做列表快取

### Phase 4：上線與優化
- Cloudflare Pages / Workers / bindings 設定
- 錯誤處理與驗證
- 效能優化
- 基礎觀測與維運文件

## 風險與注意事項

### 1. Astro 與 Editor.js 的整合
- Editor.js 主要運作於瀏覽器端，需明確區分後台互動區塊與前台渲染邏輯。

### 2. 內容儲存格式
- 若直接將完整 Editor.js JSON 存入 D1，可快速上線，但需提前定義前台 renderer。

### 3. Cloudflare KV 的角色
- KV 適合作快取與輔助讀取，不應作為文章主資料來源。

### 4. 認證策略
- 已決策：Cloudflare Zero Trust 邊界 + 單一管理員密碼 + KV session（見 DEC-001）。

## 下一步實作建議

1. 建立 Astro 專案骨架與 Cloudflare 相容設定
2. 撰寫 D1 schema 與 migration 初稿
3. 建立文章資料模型與 TypeScript 型別
4. 建立 `/admin/posts/new` 並接入 Editor.js 基本編輯器
5. 建立文章儲存 API 與前台文章渲染頁

## 規劃階段完成定義

符合以下條件即可視為**規劃階段**完成：
- 專案名稱、定位、MVP 範圍已明確
- 技術棧與資料職責切分已明確
- 開發順序與後續 Phase 已定義
- 規劃文件已收錄於 `.development_document/1_plan`
- 關鍵 ADR 已建立（DEC-001–003）

**開發進度**見 `4_task/todo.md`。

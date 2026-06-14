---
ID: TASK-001
Status: Active
Tags: [Task, Roadmap]
References: [PLAN-001, DEC-001, DEC-002, DEC-003]
Date: 20260612
---

# 開發任務追蹤

> **規劃 Phase**（PLAN-001 文件階段）已完成。  
> 以下為**開發里程碑**，與 PLAN-001「開發 Phase 建議」對應。

## 開發 Phase 1：骨架 ← 進行中

- [x] 統一 `.development_document` 結構與規範
- [x] ADR：認證、Hybrid、Editor.js JSON
- [x] D1 schema migration 初稿
- [x] Astro + Cloudflare 專案骨架
- [ ] 本地 `npm run dev` 驗證通過
- [ ] 本地 D1 migration 套用成功
- [ ] Zero Trust 路徑規則文件化（`2_manual/`）

## 開發 Phase 2：資料層與後台

- [x] `src/lib/db.ts` D1 查詢 helpers
- [ ] 文章 CRUD API（`/api/posts`，已完成 create/list/update，尚缺 delete）
- [x] 認證 API + middleware（`/api/auth/login`）
- [x] Editor.js 整合（`/admin/posts/new`）
- [ ] R2 圖片上傳（`/api/media`）

## 開發 Phase 3：前台

- [ ] 首頁、文章頁、分類、標籤（prerender）
- [ ] Editor.js block renderers
- [ ] SEO metadata、OG
- [ ] KV 列表快取

## 開發 Phase 4：上線

- [ ] Cloudflare Pages 部署與 bindings
- [ ] Zero Trust Access policy
- [ ] 發布後 revalidate / rebuild 流程
- [ ] 維運手冊（`2_manual/deploy.md`）

## 本週優先

1. 完成 Phase 1 驗證（dev server + D1 local）
2. 實作 R2 圖片上傳（給 Editor.js image block）
3. 開始前台文章頁渲染

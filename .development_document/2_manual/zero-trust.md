---
ID: MAN-001
Status: Draft
Tags: [Manual, Security, Zero-Trust]
References: [DEC-001]
Date: 20260612
---

# Zero Trust 設定指南

## 目的

在 Cloudflare Access 層保護 `/admin` 路徑，僅允許已驗證身分的使用者連線（與應用層密碼互補）。

## 建議 Policy

| 項目 | 值 |
|------|-----|
| Application | `uzine.today/admin` 或自訂 subdomain |
| Path | `/admin*` |
| Identity | 你的 email（One-time PIN 或 IdP） |
| Action | Allow |

## 與應用層密碼的關係

1. Zero Trust 通過 → 可到達 `/admin/login`
2. 輸入 `ADMIN_PASSWORD` → 取得 `uzine_session` cookie
3. 後續 `/admin/*` 與寫入 API 需有效 session

## 本地開發

本地 `astro dev` 通常不經 Zero Trust。請勿將 `.dev.vars` 提交至 git。

## 待辦

- [ ] 建立 Access Application
- [ ] 確認 production domain 路徑規則
- [ ] 可選：同 policy 保護 `POST /api/*`

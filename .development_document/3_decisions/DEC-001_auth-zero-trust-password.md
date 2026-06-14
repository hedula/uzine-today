---
ID: DEC-001
Status: Accepted
Tags: [Auth, Security, Zero-Trust]
References: [PLAN-001, CTX-003]
Date: 20260612
---

# [DEC-001] 認證：Zero Trust 邊界 + 單一管理員密碼

## 狀態

Accepted

## 背景

MVP 後台需登入，但僅有一位管理員。需在不引入完整使用者系統的前提下，保護 `/admin` 與寫入 API。

## 決策

採用**雙層認證**：

1. **Cloudflare Zero Trust**：在 DNS / Access 層保護 `/admin` 路徑（及可選的 `/api` 寫入路徑），僅允許已驗證身分（如 email OTP、IdP）的使用者連線。
2. **應用層密碼**：通過 Zero Trust 後，於 `/admin/login` 輸入單一 `ADMIN_PASSWORD`（存於 Wrangler secret），驗證成功後發放 **httpOnly session cookie**，session 資料存於 **KV (`CACHE`)**。
3. **使用者模型**：D1 `users` 表僅預留一筆管理員紀錄（或未來擴充）；MVP 不實作註冊、多角色。

## 理由

- 單人管理無需 Clerk / Auth.js 等第三方
- Zero Trust 提供網路邊界防護，降低暴力破解與掃描風險
- 應用層密碼防止 Zero Trust 帳號外洩時的直接寫入
- KV session 符合 Cloudflare Workers 無狀態模型

## 後果

### 正面

- 實作簡單、維運成本低
- 與 Cloudflare 生態一致

### 負面 / 取捨

- 本地開發需模擬 session 或略過 Zero Trust（僅 dev）
- 多作者需另開 ADR 並擴充 `users` 與權限

## 實作要點

- Secret：`ADMIN_PASSWORD`
- Cookie：`uzine_session`（httpOnly, secure, sameSite=strict）
- Middleware：`/admin/*`（除 login）、`POST|PATCH|DELETE /api/*` 需有效 session
- Session TTL：7 天（可於 `site_settings` 調整）

## 相關

- `src/middleware.ts`
- `src/lib/auth.ts`
- `src/pages/api/auth/login.ts`

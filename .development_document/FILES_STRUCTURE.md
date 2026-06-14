---
ID: IDX-002
Status: Active
Tags: [Index, Structure]
References: [IDX-001]
Date: 20260612
---

# 開發文件資料夾結構

本專案採 **OPAC 編目系統**（見 `index.md`）。目錄與 ID 前綴對照如下。

## 目錄結構

```
.development_document/
├── index.md                 # OPAC 總索引（IDX-）
├── FILES_STRUCTURE.md       # 本文件
├── README.md                # 快速導覽
│
├── 0_context/               # CTX-：專案上下文，變動少
│   ├── project-overview.md
│   ├── tech-stack.md
│   └── architecture.md
│
├── 1_plan/                  # PLAN-：產品與 Phase 規劃
│   └── PLAN-001_*.md
│
├── 2_manual/                # MAN-：部署、設定、除錯手冊
│
├── 3_decisions/             # DEC-：架構決策紀錄（ADR）
│   └── _template.md
│
├── 4_task/                  # TASK-：任務追蹤
│   └── todo.md
│
├── 5_temp/                  # TEMP-：工作草稿、進度快照
│
├── 6_study/                 # 研究筆記（無前綴強制，可自建）
│
├── 7_source/                # 原始碼範本、snippet
│
└── 8_components/            # UI 元件規格
```

## Metadata 規範

每份文件開頭必須有 YAML frontmatter：

```yaml
---
ID: PLAN-001
Status: Active | Draft | Superseded
Tags: [Tag1, Tag2]
References: [DEC-001, PLAN-001]
Date: 20260612
---
```

### ID 前綴

| 前綴 | 目錄 | 用途 |
|------|------|------|
| `IDX-` | `/` | 索引文件 |
| `CTX-` | `0_context/` | 上下文 |
| `PLAN-` | `1_plan/` | 規劃 |
| `MAN-` | `2_manual/` | 手冊 |
| `DEC-` | `3_decisions/` | 架構決策 |
| `TASK-` | `4_task/` | 任務 |
| `TEMP-` | `5_temp/` | 草稿 |

### Date 規則

- 格式：`YYYYMMDD`（無連字號）
- 代表最後更新日

### References 規則

- 使用完整 ID，如 `DEC-001`、`PLAN-001`
- 新增文件後更新 `index.md` Catalog

## 注意事項

- 勿將 `.env`、私鑰、token 放入此目錄
- 已發布決策以 `3_decisions/` 為準；規劃書與 ADR 衝突時，以較新 ADR 為準

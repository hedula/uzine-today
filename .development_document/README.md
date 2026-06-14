# `.development_document`

此目錄存放專案的所有開發文件，採 OPAC 編目系統管理。

## 快速導覽

| 目錄 | 用途 |
|------|------|
| `0_context/` | 專案概覽、技術棧、架構 |
| `1_plan/` | 產品規劃、Phase 文件 |
| `2_manual/` | 設定、部署、除錯手冊 |
| `3_decisions/` | 架構決策紀錄（ADR） |
| `4_task/` | 任務追蹤（**目前進度**） |
| `5_temp/` | 進度快照、工作草稿 |
| `6_study/` | 外部文件、研究參考 |
| `7_source/` | Schema、原始碼範本 |
| `8_components/` | UI 元件規格 |

## 入口文件

- **[index.md](index.md)** — OPAC 總索引
- **[FILES_STRUCTURE.md](FILES_STRUCTURE.md)** — 目錄約定與編目規範
- **[4_task/todo.md](4_task/todo.md)** — 開發任務與里程碑

## 注意事項

- 勿將 `.env`、私鑰、token 放入此目錄
- 每份文件開頭需有 YAML frontmatter（ID、Status、Tags、References、Date）
- 新增文件後更新 `index.md`

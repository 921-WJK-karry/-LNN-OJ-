---
name: commit-push-github
description: 将本项目改动提交并推送到 GitHub 远端 LNN-OJ（SSH 方式，无需令牌）。Use when the user asks 提交、推送、push、上传 GitHub、同步到远端 for this project. Do not use for other repos or general git questions.
---

# 提交并推送 GitHub（LNN-OJ）

把当前工作区 d:\程序设计比赛题库\linannuo_web 的改动提交并推送到远端 `origin` = `git@github.com:921-WJK-karry/-LNN-OJ-.git`（SSH ed25519 密钥已配置，不要使用任何令牌/HTTPS 方式）。

## 流程

1. `git status --short` 查看改动；`git log --oneline -3` 确认当前提交基线
2. 如有遗留临时文件（`LNN_temp_*.js` 等），先删除再加入暂存区
3. `git add -A`
4. 提交信息用中文，格式 `feat: xxx` / `fix: xxx` / `docs: xxx`，一行主题 + 可选要点列表
5. `git push origin master`
6. `git status -sb` 验证输出为 `## master...origin/master`（无 ahead/behind 即同步完成）

## 约束

- `backend/.env` 已被 .gitignore 排除（含数据库密码与各平台 API Key）——**禁止**修改 .gitignore 把它加进版本库
- `backend/LNN_uploads/`（用户运行时上传的文件）同样排除，不入库
- 提交前不要清理 `knowledge_base/`（知识库源文件属于交付内容）
- 若推送被拒（fetch first），先 `git fetch origin` 并检查远端新提交，再决定 rebase 还是询问用户，**不要**盲目 force push

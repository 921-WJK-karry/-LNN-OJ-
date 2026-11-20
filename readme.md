# 程序设计比赛题库系统（LNN OJ）

- 姓名：李南诺
- 学号：24002120324
- 项目类别：模仿（在线评测系统 OJ）

## 项目简介

模仿在线评测系统（OJ）的课程作业项目：学生可浏览算法题目、参加编程比赛、查看提交记录。

## 技术栈

- 前端：frontend/ 目录，原生 HTML / CSS / JavaScript（无任何第三方库、框架、CDN）
- 后端：backend/ 目录，Node.js + Express（RESTful + MVC），接口以 /api/ 为前缀，端口 8324
- 数据库：MySQL（凭据统一存放于 backend/.env）

## 目录结构

```
linannuo_web/
├── frontend/          # 前端（css / js / fonts / images 子目录）
├── backend/           # 后端（routes / controllers / models / config）
│   ├── LNN_interface.md   # 接口变更记录（追加写入）
│   └── LNN_database.md    # 数据库 SQL 记录（凭此文件可完整重建数据库）
├── AGENTS.md          # 项目开发规则
└── linannuo_prompt.md # AI 开发指令记录（追加写入）
```

## 运行方式

```bash
cd backend
npm i          # 已切换国内镜像：npm config set registry https://registry.npmmirror.com
node app.js    # 启动后访问 http://localhost:8324
```

## 已完成页面

- index.html —— 项目首页（canvas 背景动画 + 页面导航）
- problems.html —— 题库练习（题目列表筛选）

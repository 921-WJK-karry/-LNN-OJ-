# 提示词记录

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入项目规则（前端 frontend/ 原生 HTML/CSS/JS；后端 backend/ Node.js + Express，接口 /api/ 前缀、端口 8324；数据库 MySQL（用户名 root、密码：1119），凭据写入 backend/.env；命名以 LNN_ 开头；文件头部注释块；记录文件追加写入；统一 JSON 响应格式；前端 console 输出、index.html 入口链接等规则）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，按这个方案调整 AGENTS.md（消除凭据矛盾：AGENTS.md 中不再出现数据库用户名/密码，改为"凭据统一写入 backend/.env，不得出现在代码或本文件中"）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，创建 backend 目录并配置 .env（创建 backend/.env，写入 DB_USER=root、DB_PASSWORD、DB_HOST=localhost、DB_NAME=LNN_web；同时创建根目录 .gitignore，忽略 node_modules/ 与 backend/.env）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入以下规则（完整项目规则重发：frontend/ 原生 HTML/CSS/JS；backend/ Node.js + Express，/api/ 前缀、端口 8324、cors 全开放、npm 国内镜像；数据库 MySQL（用户名 root、密码：root），凭据写入 backend/.env 并加入 .gitignore；每表至少 8 条测试数据；命名 LNN_ 前缀；文件头部注释块；记录文件追加写入；统一 JSON 响应格式 {code,msg,data}；前端 console 输出、index.html 入口链接，detail 页面除外）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 请移除 AGENTS.md 中的明文密码（第 15 行改回"数据库：MySQL（凭据统一写入 backend/.env，不得出现在代码或本文件中）"，凭据仅保留在 backend/.env）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入以下规则（第三次重发完整项目规则：frontend/ 原生 HTML/CSS/JS；backend/ Node.js + Express，/api/ 前缀、端口 8324、cors 全开放、npm 国内镜像；数据库 MySQL（用户名 root、密码：root），凭据写入 backend/.env 并加入 .gitignore；每表至少 8 条测试数据；命名 LNN_ 前缀；文件头部注释块；记录文件追加写入；统一 JSON 响应格式 {code,msg,data}；前端 console 输出、index.html 入口链接，detail 页面除外。经确认，本次按指令将密码写入 AGENTS.md）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 开始建库建表（安装 backend 依赖 express/cors/mysql2/dotenv；建库 LNN_web（utf8mb4），建 4 张表：LNN_users(10条)、LNN_problems(9条)、LNN_contests(8条)、LNN_submissions(10条)，表名字段均带 LNN_ 前缀，含外键约束；SQL 全文记入 backend/LNN_database.md。因策略禁止命令行携带密码，改用 Node+mysql2 读取 backend/.env 凭据执行 SQL）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 先搭前端首页（创建 frontend/css、js、fonts、images 目录；新增 index.html（暗色主题首页：导航/横幅插画/功能卡片/关于/页脚）、css/LNN_index.css、js/LNN_index.js（fetch /api/health 检测服务状态，结果输出到 console）；经浏览器验证渲染正常、服务状态徽标绿色在线）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，开始搭建题库练习页面（后端 MVC 三层新增 GET /api/problems 题目列表接口，支持 difficulty/tag/keyword 筛选：routes/LNN_problems.js、controllers/LNN_problems.js、models/LNN_problems.js，挂载于 routes/LNN_index.js，接口已记入 LNN_interface.md；前端新增 problems.html + css/LNN_problems.css + js/LNN_problems.js（筛选栏：难度/标签下拉+关键词防抖搜索，列表含编号/标题/标签/限制/难度徽标）；index.html 导航及"题库练习"功能卡片追加入口链接；经浏览器验证 9 题渲染与难度筛选（简单=4题）正常）| 大模型名称：GLM-5.3-Flash

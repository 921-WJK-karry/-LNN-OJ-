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

2026-11-20 | 请初始化本项目：1、git init + .gitignore（排除 node_modules、.env）+ 首次提交；2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖；3、创建前端首页 index.html，包括姓名李南诺、学号24002120324、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接，有 canvas 背景动画，主体是页面链接导航，页面美观；4、创建 readme.md 包括学号、姓名（重构 index.html：canvas 粒子连线背景动画 + 项目信息卡（姓名/学号/项目名称/项目类别：模仿）+ 页面导航为主体（首页、题库练习），毛玻璃卡片风格；新建 readme.md（学号/姓名/技术栈/目录结构/运行方式）；git init + .gitignore（追加忽略 .trae-html-share-packages/）+ 首次提交 2bd4101；浏览器验证 canvas 动画运行、信息卡与导航正常）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，创建题目详情页（后端新增 GET /api/problems/:id 题目详情接口：models 增加 LNN_findProblemById（LEFT JOIN LNN_users 取出题人姓名）、controllers 增加 LNN_getProblem（校验 ID 正整数、404 处理）、routes 注册 /:id，接口已记入 LNN_interface.md；前端新增 problem_detail.html + css/LNN_detail.css + js/LNN_detail.js（URL ?id= 参数加载详情：标题/难度标签徽标/限制/出题人/描述，detail 页面按规则不加首页入口）；题库列表页标题改为链接跳转详情页并增加悬停样式；curl 验证正常/不存在/非法 ID 三种场景，浏览器验证 id=6 详情渲染全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，创建比赛列表页（后端 MVC 三层新增 GET /api/contests 比赛列表接口，支持 status 筛选：routes/LNN_contests.js、controllers/LNN_contests.js、models/LNN_contests.js，挂载于 routes/LNN_index.js，接口已记入 LNN_interface.md；前端新增 contests.html + css/LNN_contests.css + js/LNN_contests.js（状态筛选标签：全部/未开始/进行中/已结束，卡片含标题/描述/时间范围/状态徽标）；首页导航面板、problems.html 与 problem_detail.html 顶部导航追加"比赛列表"入口；curl 验证全部 8 场与 upcoming 3 场，浏览器验证渲染与筛选全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 创建运行后台的 bat 文件，放在项目根目录：1、自动切换到 backend 目录再启动（用 %~dp0，双击时不受当前路径影响）；2、使用 chcp 65001 避免中文日志乱码；3、启动命令与 package.json 中的脚本保持一致；4、结尾加 pause，出错时窗口不关闭（新建根目录 LNN_start.bat：cd /d "%~dp0backend" + chcp 65001 >nul + npm start + pause。首次测试发现 UTF-8 编码中文注释被 cmd 误解析（chcp 中途切换编码导致解析错位），修复为注释块置于 chcp 之前并将文件转为 ANSI/GBK 编码、chcp 后仅保留纯 ASCII 行；实测 bat 启动成功，/api/health 与首页均正常响应）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 帮我生成图文列表的html（经确认为项目静态示例页：新增 frontend/news.html 赛事动态图文列表 + css/LNN_news.css，6 条图文卡片（缩略图左 + 标签/日期/标题/摘要右），配图使用 AI 生图接口，响应式移动端缩略图置顶；首页导航面板及 problems/contests/problem_detail 顶部导航追加"赛事动态"入口；浏览器验证 6 卡片渲染、图片全部加载成功、导航激活项正确，全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 生成gallery.html图文列表的网页（新增 frontend/gallery.html 题库图库画廊式图文列表 + css/LNN_gallery.css，8 张算法主题图文卡片（图上文下）网格布局，桌面 4 列 / ≤900px 2 列 / ≤560px 1 列响应式，悬停卡片上浮图片放大，摘要两行截断；配图使用 AI 生图接口；首页导航面板及 problems/contests/news/problem_detail 顶部导航追加"题库图库"入口；浏览器验证 8 卡片全部渲染、图片全部加载成功（第8张首次检查时生成接口响应慢，等待后 complete=true）、网格列数正确，全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 为什么是LNNOJ（解释：LNN 为姓名李南诺拼音首字母并呼应 LNN_ 前缀规则，OJ 为 Online Judge 惯用缩写；给出 LNN-OJ / LNN OJ / 换名三个备选方案）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 按这个方案改（经确认选择 LNN-OJ 连字符写法：全站 6 个页面 logo、首页副标题与 title、readme.md 标题统一改为 LNN-OJ）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 创建 database.html 页面，输入用户名，密码，链接数据库，数据库使用 mysql，成功和错误都有提示，默认用户名 root，密码 root（后端新增 POST /api/database/connect：routes/controllers/models 三层，models 用页面传入凭据创建临时 mysql2 连接实测（主机/库名取自 .env，connectTimeout 3s），并映射 MySQL 错误码为可读提示；前端新增 database.html + css/LNN_database.css + js/LNN_database.js（表单默认 root/root，提交后绿色成功提示含库名与 MySQL 版本、红色失败提示，按钮加载态，响应与错误输出 console）；接口记入 LNN_interface.md；首页导航面板及各页顶部导航追加"数据库"入口；测试期间 curl 出现 500 为 PowerShell 传参吞 JSON 引号所致，改用 Invoke-RestMethod 验证成功/凭据错误/参数缺失三场景均正确；浏览器验证成功与失败提示交互全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容（建表 LNN_tech_news 并插入 8 条科技新闻测试数据，SQL 记入 LNN_database.md；后端 MVC 三层新增 GET /api/news 接口（按发布时间倒序、支持 keyword 筛选标题/摘要），挂载于 routes/LNN_index.js，接口记入 LNN_interface.md；前端新增 tech_news.html + css/LNN_tech_news.css + js/LNN_tech_news.js：页面显示接口信息条（绿色 GET 徽标 + 可点击的 http://localhost:8324/api/news 链接）与新闻列表（标题/分类徽章/摘要/来源/发布时间），关键词 300ms 防抖搜索；首页导航面板及各页顶部导航追加"科技新闻"入口；curl 验证全部 8 条与 keyword=AI 1 条，浏览器验证渲染与搜索交互全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 帮我把整体网页风格加样式效果设计的更加高级清新，有效果（新增共享设计系统 css/LNN_common.css：CSS 变量设计令牌 + 清新浅色玻璃拟态风（浅蓝渐变背景/白色毛玻璃卡片与导航/渐变标题与渐变强调色 #5b7cfa→#2fb8f6/柔和阴影+悬停上浮位移动效/胶囊导航激活态），全部 8 个页面接入并重写各自页面 CSS 为浅色主题、徽标改为浅底深字配色；首页 canvas 粒子与连线改浅色背景适配配色、粒子数 70→60；浏览器验证首页（浅色渐变背景/白色玻璃卡/渐变标题/canvas 蓝色粒子动画/7 张导航卡）与题库页（毛玻璃导航/白色半透明卡片/渐变编号框/三色难度徽标/hover 边框加深阴影增强右移 5px）全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 好的，按这个方案调整背景色和动效幅度（按更高级的克制感方向微调：背景径向光晕透明度 0.12/0.10→0.07/0.06、基底色更透亮 #fafcff→#f4f7fd；悬停阴影 --LNN-shadow-hover 收敛 36px/0.22→26px/0.16；各页 hover 位移 5px/6px→3px/4px、图库图片放大 1.06→1.04；首页 canvas 粒子速度 0.6→0.45 更平静）| 大模型名称：GLM-5.3-Flash

2026-11-20 | tech_news.html加入图片（js/LNN_tech_news.js 新增分类配图映射 LNN_CATEGORY_IMAGES（芯片/人工智能/量子计算/新能源/航天/通信/机器人/开源 8 类，AI 生图接口生成）+ 未知分类兜底图；渲染改为左图右文卡片（img 200×120 圆角 + 标题/分类徽章/摘要/元信息），css/LNN_tech_news.css 配套 flex 布局与移动端图片置顶响应式；浏览器验证 8 张配图全部加载成功、布局无破图，全部 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-20 | 改成左右图分布（css/LNN_tech_news.css 增加 .LNN_news_item:nth-child(even) { flex-direction: row-reverse; }，实现奇偶行左右交错图文布局，移动端仍为图片置顶）| 大模型名称：GLM-5.3-Flash

2026-11-25 | 使用硅基流动API key创建基本AI应用:AI聊天（后端新增 routes/controllers/models LNN_ai_chat.js：POST /api/ai/chat 转发硅基流动 chat/completions，密钥与模型名写入 backend/.env（LNN_SILICONFLOW_API_KEY、LNN_AI_MODEL），系统提示词服务端注入、仅保留最近 20 条上下文、60s 超时、401/429/5xx 错误码转用户可读提示；前端新增 ai_chat.html + css/LNN_ai_chat.css + js/LNN_ai_chat.js：气泡对话 UI、加载动画、Enter 发送 / Shift+Enter 换行、清空对话、console.log 输出接口返回；index.html 追加 AI 聊天导航卡与页面导航链接；Invoke-RestMethod 实测返回 code=0 与 Qwen 正常回复）| 大模型名称：GLM-5.3-Flash

2026-11-25 | 请为 AI 聊天页面添加更多动效和样式（css/LNN_ai_chat.css 新增：背景浮动光球 .LNN_orb×2 blur+LNN_float 动画、聊天卡片 fade_up 入场 + :focus-within 聚焦发光、页面标题渐变流动、消息 LNN_msg_pop 弹出入场、AI 头像渐变流光 LNN_flow + 思考中 LNN_pulse 呼吸光晕、错误气泡抖动、发送按钮光泽扫过 ::after、快捷提问胶囊标签错峰入场、模型名高亮、prefers-reduced-motion 降级；ai_chat.html 加 2 个光球 div 与 4 个快捷提问 chip；js/LNN_ai_chat.js 新增消息入场 class、LNN_stopThinking() 摘除脉冲、chip 点击填入并发送后隐藏标签栏，加载气泡改为整行移除避免空行占位；浏览器验证 chip 自动发送/消息堆叠/输入均正常，3 项 PASS）| 大模型名称：GLM-5.3-Flash

2026-11-25 | 更新 AI 环境变量配置（backend/.env 改为：LNN_SILICONFLOW_API_KEY、SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1、SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct、SILICONFLOW_VISION_MODEL=Qwen/Qwen3-VL-8B-Instruct、AI_PROVIDER=siliconflow；models/LNN_ai_chat.js 改为从 env 读取接入地址与模型名（LNN_getApiUrl/LNN_getModel/LNN_getProvider），新增 AI_PROVIDER≠siliconflow 时的可读错误守卫；重启服务后 Invoke-RestMethod 回归测试 code=0 通过）| 大模型名称：GLM-5.3-Flash

2026-11-25 | 用户提供硅基流动 curl 示例（deepseek-ai/DeepSeek-V4-Flash）：先用真实 Key 直连实测成功（该模型为推理模型，响应含 reasoning_content、思考 token 计入 completion）；随后将 backend/.env 的 SILICONFLOW_MODEL 切换为 deepseek-ai/DeepSeek-V4-Flash，models/LNN_ai_chat.js 新增 LNN_getMaxTokens()（模型名含 DeepSeek 时 max_tokens 放宽至 4096，避免思考 token 挤占回复导致内容为空）；重启服务经 POST /api/ai/chat 实测 code=0，model 字段返回 deepseek-ai/DeepSeek-V4-Flash | 大模型名称：GLM-5.3-Flash

2026-11-25 | 使用七牛的 api key 完成在线客服页面（Model ID: qiniu/conatus-free、BaseURL: https://api.qnaigc.com/v1）：backend/.env 新增 LNN_QINIU_API_KEY/QINIU_BASE_URL/QINIU_MODEL；models/LNN_ai_chat.js 重构为多服务商配置表 LNN_PROVIDER_CONFIG（siliconflow/qiniu）+ LNN_resolveProvider，max_tokens 默认放宽至 2048；新增 routes/controllers LNN_support.js → POST /api/support/chat（客服系统提示词，固定走 qiniu 服务商，上下文保留 12 条）；前端新增 support.html + css/LNN_support.css（青绿客服头像配色）+ js/LNN_support.js（复用聊天页样式体系，快捷提问 chip）；index.html 追加在线客服导航卡。直连七牛实测：Key 有效（非 401）、模型名有效（换 Qwen 名返回 400），但 conatus-free 持续返回 429 且响应体为空（等待 60s+ 仍限流，判定为七牛侧账号级限流/模型未开通）；AI 聊天接口回归正常 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 修改错误（用户截图控制台日志：在线客服回复失败 429）：服务端日志确认根因为七牛返回 {"code":"free_campaign_global_limit","message":"Too many requests for this free model"}——免费模型全局活动限额，属上游限制非代码问题；修复方案：controllers/LNN_support.js 增加主备降级——优先七牛，429/异常时自动降级到硅基流动备用模型（同一客服系统提示词），msg 标注「已降级到备用模型」，双服务商都失败才返回错误；重启后实测：本次七牛直接成功（限流窗口已过，确认该免费模型为严格分时限额、时好时坏），降级逻辑作为兜底常驻 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 更新七牛环境变量命名（用户指定：QINIU_CUSTOMER_SERVICE_API_KEY / QINIU_CUSTOMER_SERVICE_BASE_URL=https://api.qnaigc.com/v1 / QINIU_CUSTOMER_SERVICE_MODEL=qiniu/conatus-free）：backend/.env 重命名三个变量，models/LNN_ai_chat.js 的 qiniu 配置表同步更新 env 读取键名；重启后回归：客服接口 code=0（本次七牛又触发 free_campaign_global_limit 限流，降级到 DeepSeek-V4-Flash 正常兜底）、AI 聊天 code=0 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 使用硅基流动 完成在线客服页面：应用户要求将客服主服务商从七牛切换为硅基流动（七牛免费模型限流过于频繁）——controllers/LNN_support.js 改为优先 siliconflow（DeepSeek-V4-Flash + 客服系统提示词）、异常时降级到七牛 conatus-free 备用，msg 标注降级信息；support.html 页面描述/接口条/模型说明同步改为硅基流动；重启后实测 POST /api/support/chat code=0 直接由 DeepSeek-V4-Flash 回复「怎么提交代码」，未触发降级 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 把 AI 聊天改造成"中华美食街在线客服"：controllers/LNN_ai_chat.js 的 LNN_SYSTEM_PROMPT 重写为餐厅客服小美——白名单限定三类问题（营业时间/招牌菜/配送范围，均给出固定数据口径），硬性规则要求回答与数据一致、无关问题一律用指定话术引导留言、回复不超过 100 字；ai_chat.html 欢迎气泡/页面描述/快捷提问（含 1 个该拒示例）与 js/LNN_ai_chat.js 清空后的欢迎语同步更新；实测 5 问：3 个该答（营业时间/招牌菜价格/宿舍配送）全部按给定数据正确回答，2 个该拒（写作文/股市行情）均原样输出指定拒答话术引导留言 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 让页面支持在"硅基流动/七牛"之间切换（后端读配置，前端加下拉框）：controllers/LNN_ai_chat.js 读取 body.provider（仅接受 siliconflow/qiniu，默认 siliconflow）传入模型层，所选服务商异常时自动降级到另一家，响应 data 新增 provider 字段；ai_chat.html 输入区上方新增服务商下拉框（默认硅基流动）+ css/LNN_ai_chat.css 下拉框样式；js/LNN_ai_chat.js 请求体携带 provider；实测：provider=siliconflow→DeepSeek 回复、provider=qiniu→七牛 conatus-free 直接回复均 code=0；浏览器演示：硅基流动问招牌菜→DeepSeek 回答，切七牛问配送→本次触发降级由 DeepSeek 兜底回复，页面均正常对话 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答（RAG），支持 doc/docx/ppt/pptx/pdf/txt/md，含知识库管理，控制台输出发送/接收大模型数据：① 依赖：npm i multer adm-zip pdf-parse iconv-lite；② 建表 LNN_kb_files/LNN_kb_chunks（外键级联删除，测试数据由 4 个知识库文件上传产生，共 4 文件 11 块）；③ 后端 MVC：models/LNN_kb.js（docx/pptx 用 adm-zip 解 XML 文本、pdf 用 pdf-parse、doc/ppt 旧二进制用 iconv-lite 尽力提取、按段落合并约 300 字分块、2 字滑窗关键词打分检索 Top4）、controllers/LNN_kb.js（upload/files/delete/ask，ask 控制台输出 [LNN_kb RAG] 发送与接收 JSON）、routes/LNN_kb.js（multer 磁盘存储 10MB 限制 + 统一 JSON 错误），挂载 /api/kb；④ 前端 kb.html + LNN_kb.css + LNN_kb.js（拖拽/点击上传、文件列表删除、RAG 问答聊天界面），index.html 追加「知识库问答」导航卡；⑤ 构建 4 个知识库文件（门店手册.txt + 脚本生成的 FAQ.docx + 外卖说明.txt + 宴会细则.txt）并上传入库；⑥ 测试：营业时间/会员优惠/包间预订/儿童套餐/外卖起送/婚宴满10桌 均正确命中知识库回答，库外问题（北京天气）正确拒答引导人工；修复 3 个问题：multer diskStorage 无 file.buffer 改读磁盘、busboy Latin1 文件名乱码加 LNN_fixFilename 还原、包装 multer 成功路径漏调控制器致 404；期间重启服务经用户确认后结束旧进程（PID 33508） | 大模型名称：GLM-5.3-Flash

2026-11-25 | 完成图像识别功能：上传图片返回描述，使用已有 api-key 与模型（硅基流动 SILICONFLOW_VISION_MODEL=Qwen/Qwen3-VL-8B-Instruct，Key 复用 LNN_SILICONFLOW_API_KEY）——models/LNN_ai_chat.js 新增 LNN_visionCompletion（OpenAI 多模态 content：image_url dataURL + text 提示词，90s 超时）；controllers/routes/LNN_ai_chat.js 新增 POST /api/ai/vision（multer 内存存储、仅图片格式 10MB、base64 dataURL、控制台输出 [LNN_vision] 发送/接收数据且 base64 只输出摘要）；前端新增 vision.html + LNN_vision.css + LNN_vision.js（点击/拖拽上传、本地预览、选填提问框、识别结果卡），index.html 追加「图像识别」导航卡；用 AI 生成的餐厅美食测试图实测：默认描述模式完整识别烤鸭/蒸笼小笼包/汤面/紫砂茶壶甚至右下角 AI 生成水印，附加提问模式（图片里有什么菜品）正确列出四类菜品；浏览器端到端验证 3 项 PASS；生成测试图 vision_test_image.jpg 存于根目录 | 大模型名称：GLM-5.3-Flash

2026-11-25 | 6 条日志错误修复：排查服务端日志发现两类问题——① 用户上传的 57B「假图片」（实为 JSON 文本改名 .jpg）触发视觉模型 400（image_url not a valid image）；② 387KB 大图识别多次超过 90s 被中断（This operation was aborted）共 3 次超时。修复：controllers/LNN_ai_chat.js 新增 LNN_isValidImage 魔数校验（JPEG/PNG/GIF/BMP/WEBP 文件头）在本地拦截内容不符文件；models/LNN_ai_chat.js 识别超时放宽至 180s 并优化提示、not a valid image 映射友好文案。实测：假图片返回「图片文件内容无效或已损坏，请上传真实图片」不再打到 API；大图识别成功（11.4s） | 大模型名称：GLM-5.3-Flash

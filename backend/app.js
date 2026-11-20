/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 *
 * Express 应用入口：托管前端静态资源、挂载 /api 路由、监听 8324 端口
 */

// 引入依赖
const LNN_express = require('express');
const LNN_cors = require('cors');
const LNN_path = require('path');

// 路由
const LNN_apiRouter = require('./routes/LNN_index');

// 创建应用
const LNN_app = LNN_express();

// 中间件：开放全部跨域（仅用于课程作业）
LNN_app.use(LNN_cors());

// 中间件：解析 JSON 与表单请求体
LNN_app.use(LNN_express.json());
LNN_app.use(LNN_express.urlencoded({ extended: true }));

// 托管前端静态资源目录
LNN_app.use(LNN_express.static(LNN_path.join(__dirname, '..', 'frontend')));

// 挂载 /api 前缀路由
LNN_app.use('/api', LNN_apiRouter);

// 统一 404 响应
LNN_app.use((LNN_req, LNN_res) => {
  LNN_res.status(404).json({ code: 404, msg: '接口或资源不存在', data: null });
});

// 统一错误处理
LNN_app.use((LNN_err, LNN_req, LNN_res, LNN_next) => {
  console.error('[LNN_server error]', LNN_err);
  LNN_res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

// 监听端口 8324（学号最后三位）
const LNN_PORT = 8324;
LNN_app.listen(LNN_PORT, () => {
  console.log(`[LNN_server] 已启动，地址：http://localhost:${LNN_PORT}`);
});

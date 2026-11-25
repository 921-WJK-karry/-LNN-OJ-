/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 *
 * /api 路由总入口：汇总各模块路由
 */

const LNN_router = require('express').Router();

// 健康检查示例接口
LNN_router.get('/health', (LNN_req, LNN_res) => {
  LNN_res.json({ code: 0, msg: '服务正常', data: { port: 8324, time: new Date().toISOString() } });
});

// 题目模块路由
LNN_router.use('/problems', require('./LNN_problems'));

// 比赛模块路由
LNN_router.use('/contests', require('./LNN_contests'));

// 数据库连接测试路由
LNN_router.use('/database', require('./LNN_database'));

// 科技新闻路由
LNN_router.use('/news', require('./LNN_tech_news'));

// AI 聊天路由
LNN_router.use('/ai', require('./LNN_ai_chat'));

// 在线客服路由（七牛服务商）
LNN_router.use('/support', require('./LNN_support'));

// 知识库路由（RAG）
LNN_router.use('/kb', require('./LNN_kb'));

// 后续模块路由在此追加，例如：
// LNN_router.use('/users', require('./LNN_users'));

module.exports = LNN_router;

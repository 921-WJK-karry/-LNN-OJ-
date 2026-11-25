/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：科技新闻模块路由（挂载于 /api/news）
 */

const LNN_router = require('express').Router();
const LNN_newsController = require('../controllers/LNN_tech_news');

// GET /api/news 科技新闻列表
LNN_router.get('/', LNN_newsController.LNN_listNews);

module.exports = LNN_router;

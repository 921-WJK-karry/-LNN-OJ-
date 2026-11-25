/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服路由（挂载于 /api/support，使用七牛服务商）
 */

const LNN_router = require('express').Router();
const LNN_supportController = require('../controllers/LNN_support');

// POST /api/support/chat 在线客服对话
LNN_router.post('/chat', LNN_supportController.LNN_supportChat);

module.exports = LNN_router;

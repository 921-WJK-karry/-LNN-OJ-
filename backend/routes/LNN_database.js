/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试路由（挂载于 /api/database）
 */

const LNN_router = require('express').Router();
const LNN_databaseController = require('../controllers/LNN_database');

// POST /api/database/connect 数据库连接测试
LNN_router.post('/connect', LNN_databaseController.LNN_connect);

module.exports = LNN_router;

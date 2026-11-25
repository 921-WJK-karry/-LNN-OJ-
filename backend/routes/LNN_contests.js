/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：比赛模块路由（挂载于 /api/contests）
 */

const LNN_router = require('express').Router();
const LNN_contestController = require('../controllers/LNN_contests');

// GET /api/contests 比赛列表
LNN_router.get('/', LNN_contestController.LNN_listContests);

module.exports = LNN_router;

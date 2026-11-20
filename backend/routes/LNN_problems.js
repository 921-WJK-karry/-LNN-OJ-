/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：题目模块路由（挂载于 /api/problems）
 */

const LNN_router = require('express').Router();
const LNN_problemController = require('../controllers/LNN_problems');

// GET /api/problems 题目列表
LNN_router.get('/', LNN_problemController.LNN_listProblems);

module.exports = LNN_router;

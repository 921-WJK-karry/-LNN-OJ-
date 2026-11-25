/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试控制器，处理 POST /api/database/connect 请求
 */

const LNN_databaseModel = require('../models/LNN_database');

// POST /api/database/connect —— 用页面输入的用户名/密码实测数据库连接
async function LNN_connect(LNN_req, LNN_res) {
  const LNN_username = LNN_req.body.username;
  const LNN_password = LNN_req.body.password;

  // 系统边界处校验：用户名与密码必填
  if (!LNN_username || !LNN_password) {
    return LNN_res.status(400).json({ code: 1, msg: '用户名和密码不能为空', data: null });
  }

  try {
    const LNN_result = await LNN_databaseModel.LNN_testConnection(LNN_username, LNN_password);
    LNN_res.json({
      code: 0,
      msg: '数据库连接成功',
      data: { database: process.env.DB_NAME, serverVersion: LNN_result.LNN_serverVersion }
    });
  } catch (LNN_err) {
    // 错误详情输出到服务端控制台（不打印密码）
    console.error('[LNN_database controller] 连接失败：', LNN_err.code);
    LNN_res.json({ code: 1, msg: LNN_databaseModel.LNN_formatDbError(LNN_err), data: null });
  }
}

module.exports = { LNN_connect };

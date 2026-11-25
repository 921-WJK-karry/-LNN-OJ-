/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：比赛控制器（MVC - Controller），处理 /api/contests 请求
 */

const LNN_contestModel = require('../models/LNN_contests');

// GET /api/contests —— 比赛列表（支持 status 查询参数）
async function LNN_listContests(LNN_req, LNN_res) {
  try {
    const LNN_list = await LNN_contestModel.LNN_findContests(LNN_req.query.status);
    LNN_res.json({ code: 0, msg: '查询成功', data: { list: LNN_list } });
  } catch (LNN_err) {
    console.error('[LNN_contests controller] 查询比赛失败：', LNN_err);
    LNN_res.status(500).json({ code: 1, msg: '查询比赛失败', data: null });
  }
}

module.exports = { LNN_listContests };

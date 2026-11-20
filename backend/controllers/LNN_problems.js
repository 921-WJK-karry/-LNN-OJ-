/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：题目控制器（MVC - Controller），处理 /api/problems 请求
 */

const LNN_problemModel = require('../models/LNN_problems');

// GET /api/problems —— 题目列表（支持 difficulty / tag / keyword 查询参数）
async function LNN_listProblems(LNN_req, LNN_res) {
  try {
    const LNN_list = await LNN_problemModel.LNN_findProblems({
      LNN_difficulty: LNN_req.query.difficulty,
      LNN_tag: LNN_req.query.tag,
      LNN_keyword: LNN_req.query.keyword
    });
    const LNN_tags = await LNN_problemModel.LNN_findTags();
    LNN_res.json({ code: 0, msg: '查询成功', data: { list: LNN_list, tags: LNN_tags } });
  } catch (LNN_err) {
    console.error('[LNN_problems controller] 查询题目失败：', LNN_err);
    LNN_res.status(500).json({ code: 1, msg: '查询题目失败', data: null });
  }
}

module.exports = { LNN_listProblems };

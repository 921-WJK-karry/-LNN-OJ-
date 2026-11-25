/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：科技新闻控制器（MVC - Controller），处理 /api/news 请求
 */

const LNN_newsModel = require('../models/LNN_tech_news');

// GET /api/news —— 科技新闻列表（支持 keyword 查询参数）
async function LNN_listNews(LNN_req, LNN_res) {
  try {
    const LNN_list = await LNN_newsModel.LNN_findNews(LNN_req.query.keyword);
    LNN_res.json({ code: 0, msg: '查询成功', data: { list: LNN_list } });
  } catch (LNN_err) {
    console.error('[LNN_news controller] 查询新闻失败：', LNN_err);
    LNN_res.status(500).json({ code: 1, msg: '查询新闻失败', data: null });
  }
}

module.exports = { LNN_listNews };

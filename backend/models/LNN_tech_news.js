/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：科技新闻表模型层（MVC - Model），封装 LNN_tech_news 表查询
 */

const LNN_pool = require('../config/LNN_db');

// 查询科技新闻列表，按发布时间倒序，支持关键词筛选
async function LNN_findNews(LNN_keyword) {
  let LNN_sql =
    'SELECT LNN_news_id, LNN_title, LNN_summary, LNN_source, LNN_category, LNN_published_at FROM LNN_tech_news';
  const LNN_params = [];

  if (LNN_keyword) {
    LNN_sql += ' WHERE LNN_title LIKE ? OR LNN_summary LIKE ?';
    LNN_params.push('%' + LNN_keyword + '%', '%' + LNN_keyword + '%');
  }
  LNN_sql += ' ORDER BY LNN_published_at DESC';

  const [LNN_rows] = await LNN_pool.query(LNN_sql, LNN_params);
  return LNN_rows;
}

module.exports = { LNN_findNews };

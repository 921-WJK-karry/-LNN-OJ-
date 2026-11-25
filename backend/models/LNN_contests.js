/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：比赛表模型层（MVC - Model），封装 LNN_contests 表查询
 */

const LNN_pool = require('../config/LNN_db');

// 查询比赛列表，可按状态筛选（upcoming/ongoing/finished）
async function LNN_findContests(LNN_status) {
  let LNN_sql =
    'SELECT LNN_contest_id, LNN_title, LNN_description, LNN_start_time, LNN_end_time, LNN_status FROM LNN_contests';
  const LNN_params = [];

  if (LNN_status) {
    LNN_sql += ' WHERE LNN_status = ?';
    LNN_params.push(LNN_status);
  }
  LNN_sql += ' ORDER BY LNN_start_time DESC';

  const [LNN_rows] = await LNN_pool.query(LNN_sql, LNN_params);
  return LNN_rows;
}

module.exports = { LNN_findContests };

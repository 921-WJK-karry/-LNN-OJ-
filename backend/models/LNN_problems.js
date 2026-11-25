/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：题目表模型层（MVC - Model），封装 LNN_problems 表查询
 */

const LNN_pool = require('../config/LNN_db');

// 查询题目列表，支持难度 / 标签 / 标题关键词筛选
async function LNN_findProblems(LNN_options) {
  const LNN_difficulty = LNN_options.LNN_difficulty;
  const LNN_tag = LNN_options.LNN_tag;
  const LNN_keyword = LNN_options.LNN_keyword;

  let LNN_sql =
    'SELECT LNN_problem_id, LNN_title, LNN_difficulty, LNN_tag, LNN_time_limit, LNN_memory_limit, LNN_created_at FROM LNN_problems WHERE 1=1';
  const LNN_params = [];

  if (LNN_difficulty) {
    LNN_sql += ' AND LNN_difficulty = ?';
    LNN_params.push(LNN_difficulty);
  }
  if (LNN_tag) {
    LNN_sql += ' AND LNN_tag = ?';
    LNN_params.push(LNN_tag);
  }
  if (LNN_keyword) {
    LNN_sql += ' AND LNN_title LIKE ?';
    LNN_params.push('%' + LNN_keyword + '%');
  }
  LNN_sql += ' ORDER BY LNN_problem_id ASC';

  const [LNN_rows] = await LNN_pool.query(LNN_sql, LNN_params);
  return LNN_rows;
}

// 查询全部题目标签（去重），用于筛选下拉框
async function LNN_findTags() {
  const [LNN_rows] = await LNN_pool.query(
    'SELECT DISTINCT LNN_tag FROM LNN_problems WHERE LNN_tag IS NOT NULL ORDER BY LNN_tag ASC'
  );
  return LNN_rows.map(LNN_row => LNN_row.LNN_tag);
}

// 按题目 ID 查询详情（关联出题人姓名）
async function LNN_findProblemById(LNN_id) {
  const [LNN_rows] = await LNN_pool.query(
    'SELECT p.LNN_problem_id, p.LNN_title, p.LNN_description, p.LNN_difficulty, p.LNN_tag, ' +
      'p.LNN_time_limit, p.LNN_memory_limit, p.LNN_created_at, u.LNN_real_name AS LNN_creator_name ' +
      'FROM LNN_problems p LEFT JOIN LNN_users u ON p.LNN_created_by = u.LNN_user_id ' +
      'WHERE p.LNN_problem_id = ?',
    [LNN_id]
  );
  return LNN_rows[0] || null;
}

module.exports = { LNN_findProblems, LNN_findTags, LNN_findProblemById };

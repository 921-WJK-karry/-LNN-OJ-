/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试模型层，用页面传入的凭据实测 MySQL 连接
 */

// 测试数据库连接：成功返回 { serverVersion }，失败抛出原始错误
async function LNN_testConnection(LNN_username, LNN_password) {
  const LNN_mysql = require('mysql2/promise');

  // 用页面输入的凭据创建临时连接（主机与库名取自 backend/.env）
  const LNN_conn = await LNN_mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: LNN_username,
    password: LNN_password,
    database: process.env.DB_NAME,
    connectTimeout: 3000
  });

  try {
    const [LNN_rows] = await LNN_conn.query('SELECT VERSION() AS LNN_version');
    return { LNN_serverVersion: LNN_rows[0].LNN_version };
  } finally {
    await LNN_conn.end();
  }
}

// 将 MySQL 错误码转换为用户可读的提示
function LNN_formatDbError(LNN_err) {
  const LNN_map = {
    ER_ACCESS_DENIED_ERROR: '用户名或密码错误，连接被拒绝',
    ER_BAD_DB_ERROR: '数据库不存在：' + (process.env.DB_NAME || ''),
    ECONNREFUSED: '无法连接到 MySQL 服务，请确认 MySQL 已启动',
    ETIMEDOUT: '连接超时，请确认数据库地址可达'
  };
  return LNN_map[LNN_err.code] || ('数据库连接失败：' + LNN_err.code);
}

module.exports = { LNN_testConnection, LNN_formatDbError };

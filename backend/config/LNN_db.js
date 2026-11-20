/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 *
 * MySQL 连接池配置：凭据统一读取 backend/.env，禁止硬编码
 */

// 读取 .env 环境变量
require('dotenv').config();

const LNN_mysql = require('mysql2/promise');

// 创建数据库连接池
const LNN_pool = LNN_mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连通性
(async () => {
  try {
    const LNN_conn = await LNN_pool.getConnection();
    console.log('[LNN_db] MySQL 连接成功，数据库：' + process.env.DB_NAME);
    LNN_conn.release();
  } catch (LNN_err) {
    console.error('[LNN_db] MySQL 连接失败：', LNN_err.message);
  }
})();

module.exports = LNN_pool;

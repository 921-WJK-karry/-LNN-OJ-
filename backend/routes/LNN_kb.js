/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库路由（RAG）——上传 / 列表 / 删除 / 问答
 */

const LNN_express = require('express');
const LNN_router = LNN_express.Router();
const LNN_multer = require('multer');
const LNN_path = require('path');
const LNN_kbModel = require('../models/LNN_kb');
const LNN_ctrl = require('../controllers/LNN_kb');

// multer 磁盘存储：时间戳 + 清洗后的原始文件名，保留扩展名
const LNN_storage = LNN_multer.diskStorage({
  destination: (LNN_req, LNN_file, LNN_cb) => LNN_cb(null, LNN_kbModel.LNN_UPLOAD_DIR),
  filename: (LNN_req, LNN_file, LNN_cb) => {
    const LNN_ext = LNN_path.extname(LNN_file.originalname).toLowerCase();
    const LNN_base = LNN_path.basename(LNN_file.originalname, LNN_ext)
      .replace(/[\\/:*?"<>|\s]+/g, '_')
      .slice(0, 80) || 'file';
    LNN_cb(null, Date.now() + '-' + LNN_base + LNN_ext);
  }
});

// 限制扩展名与大小（10MB）
const LNN_upload = LNN_multer({
  storage: LNN_storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (LNN_req, LNN_file, LNN_cb) => {
    const LNN_ext = LNN_path.extname(LNN_file.originalname).toLowerCase();
    if (LNN_kbModel.LNN_ALLOWED_EXT.indexOf(LNN_ext) === -1) {
      return LNN_cb(new Error('只允许上传 ' + LNN_kbModel.LNN_ALLOWED_EXT.join(' / ') + ' 格式文件'));
    }
    LNN_cb(null, true);
  }
});

// 上传路由：包装 multer 中间件，捕获文件过大/类型不合法等错误，统一返回 JSON
LNN_router.post('/upload', (LNN_req, LNN_res, LNN_next) => {
  LNN_upload.single('file')(LNN_req, LNN_res, LNN_err => {
    if (LNN_err) {
      console.error('[LNN_kb routes] 上传校验失败：', LNN_err.code || LNN_err.message);
      return LNN_res.json({ code: 1, msg: LNN_ctrl.LNN_uploadError(LNN_err), data: null });
    }
    // 解析成功后交给控制器处理
    LNN_ctrl.LNN_upload(LNN_req, LNN_res);
  });
});
LNN_router.get('/files', LNN_ctrl.LNN_files);
LNN_router.delete('/files/:id', LNN_ctrl.LNN_delete);
LNN_router.post('/ask', LNN_ctrl.LNN_ask);

module.exports = LNN_router;

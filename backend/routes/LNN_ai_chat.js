/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：AI 聊天路由（挂载于 /api/ai）
 */

const LNN_router = require('express').Router();
const LNN_multer = require('multer');
const LNN_aiChatController = require('../controllers/LNN_ai_chat');

// POST /api/ai/chat AI 对话
LNN_router.post('/chat', LNN_aiChatController.LNN_chat);

// POST /api/ai/vision 图像识别（内存存储，仅图片格式，10MB）
const LNN_imageUpload = LNN_multer({
  storage: LNN_multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (LNN_req, LNN_file, LNN_cb) => {
    if (/^image\/(jpeg|png|webp|gif|bmp)$/.test(LNN_file.mimetype)) LNN_cb(null, true);
    else LNN_cb(new Error('只允许上传 jpg / png / webp / gif / bmp 格式图片'));
  }
});

LNN_router.post('/vision', (LNN_req, LNN_res, LNN_next) => {
  LNN_imageUpload.single('image')(LNN_req, LNN_res, LNN_err => {
    if (LNN_err) {
      console.error('[LNN_ai routes] 图片上传校验失败：', LNN_err.code || LNN_err.message);
      const LNN_msg = LNN_err.code === 'LIMIT_FILE_SIZE' ? '图片过大（最大 10MB）'
        : (LNN_err.message.indexOf('只允许上传') === 0 ? LNN_err.message : '图片上传失败：' + LNN_err.message);
      return LNN_res.json({ code: 1, msg: LNN_msg, data: null });
    }
    LNN_aiChatController.LNN_vision(LNN_req, LNN_res);
  });
});

module.exports = LNN_router;

/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别路由——POST /api/asr/recognize（multipart，audio 字段）
 */

const LNN_router = require('express').Router();
const LNN_multer = require('multer');
const LNN_asrController = require('../controllers/LNN_asr');

// 内存存储，音频格式白名单，最大 25MB
const LNN_audioUpload = LNN_multer({
  storage: LNN_multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (LNN_req, LNN_file, LNN_cb) => {
    if (/^audio\/(wav|x-wav|mpeg|mp3|mp4|m4a|webm|ogg|flac|aac)$/.test(LNN_file.mimetype)
      || /\.(wav|mp3|m4a|webm|ogg|oga|flac|aac)$/i.test(LNN_file.originalname)) {
      LNN_cb(null, true);
    } else {
      LNN_cb(new Error('只允许上传 wav / mp3 / m4a / webm / ogg / flac 格式音频'));
    }
  }
});

LNN_router.post('/recognize', (LNN_req, LNN_res, LNN_next) => {
  LNN_audioUpload.single('audio')(LNN_req, LNN_res, LNN_err => {
    if (LNN_err) {
      console.error('[LNN_asr routes] 音频上传校验失败：', LNN_err.code || LNN_err.message);
      const LNN_msg = LNN_err.code === 'LIMIT_FILE_SIZE' ? '音频过大（最大 25MB）'
        : (LNN_err.message.indexOf('只允许上传') === 0 ? LNN_err.message : '音频上传失败：' + LNN_err.message);
      return LNN_res.json({ code: 1, msg: LNN_msg, data: null });
    }
    LNN_asrController.LNN_recognize(LNN_req, LNN_res);
  });
});

module.exports = LNN_router;

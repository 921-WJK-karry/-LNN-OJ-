/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别控制器——接收音频文件，调用模型层转写，控制台输出发送/接收数据
 */

const LNN_asrModel = require('../models/LNN_asr');

// POST /api/asr/recognize —— 语音识别（multer 内存存储已在路由层处理）
async function LNN_recognize(LNN_req, LNN_res) {
  if (!LNN_req.file) {
    return LNN_res.json({ code: 1, msg: '未收到音频文件', data: null });
  }

  const LNN_file = LNN_req.file;

  // 控制台输出发送给 ASR 服务的数据（音频内容为二进制，仅输出摘要）
  console.log('\n[LNN_asr] ===== 发送给语音识别服务的数据 =====');
  console.log(JSON.stringify({
    filename: LNN_file.originalname,
    mime: LNN_file.mimetype,
    size: LNN_file.size + 'B',
    remark: '音频二进制内容共 ' + LNN_file.size + ' 字节（略）'
  }, null, 2));

  try {
    const LNN_result = await LNN_asrModel.LNN_asrTranscribe(LNN_file.buffer, LNN_file.originalname, LNN_file.mimetype);

    // 控制台输出语音识别服务返回的数据
    console.log('\n[LNN_asr] ===== 语音识别服务返回的数据 =====');
    console.log(JSON.stringify({
      text: LNN_result.LNN_text,
      model: LNN_result.LNN_model,
      provider: LNN_result.LNN_provider,
      language: LNN_result.LNN_language,
      usage: LNN_result.LNN_usage
    }, null, 2));

    LNN_res.json({
      code: 0,
      msg: '识别成功',
      data: {
        text: LNN_result.LNN_text,
        model: LNN_result.LNN_model,
        provider: LNN_result.LNN_provider,
        providerLabel: LNN_result.LNN_providerLabel,
        language: LNN_result.LNN_language,
        audio: { name: LNN_file.originalname, size: LNN_file.size }
      }
    });
  } catch (LNN_err) {
    console.error('[LNN_asr controller] 识别失败：', LNN_err.message);
    LNN_res.json({
      code: 1,
      msg: LNN_err.LNN_hint || '语音识别异常，请稍后重试',
      data: null
    });
  }
}

module.exports = { LNN_recognize };

/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：AI 聊天控制器，处理 POST /api/ai/chat 请求
 */

const LNN_aiChatModel = require('../models/LNN_ai_chat');

// 系统提示词：中华美食街在线客服（严格限定三类问题）
const LNN_SYSTEM_PROMPT = '你是「中华美食街」餐厅的在线客服，名字叫小美。'
  + '\n\n【你只回答以下三类问题】'
  + '\n1. 营业时间：每天 10:00-21:30，全年无休，最后点单时间 21:00。'
  + '\n2. 招牌菜：北京烤鸭（168元/只）、四川麻婆豆腐（28元）、广东虾饺（32元/笼）、'
  + '兰州牛肉面（22元）、扬州炒饭（26元）。'
  + '\n3. 配送范围：门店周边 5 公里内可配送，满 38 元免配送费，配送费 5 元，'
  + '预计 40 分钟送达；超过 5 公里无法配送。'
  + '\n\n【硬性规则】'
  + '\n- 只回答与上述三类信息相关的问题，回答必须与给定数据一致，不得编造其他菜品、价格或服务。'
  + '\n- 遇到任何与这三类无关的问题（如编程、作文、天气、闲聊、政策等），'
  + '一律用这句话礼貌引导，不要回答问题本身：'
  + '「抱歉，这个问题超出了我的服务范围，我是餐厅客服，只能解答营业时间、招牌菜和配送范围的问题。'
  + '您可以拨打店内电话或留言，我们会尽快人工回复您～」'
  + '\n- 回答使用中文，语气亲切友好，每次回答不超过 100 字。'
  + '\n- 顾客打招呼时友好回应并介绍你能提供的三类服务。';

// POST /api/ai/chat —— 请求体 { messages: [{role, content}, ...], provider: 'siliconflow'|'qiniu' }
async function LNN_chat(LNN_req, LNN_res) {
  const LNN_messages = LNN_req.body.messages;

  // 服务商由前端下拉框选择，仅传名称；密钥/地址等配置仍在服务端 .env 读取
  const LNN_provider = LNN_req.body.provider === 'qiniu' ? 'qiniu' : 'siliconflow';

  // 系统边界处校验：messages 必须为非空数组且元素合法
  if (!Array.isArray(LNN_messages) || LNN_messages.length === 0) {
    return LNN_res.status(400).json({ code: 1, msg: 'messages 不能为空', data: null });
  }

  const LNN_valid = LNN_messages.every(LNN_m =>
    LNN_m && typeof LNN_m.content === 'string' && LNN_m.content.trim() !== ''
    && (LNN_m.role === 'user' || LNN_m.role === 'assistant')
  );
  if (!LNN_valid) {
    return LNN_res.status(400).json({ code: 1, msg: '消息格式不合法', data: null });
  }

  // 防止上下文过长：只保留最近 20 条对话
  const LNN_trimmed = LNN_messages.slice(-20);
  const LNN_payload = [
    { role: 'system', content: LNN_SYSTEM_PROMPT },
    ...LNN_trimmed
  ];

  try {
    const LNN_result = await LNN_aiChatModel.LNN_chatCompletion(LNN_payload, LNN_provider);
    LNN_res.json({
      code: 0,
      msg: '回复成功',
      data: {
        reply: LNN_result.LNN_reply,
        model: LNN_result.LNN_model,
        provider: LNN_provider,
        usage: LNN_result.LNN_usage
      }
    });
  } catch (LNN_err) {
    // 所选服务商异常（如七牛限流 429）时，自动降级到另一家，保证对话可用
    const LNN_backup = LNN_provider === 'qiniu' ? 'siliconflow' : 'qiniu';
    console.warn('[LNN_ai_chat controller] ' + LNN_provider + ' 调用失败（' + LNN_err.message + '），降级到 ' + LNN_backup);
    try {
      const LNN_result = await LNN_aiChatModel.LNN_chatCompletion(LNN_payload, LNN_backup);
      LNN_res.json({
        code: 0,
        msg: '回复成功（' + LNN_provider + ' 异常，已降级到 ' + LNN_backup + '）',
        data: {
          reply: LNN_result.LNN_reply,
          model: LNN_result.LNN_model,
          provider: LNN_backup,
          usage: LNN_result.LNN_usage
        }
      });
    } catch (LNN_err2) {
      console.error('[LNN_ai_chat controller] 双服务商均失败：', LNN_err2.message);
      LNN_res.json({
        code: 1,
        msg: LNN_err2.LNN_hint || 'AI 服务异常，请稍后重试',
        data: null
      });
    }
  }
}

// 校验图片魔数（文件头）：防止把非图片文件改名为 .jpg 上传
function LNN_isValidImage(LNN_buffer, LNN_mime) {
  if (!LNN_buffer || LNN_buffer.length < 12) return false;
  const LNN_b = LNN_buffer;
  switch (LNN_mime) {
    case 'image/jpeg':
      return LNN_b[0] === 0xFF && LNN_b[1] === 0xD8 && LNN_b[2] === 0xFF;
    case 'image/png':
      return LNN_b[0] === 0x89 && LNN_b[1] === 0x50 && LNN_b[2] === 0x4E && LNN_b[3] === 0x47;
    case 'image/gif':
      return LNN_b[0] === 0x47 && LNN_b[1] === 0x49 && LNN_b[2] === 0x46; // 'GIF'
    case 'image/bmp':
      return LNN_b[0] === 0x42 && LNN_b[1] === 0x4D; // 'BM'
    case 'image/webp':
      return LNN_b.toString('ascii', 0, 4) === 'RIFF' && LNN_b.toString('ascii', 8, 12) === 'WEBP';
    default:
      return false;
  }
}

// POST /api/ai/vision —— 图像识别：上传图片返回描述（multer 内存存储已在路由层处理）
async function LNN_vision(LNN_req, LNN_res) {
  if (!LNN_req.file) {
    return LNN_res.json({ code: 1, msg: '未收到图片文件', data: null });
  }

  // 魔数校验：内容与扩展名/类型不符（如把 JSON/文本改名成 .jpg）直接拒绝
  if (!LNN_isValidImage(LNN_req.file.buffer, LNN_req.file.mimetype)) {
    console.warn('[LNN_vision controller] 图片内容校验失败：' + LNN_req.file.originalname + '（' + LNN_req.file.mimetype + ', ' + LNN_req.file.size + 'B）');
    return LNN_res.json({ code: 1, msg: '图片文件内容无效或已损坏，请上传真实图片', data: null });
  }

  const LNN_question = (LNN_req.body.question || '').trim();
  const LNN_prompt = LNN_question || '请详细描述这张图片的内容。';

  // 图片转 base64 dataURL（按 mime 类型）
  const LNN_dataUrl = 'data:' + LNN_req.file.mimetype + ';base64,' + LNN_req.file.buffer.toString('base64');

  // 控制台输出发送给大模型的数据（base64 过长，仅输出摘要）
  console.log('\n[LNN_vision] ===== 发送给大模型的数据 =====');
  console.log(JSON.stringify({
    model: process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct',
    image: { name: LNN_req.file.originalname, mime: LNN_req.file.mimetype, size: LNN_req.file.size + 'B', dataUrl: LNN_dataUrl.slice(0, 60) + '...(base64 共 ' + LNN_dataUrl.length + ' 字符，略)' },
    prompt: LNN_prompt
  }, null, 2));

  try {
    const LNN_result = await LNN_aiChatModel.LNN_visionCompletion(LNN_dataUrl, LNN_prompt);

    // 控制台输出大模型返回的数据
    console.log('\n[LNN_vision] ===== 大模型返回的数据 =====');
    console.log(JSON.stringify({ reply: LNN_result.LNN_reply, model: LNN_result.LNN_model, usage: LNN_result.LNN_usage }, null, 2));

    LNN_res.json({
      code: 0,
      msg: '识别成功',
      data: {
        description: LNN_result.LNN_reply,
        model: LNN_result.LNN_model,
        usage: LNN_result.LNN_usage,
        image: { name: LNN_req.file.originalname, size: LNN_req.file.size }
      }
    });
  } catch (LNN_err) {
    console.error('[LNN_vision controller] 识别失败：', LNN_err.message);
    LNN_res.json({
      code: 1,
      msg: LNN_err.LNN_hint || '图像识别异常，请稍后重试',
      data: null
    });
  }
}

module.exports = { LNN_chat, LNN_vision };

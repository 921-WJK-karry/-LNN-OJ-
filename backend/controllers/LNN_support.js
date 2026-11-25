/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服控制器，处理 POST /api/support/chat 请求（七牛服务商）
 */

const LNN_aiChatModel = require('../models/LNN_ai_chat');

// 客服系统提示词：限定在题库系统场景内回答
const LNN_SUPPORT_PROMPT = '你是程序设计比赛题库系统 LNN-OJ 的在线客服，'
  + '负责解答平台使用问题（注册登录、报名比赛、提交代码、查看排名、题目筛选等）'
  + '以及基础编程疑问。回答使用中文，语气亲切友好、简洁清晰。'
  + '遇到与平台无关的复杂技术问题，可以礼貌引导用户到「AI 聊天」页面咨询。';

// POST /api/support/chat —— 请求体 { messages: [{role, content}, ...] }
async function LNN_supportChat(LNN_req, LNN_res) {
  const LNN_messages = LNN_req.body.messages;

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

  // 客服场景上下文较短：只保留最近 12 条对话
  const LNN_trimmed = LNN_messages.slice(-12);

  try {
    // 在线客服优先使用硅基流动服务商（稳定），七牛限流频繁故作为备用
    const LNN_result = await LNN_aiChatModel.LNN_chatCompletion([
      { role: 'system', content: LNN_SUPPORT_PROMPT },
      ...LNN_trimmed
    ], 'siliconflow');
    LNN_res.json({
      code: 0,
      msg: '回复成功',
      data: { reply: LNN_result.LNN_reply, model: LNN_result.LNN_model, usage: LNN_result.LNN_usage }
    });
  } catch (LNN_err) {
    // 硅基流动异常时，自动降级到七牛备用服务商，保证客服可用
    console.warn('[LNN_support controller] 硅基流动调用失败（' + LNN_err.message + '），降级到 qiniu');
    try {
      const LNN_backup = await LNN_aiChatModel.LNN_chatCompletion([
        { role: 'system', content: LNN_SUPPORT_PROMPT },
        ...LNN_trimmed
      ], 'qiniu');
      LNN_res.json({
        code: 0,
        msg: '回复成功（硅基流动异常，已降级到七牛备用模型）',
        data: { reply: LNN_backup.LNN_reply, model: LNN_backup.LNN_model, usage: LNN_backup.LNN_usage }
      });
    } catch (LNN_err2) {
      console.error('[LNN_support controller] 备用服务商也失败：', LNN_err2.message);
      LNN_res.json({
        code: 1,
        msg: LNN_err2.LNN_hint || '客服服务异常，请稍后重试',
        data: null
      });
    }
  }
}

module.exports = { LNN_supportChat };

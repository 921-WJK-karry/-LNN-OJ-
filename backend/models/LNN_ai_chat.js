/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：AI 对话模型层，支持多服务商（siliconflow / qiniu），
 *       统一调用 OpenAI 兼容的 chat/completions 接口
 */

// 服务商配置表：接入地址、模型名、密钥均来自 backend/.env
const LNN_PROVIDER_CONFIG = {
  siliconflow: {
    LNN_name: 'siliconflow',
    LNN_keyEnv: 'LNN_SILICONFLOW_API_KEY',
    LNN_baseUrlEnv: 'SILICONFLOW_BASE_URL',
    LNN_modelEnv: 'SILICONFLOW_MODEL',
    LNN_defaultBaseUrl: 'https://api.siliconflow.cn/v1',
    LNN_defaultModel: 'Qwen/Qwen2.5-7B-Instruct'
  },
  qiniu: {
    LNN_name: 'qiniu',
    LNN_keyEnv: 'QINIU_CUSTOMER_SERVICE_API_KEY',
    LNN_baseUrlEnv: 'QINIU_CUSTOMER_SERVICE_BASE_URL',
    LNN_modelEnv: 'QINIU_CUSTOMER_SERVICE_MODEL',
    LNN_defaultBaseUrl: 'https://api.qnaigc.com/v1',
    LNN_defaultModel: 'qiniu/conatus-free'
  }
};

// DeepSeek 等推理模型的思考 token 也计入 completion 预算，需放宽上限
function LNN_getMaxTokens(LNN_model) {
  if (LNN_model && LNN_model.indexOf('DeepSeek') !== -1) return 4096;
  return 2048;
}

// 解析某个服务商的实际配置（地址 / 模型 / 密钥）
function LNN_resolveProvider(LNN_provider) {
  const LNN_config = LNN_PROVIDER_CONFIG[LNN_provider];
  if (!LNN_config) return null;
  return {
    LNN_name: LNN_config.LNN_name,
    LNN_apiKey: process.env[LNN_config.LNN_keyEnv],
    LNN_apiUrl: (process.env[LNN_config.LNN_baseUrlEnv] || LNN_config.LNN_defaultBaseUrl) + '/chat/completions',
    LNN_model: process.env[LNN_config.LNN_modelEnv] || LNN_config.LNN_defaultModel
  };
}

// 调用服务商对话接口：传入消息数组与服务商名，返回助手回复文本
// 失败时抛出带 LNN_hint（用户可读提示）的错误
async function LNN_chatCompletion(LNN_messages, LNN_provider) {
  const LNN_config = LNN_resolveProvider(LNN_provider || 'siliconflow');
  if (!LNN_config) {
    const LNN_err = new Error('不支持的服务商：' + LNN_provider);
    LNN_err.LNN_hint = '不支持的服务商，仅支持 siliconflow / qiniu';
    throw LNN_err;
  }

  if (!LNN_config.LNN_apiKey) {
    const LNN_err = new Error('未配置 ' + LNN_config.LNN_name + ' 密钥');
    LNN_err.LNN_hint = '服务端未配置 ' + LNN_config.LNN_keyEnv;
    throw LNN_err;
  }

  const LNN_controller = new AbortController();
  const LNN_timer = setTimeout(() => LNN_controller.abort(), 60000);

  let LNN_resp;
  try {
    LNN_resp = await fetch(LNN_config.LNN_apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + LNN_config.LNN_apiKey
      },
      body: JSON.stringify({
        model: LNN_config.LNN_model,
        messages: LNN_messages,
        temperature: 0.7,
        max_tokens: LNN_getMaxTokens(LNN_config.LNN_model)
      }),
      signal: LNN_controller.signal
    });
  } catch (LNN_err) {
    clearTimeout(LNN_timer);
    // 网络失败 / 超时中断（AbortError）转换为可读提示
    const LNN_hint = LNN_err.name === 'AbortError' ? 'AI 回复超时，请重试' : '无法连接 AI 服务，请检查网络';
    const LNN_wrapped = new Error(LNN_err.message);
    LNN_wrapped.LNN_hint = LNN_hint;
    throw LNN_wrapped;
  }

  try {
    const LNN_body = await LNN_resp.json().catch(() => null);

    if (!LNN_resp.ok) {
      const LNN_err = new Error(LNN_config.LNN_name + ' 接口返回 ' + LNN_resp.status);
      LNN_err.LNN_hint = LNN_formatApiError(LNN_resp.status, LNN_body);
      console.error('[LNN_ai model] ' + LNN_config.LNN_name + ' 接口错误：', LNN_resp.status, JSON.stringify(LNN_body));
      throw LNN_err;
    }

    const LNN_reply = LNN_body && LNN_body.choices && LNN_body.choices[0]
      && LNN_body.choices[0].message && LNN_body.choices[0].message.content;

    if (!LNN_reply) {
      const LNN_err = new Error('接口响应中没有回复内容');
      LNN_err.LNN_hint = 'AI 未返回有效回复，请稍后重试';
      throw LNN_err;
    }

    return {
      LNN_reply: LNN_reply.trim(),
      LNN_model: LNN_body.model || '',
      LNN_usage: LNN_body.usage || null
    };
  } finally {
    clearTimeout(LNN_timer);
  }
}

// 图像识别：调用硅基流动视觉模型，传入图片 dataURL 与提示词，返回描述文本
async function LNN_visionCompletion(LNN_dataUrl, LNN_prompt) {
  const LNN_config = LNN_resolveProvider('siliconflow');
  if (!LNN_config || !LNN_config.LNN_apiKey) {
    const LNN_err = new Error('未配置硅基流动密钥');
    LNN_err.LNN_hint = '服务端未配置 LNN_SILICONFLOW_API_KEY';
    throw LNN_err;
  }

  // 视觉模型从环境变量读取（SILICONFLOW_VISION_MODEL，默认 Qwen3-VL）
  const LNN_visionModel = process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct';

  const LNN_controller = new AbortController();
  // 大图 + 推理耗时较长，识别超时放宽到 180 秒
  const LNN_timer = setTimeout(() => LNN_controller.abort(), 180000);

  const LNN_messages = [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: LNN_dataUrl } },
      { type: 'text', text: LNN_prompt || '请详细描述这张图片的内容。' }
    ]
  }];

  let LNN_resp;
  try {
    LNN_resp = await fetch(LNN_config.LNN_apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + LNN_config.LNN_apiKey
      },
      body: JSON.stringify({
        model: LNN_visionModel,
        messages: LNN_messages,
        temperature: 0.7,
        max_tokens: 1024
      }),
      signal: LNN_controller.signal
    });
  } catch (LNN_err) {
    clearTimeout(LNN_timer);
    const LNN_hint = LNN_err.name === 'AbortError'
      ? '图像识别超时（图片较大时识别较慢），请重试或换一张更小的图片'
      : '无法连接 AI 服务，请检查网络';
    const LNN_wrapped = new Error(LNN_err.message);
    LNN_wrapped.LNN_hint = LNN_hint;
    throw LNN_wrapped;
  }

  try {
    const LNN_body = await LNN_resp.json().catch(() => null);

    if (!LNN_resp.ok) {
      const LNN_err = new Error('视觉模型接口返回 ' + LNN_resp.status);
      // 图片内容无效时给出更准确的提示
      if (LNN_body && LNN_body.message && LNN_body.message.indexOf('not a valid image') !== -1) {
        LNN_err.LNN_hint = '图片文件内容无效或已损坏，请上传真实图片';
      } else {
        LNN_err.LNN_hint = LNN_formatApiError(LNN_resp.status, LNN_body);
      }
      console.error('[LNN_ai model] 视觉模型接口错误：', LNN_resp.status, JSON.stringify(LNN_body));
      throw LNN_err;
    }

    const LNN_reply = LNN_body && LNN_body.choices && LNN_body.choices[0]
      && LNN_body.choices[0].message && LNN_body.choices[0].message.content;

    if (!LNN_reply) {
      const LNN_err = new Error('视觉模型响应中没有回复内容');
      LNN_err.LNN_hint = '图像识别未返回有效结果，请稍后重试';
      throw LNN_err;
    }

    return {
      LNN_reply: LNN_reply.trim(),
      LNN_model: LNN_body.model || LNN_visionModel,
      LNN_usage: LNN_body.usage || null
    };
  } finally {
    clearTimeout(LNN_timer);
  }
}

// 将服务商 HTTP 状态码转换为用户可读提示
function LNN_formatApiError(LNN_status, LNN_body) {
  if (LNN_status === 401) return 'AI 密钥无效或已过期（401）';
  if (LNN_status === 429) return '请求过于频繁，请稍后再试（429）';
  if (LNN_status === 503 || LNN_status === 502) return 'AI 服务繁忙，请稍后再试';
  return 'AI 接口调用失败（HTTP ' + LNN_status + '）';
}

module.exports = { LNN_chatCompletion, LNN_visionCompletion, LNN_formatApiError, LNN_resolveProvider };

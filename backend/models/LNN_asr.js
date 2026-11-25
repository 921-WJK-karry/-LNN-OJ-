/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别（ASR）模型层——优先七牛 Qwen-Audio-3.0-ASR-Flash，
 *       平台未上线该模型时自动降级到硅基流动 SenseVoiceSmall（OpenAI 兼容 audio/transcriptions）
 */

const LNN_fs = require('fs');
const LNN_path = require('path');

// 读取 .env（服务入口 dotenv 已加载，但直接读取保证独立可用）
function LNN_envGet(LNN_key, LNN_default) {
  const LNN_v = process.env[LNN_key];
  if (LNN_v !== undefined && LNN_v !== '') return LNN_v;
  try {
    const LNN_envFile = LNN_fs.readFileSync(LNN_path.join(__dirname, '..', '.env'), 'utf8');
    const LNN_found = LNN_envFile.split(/\r?\n/).find(LNN_l => LNN_l.match('^\\s*' + LNN_key + '\\s*='));
    if (LNN_found) return LNN_found.split('=')[1].trim();
  } catch (LNN_e) { /* 忽略 */ }
  return LNN_default;
}

// ASR 服务商配置表（七牛优先，硅基流动兜底）
function LNN_asrProviders() {
  return [
    {
      LNN_name: 'qiniu',
      LNN_label: '七牛云 Qwen-Audio-3.0-ASR-Flash',
      LNN_apiUrl: LNN_envGet('QINIU_ASR_BASE_URL', 'https://api.qnaigc.com/v1') + '/audio/transcriptions',
      LNN_apiKey: LNN_envGet('QINIU_ASR_API_KEY', ''),
      LNN_model: LNN_envGet('QINIU_ASR_MODEL', 'Qwen-Audio-3.0-ASR-Flash')
    },
    {
      LNN_name: 'siliconflow',
      LNN_label: '硅基流动 SenseVoiceSmall',
      LNN_apiUrl: LNN_envGet('SILICONFLOW_BASE_URL', 'https://api.siliconflow.cn/v1') + '/audio/transcriptions',
      LNN_apiKey: LNN_envGet('LNN_SILICONFLOW_API_KEY', ''),
      LNN_model: LNN_envGet('SILICONFLOW_ASR_MODEL', 'FunAudioLLM/SenseVoiceSmall')
    }
  ];
}

// 单个服务商转写：multipart 上传音频，返回 { text, model, language, duration }
async function LNN_callProvider(LNN_provider, LNN_buffer, LNN_filename, LNN_mime) {
  const LNN_controller = new AbortController();
  const LNN_timer = setTimeout(() => LNN_controller.abort(), 120000);

  let LNN_resp;
  try {
    const LNN_form = new FormData();
    LNN_form.append('file', new Blob([LNN_buffer], { type: LNN_mime }), LNN_filename);
    LNN_form.append('model', LNN_provider.LNN_model);
    LNN_resp = await fetch(LNN_provider.LNN_apiUrl, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + LNN_provider.LNN_apiKey },
      body: LNN_form,
      signal: LNN_controller.signal
    });
  } catch (LNN_err) {
    clearTimeout(LNN_timer);
    const LNN_hint = LNN_err.name === 'AbortError' ? '语音识别超时，请重试' : '无法连接语音识别服务';
    const LNN_wrapped = new Error(LNN_err.message);
    LNN_wrapped.LNN_hint = LNN_hint;
    throw LNN_wrapped;
  }

  try {
    const LNN_body = await LNN_resp.json().catch(() => null);

    if (!LNN_resp.ok) {
      // 提取可读错误信息（兼容 error.message / message 两种格式）
      const LNN_apiMsg = (LNN_body && ((LNN_body.error && LNN_body.error.message) || LNN_body.message)) || ('HTTP ' + LNN_resp.status);
      const LNN_err = new Error('[' + LNN_provider.LNN_name + '] ' + LNN_apiMsg);
      LNN_err.LNN_apiStatus = LNN_resp.status;
      throw LNN_err;
    }

    const LNN_text = LNN_body && LNN_body.text;
    if (!LNN_text && LNN_text !== '') {
      const LNN_err = new Error('[' + LNN_provider.LNN_name + '] 响应中没有转写文本');
      throw LNN_err;
    }

    return {
      LNN_text: LNN_text.trim(),
      LNN_model: LNN_body.model || LNN_provider.LNN_model,
      LNN_language: LNN_body.language || null,
      LNN_usage: LNN_body.usage || null
    };
  } finally {
    clearTimeout(LNN_timer);
  }
}

// 语音识别入口：按顺序尝试服务商，全部失败抛出汇总错误
async function LNN_asrTranscribe(LNN_buffer, LNN_filename, LNN_mime) {
  const LNN_errors = [];

  for (const LNN_provider of LNN_asrProviders()) {
    if (!LNN_provider.LNN_apiKey) {
      LNN_errors.push(LNN_provider.LNN_name + ': 未配置密钥');
      continue;
    }
    try {
      console.log('[LNN_asr] 尝试服务商：' + LNN_provider.LNN_label);
      const LNN_result = await LNN_callProvider(LNN_provider, LNN_buffer, LNN_filename, LNN_mime);
      return {
        LNN_text: LNN_result.LNN_text,
        LNN_model: LNN_result.LNN_model,
        LNN_provider: LNN_provider.LNN_name,
        LNN_providerLabel: LNN_provider.LNN_label,
        LNN_language: LNN_result.LNN_language,
        LNN_usage: LNN_result.LNN_usage
      };
    } catch (LNN_err) {
      console.warn('[LNN_asr] 服务商 ' + LNN_provider.LNN_name + ' 失败：' + LNN_err.message);
      LNN_errors.push(LNN_provider.LNN_name + ': ' + (LNN_err.LNN_hint || LNN_err.message));
    }
  }

  const LNN_err = new Error(LNN_errors.join('；'));
  LNN_err.LNN_hint = '语音识别暂时不可用，请稍后重试';
  throw LNN_err;
}

module.exports = { LNN_asrTranscribe };

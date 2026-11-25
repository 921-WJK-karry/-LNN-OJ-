/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库控制器（RAG）——上传、列表、删除、检索问答
 */

const LNN_fs = require('fs');
const LNN_path = require('path');
const LNN_kbModel = require('../models/LNN_kb');
const LNN_aiChatModel = require('../models/LNN_ai_chat');

// RAG 系统提示词：只依据知识库内容回答
const LNN_RAG_PROMPT = '你是「中华美食街」的知识库问答助手。'
  + '\n规则：'
  + '\n1. 只依据下面提供的【知识库检索内容】回答用户问题，回答必须能在检索内容中找到依据。'
  + '\n2. 如果检索内容中没有相关信息，直接回答：「知识库中暂时没有相关内容，您可以换个问法，或联系店员人工咨询～」，不得编造。'
  + '\n3. 回答使用中文，语气亲切简洁，不超过 200 字。';

// 修复 multipart 文件名编码问题：busboy 默认按 Latin1 解码 UTF-8 文件名
// 还原原理：Latin1 字节序列重编码为 UTF-8 后能精确回退，才认定是乱码并还原
function LNN_fixFilename(LNN_name) {
  if (!LNN_name) return LNN_name;
  const LNN_fixed = Buffer.from(LNN_name, 'latin1').toString('utf8');
  if (LNN_fixed === LNN_name) return LNN_name;
  const LNN_back = Buffer.from(LNN_fixed, 'utf8').toString('latin1');
  return LNN_back === LNN_name ? LNN_fixed : LNN_name;
}

// 统一上传错误提示
function LNN_uploadError(LNN_err) {
  if (LNN_err.code === 'LIMIT_FILE_SIZE') return '文件过大（最大 10MB）';
  if (LNN_err.message && LNN_err.message.indexOf('只允许上传') === 0) return LNN_err.message;
  return '上传失败：' + LNN_err.message;
}

// POST /api/kb/upload —— 上传并解析入库
async function LNN_upload(LNN_req, LNN_res) {
  if (!LNN_req.file) {
    return LNN_res.json({ code: 1, msg: '未收到文件', data: null });
  }
  try {
    const LNN_ext = LNN_path.extname(LNN_req.file.originalname).toLowerCase();
    // multer 磁盘存储模式下 file.buffer 为空，需从磁盘读取内容再解析
    const LNN_buf = LNN_fs.readFileSync(LNN_req.file.path);
    const LNN_text = await LNN_kbModel.LNN_extractText(LNN_buf, LNN_ext);
    if (!LNN_text || LNN_text.trim().length < 10) {
      LNN_fs.unlinkSync(LNN_req.file.path);
      return LNN_res.json({ code: 1, msg: '文件解析后未提取到有效文本内容', data: null });
    }

    const LNN_chunks = LNN_kbModel.LNN_splitChunks(LNN_text);
    const LNN_fileId = await LNN_kbModel.LNN_saveFile({
      LNN_filename: LNN_path.basename(LNN_req.file.path),
      LNN_original_name: LNN_fixFilename(LNN_req.file.originalname),
      LNN_file_type: LNN_ext.slice(1),
      LNN_file_size: LNN_req.file.size
    }, LNN_chunks);

    console.log('[LNN_kb controller] 文件入库成功：' + LNN_fixFilename(LNN_req.file.originalname) + '，提取 ' + LNN_text.length + ' 字，分为 ' + LNN_chunks.length + ' 块');
    LNN_res.json({
      code: 0,
      msg: '上传成功',
      data: {
        file_id: LNN_fileId,
        original_name: LNN_req.file.originalname,
        text_length: LNN_text.length,
        chunk_count: LNN_chunks.length
      }
    });
  } catch (LNN_err) {
    console.error('[LNN_kb controller] 上传处理失败：', LNN_err.message);
    if (LNN_req.file && LNN_fs.existsSync(LNN_req.file.path)) LNN_fs.unlinkSync(LNN_req.file.path);
    LNN_res.json({ code: 1, msg: LNN_uploadError(LNN_err), data: null });
  }
}

// GET /api/kb/files —— 文件列表
async function LNN_files(LNN_req, LNN_res) {
  try {
    const LNN_rows = await LNN_kbModel.LNN_listFiles();
    LNN_res.json({
      code: 0,
      msg: '获取成功',
      data: {
        list: LNN_rows.map(LNN_r => ({
          file_id: LNN_r.LNN_file_id,
          original_name: LNN_r.LNN_original_name,
          file_type: LNN_r.LNN_file_type,
          file_size: LNN_r.LNN_file_size,
          chunk_count: LNN_r.LNN_chunk_count,
          created_at: LNN_r.LNN_created_at
        }))
      }
    });
  } catch (LNN_err) {
    console.error('[LNN_kb controller] 获取文件列表失败：', LNN_err.message);
    LNN_res.json({ code: 1, msg: '获取文件列表失败', data: null });
  }
}

// DELETE /api/kb/files/:id —— 删除文件及其文本块
async function LNN_delete(LNN_req, LNN_res) {
  const LNN_fileId = parseInt(LNN_req.params.id, 10);
  if (!LNN_fileId) {
    return LNN_res.json({ code: 1, msg: '文件 ID 不合法', data: null });
  }
  try {
    const LNN_filename = await LNN_kbModel.LNN_deleteFile(LNN_fileId);
    if (!LNN_filename) {
      return LNN_res.json({ code: 1, msg: '文件不存在', data: null });
    }
    const LNN_diskPath = LNN_path.join(LNN_kbModel.LNN_UPLOAD_DIR, LNN_filename);
    if (LNN_fs.existsSync(LNN_diskPath)) LNN_fs.unlinkSync(LNN_diskPath);
    console.log('[LNN_kb controller] 已删除文件 ID=' + LNN_fileId + '（' + LNN_filename + '）');
    LNN_res.json({ code: 0, msg: '删除成功', data: null });
  } catch (LNN_err) {
    console.error('[LNN_kb controller] 删除失败：', LNN_err.message);
    LNN_res.json({ code: 1, msg: '删除失败', data: null });
  }
}

// POST /api/kb/ask —— 基于知识库的 RAG 问答
async function LNN_ask(LNN_req, LNN_res) {
  const LNN_question = (LNN_req.body.question || '').trim();
  if (!LNN_question) {
    return LNN_res.json({ code: 1, msg: '问题不能为空', data: null });
  }
  if (LNN_question.length > 500) {
    return LNN_res.json({ code: 1, msg: '问题过长（最多 500 字）', data: null });
  }

  try {
    // 1. 检索知识库
    const LNN_chunks = await LNN_kbModel.LNN_searchChunks(LNN_question, 4);
    const LNN_context = LNN_chunks.length > 0
      ? LNN_chunks.map((LNN_c, LNN_i) => '【片段' + (LNN_i + 1) + '】\n' + LNN_c.LNN_content).join('\n\n')
      : '（未检索到相关内容）';

    // 2. 组装发送给大模型的消息
    const LNN_messages = [
      { role: 'system', content: LNN_RAG_PROMPT },
      { role: 'user', content: '【知识库检索内容】\n' + LNN_context + '\n\n【用户问题】\n' + LNN_question }
    ];

    // 3. 控制台输出发送给大模型的数据
    console.log('\n[LNN_kb RAG] ===== 发送给大模型的数据 =====');
    console.log('检索命中块数：' + LNN_chunks.length);
    console.log(JSON.stringify(LNN_messages, null, 2));

    // 4. 调用大模型（硅基流动优先，七牛备用）
    let LNN_result = null, LNN_usedProvider = 'siliconflow';
    try {
      LNN_result = await LNN_aiChatModel.LNN_chatCompletion(LNN_messages, 'siliconflow');
    } catch (LNN_err) {
      console.warn('[LNN_kb controller] 硅基流动失败（' + LNN_err.message + '），降级到 qiniu');
      LNN_result = await LNN_aiChatModel.LNN_chatCompletion(LNN_messages, 'qiniu');
      LNN_usedProvider = 'qiniu';
    }

    // 5. 控制台输出大模型返回的数据
    console.log('\n[LNN_kb RAG] ===== 大模型返回的数据 =====');
    console.log(JSON.stringify({ reply: LNN_result.LNN_reply, model: LNN_result.LNN_model, usage: LNN_result.LNN_usage }, null, 2));

    LNN_res.json({
      code: 0,
      msg: '回复成功',
      data: {
        reply: LNN_result.LNN_reply,
        model: LNN_result.LNN_model,
        provider: LNN_usedProvider,
        hit_chunks: LNN_chunks.length
      }
    });
  } catch (LNN_err) {
    console.error('[LNN_kb controller] 问答失败：', LNN_err.message);
    LNN_res.json({
      code: 1,
      msg: LNN_err.LNN_hint || '知识库问答异常，请稍后重试',
      data: null
    });
  }
}

module.exports = { LNN_upload, LNN_files, LNN_delete, LNN_ask, LNN_uploadError };

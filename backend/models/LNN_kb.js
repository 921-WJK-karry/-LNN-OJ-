/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库模型层（RAG）——文件文本解析、分块、入库、关键词检索
 */

const LNN_fs = require('fs');
const LNN_path = require('path');
const LNN_AdmZip = require('adm-zip');
const LNN_iconv = require('iconv-lite');
const LNN_db = require('../config/LNN_db');

// 上传文件存放目录
const LNN_UPLOAD_DIR = LNN_path.join(__dirname, '..', 'LNN_uploads');
if (!LNN_fs.existsSync(LNN_UPLOAD_DIR)) LNN_fs.mkdirSync(LNN_UPLOAD_DIR, { recursive: true });

// 允许上传的扩展名
const LNN_ALLOWED_EXT = ['.txt', '.md', '.docx', '.doc', '.pptx', '.ppt', '.pdf'];

// ========== 文本解析 ==========

// docx：ZIP 内 word/document.xml，按段落提取 <w:t> 文本
function LNN_parseDocx(LNN_buffer) {
  const LNN_zip = new LNN_AdmZip(LNN_buffer);
  const LNN_entry = LNN_zip.getEntry('word/document.xml');
  if (!LNN_entry) return '';
  const LNN_xml = LNN_entry.getData().toString('utf8');
  // 段落分隔，段内拼接 <w:t> 文本
  return LNN_xml
    .split(/<\/w:p>/)
    .map(LNN_p => (LNN_p.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [])
      .map(LNN_t => LNN_t.replace(/<[^>]+>/g, '')).join(''))
    .filter(LNN_p => LNN_p.trim() !== '')
    .join('\n');
}

// pptx：ZIP 内 ppt/slides/slide*.xml，提取 <a:t> 文本
function LNN_parsePptx(LNN_buffer) {
  const LNN_zip = new LNN_AdmZip(LNN_buffer);
  const LNN_slides = LNN_zip.getEntries()
    .filter(LNN_e => /^ppt\/slides\/slide\d+\.xml$/.test(LNN_e.entryName))
    .sort((LNN_a, LNN_b) => {
      const LNN_n = LNN_s => parseInt(LNN_s.entryName.replace(/\D/g, ''), 10);
      return LNN_n(LNN_a) - LNN_n(LNN_b);
    });
  return LNN_slides.map(LNN_e => {
    const LNN_xml = LNN_e.getData().toString('utf8');
    return (LNN_xml.match(/<a:t>([^<]*)<\/a:t>/g) || [])
      .map(LNN_t => LNN_t.replace(/<[^>]+>/g, '')).join(' ');
  }).filter(LNN_p => LNN_p.trim() !== '').join('\n');
}

// pdf：pdf-parse 提取全文
async function LNN_parsePdf(LNN_buffer) {
  // 注意：直接 require('pdf-parse') 会触发其调试代码，需引用内部模块
  const LNN_pdfParse = require('pdf-parse/lib/pdf-parse.js');
  const LNN_data = await LNN_pdfParse(LNN_buffer);
  return LNN_data.text || '';
}

// doc/ppt（旧版二进制格式）：尽力提取 UTF-16LE / GBK 可读文本
function LNN_parseLegacyBinary(LNN_buffer) {
  // 先尝试 UTF-16LE：提取连续可打印中文/ASCII 段
  const LNN_utf16 = LNN_iconv.decode(LNN_buffer, 'utf16le');
  const LNN_utf16Parts = (LNN_utf16.match(/[\u4e00-\u9fa5A-Za-z0-9，。：；！？、,.:;!?()（）%\-\s]{6,}/g) || []);
  if (LNN_utf16Parts.join('').length > 100) return LNN_utf16Parts.join('\n');
  // 回退 GBK
  const LNN_gbk = LNN_iconv.decode(LNN_buffer, 'gbk');
  const LNN_gbkParts = (LNN_gbk.match(/[\u4e00-\u9fa5A-Za-z0-9，。：；！？、,.:;!?()（）%\-\s]{6,}/g) || []);
  return LNN_gbkParts.join('\n');
}

// 按扩展名解析文件，返回纯文本
async function LNN_extractText(LNN_buffer, LNN_ext) {
  switch (LNN_ext) {
    case '.txt':
    case '.md':
      // 尝试 UTF-8，含 BOM 时自动去除；失败回退 GBK
      return LNN_isUtf8(LNN_buffer) ? LNN_buffer.toString('utf8') : LNN_iconv.decode(LNN_buffer, 'gbk');
    case '.docx':
      return LNN_parseDocx(LNN_buffer);
    case '.pptx':
      return LNN_parsePptx(LNN_buffer);
    case '.pdf':
      return LNN_parsePdf(LNN_buffer);
    case '.doc':
    case '.ppt':
      return LNN_parseLegacyBinary(LNN_buffer);
    default:
      throw new Error('不支持的文件类型：' + LNN_ext);
  }
}

// 简易 UTF-8 合法性检测
function LNN_isUtf8(LNN_buffer) {
  try {
    const LNN_str = LNN_buffer.toString('utf8');
    return !LNN_str.includes('\uFFFD');
  } catch (LNN_e) {
    return false;
  }
}

// ========== 分块 ==========

// 将长文本按段落合并为约 300 字的块（较小的块提升检索精度）
function LNN_splitChunks(LNN_text) {
  const LNN_paras = LNN_text.split(/\r?\n+/).map(LNN_p => LNN_p.trim()).filter(LNN_p => LNN_p !== '');
  const LNN_chunks = [];
  let LNN_cur = '';
  for (const LNN_p of LNN_paras) {
    // 单段超长时直接硬切
    if (LNN_p.length > 350) {
      if (LNN_cur) { LNN_chunks.push(LNN_cur); LNN_cur = ''; }
      for (let i = 0; i < LNN_p.length; i += 300) LNN_chunks.push(LNN_p.slice(i, i + 300));
      continue;
    }
    if ((LNN_cur + '\n' + LNN_p).length > 300) {
      if (LNN_cur) LNN_chunks.push(LNN_cur);
      LNN_cur = LNN_p;
    } else {
      LNN_cur = LNN_cur ? LNN_cur + '\n' + LNN_p : LNN_p;
    }
  }
  if (LNN_cur) LNN_chunks.push(LNN_cur);
  return LNN_chunks;
}

// ========== 数据库操作 ==========

// 保存文件记录与文本块，返回文件 ID
async function LNN_saveFile(LNN_meta, LNN_chunks) {
  const [LNN_result] = await LNN_db.query(
    'INSERT INTO LNN_kb_files (LNN_filename, LNN_original_name, LNN_file_type, LNN_file_size, LNN_chunk_count) VALUES (?,?,?,?,?)',
    [LNN_meta.LNN_filename, LNN_meta.LNN_original_name, LNN_meta.LNN_file_type, LNN_meta.LNN_file_size, LNN_chunks.length]
  );
  const LNN_fileId = LNN_result.insertId;
  if (LNN_chunks.length > 0) {
    const LNN_values = LNN_chunks.map((LNN_c, LNN_i) => [LNN_fileId, LNN_i, LNN_c]);
    await LNN_db.query(
      'INSERT INTO LNN_kb_chunks (LNN_file_id, LNN_chunk_index, LNN_content) VALUES ?',
      [LNN_values]
    );
  }
  return LNN_fileId;
}

// 文件列表（含块数）
async function LNN_listFiles() {
  const [LNN_rows] = await LNN_db.query(
    'SELECT LNN_file_id, LNN_filename, LNN_original_name, LNN_file_type, LNN_file_size, LNN_chunk_count, LNN_created_at FROM LNN_kb_files ORDER BY LNN_file_id DESC'
  );
  return LNN_rows;
}

// 删除文件：返回存储文件名供磁盘删除；块由外键级联删除
async function LNN_deleteFile(LNN_fileId) {
  const [LNN_rows] = await LNN_db.query(
    'SELECT LNN_filename FROM LNN_kb_files WHERE LNN_file_id = ?',
    [LNN_fileId]
  );
  if (LNN_rows.length === 0) return null;
  await LNN_db.query('DELETE FROM LNN_kb_files WHERE LNN_file_id = ?', [LNN_fileId]);
  return LNN_rows[0].LNN_filename;
}

// 高频虚词/疑问词碎片停用表：这些 2 字组合几乎命中所有文档，会污染打分
const LNN_STOPWORDS = new Set([
  '什么', '么时', '时候', '可以', '怎么', '怎样', '么做', '多少', '请问', '一下',
  '这个', '那个', '还是', '没有', '是否', '如何', '你们', '我们', '他们', '自己',
  '就是', '但是', '如果', '而且', '或者', '以及', '关于', '是不', '有不', '能不',
  '可不', '我要', '我想', '你是', '我是', '在哪', '里有', '何区', '什么意思'
]);

// 关键词检索：中文按 2/3/4 字滑窗 + 整段词加权，虚词过滤，按命中次数×词重打分，取 TopN
async function LNN_searchChunks(LNN_question, LNN_topN) {
  const [LNN_rows] = await LNN_db.query(
    'SELECT c.LNN_chunk_id, c.LNN_file_id, c.LNN_content, f.LNN_original_name ' +
    'FROM LNN_kb_chunks c LEFT JOIN LNN_kb_files f ON c.LNN_file_id = f.LNN_file_id'
  );

  // 构建检索词表：词 -> 权重（同一词保留最大权重）
  const LNN_terms = new Map();
  const LNN_addTerm = (LNN_t, LNN_w) => {
    if (LNN_t.length < 2 || LNN_STOPWORDS.has(LNN_t)) return;
    const LNN_old = LNN_terms.get(LNN_t);
    if (LNN_old === undefined || LNN_w > LNN_old) LNN_terms.set(LNN_t, LNN_w);
  };

  const LNN_segments = LNN_question.match(/[\u4e00-\u9fa5A-Za-z0-9]+/g) || [];
  for (const LNN_seg of LNN_segments) {
    // 完整段作为高权重词（如「营业时间」「北京烤鸭」整段出现时强命中）
    if (/[A-Za-z0-9]/.test(LNN_seg)) LNN_addTerm(LNN_seg, LNN_seg.length + 2);
    else LNN_addTerm(LNN_seg, LNN_seg.length);
    // 多字滑窗：3/4 字词权重高于 2 字碎片
    for (let LNN_n = 2; LNN_n <= Math.min(4, LNN_seg.length); LNN_n++) {
      for (let LNN_i = 0; LNN_i + LNN_n <= LNN_seg.length; LNN_i++) {
        LNN_addTerm(LNN_seg.slice(LNN_i, LNN_i + LNN_n), LNN_n - 1);
      }
    }
  }

  const LNN_scored = LNN_rows.map(LNN_row => {
    let LNN_score = 0;
    LNN_terms.forEach((LNN_weight, LNN_t) => {
      let LNN_idx = -1, LNN_count = 0;
      while ((LNN_idx = LNN_row.LNN_content.indexOf(LNN_t, LNN_idx + 1)) !== -1 && LNN_count < 5) LNN_count++;
      if (LNN_count > 0) LNN_score += LNN_count * LNN_weight;
    });
    return {
      LNN_file_id: LNN_row.LNN_file_id,
      LNN_content: LNN_row.LNN_content,
      LNN_file_name: LNN_row.LNN_original_name || '未知文件',
      LNN_score
    };
  });

  return LNN_scored
    .filter(LNN_s => LNN_s.LNN_score > 0)
    .sort((LNN_a, LNN_b) => LNN_b.LNN_score - LNN_a.LNN_score)
    .slice(0, LNN_topN || 4);
}

module.exports = {
  LNN_UPLOAD_DIR,
  LNN_ALLOWED_EXT,
  LNN_extractText,
  LNN_splitChunks,
  LNN_saveFile,
  LNN_listFiles,
  LNN_deleteFile,
  LNN_searchChunks
};

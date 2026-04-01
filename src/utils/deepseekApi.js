const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

/**
 * 将职位的中文内容批量翻译成英文和日文。
 * @param {object} zhData - { title, department, type, responsibilities: [], requirements: [] }
 * @returns {object} - { en: {...}, ja: {...} }
 */
export async function translateJobContent(zhData) {
  const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('未配置 REACT_APP_DEEPSEEK_API_KEY，请在 .env 文件中添加');

  const prompt = `你是一位专业的商务翻译，请将以下中文职位信息翻译成英文（en）和日文（ja），保持专业的招聘语气，术语准确。

中文原文（JSON）：
${JSON.stringify(zhData, null, 2)}

请严格按照如下 JSON 格式返回，不要添加任何其他文字或代码块标记：
{
  "en": {
    "title": "...",
    "department": "...",
    "type": "...",
    "responsibilities": ["...", "..."],
    "requirements": ["...", "..."]
  },
  "ja": {
    "title": "...",
    "department": "...",
    "type": "...",
    "responsibilities": ["...", "..."],
    "requirements": ["...", "..."]
  }
}`;

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `DeepSeek API 请求失败 (${res.status})`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('翻译结果解析失败，请重试');
  }
}

export async function translateProductContent(zhData) {
  const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('未配置 REACT_APP_DEEPSEEK_API_KEY，请在 .env 文件中添加');

  const prompt = `你是一位专业的制造业产品翻译，请将以下中文产品信息翻译成英文（en）和日文（ja），保持专业简洁的工业产品语气。

中文原文（JSON）：
${JSON.stringify(zhData, null, 2)}

请严格按照如下 JSON 格式返回，不要添加任何其他文字或代码块标记：
{
  "en": {
    "title": "...",
    "description": "...",
    "features": ["...", "..."]
  },
  "ja": {
    "title": "...",
    "description": "...",
    "features": ["...", "..."]
  }
}`;

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `DeepSeek API 请求失败 (${res.status})`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('翻译结果解析失败，请重试');
  }
}

/**
 * 将资质/证书的中文标题翻译成英文和日文（用于后台 certifications.json）
 */
export async function translateCertificationTitle(zhData) {
  const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('未配置 REACT_APP_DEEPSEEK_API_KEY，请在 .env 文件中添加');

  const prompt = `你是一位专业的制造业与企业资质文档翻译，请将以下中文证书或资质标题翻译成英文（en）和日文（ja），语气正式、简洁，适合企业官网展示；专有名词（如 ISO9001）保持通用写法。

中文原文（JSON）：
${JSON.stringify(zhData, null, 2)}

请严格按照如下 JSON 格式返回，不要添加任何其他文字或代码块标记：
{
  "en": { "title": "..." },
  "ja": { "title": "..." }
}`;

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `DeepSeek API 请求失败 (${res.status})`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('翻译结果解析失败，请重试');
  }
}

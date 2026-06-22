/** Vercel Serverless：同源转发联系表单到 Formspree（避免浏览器拦截第三方请求） */
const DEFAULT_FORMSPREE = 'https://formspree.io/f/xjkrwloz';

function pickString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const name = pickString(req.body?.name);
  const email = pickString(req.body?.email);
  const subject = pickString(req.body?.subject);
  const message = pickString(req.body?.message);
  const gotcha = pickString(req.body?._gotcha);

  if (gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!name || !email || !message) {
    res.status(400).json({
      error: 'Missing required fields',
      errors: [{ message: 'Name, email and message are required.' }],
    });
    return;
  }

  const endpoint = (process.env.FORMSPREE_ENDPOINT || DEFAULT_FORMSPREE).trim();

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email,
        _subject: subject || `Website contact from ${name}`,
      }),
    });

    let data = {};
    try {
      data = await upstream.json();
    } catch {
      data = {};
    }

    res.status(upstream.status).json(data);
  } catch {
    res.status(500).json({ error: 'Unable to reach form service' });
  }
}

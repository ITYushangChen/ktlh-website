const CONTACT_API = '/api/contact';

export function contactFormErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  if (typeof data.error?.message === 'string' && data.error.message.trim()) {
    return data.error.message;
  }
  if (Array.isArray(data.errors)) {
    const parts = data.errors
      .map((item) => (typeof item?.message === 'string' ? item.message : item?.code))
      .filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  return fallback;
}

/** 通过同源 API 提交（生产环境走 Vercel Function，开发环境走 devServer 代理） */
export async function submitContactForm({ name, email, subject, message }) {
  const res = await fetch(CONTACT_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, subject, message }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { ok: res.ok, status: res.status, data };
}

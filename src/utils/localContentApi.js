/** 开发环境：写入 public/content/*.json，前台刷新即可看到 */
export async function saveContentLocally(relPath, content) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('本地保存仅用于开发环境');
  }

  const normalized = relPath.replace(/^public\//, '');

  const res = await fetch('/api/dev/save-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: normalized, content }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `本地保存失败 (${res.status})`);
  }

  return res.json();
}

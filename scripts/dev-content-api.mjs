/**
 * 开发环境：将 JSON 写入 public/content（供 npm start 时本地预览）
 * POST /api/dev/save-content  { path: "content/products.json", content: {...} }
 */
import http from 'node:http';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3099;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

function isAllowedContentPath(relPath) {
  if (!relPath || typeof relPath !== 'string') return false;
  const normalized = relPath.replace(/^\/+/, '').replace(/^public\//, '');
  if (!normalized.startsWith('content/')) return false;
  if (!normalized.endsWith('.json')) return false;
  if (normalized.includes('..')) return false;
  return true;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/dev/save-content') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { path: relPath, content } = payload;
        if (!isAllowedContentPath(relPath)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '仅允许保存 public/content/*.json' }));
          return;
        }
        const normalized = relPath.replace(/^\/+/, '').replace(/^public\//, '');
        const fullPath = join(publicDir, normalized);
        writeFileSync(fullPath, JSON.stringify(content, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, path: normalized }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || '保存失败' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[dev-content-api] http://localhost:${PORT} (writes to public/content/)`);
});

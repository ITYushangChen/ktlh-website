/**
 * 根据 products.json / product-details.json 生成 public/sitemap.xml
 * 用法: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const SITE_URL = 'https://ktlhrefrigeration.com';

const CATEGORY_PATH_BY_ID = {
  receivers: 'receivers',
  'gas-liquid-separators': 'gas-liquid-separators',
  'oil-separators': 'oil-separators',
  'damping-blocks': 'damping-blocks',
  'shell-tube-heat-exchangers': 'shell-tube-heat-exchangers',
  'copper-tube-series': 'copper-tube-series',
  'steel-pipes': 'steel-pipes',
  'plate-heat-exchangers': 'plate-heat-exchangers',
};

const STATIC_PATHS = [
  '/',
  '/about',
  '/products',
  '/contact',
  '/terms',
  '/privacy',
];

function readJson(relPath) {
  return JSON.parse(readFileSync(join(publicDir, relPath), 'utf8'));
}

function collectPaths() {
  const paths = new Set(STATIC_PATHS);

  const products = readJson('content/products.json');
  for (const cat of products.categories || []) {
    if (cat.active === false) continue;
    const link = cat.link || (cat.id ? `/products/${CATEGORY_PATH_BY_ID[cat.id] || cat.id}` : null);
    if (link) paths.add(link);
  }

  const details = readJson('content/product-details.json');
  for (const [categoryId, items] of Object.entries(details)) {
    const categoryPath = CATEGORY_PATH_BY_ID[categoryId] || categoryId;
    for (const item of items || []) {
      if (item.active === false || !item.id) continue;
      paths.add(`/products/${categoryPath}/${item.id}`);
    }
  }

  return [...paths].sort();
}

function toSitemapXml(paths) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map((path) => {
      const loc = `${SITE_URL}${path === '/' ? '' : path}`;
      const priority = path === '/' ? '1.0' : path.startsWith('/products/') && path.split('/').length > 3 ? '0.7' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const paths = collectPaths();
const xml = toSitemapXml(paths);
const outPath = join(publicDir, 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`wrote ${outPath} (${paths.length} URLs)`);

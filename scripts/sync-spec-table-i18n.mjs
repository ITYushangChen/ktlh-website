/**
 * 将 products.json 中所有 specTable 的 zh 同步为 en / ja
 * 用法: node scripts/sync-spec-table-i18n.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncSpecTableI18nFromZh } from '../src/utils/specTable.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'public/content/products.json');

const data = JSON.parse(readFileSync(productsPath, 'utf8'));
let count = 0;

for (const cat of data.categories || []) {
  if (!cat.specTable) continue;
  cat.specTable = syncSpecTableI18nFromZh(cat.specTable);
  count += 1;
  console.log(`✓ ${cat.id}`);
}

writeFileSync(productsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`\n已更新 ${count} 个品类的规格表翻译 → ${productsPath}`);

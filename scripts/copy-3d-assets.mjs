/**
 * 将 private-assets/glb 下的模型复制到 public/images/products_3d/
 * 供 model-viewer 通过 URL 加载。
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'private-assets', 'glb');
const destDir = join(root, 'public', 'images', 'products_3d');

if (!existsSync(srcDir)) {
  console.log('copy-3d-assets: no private-assets/glb directory, skip');
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });

const glbFiles = readdirSync(srcDir).filter((name) => name.toLowerCase().endsWith('.glb'));
if (glbFiles.length === 0) {
  console.log('copy-3d-assets: no GLB files found');
  process.exit(0);
}

for (const name of glbFiles) {
  const src = join(srcDir, name);
  const dest = join(destDir, name);
  copyFileSync(src, dest);
  console.log(`copy-3d-assets: ${name}`);
}

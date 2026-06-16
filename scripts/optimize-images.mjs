/**
 * 压缩 public/images 下大图并生成 WebP 伴生文件。
 * 构建前运行：node scripts/optimize-images.mjs
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesRoot = join(__dirname, '..', 'public', 'images');

const MAX_DIMENSION = 1920;
const MIN_BYTES = 200 * 1024;
const WEBP_QUALITY = 82;
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function run(cmd) {
  execSync(cmd, { stdio: 'pipe' });
}

function optimizeRaster(filePath) {
  const ext = extname(filePath);
  if (!RASTER_EXT.has(ext)) return null;

  const before = statSync(filePath).size;
  if (before < MIN_BYTES) return null;

  const tmp = `${filePath}.opt${ext.toLowerCase() === '.png' ? '.png' : '.jpg'}`;

  try {
    run(`sips -Z ${MAX_DIMENSION} "${filePath}" --out "${tmp}"`);
    run(`mv "${tmp}" "${filePath}"`);
  } catch {
    if (existsSync(tmp)) run(`rm -f "${tmp}"`);
    return null;
  }

  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  const webpExists = existsSync(webpPath);
  const sourceMtime = statSync(filePath).mtimeMs;
  const webpFresh = webpExists && statSync(webpPath).mtimeMs >= sourceMtime;

  if (!webpFresh) {
    try {
      run(`cwebp -q ${WEBP_QUALITY} "${filePath}" -o "${webpPath}"`);
    } catch {
      return { filePath, before, after: statSync(filePath).size, webp: false };
    }
  }

  const after = statSync(filePath).size;
  const webpSize = existsSync(webpPath) ? statSync(webpPath).size : 0;
  return { filePath, before, after, webp: true, webpSize };
}

const targets = walk(imagesRoot);
let optimized = 0;

for (const file of targets) {
  const result = optimizeRaster(file);
  if (!result) continue;
  optimized += 1;
  const saved = ((1 - result.after / result.before) * 100).toFixed(0);
  const rel = file.replace(imagesRoot, 'public/images');
  const webpNote = result.webp
    ? `, webp ${(result.webpSize / 1024).toFixed(0)} KB`
    : '';
  console.log(
    `✓ ${rel}: ${(result.before / 1024 / 1024).toFixed(1)} MB → ${(result.after / 1024).toFixed(0)} KB (-${saved}%)${webpNote}`
  );
}

console.log(optimized ? `\nOptimized ${optimized} image(s).` : 'No images needed optimization.');

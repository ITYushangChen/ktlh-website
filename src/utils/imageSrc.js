/** WebP 伴生文件路径（与源图同目录，扩展名 .webp） */
export function getWebpSrc(src) {
  if (!src || typeof src !== 'string') return null;
  if (src.endsWith('.svg') || src.endsWith('.webp')) return null;
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

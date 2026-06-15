/** 生产站点根 URL，用于 canonical、sitemap、Open Graph */
export const SITE_URL = 'https://ktlhrefrigeration.com';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/app/logo.png`;

export const LOCALE_MAP = {
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
};

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function truncateDescription(text, maxLen = 160) {
  const s = (text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen - 1)}…`;
}

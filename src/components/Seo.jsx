import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { absoluteUrl, DEFAULT_OG_IMAGE, LOCALE_MAP, SITE_URL } from '../constants/seo';

/**
 * @param {object} props
 * @param {string} props.title - 页面标题（不含站点名后缀时可传完整标题）
 * @param {string} [props.description]
 * @param {string} [props.path] - 当前路径，如 /about
 * @param {string} [props.image] - OG 图片绝对或相对路径
 * @param {string} [props.type] - og:type，默认 website
 * @param {boolean} [props.noindex] - 是否禁止收录
 * @param {boolean} [props.includeSiteName=true] - title 后自动拼接站点名
 */
export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  includeSiteName = true,
}) {
  const { i18n, t } = useTranslation();
  const siteName = t('seo.siteName');
  const defaultDescription = t('seo.defaultDescription');
  const resolvedDescription = description || defaultDescription;
  const fullTitle = includeSiteName && title ? `${title} | ${siteName}` : title || siteName;
  const canonical = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
  const locale = LOCALE_MAP[i18n.language] || LOCALE_MAP.zh;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />

      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
    </Helmet>
  );
}

export { SITE_URL };

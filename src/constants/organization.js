import { DEFAULT_OG_IMAGE, SITE_URL } from './seo';

export const ORGANIZATION_LEGAL_NAME = 'Qingdao Kaituo Longhai Intelligent Control Co., Ltd.';

export const ORGANIZATION_ALTERNATE_NAMES = [
  'Kaituo Longhai',
  'kaituolonghai',
  '开拓隆海',
  '青岛开拓隆海智控有限公司',
  'KTLH',
];

export const ORGANIZATION_CONTACT = {
  email: 'sales@kaituolonghai.com',
  telephone: '+86-532-87909886',
  streetAddress: 'No. 21 Xiangjiang Road, SCO Demonstration Zone',
  addressLocality: 'Jiaozhou',
  addressRegion: 'Qingdao, Shandong',
  postalCode: '266300',
  addressCountry: 'CN',
};

export const BRAND_KEYWORDS =
  'Kaituo Longhai, kaituolonghai, 开拓隆海, KTLH, refrigeration components, heat exchangers';

/** 社交媒体等官方外链，用于 Organization sameAs */
export function getOrganizationSameAs() {
  const generic = new Set([
    'https://www.instagram.com/',
    'https://www.facebook.com/',
    'https://www.tiktok.com/',
    'https://wa.me/',
  ]);
  const candidates = [
    process.env.REACT_APP_INSTAGRAM_URL,
    process.env.REACT_APP_FACEBOOK_URL,
    process.env.REACT_APP_TIKTOK_URL,
    'https://www.tiktok.com/@kaituolonghai',
  ];
  return [
    ...new Set(
      candidates.map((u) => String(u || '').trim()).filter((u) => u && !generic.has(u)),
    ),
  ];
}

export function buildOrganizationJsonLd() {
  const sameAs = getOrganizationSameAs();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION_LEGAL_NAME,
    alternateName: ORGANIZATION_ALTERNATE_NAMES,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    email: ORGANIZATION_CONTACT.email,
    telephone: ORGANIZATION_CONTACT.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION_CONTACT.streetAddress,
      addressLocality: ORGANIZATION_CONTACT.addressLocality,
      addressRegion: ORGANIZATION_CONTACT.addressRegion,
      postalCode: ORGANIZATION_CONTACT.postalCode,
      addressCountry: ORGANIZATION_CONTACT.addressCountry,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORGANIZATION_LEGAL_NAME,
    alternateName: ['kaituolonghai', 'Kaituo Longhai', '开拓隆海'],
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['zh-CN', 'en', 'ja'],
  };
}

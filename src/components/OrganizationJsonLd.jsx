import { Helmet } from 'react-helmet-async';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '../constants/organization';

/**
 * 全站 Organization + WebSite 结构化数据（品牌词 SEO）
 */
export default function OrganizationJsonLd() {
  const organization = buildOrganizationJsonLd();
  const website = buildWebSiteJsonLd();

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  );
}

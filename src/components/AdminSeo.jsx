import Seo from './Seo';

/** 后台页面：禁止搜索引擎收录 */
export default function AdminSeo() {
  return <Seo title="Admin" noindex includeSiteName={false} />;
}

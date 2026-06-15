import Seo from './Seo';
import { useTranslation } from 'react-i18next';

/** 产品分类页统一 SEO */
export default function ProductCategorySeo({ categoryId, path }) {
  const { t } = useTranslation();
  const key = `seo.categories.${categoryId}`;
  return (
    <Seo
      title={t(`${key}.title`)}
      description={t(`${key}.description`)}
      path={path}
    />
  );
}

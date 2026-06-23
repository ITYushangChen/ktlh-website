import { lazy, Suspense } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductCategory } from '../../hooks/useProductCategory';
import Seo from '../../components/Seo';
import OptimizedImage from '../../components/OptimizedImage';
import ProductSpecTable from '../../components/products/ProductSpecTable';
import ProductSpecRangeSummary from '../../components/products/ProductSpecRangeSummary';
import ProductCategorySeo from '../../components/ProductCategorySeo';
import { truncateDescription } from '../../constants/seo';
import { PRODUCT_CATEGORY_DETAIL_CONFIG } from '../../constants/productCategoryConfig';

const ProductGlbViewer = lazy(() => import('../../components/products/ProductGlbViewer'));

/**
 * 产品品类详情页（每品类一页，数据来自 products.json）
 */
export default function ProductCategoryDetail() {
  const { t } = useTranslation();
  const { categoryPath } = useParams();
  const config = PRODUCT_CATEGORY_DETAIL_CONFIG[categoryPath];
  const { category, gl, gla, loaded } = useProductCategory(categoryPath);

  if (!config) {
    return <Navigate to="/products" replace />;
  }

  if (!loaded) {
    return (
      <div className="py-8 pb-16 bg-white min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">{t('products.loadingProduct')}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-8 pb-16 bg-white">
        <ProductCategorySeo categoryId={config.categoryKey} path={`/products/${categoryPath}`} />
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <nav className="text-sm mb-8 text-left">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t(config.navKey)}</span>
          </nav>
          <p className="text-gray-600 mb-6">{t('products.productNotFound')}</p>
          <Link
            to="/products"
            className="inline-flex text-[#086c7b] font-medium hover:text-[#065a66] transition-colors"
          >
            ← {t('products.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const specEntries = Object.entries(category.specifications || {});
  const title = gl(category.title);
  const description = truncateDescription(gl(category.description));
  const detailPath = `/products/${categoryPath}`;
  const displayImage = category.detailImage || category.image;

  return (
    <div className="py-8 pb-16 bg-white">
      <Seo
        title={`${title} | ${t('products.title')}`}
        description={description}
        path={detailPath}
        image={displayImage}
        type="product"
      />
      <div className="container mx-auto px-4 max-w-5xl">
        <nav className="text-sm mb-8">
          <Link to="/products" className="text-[#086c7b] hover:underline">
            {t('products.backToProducts')}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          <div className="w-full lg:w-[min(100%,380px)] shrink-0 mx-auto lg:mx-0">
            <OptimizedImage
              src={displayImage}
              alt={title}
              loading="eager"
              fetchPriority="high"
              className="block w-full"
              imgClassName="w-full h-auto max-h-[min(70vh,520px)] object-contain rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            />
            {category.viewer3dGlb && (
              <Suspense
                fallback={
                  <div
                    className="mt-6 w-full animate-pulse rounded-xl border border-gray-100 bg-slate-100/90 aspect-[4/3] max-h-[min(52vh,420px)] shadow-sm"
                    aria-hidden
                  />
                }
              >
                <ProductGlbViewer glbUrl={category.viewer3dGlb} />
              </Suspense>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <div className="h-0.5 w-16 mb-6 bg-[#086c7b]" aria-hidden />
            <p className="text-gray-700 leading-relaxed mb-8">{gl(category.description)}</p>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('products.productFeatures')}</h2>
            <ul className="space-y-2 mb-8">
              {gla(category.features).map((f, idx) => (
                <li key={idx} className="flex gap-2 text-gray-700 text-[15px] md:text-base">
                  <span className="text-[#086c7b] shrink-0 mt-0.5" aria-hidden>▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {specEntries.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('products.specifications')}</h2>
                <div className="space-y-2 text-sm md:text-base">
                  {specEntries.map(([key, val]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-gray-100 pb-2"
                    >
                      <span className="text-gray-600">{t(`${config.specLabelPrefix}.${key}`, key)}</span>
                      <span className="text-gray-900 font-medium sm:text-right">{gl(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/contact"
              className="inline-flex items-center text-sm font-medium text-[#086c7b] hover:text-[#065a66] transition-colors"
            >
              {t('products.contactForCustom')}
            </Link>
          </div>
        </div>

        <ProductSpecRangeSummary table={category.specTable} gl={gl} className="mt-10" />
        <ProductSpecTable table={category.specTable} gl={gl} />
      </div>
    </div>
  );
}

import { lazy, Suspense } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProductCategory } from '../../hooks/useProductCategory';
import Seo from '../../components/Seo';
import OptimizedImage from '../../components/OptimizedImage';
import ProductSpecTable from '../../components/products/ProductSpecTable';
import ProductSpecRangeSummary from '../../components/products/ProductSpecRangeSummary';
import ProductCategorySeo from '../../components/ProductCategorySeo';
import { truncateDescription } from '../../constants/seo';
import { PRODUCT_CATEGORY_DETAIL_CONFIG } from '../../constants/productCategoryConfig';

const ProductGlbViewer = lazy(() => import('../../components/products/ProductGlbViewer'));

/** 全页面区块统一的上浮淡入参数（慢速） */
const fadeUp = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

/** 卡片样式：悬停只放大到 1.08 倍，不做颜色变化 */
const DETAIL_CARD =
  'rounded-xl border border-gray-100 bg-white p-6 md:p-7 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.08]';

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
            className="inline-flex text-[#086c7b] font-medium"
          >
            &larr; {t('products.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const specEntries = Object.entries(category.specifications || {});
  const specCopyKey = config.specLabelPrefix.replace('.specLabels', '');
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
        <motion.nav
          className="text-sm mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={fadeUp}
        >
          <Link to="/products" className="text-[#086c7b] hover:underline">
            {t('products.backToProducts')}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{title}</span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          <motion.div
            className="w-full lg:w-[min(100%,380px)] shrink-0 mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={fadeUp}
          >
            <OptimizedImage
              src={displayImage}
              alt={title}
              loading="eager"
              fetchPriority="high"
              className="block w-1/2 md:w-full mx-auto"
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
          </motion.div>

          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...fadeUp, delay: 0.05 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <div className="h-0.5 w-16 mb-8 bg-[#086c7b]" aria-hidden />

            {/* 产品介绍卡片：悬停仅放大 1.08 倍 */}
            <div className={`${DETAIL_CARD} mb-8`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.productOverview')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {gl(category.description)}
              </p>
            </div>

            {/* 产品特点卡片：特点均匀分布，悬停仅放大 1.08 倍 */}
            <div className={`${DETAIL_CARD} mb-8`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('products.productFeatures')}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {gla(category.features).map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-gray-700 text-[15px] md:text-base"
                  >
                    <span
                      className="text-[#086c7b] shrink-0 mt-0.5"
                      aria-hidden
                    >
                      ▪
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {specEntries.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-7 shadow-sm mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('products.specifications')}
                </h2>
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

            {/* 联系我们了解更多：悬停仅放大 1.08 倍，不做颜色变化 */}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#086c7b] bg-white px-8 py-3.5 text-sm md:text-base font-semibold text-[#086c7b] transition-transform duration-300 hover:scale-[1.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2"
            >
              {t('products.contactForCustom')}
            </Link>
          </motion.div>
        </div>

        {category.specDiagram ? (
          <motion.div
            className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={fadeUp}
          >
            <figure className="w-full lg:w-[min(100%,440px)] shrink-0 mx-auto lg:mx-0">
              <OptimizedImage
                src={category.specDiagram}
                alt={t(`${specCopyKey}.specDiagramAlt`, { defaultValue: t('products.specDiagramAlt') })}
                loading="lazy"
                className="block w-full"
                imgClassName="w-full h-auto rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              />
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {t(`${specCopyKey}.specDiagramCaption`, { defaultValue: t('products.specDiagramCaption') })}
              </figcaption>
            </figure>
            <div className="flex-1 min-w-0 w-full">
              <ProductSpecRangeSummary table={category.specTable} gl={gl} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={fadeUp}
          >
            <ProductSpecRangeSummary table={category.specTable} gl={gl} className="mt-10" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={fadeUp}
        >
          <ProductSpecTable table={category.specTable} gl={gl} />
        </motion.div>
      </div>
    </div>
  );
}

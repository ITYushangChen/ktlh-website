import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductDetails } from '../../hooks/useProductDetails';

const CATEGORY_PATH_CONFIG = {
  receivers: {
    categoryKey: 'receivers',
    specLabelPrefix: 'products.receivers.specLabels',
    navKey: 'nav.products_sub.receivers',
    listPath: '/products/receivers',
  },
  'gas-liquid-separators': {
    categoryKey: 'gas-liquid-separators',
    specLabelPrefix: 'products.gasLiquidSeparators.specLabels',
    navKey: 'nav.products_sub.gas_liquid_separators',
    listPath: '/products/gas-liquid-separators',
  },
};

const ProductItemDetail = () => {
  const { t } = useTranslation();
  const { categoryPath, productId } = useParams();
  const config = CATEGORY_PATH_CONFIG[categoryPath];

  const { items, gl, gla, loaded } = useProductDetails(config?.categoryKey ?? null);

  const product = useMemo(() => items.find((p) => p.id === productId), [items, productId]);

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

  if (!product) {
    return (
      <div className="py-8 pb-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <nav className="text-sm mb-8 text-left">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to={config.listPath} className="text-[#086c7b] hover:underline">
              {t(config.navKey)}
            </Link>
          </nav>
          <p className="text-gray-600 mb-6">{t('products.productNotFound')}</p>
          <Link
            to={config.listPath}
            className="inline-flex text-[#086c7b] font-medium hover:text-[#065a66] transition-colors"
          >
            ← {t(config.navKey)}
          </Link>
        </div>
      </div>
    );
  }

  const specEntries = Object.entries(product.specifications || {});

  return (
    <div className="py-8 pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <nav className="text-sm mb-8">
          <Link to="/products" className="text-[#086c7b] hover:underline">
            {t('products.backToProducts')}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to={config.listPath} className="text-[#086c7b] hover:underline">
            {t(config.navKey)}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{gl(product.name)}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          <div className="w-full lg:w-[min(100%,380px)] shrink-0 mx-auto lg:mx-0">
            <img
              src={product.image}
              alt={gl(product.name)}
              className="w-full h-auto max-h-[min(70vh,520px)] object-contain rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{gl(product.name)}</h1>
            <div className="h-0.5 w-16 mb-6 bg-[#086c7b]" aria-hidden />
            <p className="text-gray-700 leading-relaxed mb-8">{gl(product.description)}</p>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('products.productFeatures')}</h2>
            <ul className="space-y-2 mb-8">
              {gla(product.features).map((f, idx) => (
                <li key={idx} className="flex gap-2 text-gray-700 text-[15px] md:text-base">
                  <span className="text-[#086c7b] shrink-0 mt-0.5" aria-hidden>
                    ▸
                  </span>
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
      </div>
    </div>
  );
};

export default ProductItemDetail;

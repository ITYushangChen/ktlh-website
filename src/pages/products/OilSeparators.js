import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCategorySeo from '../../components/ProductCategorySeo';

const OilSeparators = () => {
  const { t } = useTranslation();

  return (
    <div className="py-8 pb-16 bg-white">
      <ProductCategorySeo categoryId="oil-separators" path="/products/oil-separators" />
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-8">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t('nav.products_sub.oil_separators')}</span>
          </nav>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('products.productDeveloping')}</h2>
            <p className="text-lg text-gray-600 mb-8">{t('products.developingDesc')}</p>
            <Link
              to="/contact"
              className="inline-block bg-[#086c7b] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#065a66] transition-colors duration-300"
            >
              {t('products.contactForCustom')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OilSeparators;

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PlateHeatExchangers = () => {
  const { t } = useTranslation();

  return (
    <div className="py-16">
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <nav className="mb-8">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t('nav.products_sub.plate_heat_exchangers')}</span>
          </nav>
          <h1 className="text-4xl font-bold text-center mb-6">{t('products.plateHeatExchangers.title')}</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('products.plateHeatExchangers.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('products.productDeveloping')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('products.developingDesc')}
            </p>
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

export default PlateHeatExchangers; 
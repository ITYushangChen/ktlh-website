import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductDetails } from '../../hooks/useProductDetails';
import ProductDetailCard from '../../components/ProductDetailCard';

const Receivers = () => {
  const { t } = useTranslation();
  const { items, gl, gla } = useProductDetails('receivers');

  return (
    <div className="py-8 pb-16 bg-white">
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-8">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t('nav.products_sub.receivers')}</span>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
              <ProductDetailCard
                key={product.id}
                product={product}
                gl={gl}
                gla={gla}
                t={t}
                specLabelPrefix="products.receivers.specLabels"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Receivers;

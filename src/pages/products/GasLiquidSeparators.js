import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductDetails } from '../../hooks/useProductDetails';
import ProductDetailCard from '../../components/ProductDetailCard';

const GasLiquidSeparators = () => {
  const { t } = useTranslation();
  const { items, gl } = useProductDetails('gas-liquid-separators');

  return (
    <div className="py-8 pb-16 bg-white">
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-8">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t('nav.products_sub.gas_liquid_separators')}</span>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
              <ProductDetailCard
                key={product.id}
                product={product}
                gl={gl}
                t={t}
                listPath="/products/gas-liquid-separators"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GasLiquidSeparators;

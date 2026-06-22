import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { ProductCategoryCard } from '../components/ProductCategoryCard';
import { buildProductGroups, glField } from '../utils/productsCatalog';

const Products = () => {
  const { t, i18n } = useTranslation();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setGroups(buildProductGroups(data, i18n.language)))
      .catch(() => setGroups([]));
  }, [i18n.language]);

  const gl = (field) => glField(field, i18n.language);

  return (
    <div className="py-8 pb-16 bg-white">
      <Seo
        title={t('seo.products.title')}
        description={t('seo.products.description')}
        path="/products"
      />
      <section className="bg-white py-8 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-6xl space-y-14 md:space-y-16">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('products.title')}</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{t('products.subtitle')}</p>
          </div>
          {groups.map((group, index) => (
            <div key={group.id}>
              <div className="mb-8 md:mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#086c7b] text-sm font-semibold text-white"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{gl(group.title)}</h2>
                </div>
                <div className="h-0.5 w-16 bg-[#086c7b]/80 ml-11" aria-hidden />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.categories.map((category) => (
                  <ProductCategoryCard key={category.id} category={category} gl={gl} t={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;

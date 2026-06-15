import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PRODUCT_CARD_FRAME } from '../constants/productUi';
import Seo from '../components/Seo';

const Products = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCategories((data.categories || []).filter((c) => c.active !== false)))
      .catch(() => setCategories([]));
  }, []);

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[i18n.language] || field.zh || '';
  };

  return (
    <div className="py-8 pb-16 bg-white">
      <Seo
        title={t('seo.products.title')}
        description={t('seo.products.description')}
        path="/products"
      />
      <section className="bg-white py-8 min-h-[50vh]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className={`${PRODUCT_CARD_FRAME} bg-white`}>
                <div className="relative overflow-hidden bg-white">
                  <img
                    src={category.image}
                    alt={gl(category.title)}
                    className="w-full h-52 object-contain p-4"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{gl(category.title)}</h3>
                  <div className="h-0.5 w-full mb-4 shrink-0 bg-[#086c7b]" aria-hidden />
                  <div className="flex-1 min-h-0" aria-hidden />
                  <Link
                    to={category.link}
                    className="inline-flex items-center text-sm font-medium mt-auto text-[#086c7b] hover:text-[#065a66] transition-colors"
                  >
                    {t('products.clickToView')}
                    <span className="ml-0.5" aria-hidden>
                      &gt;
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;

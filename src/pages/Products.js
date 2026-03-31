import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/content/products.json')
      .then(res => res.json())
      .then(data => setCategories((data.categories || []).filter(c => c.active !== false)))
      .catch(() => setCategories([]));
  }, []);

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[i18n.language] || field.zh || '';
  };

  const gla = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[i18n.language] || field.zh || [];
  };

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">{t('products.title')}</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('products.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={gl(category.title)}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-semibold">{gl(category.title)}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{gl(category.title)}</h3>
                  <p className="text-gray-600 mb-4">{gl(category.description)}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('products.productFeatures')}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gla(category.features).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#086c7b] bg-opacity-10 text-[#086c7b] text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={category.link}
                    className="inline-flex items-center justify-center w-full bg-[#086c7b] text-white px-4 py-2 rounded-md hover:bg-[#065a66] transition-colors duration-300"
                  >
                    {t('products.learnMore')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Advantages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('products.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: '专业制造', description: '20年专注空调系统元件制造经验', icon: '🏭', stat: '20年+' },
              { title: '生产规模', description: '年产能容器320万台，铜管件5000吨', icon: '📊', stat: '320万台' },
              { title: '质量认证', description: 'ISO9001质量管理体系认证', icon: '✅', stat: 'ISO9001' },
              { title: '全球服务', description: '产品远销日本、欧美、东南亚等地', icon: '🌍', stat: '全球化' },
            ].map((advantage, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <div className="text-2xl font-bold text-[#086c7b] mb-2">{advantage.stat}</div>
                <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                <p className="text-gray-600 text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Capacity */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">320万台</div>
                <div className="text-lg font-semibold mb-1">容器类产品</div>
                <div className="text-gray-600">年产能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">5000吨</div>
                <div className="text-lg font-semibold mb-1">铜管件</div>
                <div className="text-gray-600">年产能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">2000吨</div>
                <div className="text-lg font-semibold mb-1">阻尼块</div>
                <div className="text-gray-600">年产能</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                公司拥有现代化生产设备和完善的质量管理体系，确保产品质量稳定可靠
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#086c7b]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t('products.needProfessionalSolution')}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('products.professionalSupport')}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#086c7b] px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;

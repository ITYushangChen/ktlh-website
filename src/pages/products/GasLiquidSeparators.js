import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GasLiquidSeparators = () => {
  const { t } = useTranslation();

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <nav className="mb-8">
            <Link to="/products" className="text-[#086c7b] hover:underline">
              {t('products.backToProducts')}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{t('nav.products_sub.gas_liquid_separators')}</span>
          </nav>
          <h1 className="text-4xl font-bold text-center mb-6">{t('products.gasLiquidSeparators.title')}</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('products.gasLiquidSeparators.subtitle')}
          </p>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">{t('products.productOverview')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('products.gasLiquidSeparators.overview')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">99.8%</div>
                <div className="text-sm text-gray-600">{t('products.gasLiquidSeparators.stats.efficiency')}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">4.0MPa</div>
                <div className="text-sm text-gray-600">{t('products.gasLiquidSeparators.stats.pressure')}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">2000m³/h</div>
                <div className="text-sm text-gray-600">{t('products.gasLiquidSeparators.stats.capacity')}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">4+</div>
                <div className="text-sm text-gray-600">{t('products.gasLiquidSeparators.stats.models')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('products.starProducts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t('products.gasLiquidSeparators.products', { returnObjects: true }).map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={`/images/products/gas-liquid-separators/gls-00${index + 1}.jpg`}
                      alt={product.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('products.productFeatures')}：</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#086c7b] bg-opacity-10 text-[#086c7b] text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('products.specifications')}：</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('products.gasLiquidSeparators.specLabels.efficiency')}:</span>
                          <span className="text-gray-900 font-medium">{product.specifications.efficiency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('products.gasLiquidSeparators.specLabels.pressure')}:</span>
                          <span className="text-gray-900 font-medium">{product.specifications.pressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('products.gasLiquidSeparators.specLabels.capacity')}:</span>
                          <span className="text-gray-900 font-medium">{product.specifications.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('products.gasLiquidSeparators.specLabels.material')}:</span>
                          <span className="text-gray-900 font-medium">{product.specifications.material}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-[#086c7b] text-white px-4 py-2 rounded-md hover:bg-[#065a66] transition-colors duration-300">
                      {t('products.learnMore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advantages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('products.technicalAdvantages')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#086c7b] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('products.gasLiquidSeparators.advantages.efficient')}</h3>
              <p className="text-gray-600">{t('products.gasLiquidSeparators.advantages.efficientDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-[#086c7b] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📉</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('products.gasLiquidSeparators.advantages.lowPressure')}</h3>
              <p className="text-gray-600">{t('products.gasLiquidSeparators.advantages.lowPressureDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-[#086c7b] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('products.gasLiquidSeparators.advantages.maintenance')}</h3>
              <p className="text-gray-600">{t('products.gasLiquidSeparators.advantages.maintenanceDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-[#086c7b] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('products.gasLiquidSeparators.advantages.corrosion')}</h3>
              <p className="text-gray-600">{t('products.gasLiquidSeparators.advantages.corrosionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#086c7b]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t('products.gasLiquidSeparators.customSolution')}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('products.engineerSupport')}
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

export default GasLiquidSeparators; 
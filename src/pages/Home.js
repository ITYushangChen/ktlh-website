import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURE_CAROUSEL_MS = 5500;

const Home = () => {
  const { t } = useTranslation();

  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const features = getTranslationArray('home.features.items');
  const showcaseItems = getTranslationArray('home.showcase.items');
  const products = getTranslationArray('home.products.items');

  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    if (features.length === 0) return;
    setFeatureIndex((i) => Math.min(i, features.length - 1));
  }, [features.length]);

  useEffect(() => {
    if (features.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setFeatureIndex((i) => (i + 1) % features.length);
    }, FEATURE_CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [features.length]);

  const goPrevFeature = () =>
    setFeatureIndex((i) => (i - 1 + features.length) % features.length);
  const goNextFeature = () =>
    setFeatureIndex((i) => (i + 1) % features.length);

  const currentFeature = features[featureIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#086c7b] to-[#065a66]">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('home.hero.title')}</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">{t('home.hero.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#086c7b] bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                {t('home.hero.cta.primary')}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-300"
              >
                {t('home.hero.cta.secondary')}
              </Link>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </section>

      {/* Features：轮播 */}
      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('home.features.subtitle')}</p>
          </div>

          {features.length > 0 && currentFeature && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-stretch gap-2 sm:gap-4">
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={goPrevFeature}
                    className="shrink-0 self-center p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-[#086c7b]/10 hover:text-[#086c7b] hover:border-[#086c7b]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b]"
                    aria-label={t('home.features.prevSlide')}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="flex-1 min-w-0 min-h-[280px] sm:min-h-[240px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -28 }}
                      transition={{ duration: 0.35 }}
                      className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100 text-center h-full flex flex-col items-center justify-center"
                    >
                      <div
                        className="text-[#086c7b] mb-4 flex justify-center"
                        dangerouslySetInnerHTML={{ __html: currentFeature.icon }}
                      />
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                        {currentFeature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{currentFeature.description}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={goNextFeature}
                    className="shrink-0 self-center p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-[#086c7b]/10 hover:text-[#086c7b] hover:border-[#086c7b]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b]"
                    aria-label={t('home.features.nextSlide')}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {features.length > 1 && (
                <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="features">
                  {features.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFeatureIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 ${
                        i === featureIndex ? 'w-8 bg-[#086c7b]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`${i + 1} / ${features.length}`}
                      aria-current={i === featureIndex ? true : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Company Showcase Section —— 图片卡片保留动画 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.showcase.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.showcase.subtitle')}
            </p>
          </div>

          {showcaseItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showcaseItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group overflow-hidden rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Section —— 图片卡片保留动画 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.products.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.products.subtitle')}
            </p>
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-[#086c7b] bg-opacity-0"
                      whileHover={{ opacity: 0.2 }}
                    />
                  </motion.div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md text-base font-medium text-white bg-[#086c7b] hover:bg-[#065a66] transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                {t('home.products.learnMoreAll')}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#086c7b] relative overflow-hidden">
        {/* 背景装饰（保留动画） */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              {t('home.cta.subtitle')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-[#086c7b] transition-all duration-300"
            >
              {t('home.cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

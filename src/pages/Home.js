import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_INTERVAL_MS = 6500;

const Home = () => {
  const { t } = useTranslation();

  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const heroSlides = useMemo(() => {
    const raw = t('home.hero.slides', { returnObjects: true });
    const arr = Array.isArray(raw) ? raw : [];
    if (arr.length > 0) return arr;
    return [
      {
        image: '/images/factory.jpg',
        title: t('home.hero.title'),
        subtitle: t('home.hero.subtitle'),
      },
    ];
  }, [t]);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    setHeroIndex((i) => Math.min(i, heroSlides.length - 1));
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  const goPrev = () =>
    setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  const goNext = () => setHeroIndex((i) => (i + 1) % heroSlides.length);

  const features = getTranslationArray('home.features.items');
  const showcaseItems = getTranslationArray('home.showcase.items');
  const products = getTranslationArray('home.products.items');

  const currentSlide = heroSlides[heroIndex] || heroSlides[0];

  return (
    <div className="min-h-screen">
      {/* Hero：全屏轮播，向下滚动进入后续板块 */}
      <section
        className="relative w-full overflow-hidden bg-gray-900"
        style={{ height: 'calc(100vh - 3.5rem)', minHeight: '22rem' }}
        aria-roledescription="carousel"
        aria-label={t('nav.home')}
      >
        {heroSlides.map((slide, i) => (
          <motion.div
            key={`${slide.image}-${i}`}
            className="absolute inset-0 z-0 pointer-events-none"
            initial={false}
            animate={{ opacity: i === heroIndex ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" aria-hidden />
          </motion.div>
        ))}

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white pointer-events-none">
          <div className="pointer-events-auto max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {currentSlide && (
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-md tracking-tight">
                    {currentSlide.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 md:mb-10 max-w-3xl mx-auto drop-shadow leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#086c7b] bg-white hover:bg-gray-50 transition-colors duration-300 shadow-lg"
              >
                {t('home.hero.cta.primary')}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/15 transition-colors duration-300"
              >
                {t('home.hero.cta.secondary')}
              </Link>
            </div>
          </div>
        </div>

        {heroSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/25 text-white hover:bg-black/45 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.hero.prevSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/25 text-white hover:bg-black/45 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.hero.nextSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div
              className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-2"
              role="tablist"
              aria-label="slides"
            >
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                    i === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
                  }`}
                  aria-label={`${i + 1} / ${heroSlides.length}`}
                  aria-current={i === heroIndex}
                />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent z-[15]" />

        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/90 pointer-events-none"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <span className="text-xs sm:text-sm tracking-wide mb-1 drop-shadow">{t('home.hero.scrollHint')}</span>
          <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          {features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className="text-[#086c7b] mb-4"
                    dangerouslySetInnerHTML={{ __html: feature.icon }}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
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

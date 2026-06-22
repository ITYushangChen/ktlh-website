import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import OptimizedImage from '../components/OptimizedImage';
import HomeApplicationHero from '../components/home/HomeApplicationHero';
import { useInView } from '../hooks/useInView';

const FEATURE_CAROUSEL_MS = 5500;

/** 「我们的优势」区块底色 */
const HOME_SEAM = '#030712';

const Home = () => {
  const { t } = useTranslation();

  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const advantageSlides = getTranslationArray('home.features.items');
  const products = getTranslationArray('home.products.items');

  const [featureIndex, setFeatureIndex] = useState(0);
  const [featuresRef, featuresInView] = useInView({ rootMargin: '300px' });

  const featureSlidesToLoad = useMemo(() => {
    if (!featuresInView || advantageSlides.length === 0) return new Set();
    const indices = new Set([featureIndex]);
    if (advantageSlides.length > 1) {
      indices.add((featureIndex + 1) % advantageSlides.length);
    }
    return indices;
  }, [featuresInView, featureIndex, advantageSlides.length]);

  useEffect(() => {
    if (advantageSlides.length === 0) return;
    setFeatureIndex((i) => Math.min(i, advantageSlides.length - 1));
  }, [advantageSlides.length]);

  useEffect(() => {
    if (advantageSlides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setFeatureIndex((i) => (i + 1) % advantageSlides.length);
    }, FEATURE_CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [advantageSlides.length]);

  const goPrevFeature = () =>
    setFeatureIndex((i) => (i - 1 + advantageSlides.length) % advantageSlides.length);
  const goNextFeature = () =>
    setFeatureIndex((i) => (i + 1) % advantageSlides.length);

  const currentSlide = advantageSlides[featureIndex];

  return (
    <div className="min-h-screen">
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path="/"
      />
      <HomeApplicationHero />

      {/* 我们的优势：4 屏轮播（文案与配图见 home.features.items） */}
      <section
        ref={featuresRef}
        id="home-features"
        className="relative -mt-px min-h-screen w-full overflow-hidden pt-px"
        style={{ backgroundColor: HOME_SEAM }}
        aria-labelledby="features-heading"
      >
        <div className="absolute inset-0" style={{ backgroundColor: HOME_SEAM }} aria-hidden />

        {advantageSlides.length > 0 &&
          advantageSlides.map((f, i) => {
            const src = f.image || '/images/app/factory.jpg';
            const shouldLoad = featureSlidesToLoad.has(i);
            const isActive = i === featureIndex;
            return (
              <motion.div
                key={`${src}-${i}`}
                className="absolute inset-0 z-0 pointer-events-none"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {shouldLoad ? (
                  <OptimizedImage
                    src={src}
                    alt=""
                    aria-hidden
                    loading={isActive && i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={isActive && i === 0 ? 'high' : undefined}
                    className="absolute inset-0 block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                ) : null}
              </motion.div>
            );
          })}

        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/58 from-0% via-black/42 via-35% to-black/55 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <div className="px-4 pt-10 pb-4 md:pt-14 md:pb-6 text-center text-white shrink-0">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold drop-shadow-md">
              {t('home.features.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mt-3 drop-shadow">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-end items-stretch px-4 sm:px-6 md:px-10 lg:px-14 pb-2 md:pb-4 min-h-0">
            {currentSlide && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-left w-full max-w-[min(100%,calc(100vw-2.5rem))] ml-6 sm:ml-12 md:ml-20 lg:ml-28 mb-10 md:mb-14"
                >
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-5 drop-shadow-lg max-w-3xl">
                    {currentSlide.title}
                  </h3>
                  <div className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin]">
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed drop-shadow [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] whitespace-nowrap w-max max-w-none pr-2">
                      {currentSlide.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {advantageSlides.length > 1 && (
            <div
              className="relative z-20 flex justify-center gap-2 pb-10 md:pb-12"
              role="tablist"
              aria-label="features"
            >
              {advantageSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFeatureIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    i === featureIndex ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                  }`}
                  aria-label={`${i + 1} / ${advantageSlides.length}`}
                  aria-current={i === featureIndex ? true : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {advantageSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevFeature}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/35 text-white hover:bg-black/55 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.features.prevSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNextFeature}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/35 text-white hover:bg-black/55 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.features.nextSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </section>

      {/* Products Section —— 图片卡片保留动画 */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 w-full">
          <div className="text-center mb-12 md:mb-16">
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
                <div
                  key={product.title || index}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] transform-gpu"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-[#086c7b] opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-20"
                      aria-hidden
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </div>
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

      {/* CTA：期待与您合作（不铺满整屏，随内容高度） */}
      <section className="py-16 md:py-20 bg-[#086c7b] relative overflow-hidden">
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

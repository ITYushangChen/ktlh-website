import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import OptimizedImage from '../components/OptimizedImage';
import HomeApplicationHero from '../components/home/HomeApplicationHero';
import { BRAND_KEYWORDS } from '../constants/organization';

/** 「我们的优势」区块底色 */
const HOME_SEAM = '#030712';

/** 轮播图整屏切换：上一屏淡出向右滑出，下一屏淡入从左向右滑入 */
const SLIDE_VARIANTS = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? '-16%' : '16%' }),
  center: { opacity: 1, x: '0%' },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? '16%' : '-16%' }),
};

/** 首页「产品中心」卡片 → 产品页分组锚点 */
const HOME_CARD_GROUP_MAP = {
  '/products/containers': 'pressure-vessels',
  '/products/pipes': 'piping-components',
  '/products/heat-exchangers': 'heat-exchangers',
};

const Home = () => {
  const { t } = useTranslation();

  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const advantageSlides = getTranslationArray('home.features.items');
  const products = getTranslationArray('home.products.items');

  const featuresSectionRef = useRef(null);

  const [featureIndex, setFeatureIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const touchStartRef = useRef(null);

  useEffect(() => {
    if (advantageSlides.length === 0) return;
    setFeatureIndex((i) => Math.min(i, advantageSlides.length - 1));
  }, [advantageSlides.length]);

  const goToSlide = (target) => {
    const clamped = Math.max(0, Math.min(advantageSlides.length - 1, target));
    setSlideDirection(clamped > featureIndex ? 1 : -1);
    setFeatureIndex(clamped);
  };

  const goPrevFeature = () => goToSlide(featureIndex - 1);
  const goNextFeature = () => goToSlide(featureIndex + 1);

  const currentSlide = advantageSlides[featureIndex];

  return (
    <div className="min-h-screen">
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path="/"
        keywords={BRAND_KEYWORDS}
      />
      <HomeApplicationHero />

      {/* 我们的优势：滚轮整屏切换的轮播图（home.features.items） */}
      <section
        ref={featuresSectionRef}
        id="home-features"
        className="relative -mt-px min-h-0 md:min-h-screen w-full overflow-hidden pt-px"
        style={{ backgroundColor: HOME_SEAM }}
        aria-labelledby="features-heading"
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) touchStartRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStartRef.current;
          touchStartRef.current = null;
          if (!start) return;
          const t = e.changedTouches[0];
          if (!t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // 仅识别明显横向滑动（左右滑动切换优势屏），不干扰纵向页面滚动
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
          if (dx < 0) {
            goNextFeature();
          } else {
            goPrevFeature();
          }
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: HOME_SEAM }} aria-hidden />

        {/* 桌面版：整屏背景轮播（手机端隐藏） */}
        <div className="hidden md:block">
        {currentSlide && advantageSlides.length > 0 && (
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.div
              key={featureIndex}
              custom={slideDirection}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <OptimizedImage
                src={currentSlide.image || '/images/app/factory.jpg'}
                alt=""
                aria-hidden
                loading={featureIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={featureIndex === 0 ? 'high' : undefined}
                className="absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/58 from-0% via-black/42 via-35% to-black/55"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-6 md:px-10 lg:px-14 pb-16 sm:pb-20">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-5 drop-shadow-lg max-w-3xl">
                  {currentSlide.title}
                </h3>
                <div className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin]">
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed drop-shadow [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] whitespace-nowrap w-max max-w-none pr-2">
                    {currentSlide.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        </div>

        <div className="relative z-10 px-4 pt-10 pb-4 md:pt-14 md:pb-6 text-center text-white shrink-0">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold drop-shadow-md">
            {t('home.features.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mt-3 drop-shadow">
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* 手机版：全宽图片轮播 + 文案 + 圆点按钮（置于图片下方） */}
        {currentSlide && advantageSlides.length > 0 && (
          <div className="md:hidden relative z-10">
            <div className="relative w-full overflow-hidden">
              <OptimizedImage
                key={featureIndex}
                src={currentSlide.image || '/images/app/factory.jpg'}
                alt=""
                aria-hidden
                loading={featureIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={featureIndex === 0 ? 'high' : undefined}
                className="block w-full"
                imgClassName="w-full aspect-video object-cover"
              />
            </div>
            <div className="px-4 pt-4 pb-1 text-white">
              <h3 className="text-2xl font-bold mb-2 leading-snug">{currentSlide.title}</h3>
              <p className="text-base text-white/90 leading-relaxed">{currentSlide.description}</p>
            </div>
            {advantageSlides.length > 1 && (
              <div
                className="flex justify-center gap-2 py-4"
                role="tablist"
                aria-label="features"
              >
                {advantageSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                      i === featureIndex ? 'w-8 bg-white' : 'w-2 bg-white/45'
                    }`}
                    aria-label={`${i + 1} / ${advantageSlides.length}`}
                    aria-current={i === featureIndex ? true : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {advantageSlides.length > 1 && (
          <div
            className="hidden md:flex absolute inset-x-0 bottom-6 z-20 justify-center gap-2"
            role="tablist"
            aria-label="features"
          >
            {advantageSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  i === featureIndex ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                }`}
                aria-label={`${i + 1} / ${advantageSlides.length}`}
                aria-current={i === featureIndex ? true : undefined}
              />
            ))}
          </div>
        )}

        {advantageSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevFeature}
              className="hidden md:inline-flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/35 text-white hover:bg-black/55 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.features.prevSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNextFeature}
              className="hidden md:inline-flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/35 text-white hover:bg-black/55 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t('home.features.nextSlide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </section>

      {/* 产品中心：点击卡片跳转到产品页对应分组卡片位置 */}
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
              {products.map((product, index) => {
                const targetGroup = HOME_CARD_GROUP_MAP[product.link];
                return (
                  <Link
                    key={product.title || index}
                    to={targetGroup ? `/products#group-${targetGroup}` : '/products'}
                    className="group block bg-white rounded-lg shadow-lg overflow-hidden motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2"
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
                  </Link>
                );
              })}
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

    </div>
  );
};

export default Home;

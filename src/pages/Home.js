import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURE_CAROUSEL_MS = 5500;

const TypeCursor = () => (
  <motion.span
    className="inline-block w-[2px] sm:w-[3px] h-[0.92em] align-baseline ml-1 rounded-sm bg-cyan-100 shadow-[0_0_14px_rgba(165,243,252,0.95)]"
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden
  />
);

const Home = () => {
  const { t } = useTranslation();

  const heroTitle = t('home.hero.title');
  const heroSubtitle = t('home.hero.subtitle');
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [heroTypingDone, setHeroTypingDone] = useState(false);

  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const advantageSlides = getTranslationArray('home.features.items');
  const products = getTranslationArray('home.products.items');

  const [featureIndex, setFeatureIndex] = useState(0);

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

  useEffect(() => {
    setTypedTitle('');
    setTypedSubtitle('');
    setHeroTypingDone(false);
    let cancelled = false;
    const timers = [];
    const wait = (ms) =>
      new Promise((resolve) => {
        timers.push(
          setTimeout(() => {
            if (!cancelled) resolve();
          }, ms)
        );
      });

    const run = async () => {
      await wait(420);
      const titleSpeed = /[\u3000-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(heroTitle) ? 52 : 38;
      for (let i = 1; i <= heroTitle.length; i++) {
        if (cancelled) return;
        setTypedTitle(heroTitle.slice(0, i));
        if (i < heroTitle.length) await wait(titleSpeed);
      }
      await wait(420);
      const subSpeed = /[\u3000-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(heroSubtitle) ? 32 : 22;
      for (let i = 1; i <= heroSubtitle.length; i++) {
        if (cancelled) return;
        setTypedSubtitle(heroSubtitle.slice(0, i));
        if (i < heroSubtitle.length) await wait(subSpeed);
      }
      if (!cancelled) setHeroTypingDone(true);
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [heroTitle, heroSubtitle]);

  const goPrevFeature = () =>
    setFeatureIndex((i) => (i - 1 + advantageSlides.length) % advantageSlides.length);
  const goNextFeature = () =>
    setFeatureIndex((i) => (i + 1) % advantageSlides.length);

  const currentSlide = advantageSlides[featureIndex];

  return (
    <div className="min-h-screen">
      {/* Hero：背景动画 + 打字机文案 */}
      <section className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden bg-[#032a30]">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#086c7b] via-[#0a5f6d] to-[#043d47]" />
          <motion.div
            className="absolute inset-0 opacity-100"
            animate={{
              background: [
                'radial-gradient(ellipse 90% 70% at 15% 25%, rgba(34,211,238,0.28) 0%, transparent 50%)',
                'radial-gradient(ellipse 90% 70% at 75% 65%, rgba(45,212,191,0.24) 0%, transparent 50%)',
                'radial-gradient(ellipse 90% 70% at 45% 15%, rgba(56,189,248,0.22) 0%, transparent 50%)',
                'radial-gradient(ellipse 90% 70% at 15% 25%, rgba(34,211,238,0.28) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        <motion.div
          className="absolute -top-40 -left-32 w-[min(55vw,480px)] h-[min(55vw,480px)] rounded-full bg-cyan-400/25 blur-[90px] z-[1] pointer-events-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, x: [0, 36, 0], y: [0, 28, 0] }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            x: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-24 w-[min(60vw,520px)] h-[min(60vw,520px)] rounded-full bg-teal-500/20 blur-[100px] z-[1] pointer-events-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, x: [0, -28, 0], y: [0, -22, 0] }}
          transition={{
            opacity: { duration: 1.2, delay: 0.1 },
            scale: { duration: 1.2, delay: 0.1 },
            x: { duration: 13, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.25, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
            `,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </motion.div>

        <div
          key={heroTitle}
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
          aria-hidden
        >
          <div className="hero-shimmer-once absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay" />
        </div>

        <div className="absolute inset-0 z-[4] bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none" aria-hidden />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 min-h-[2.5em] md:min-h-[2em] leading-tight tracking-tight">
              <span className="sr-only">{heroTitle}</span>
              <span
                className="inline bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(165,243,252,0.35)]"
                aria-hidden="true"
              >
                {typedTitle}
              </span>
              {!heroTypingDone && typedSubtitle.length === 0 && <TypeCursor />}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 min-h-[3.5rem] md:min-h-[4rem] leading-relaxed">
              <span className="sr-only">{heroSubtitle}</span>
              <span className="text-gray-100/95" aria-hidden="true">
                {typedSubtitle}
              </span>
              {!heroTypingDone && typedSubtitle.length > 0 && <TypeCursor />}
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              animate={
                heroTypingDone
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 28, filter: 'blur(8px)' }
              }
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#086c7b] bg-white shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:bg-cyan-50 hover:shadow-[0_0_32px_rgba(165,243,252,0.45)] transition-all duration-300"
                >
                  {t('home.hero.cta.primary')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white/90 text-base font-medium rounded-md text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  {t('home.hero.cta.secondary')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-[6] flex justify-center px-4 pointer-events-none"
          initial={{ opacity: 0, y: 14 }}
          animate={
            heroTypingDone
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 14 }
          }
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() =>
              document.getElementById('home-features')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
            className="pointer-events-auto flex flex-col items-center gap-2 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg py-2 px-3 transition-colors"
            aria-label={t('home.hero.scrollHint')}
          >
            <span className="text-[11px] sm:text-xs tracking-[0.14em] font-medium drop-shadow-md">
              {t('home.hero.scrollHint')}
            </span>
            <span className="flex flex-col items-center -space-y-3" aria-hidden>
              <motion.span
                className="inline-flex"
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 1.65, ease: [0.45, 0, 0.55, 1] }}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
              <motion.span
                className="inline-flex"
                animate={{ y: [0, 7, 0], opacity: [0.35, 0.75, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.65, ease: [0.45, 0, 0.55, 1], delay: 0.12 }}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </span>
          </button>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[min(32vh,220px)] bg-gradient-to-t from-gray-950 via-[#063239]/90 to-transparent z-[5] pointer-events-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </section>

      {/* 我们的优势：4 屏轮播（文案与配图见 home.features.items） */}
      <section
        id="home-features"
        className="relative min-h-screen w-full overflow-hidden bg-gray-950"
        aria-labelledby="features-heading"
      >
        <div className="absolute inset-0 bg-gray-900" aria-hidden />
        {/* 顶部与 Hero 同色系衔接，避免整屏图突然出现 */}
        <div
          className="absolute inset-x-0 top-0 z-[2] h-40 md:h-48 bg-gradient-to-b from-[#032a30] from-0% via-[#032a30]/65 via-45% to-transparent pointer-events-none"
          aria-hidden
        />

        {advantageSlides.length > 0 &&
          advantageSlides.map((f, i) => {
            const src = f.image || '/images/factory.jpg';
            return (
              <motion.div
                key={`${src}-${i}`}
                className="absolute inset-0 z-0 pointer-events-none"
                initial={false}
                animate={{ opacity: i === featureIndex ? 1 : 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${src}')` }}
                  aria-hidden
                />
              </motion.div>
            );
          })}

        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/40 to-black/55 pointer-events-none"
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
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] transform-gpu"
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

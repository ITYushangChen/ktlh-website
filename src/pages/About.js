import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import OptimizedImage from '../components/OptimizedImage';
import { useInView } from '../hooks/useInView';
import CompanyHistoryTimeline from '../components/CompanyHistoryTimeline';

const WorldPartnersMap = lazy(() => import('../components/WorldPartnersMap'));

function certTitleForLang(titleObj, lang) {
  if (!titleObj || typeof titleObj !== 'object') return '';
  const key = lang.startsWith('ja') ? 'ja' : lang.startsWith('en') ? 'en' : 'zh';
  return titleObj[key] || titleObj.zh || titleObj.en || titleObj.ja || '';
}

const About = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [certItems, setCertItems] = useState([]);
  const certScrollRef = useRef(null);
  const [canCertPrev, setCanCertPrev] = useState(false);
  const [canCertNext, setCanCertNext] = useState(false);
  const [partnersMapRef, partnersMapInView] = useInView({ rootMargin: '120px' });

  const updateCertScrollArrows = useCallback(() => {
    const el = certScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanCertPrev(scrollLeft > 2);
    setCanCertNext(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    fetch(`/content/certifications.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCertItems(Array.isArray(data.items) ? data.items : []))
      .catch(() => setCertItems([]));
  }, []);

  useEffect(() => {
    updateCertScrollArrows();
  }, [certItems, updateCertScrollArrows]);

  useEffect(() => {
    const el = certScrollRef.current;
    if (!el) return undefined;
    const onScroll = () => updateCertScrollArrows();
    const ro = new ResizeObserver(() => updateCertScrollArrows());
    ro.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [updateCertScrollArrows, certItems.length]);

  useEffect(() => {
    const hash = location.hash?.replace(/^#/, '');
    if (!hash) return undefined;
    const scrollToSection = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const timer = window.setTimeout(scrollToSection, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const scrollCertByOne = (dir) => {
    const el = certScrollRef.current;
    if (!el || certItems.length < 2) return;
    const articles = el.querySelectorAll('article');
    if (articles.length < 2) return;
    const step = articles[1].offsetLeft - articles[0].offsetLeft;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="pt-16">
      <Seo
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        path="/about"
      />
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            {t('about.title')}
          </h1>
        </div>
      </section>

      {/* Company Overview */}
      <section id="overview" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              {t('about.overviewTitle')}
            </h2>
            <div className="prose prose-lg">
              <p className="mb-6">{t('about.overview.0')}</p>
              <p className="mb-6">{t('about.overview.1')}</p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">{t('about.productionTitle')}</h3>
                <ul className="space-y-2">
                  <li>{t('about.production.0')}</li>
                  <li>{t('about.production.1')}</li>
                  <li>{t('about.production.2')}</li>
                  <li>{t('about.production.3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section id="history" className="py-16 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">{t('about.historyTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('about.historySubtitle')}</p>
          </div>
          <CompanyHistoryTimeline />
        </div>
      </section>

      {/* Business Partners */}
      <section id="partners" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('about.partners.title')}
          </h2>
        </div>

        <div
          ref={partnersMapRef}
          className="relative left-1/2 w-screen -translate-x-1/2 flex justify-center items-center py-6 min-h-[min(72vh,736px)]"
        >
          <div className="w-[72vw] h-[72vh] min-h-[384px] min-w-[240px] max-w-[1536px] max-h-[960px]">
            {partnersMapInView ? (
              <Suspense
                fallback={
                  <div
                    className="h-full w-full min-h-[384px] animate-pulse rounded-xl bg-gray-100"
                    aria-hidden
                  />
                }
              >
                <WorldPartnersMap />
              </Suspense>
            ) : (
              <div className="h-full w-full min-h-[384px] rounded-xl bg-gray-50" aria-hidden />
            )}
          </div>
        </div>
      </section>

      {/* 资质认证 */}
      <section id="certifications" className="py-16 bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            {t('about.certificationsTitle')}
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            {t('about.certificationsSubtitle')}
          </p>
          {certItems.length === 0 ? (
            <p className="text-center text-gray-500">{t('about.certificationsEmpty')}</p>
          ) : (
            <div className="relative max-w-6xl mx-auto">
              <button
                type="button"
                onClick={() => scrollCertByOne(-1)}
                disabled={!canCertPrev}
                aria-label={t('about.certificationsPrev')}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-[#086c7b] shadow-md backdrop-blur-sm transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 sm:h-12 sm:w-12 sm:-translate-x-1"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollCertByOne(1)}
                disabled={!canCertNext}
                aria-label={t('about.certificationsNext')}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-[#086c7b] shadow-md backdrop-blur-sm transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 sm:h-12 sm:w-12 sm:translate-x-1"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div
                ref={certScrollRef}
                className="overflow-x-auto scroll-smooth pb-4 px-12 sm:px-14 -mx-4 scrollbar-thin snap-x snap-mandatory [scrollbar-color:rgba(8,108,123,0.35)_transparent]"
              >
                <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                {certItems.map((item, index) => {
                  const label = certTitleForLang(item.title, i18n.language || 'en');
                  return (
                    <motion.article
                      key={`${item.image}-${index}`}
                      className="snap-start bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 shrink-0 w-56"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                    >
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 rounded-t-xl"
                      >
                        <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center p-3 min-h-[200px]">
                          <OptimizedImage
                            src={item.image}
                            alt={label}
                            loading="lazy"
                            className="block max-h-full max-w-full"
                            imgClassName="max-h-full max-w-full w-auto object-contain"
                          />
                        </div>
                      </a>
                      <div className="px-4 py-3 border-t border-gray-100 min-h-[3.5rem] flex items-center justify-center">
                        <p className="text-sm font-medium text-gray-800 text-center leading-snug">
                          {label}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;

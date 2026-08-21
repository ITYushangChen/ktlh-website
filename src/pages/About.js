import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import OptimizedImage from '../components/OptimizedImage';
import { useInView } from '../hooks/useInView';
import { useScrollPinSteps } from '../hooks/useScrollPinSteps';
import { useIsMobile } from '../hooks/useIsMobile';
import CompanyHistoryTimeline from '../components/CompanyHistoryTimeline';

const WorldPartnersMap = lazy(() => import('../components/WorldPartnersMap'));

function certTitleForLang(titleObj, lang) {
  if (!titleObj || typeof titleObj !== 'object') return '';
  const key = lang.startsWith('ja') ? 'ja' : lang.startsWith('en') ? 'en' : 'zh';
  return titleObj[key] || titleObj.zh || titleObj.en || titleObj.ja || '';
}

/** 统一的上浮淡入参数 */
const fadeUp = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

const About = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [certItems, setCertItems] = useState([]);
  const certScrollRef = useRef(null);
  const certSectionRef = useRef(null);
  const partnersPinRef = useRef(null);
  const [canCertPrev, setCanCertPrev] = useState(false);
  const [canCertNext, setCanCertNext] = useState(false);
  const [partnerStepCount, setPartnerStepCount] = useState(0);
  const [partnersMapRef, partnersMapInView] = useInView({ rootMargin: '120px' });
  const { step: certStep } = useScrollPinSteps(certSectionRef, {
    stepCount: certItems.length,
    enabled: certItems.length >= 2 && !isMobile,
  });

  // 战略合作伙伴：地图一开始就显示，每滚动一次展示一条连线
  const { step: partnerStep } = useScrollPinSteps(partnersPinRef, {
    stepCount: partnerStepCount,
    enabled: partnerStepCount >= 2 && !isMobile,
    resetOnExit: true,
    trigger: 'top-zone',
  });
  // 手机版：不随滚动播放动画，直接完整显示所有连线
  const partnersProgress = isMobile
    ? 1
    : partnerStepCount > 1
      ? partnerStep / (partnerStepCount - 1)
      : 1;

  const setPartnersContainerRef = useCallback((node) => {
    partnersMapRef.current = node;
    partnersPinRef.current = node;
  }, [partnersMapRef, partnersPinRef]);

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
    if (!el || certItems.length < 2) return;
    const articles = el.querySelectorAll('article');
    if (articles.length < 2) return;
    const stepWidth = articles[1].offsetLeft - articles[0].offsetLeft;
    el.scrollTo({ left: certStep * stepWidth, behavior: 'smooth' });
  }, [certStep, certItems.length]);

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
    <div className="about-page-in pt-16">
      <Seo
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        path="/about"
      />

      {/* Hero Section — 淡入上浮（参考联系我们页面） */}
      <section className="pt-10 pb-14 lg:pb-20">
        <div className="container mx-auto px-4">
          <h1 className="about-title-in text-4xl md:text-6xl font-bold text-center mb-6 text-[#123a63]">
            {t('about.title')}
          </h1>
        </div>
      </section>

      {/* Company Overview — 左侧文字 + 右侧 3D 半圆环 */}
      <section id="overview" className="relative overflow-hidden py-16 lg:py-24 scroll-mt-20 bg-white">
        <div className="about-overview-in grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-0">
          {/* 行 1：公司概况文字在左，3D 圆环在右 */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {t('about.overviewTitle')}
              </h2>
              <div className="space-y-5 text-gray-700 leading-relaxed">
                {[0, 1].map((i) => (
                  <p key={i}>
                    {t(`about.overview.${i}`)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[440px] lg:h-[600px] overflow-hidden">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f7fbfc_0%,#e9f4f6_58%,#dceef1_100%)]"
              aria-hidden
            />
            <OptimizedImage
              src="/images/app/55e8c8b3102108cdecf9862b73e04e32_compress.jpg"
              alt={t('about.overviewTitle')}
              loading="lazy"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* 行 2：3D 圆环在左，生产能力文字在右 */}
        <div className="about-overview-in-2 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-0 mt-16 lg:mt-24">
          <div className="relative h-[340px] sm:h-[440px] lg:h-[600px] overflow-hidden order-2 lg:order-1">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f7fbfc_0%,#e9f4f6_58%,#dceef1_100%)]"
              aria-hidden
            />
            <OptimizedImage
              src="/images/app/a5888c1741694c2f0b611fda48a68ecf_compress.jpg"
              alt={t('about.productionTitle')}
              loading="lazy"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 order-1 lg:order-2">
            <div className="max-w-2xl ml-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {t('about.productionTitle')}
              </h2>
              <ul className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#086c7b]"
                      aria-hidden
                    />
                    <span className="text-gray-700">
                      {String(t(`about.production.${i}`)).replace(/^[•\s]+/, '')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 公司历程 — 静态展示全部里程碑，无滚动锁定/动画 */}
      <section id="history" className="py-16 bg-white scroll-mt-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto mb-10 text-center">
            <motion.h2
              className="text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={fadeUp}
            >
              {t('about.historyTitle')}
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...fadeUp, delay: 0.05 }}
            >
              {t('about.historySubtitle')}
            </motion.p>
          </div>
          <CompanyHistoryTimeline />
        </div>
      </section>

      {/* 战略合作伙伴 — 到达可视区域后固定页面，动画播完恢复滚动 */}
      <section id="partners" className="py-16 lg:py-20 scroll-mt-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900"
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={fadeUp}
          >
            {t('about.partners.title')}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8"
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...fadeUp, delay: 0.05 }}
          >
            {t('about.partners.desc')}
          </motion.p>
        </div>

        <div
          ref={setPartnersContainerRef}
          className="relative left-1/2 w-screen -translate-x-1/2 flex justify-center items-center py-4 md:py-6 min-h-0 md:min-h-[min(88vh,860px)]"
        >
          <div
            className="w-[92vw] h-[300px] md:h-[80vh] min-h-0 md:min-h-[440px] min-w-[320px] max-w-none max-h-none"
          >
            {partnersMapInView ? (
              <Suspense
                fallback={
                  <div
                    className="h-full w-full min-h-[384px] animate-pulse rounded-xl bg-gray-100"
                    aria-hidden
                  />
                }
              >
                <WorldPartnersMap
                  progress={partnersProgress}
                  onConnectNodesChange={setPartnerStepCount}
                  staticMap={isMobile}
                />
              </Suspense>
            ) : (
              <div className="h-full w-full min-h-[384px] rounded-xl bg-gray-50" aria-hidden />
            )}
          </div>
        </div>
      </section>

      {/* 资质认证 */}
      <section
        id="certifications"
        ref={certSectionRef}
        className="py-16 bg-gray-50 border-y border-gray-100 scroll-mt-20"
      >
        {/* 仅手机版缩放：板块整体 0.5 倍；文字放大到当前 2 倍（恢复原字号）；轮播图放大到当前 1.5 倍。桌面版保持原样 */}
        <div className="container mx-auto px-4" style={isMobile ? { zoom: 0.5 } : undefined}>
          <div style={isMobile ? { zoom: 2 } : undefined}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              {t('about.certificationsTitle')}
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
              {t('about.certificationsSubtitle')}
            </p>
          </div>
          {certItems.length === 0 ? (
            <p className="text-center text-gray-500">{t('about.certificationsEmpty')}</p>
          ) : (
            <div
              className="relative max-w-6xl mx-auto flex flex-col md:block"
              style={isMobile ? { zoom: 1.5 } : undefined}
            >
              <div
                ref={certScrollRef}
                className="order-1 overflow-x-auto scroll-smooth pb-4 px-4 md:px-14 -mx-4 scrollbar-thin snap-x snap-mandatory [scrollbar-color:rgba(8,108,123,0.35)_transparent]"
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
                      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.15) }}
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
              {/* 手机端：按钮放到轮播图下方；桌面端：左右悬浮箭头 */}
              <div className="order-2 z-10 mt-3 flex items-center justify-center gap-6 md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:justify-between">
                <button
                  type="button"
                  onClick={() => scrollCertByOne(-1)}
                  disabled={!canCertPrev}
                  aria-label={t('about.certificationsPrev')}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-[#086c7b] shadow-md backdrop-blur-sm transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 sm:h-12 sm:w-12 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1"
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-[#086c7b] shadow-md backdrop-blur-sm transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 sm:h-12 sm:w-12 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default About;

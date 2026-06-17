import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import OptimizedImage from '../OptimizedImage';
import HvacApplicationDiagram from './HvacApplicationDiagram';
import { glField } from '../../utils/productsCatalog';

const HOME_SEAM = '#030712';

function useElementLines(containerRef, hubRef, nodeElementsRef, leftCardRef, enabled) {
  const [lines, setLines] = useState([]);

  const measure = useCallback(() => {
    if (!enabled || !containerRef.current || !hubRef.current) {
      setLines([]);
      return;
    }
    const cr = containerRef.current.getBoundingClientRect();
    const hr = hubRef.current.getBoundingClientRect();
    const hx = hr.left + hr.width / 2 - cr.left;
    const hy = hr.top + hr.height / 2 - cr.top;

    const result = [];

    if (leftCardRef?.current) {
      const lr = leftCardRef.current.getBoundingClientRect();
      result.push({
        id: 'left',
        x1: hx,
        y1: hy,
        x2: lr.right - cr.left,
        y2: lr.top + lr.height * 0.35 - cr.top,
      });
      result.push({
        id: 'left2',
        x1: hx,
        y1: hy,
        x2: lr.right - cr.left,
        y2: lr.top + lr.height * 0.65 - cr.top,
      });
    }

    (nodeElementsRef.current || []).forEach((el, i) => {
      if (!el) return;
      const nr = el.getBoundingClientRect();
      result.push({
        id: `node-${i}`,
        x1: hx,
        y1: hy,
        x2: nr.left + nr.width / 2 - cr.left,
        y2: nr.top + nr.height / 2 - cr.top,
      });
    });

    setLines(result);
  }, [containerRef, hubRef, leftCardRef, nodeElementsRef, enabled]);

  useLayoutEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, enabled, nodeElementsRef]);

  return lines;
}

function HubLinkPath({ x1, y1, x2, y2, delay }) {
  const mx = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} Q ${mx} ${y1} ${x2} ${y2}`;
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#7c6cb0"
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.55 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export default function HomeApplicationHero() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const containerRef = useRef(null);
  const hubRef = useRef(null);
  const leftCardRef = useRef(null);
  const nodeElementsRef = useRef([]);

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const rows = (data.categories || []).filter((c) => c.active !== false);
        setCategories(rows);
        nodeElementsRef.current = Array(rows.length).fill(null);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (categories.length === 0) return undefined;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [categories]);

  const lines = useElementLines(
    containerRef,
    hubRef,
    nodeElementsRef,
    leftCardRef,
    categories.length > 0,
  );

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background:
          'linear-gradient(105deg, #e8f4f8 0%, #eef4fb 38%, #eceef8 72%, #e6f2f6 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
        <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-light/20 blur-3xl" />
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 container mx-auto px-4 pt-8 sm:pt-10 pb-8 lg:pb-12 z-10 min-h-0"
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden
        >
          {lines.map((line, i) => (
            <HubLinkPath
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              delay={0.15 + i * 0.04}
            />
          ))}
        </svg>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1fr)] gap-6 lg:gap-4 items-center">
          {/* 左侧示意图 */}
          <motion.div
            ref={leftCardRef}
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <HvacApplicationDiagram />
          </motion.div>

          {/* 中心 Hub */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center py-4 lg:py-0"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.05 }}
          >
            <div
              ref={hubRef}
              className="relative flex flex-col items-center justify-center text-center rounded-full w-[min(88vw,200px)] h-[min(88vw,200px)] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px]"
              style={{
                background: 'linear-gradient(145deg, #0a8a9d 0%, #086c7b 45%, #065562 100%)',
                boxShadow:
                  '0 0 0 6px rgba(8,108,123,0.12), 0 0 0 14px rgba(8,108,123,0.06), 0 20px 50px rgba(8,108,123,0.35)',
              }}
            >
              <OptimizedImage
                src="/images/app/logo.png"
                alt=""
                className="w-12 h-12 sm:w-14 sm:h-14 mb-2 opacity-95"
                imgClassName="w-full h-full object-contain brightness-0 invert"
              />
              <p className="text-white font-bold text-xl sm:text-2xl leading-tight px-4">
                {t('home.applicationHero.hubTitle')}
              </p>
              <p className="text-white/85 text-xs sm:text-sm mt-1 px-3 tracking-wide">
                {t('home.applicationHero.hubSubtitle')}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 px-3">
                <Link
                  to="/products"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-md bg-white text-primary font-medium hover:bg-cyan-50 transition-colors"
                >
                  {t('home.hero.cta.primary')}
                </Link>
                <Link
                  to="/contact"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-md border border-white/70 text-white hover:bg-white/10 transition-colors"
                >
                  {t('home.hero.cta.secondary')}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 右侧产品圆 grid */}
          <motion.div
            className="order-3 grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-4 sm:gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            {categories.map((cat, i) => {
              const title = glField(cat.title, lang);
              const isActive = activeId === cat.id;
              return (
                <Link
                  key={cat.id}
                  to={cat.link || `/products/${cat.id}`}
                  ref={(el) => {
                    nodeElementsRef.current[i] = el;
                  }}
                  className="group flex flex-col items-center text-center"
                  onMouseEnter={() => setActiveId(cat.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(cat.id)}
                  onBlur={() => setActiveId(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-full bg-white shadow-md overflow-hidden ring-2 transition-all duration-300 ${
                      isActive ? 'ring-primary shadow-lg shadow-primary/20' : 'ring-white/80'
                    }`}
                  >
                    <OptimizedImage
                      src={cat.image || '/images/app/logo.png'}
                      alt={title}
                      loading={i < 4 ? 'eager' : 'lazy'}
                      className="block w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </motion.div>
                  <span
                    className={`mt-1.5 text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2 transition-colors ${
                      isActive ? 'text-primary' : 'text-slate-700'
                    }`}
                  >
                    {title}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* 向下滑动 */}
      <motion.div
        className="relative z-10 flex justify-center pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          type="button"
          onClick={() =>
            document.getElementById('home-features')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary text-xs tracking-widest transition-colors"
          aria-label={t('home.hero.scrollHint')}
        >
          {t('home.hero.scrollHint')}
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
      </motion.div>

      {/* 过渡到深色「我们的优势」区块 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none h-32 sm:h-40"
        style={{
          background: `linear-gradient(to top, ${HOME_SEAM} 0%, rgba(3,7,18,0.85) 35%, transparent 100%)`,
        }}
        aria-hidden
      />
    </section>
  );
}

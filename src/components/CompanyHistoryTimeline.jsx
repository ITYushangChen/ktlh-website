import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { glField } from '../utils/productsCatalog';

/** 与 tailwind.config.js / Logo 主色一致 */
const BRAND = {
  primary: '#086c7b',
  light: '#0a8a9d',
  dark: '#065562',
};
const ARROW_COLORS = [BRAND.primary, BRAND.light, '#5ba8b5', BRAND.light, BRAND.dark];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const fadeDown = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 22 } },
};

function yearBubbleSize(index, total) {
  const min = 52;
  const max = 88;
  if (total <= 1) return max;
  return min + (index / (total - 1)) * (max - min);
}

function labelAbove(milestone, index) {
  if (milestone.position === 'above') return true;
  if (milestone.position === 'below') return false;
  return index % 2 === 0;
}

function ArrowBetween({ color, delay }) {
  return (
    <motion.div
      className="hidden md:flex shrink-0 items-center self-center px-0.5 -mt-0"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      style={{ transformOrigin: 'left center' }}
      aria-hidden
    >
      <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
        <path d="M0 8h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 3l7 5-7 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function ContentCard({ events, gl, position, delay }) {
  const anim = position === 'above' ? fadeDown : fadeUp;
  const items = (events || []).filter((e) => gl(e.description));

  if (items.length === 0) return <div className="h-full min-h-[7rem]" />;

  return (
    <motion.div
      variants={anim}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={`w-full max-w-[11rem] sm:max-w-[12.5rem] mx-auto ${
        position === 'above' ? 'mb-1' : 'mt-1'
      }`}
    >
      <ul className="space-y-1.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 text-left px-1">
        {items.map((event) => (
          <li key={event.id} className="flex gap-2 items-start">
            {event.image ? (
              <div className="shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white shadow-sm ring-1 ring-primary/10">
                <OptimizedImage
                  src={event.image}
                  alt=""
                  className="block w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span
                className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/55"
                aria-hidden
              />
            )}
            <span className="flex-1 min-w-0">{gl(event.description)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function YearBubble({ year, size, index, delay, isActive, onClick }) {
  return (
    <motion.button
      type="button"
      variants={popIn}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      className="relative z-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      style={{
        width: size,
        height: size,
      }}
      aria-pressed={isActive}
      aria-label={year}
    >
      <span
        className="absolute inset-0 rounded-full bg-white transition-shadow duration-300"
        style={{
          boxShadow: isActive
            ? 'inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -3px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(8,108,123,0.25), 0 0 0 3px rgba(8,108,123,0.15)'
            : 'inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -3px 6px rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.12)',
        }}
      />
      <span
        className="absolute inset-0 flex items-center justify-center font-bold tabular-nums select-none"
        style={{
          color: BRAND.primary,
          fontSize: size < 64 ? '0.95rem' : size < 76 ? '1.1rem' : '1.35rem',
        }}
      >
        {year}
      </span>
    </motion.button>
  );
}

function Connector({ position }) {
  return (
    <div className="flex flex-col items-center shrink-0" aria-hidden>
      {position === 'above' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-primary/45 mb-0.5" />
          <span className="w-px h-4 bg-primary/25" />
        </>
      ) : (
        <>
          <span className="w-px h-4 bg-primary/25" />
          <span className="w-2 h-2 rounded-full bg-primary/45 mt-0.5" />
        </>
      )}
    </div>
  );
}

function DesktopTimeline({ milestones, gl, selectedId, setSelectedId }) {
  const total = milestones.length;

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-inner border border-primary/10"
      style={{
        background:
          'linear-gradient(105deg, #e8f4f6 0%, #eef6f7 42%, #e4f1f3 78%, #e6f3f5 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-35 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl bg-primary/20" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl bg-primary-light/25" />
      </div>

      <div className="relative px-4 sm:px-8 py-10 lg:py-12">
        <motion.div
          className="absolute left-10 right-10 lg:left-14 lg:right-14 top-1/2 h-0 border-t-2 border-dashed border-primary/30 -translate-y-1/2 pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left center' }}
        />

        <div className="flex items-stretch justify-between gap-0 min-w-0">
          {milestones.map((milestone, index) => {
            const above = labelAbove(milestone, index);
            const size = yearBubbleSize(index, total);
            const delay = 0.2 + index * 0.1;
            const isActive = milestone.id === selectedId;

            return (
              <div key={milestone.id} className="contents">
                <div className="flex-1 min-w-0 flex flex-col items-center">
                  <div className="flex-1 min-h-[7.5rem] lg:min-h-[8.5rem] w-full flex flex-col items-center justify-end">
                    {above && (
                      <>
                        <ContentCard
                          events={milestone.events}
                          gl={gl}
                          position="above"
                          delay={delay + 0.15}
                        />
                        <Connector position="above" />
                      </>
                    )}
                  </div>

                  <YearBubble
                    year={milestone.year}
                    size={size}
                    index={index}
                    delay={delay}
                    isActive={isActive}
                    onClick={() => setSelectedId(milestone.id)}
                  />

                  <div className="flex-1 min-h-[7.5rem] lg:min-h-[8.5rem] w-full flex flex-col items-center justify-start">
                    {!above && (
                      <>
                        <Connector position="below" />
                        <ContentCard
                          events={milestone.events}
                          gl={gl}
                          position="below"
                          delay={delay + 0.15}
                        />
                      </>
                    )}
                  </div>
                </div>

                {index < total - 1 && (
                  <ArrowBetween color={ARROW_COLORS[index % ARROW_COLORS.length]} delay={delay + 0.05} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileTimeline({ milestones, gl, selectedId, setSelectedId }) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden border border-primary/10 shadow-sm"
      style={{
        background: 'linear-gradient(180deg, #e8f4f6 0%, #f0f7f8 100%)',
      }}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="p-5 space-y-0">
        {milestones.map((milestone, index) => {
          const isActive = milestone.id === selectedId;
          const size = yearBubbleSize(index, milestones.length);

          return (
            <motion.div key={milestone.id} variants={fadeUp} className="relative flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <motion.button
                  type="button"
                  onClick={() => setSelectedId(milestone.id)}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{ width: Math.min(size, 72), height: Math.min(size, 72) }}
                  aria-expanded={isActive}
                >
                  <span
                    className="absolute inset-0 rounded-full bg-white"
                    style={{
                      boxShadow: isActive
                        ? 'inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -2px 5px rgba(0,0,0,0.08), 0 4px 16px rgba(8,108,123,0.2)'
                        : 'inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -2px 5px rgba(0,0,0,0.08), 0 3px 10px rgba(0,0,0,0.1)',
                    }}
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm"
                  >
                    {milestone.year}
                  </span>
                </motion.button>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 min-h-[1.5rem] my-1 bg-gradient-to-b from-primary/35 to-primary/10" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-6">
                <motion.div
                  layout
                  className={`rounded-xl p-3 transition-colors ${
                    isActive ? 'bg-white shadow-md ring-1 ring-primary/15' : 'bg-white/60'
                  }`}
                >
                  <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                    {(milestone.events || []).map((event) => (
                      <li key={event.id} className="flex gap-2 items-start">
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/55" />
                        <span>{gl(event.description)}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function CompanyHistoryTimeline() {
  const { t, i18n } = useTranslation();
  const [milestones, setMilestones] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const lang = i18n.language || 'en';
  const gl = (field) => glField(field, lang);

  useEffect(() => {
    fetch(`/content/company-history.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const rows = (data.milestones || []).filter((m) => m.active !== false);
        setMilestones(rows);
        if (rows.length > 0) setSelectedId(rows[rows.length - 1].id);
      })
      .catch(() => setMilestones([]));
  }, []);

  if (milestones.length === 0) {
    return <p className="text-center text-gray-500 py-12">{t('about.historyEmpty')}</p>;
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="hidden md:block overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[880px]">
          <DesktopTimeline
            milestones={milestones}
            gl={gl}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>
      <div className="md:hidden">
        <MobileTimeline
          milestones={milestones}
          gl={gl}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>
    </div>
  );
}

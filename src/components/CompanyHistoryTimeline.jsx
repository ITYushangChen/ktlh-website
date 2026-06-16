import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { glField } from '../utils/productsCatalog';

function milestonePosition(index, total) {
  if (total <= 1) return { left: 50, top: 50 };
  const t = index / (total - 1);
  return {
    left: 6 + t * 88,
    top: 88 - t * 68,
  };
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

  const selected = useMemo(
    () => milestones.find((m) => m.id === selectedId) ?? milestones[0],
    [milestones, selectedId]
  );

  if (milestones.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">{t('about.historyEmpty')}</p>
    );
  }

  return (
    <div className="relative">
      {/* 桌面：斜向曲线时间轴 */}
      <div className="hidden md:block relative min-h-[min(520px,58vh)] mx-auto max-w-5xl">
        <div
          className="absolute inset-0 rounded-2xl opacity-40"
          style={{
            background:
              'linear-gradient(135deg, rgba(8,108,123,0.06) 0%, rgba(255,255,255,0.9) 45%, rgba(8,108,123,0.04) 100%)',
          }}
          aria-hidden
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none text-gray-300"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <marker id="history-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
            </marker>
          </defs>
          <path
            d="M 4 92 Q 42 58, 78 32 T 96 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            markerEnd="url(#history-arrow)"
          />
        </svg>

        {milestones.map((milestone, index) => {
          const { left, top } = milestonePosition(index, milestones.length);
          const isSelected = milestone.id === selected?.id;
          const labelAbove = index % 2 === 0;
          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => setSelectedId(milestone.id)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 rounded-full"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-pressed={isSelected}
              aria-label={`${milestone.year} ${gl(milestone.phase)}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-[#086c7b] bg-white ring-4 ring-[#086c7b]/20'
                    : 'border-gray-400 bg-white group-hover:border-[#086c7b]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#086c7b]' : 'bg-gray-400 group-hover:bg-[#086c7b]'}`}
                />
              </span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 w-max max-w-[9rem] text-center ${
                  labelAbove ? 'bottom-6' : 'top-6'
                }`}
              >
                <span className="block text-base font-semibold text-gray-900 leading-tight">
                  {milestone.year}
                </span>
                <span className="block text-[10px] sm:text-xs uppercase tracking-[0.14em] text-gray-400 mt-0.5">
                  {gl(milestone.phase)}
                </span>
              </span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 w-px bg-gray-300 ${
                  labelAbove ? 'top-full h-4' : 'bottom-full h-4'
                }`}
                aria-hidden
              />
            </button>
          );
        })}

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[min(100%,28rem)] z-20"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                  <p className="text-sm font-semibold text-gray-900">
                    {selected.year}
                    <span className="ml-2 text-xs font-medium uppercase tracking-wider text-[#086c7b]">
                      {gl(selected.phase)}
                    </span>
                  </p>
                </div>
                <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50 [scrollbar-color:rgba(8,108,123,0.35)_transparent]">
                  {(selected.events || []).map((event) => (
                    <li key={event.id} className="flex gap-3 p-3 hover:bg-gray-50/80">
                      <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                        {event.image ? (
                          <OptimizedImage
                            src={event.image}
                            alt=""
                            className="block w-full h-full"
                            imgClassName="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed flex-1 min-w-0">
                        {gl(event.description)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 手机：纵向时间轴 */}
      <div className="md:hidden space-y-4">
        {milestones.map((milestone, index) => {
          const isSelected = milestone.id === selected?.id;
          return (
            <div key={milestone.id} className="relative pl-8">
              {index < milestones.length - 1 && (
                <span
                  className="absolute left-[11px] top-8 bottom-0 w-px bg-gray-200"
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => setSelectedId(milestone.id)}
                className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#086c7b] bg-white"
                aria-expanded={isSelected}
              >
                <span className="h-2 w-2 rounded-full bg-[#086c7b]" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(milestone.id)}
                className="text-left w-full"
              >
                <span className="text-lg font-semibold text-gray-900">{milestone.year}</span>
                <span className="ml-2 text-xs uppercase tracking-wider text-gray-400">
                  {gl(milestone.phase)}
                </span>
              </button>
              {isSelected && (milestone.events || []).length > 0 && (
                <ul className="mt-3 space-y-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  {milestone.events.map((event) => (
                    <li key={event.id} className="flex gap-3">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        {event.image && (
                          <OptimizedImage
                            src={event.image}
                            alt=""
                            className="block w-full h-full"
                            imgClassName="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{gl(event.description)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

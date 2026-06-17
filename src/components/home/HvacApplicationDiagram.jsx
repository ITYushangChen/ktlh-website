/**
 * 左侧「产品应用」示意图：外部 SVG 底图 + 同 viewBox 标注线 + i18n 文案
 * 底图：public/images/app/home/hvac-diagram.svg（viewBox 0 0 1250 1478）
 * 锚点：i18n home.applicationHero.diagramCallouts 的 anchorX / anchorY（百分比）
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const DIAGRAM_SRC = '/images/app/home/hvac-diagram.svg';
const VB_W = 1250;
const VB_H = 1478;

function CalloutLine({ ax, ay, lx, ly }) {
  const midX = ax + (lx - ax) * 0.45;
  return (
    <path
      d={`M ${ax} ${ay} L ${midX} ${ay} L ${lx} ${ly}`}
      fill="none"
      stroke="#7c6cb0"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.75"
    />
  );
}

export default function HvacApplicationDiagram() {
  const { t } = useTranslation();
  const calloutsRaw = t('home.applicationHero.diagramCallouts', { returnObjects: true });
  const callouts = Array.isArray(calloutsRaw) ? calloutsRaw : [];

  const anchors = useMemo(
    () =>
      callouts.map((c, i) => ({
        ...c,
        anchorX: Number(c.anchorX ?? 50),
        anchorY: Number(c.anchorY ?? 50),
        side: c.side === 'left' ? 'left' : 'right',
        index: i,
      })),
    [callouts],
  );

  return (
    <div
      className="relative w-full rounded-2xl bg-[#fcfbf5] shadow-lg shadow-primary/5 ring-1 ring-slate-200/70 overflow-hidden"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <img
        src={DIAGRAM_SRC}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        loading="lazy"
        decoding="async"
        aria-hidden
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {anchors.map((item, i) => {
          const ax = (item.anchorX / 100) * VB_W;
          const ay = (item.anchorY / 100) * VB_H;
          const lx = item.side === 'left' ? 88 : VB_W - 88;
          const ly = ay + (i % 2 === 0 ? -18 : 18);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
            >
              <CalloutLine ax={ax} ay={ay} lx={lx} ly={ly} />
              <circle cx={ax} cy={ay} r="5" fill="#086c7b" opacity="0.9" />
              <circle cx={ax} cy={ay} r="8" fill="none" stroke="#086c7b" strokeWidth="1.5" opacity="0.35" />
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute inset-0 pointer-events-none" aria-hidden={false}>
        {anchors.map((item, i) => {
          const isLeft = item.side === 'left';
          return (
            <motion.div
              key={i}
              className={`absolute max-w-[min(32%,9.5rem)] sm:max-w-[min(34%,11rem)] text-[9px] sm:text-[10px] leading-snug pointer-events-auto ${
                isLeft ? 'left-[1.5%] sm:left-[2%] text-left' : 'right-[1.5%] sm:right-[2%] text-right'
              }`}
              style={{
                top: `${item.anchorY}%`,
                transform: `translateY(-50%) translateY(${i % 2 === 0 ? '-4px' : '4px'})`,
              }}
              initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
            >
              <p className="font-semibold text-slate-800 drop-shadow-sm">{item.title}</p>
              {item.description && (
                <p className="text-slate-600 mt-0.5 hidden sm:block">{item.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="sr-only">{t('home.applicationHero.diagramAria')}</span>
    </div>
  );
}

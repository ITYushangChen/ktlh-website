/**
 * 左侧「产品应用」示意图：外部 SVG + 标注线 + i18n 文案
 * anchorX/anchorY：部件锚点（百分比，相对 viewBox 1250×1478）
 * labelY：可选，文案垂直位置（默认与 anchorY 相同）
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const DIAGRAM_SRC = '/images/app/home/hvac-diagram.svg';
const VB_W = 1250;
const VB_H = 1478;

function CalloutLine({ ax, ay, lx, ly }) {
  const elbowX = ax + (lx - ax) * 0.55;
  return (
    <path
      d={`M ${lx} ${ly} L ${elbowX} ${ly} L ${ax} ${ay}`}
      fill="none"
      stroke="#7c6cb0"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
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
        labelY: Number(c.labelY ?? c.anchorY ?? 50),
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
          const ly = (item.labelY / 100) * VB_H;
          const lx = item.side === 'left' ? 72 : VB_W - 72;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
            >
              <CalloutLine ax={ax} ay={ay} lx={lx} ly={ly} />
              <circle cx={ax} cy={ay} r="5" fill="#086c7b" opacity="0.92" />
              <circle cx={ax} cy={ay} r="9" fill="none" stroke="#086c7b" strokeWidth="1.5" opacity="0.35" />
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
              className={`absolute max-w-[min(30%,8.75rem)] sm:max-w-[min(32%,10rem)] text-[9px] sm:text-[10px] leading-snug pointer-events-auto rounded-md px-1.5 py-1 bg-white/90 shadow-sm ring-1 ring-slate-200/60 ${
                isLeft ? 'left-[0.5%] sm:left-[1%] text-left' : 'right-[0.5%] sm:right-[1%] text-right'
              }`}
              style={{
                top: `${item.labelY}%`,
                transform: 'translateY(-50%)',
              }}
              initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
            >
              <p className="font-semibold text-slate-800">{item.title}</p>
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

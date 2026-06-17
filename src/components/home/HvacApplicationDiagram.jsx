/**
 * 左侧「产品应用」示意图
 *
 * 实现方式：SVG 底图（设备线框）+ HTML 标注（支持 i18n）
 *
 * 如何替换成设计师的 SVG：
 * 1. 在 Illustrator / Figma 导出「仅线框、无文字」的 SVG，放到 public/images/app/home/hvac-diagram.svg
 * 2. 用 Inkscape 或 Figma 查看各部件中心点坐标（viewBox 内 x,y）
 * 3. 在 i18n home.applicationHero.diagramCallouts 里配置 anchorX/anchorY（0–100 百分比）
 * 4. 或把整段 <g> 设备路径粘贴到 DIAGRAM_PATHS 下方替换简化线框
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/** 简化空调系统线框（可整体替换为设计稿 SVG path） */
function DiagramArtwork() {
  return (
    <g stroke="#64748b" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* 室外机 */}
      <rect x="42" y="48" width="118" height="72" rx="4" fill="#f8fafc" />
      <line x1="52" y1="62" x2="148" y2="62" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="52" y1="78" x2="148" y2="78" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="52" y1="94" x2="148" y2="94" stroke="#94a3b8" strokeWidth="0.8" />
      <circle cx="88" cy="108" r="10" fill="#e2e8f0" stroke="#64748b" />
      {/* 室内机 */}
      <rect x="200" y="56" width="148" height="52" rx="3" fill="#f1f5f9" />
      <rect x="212" y="68" width="124" height="28" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.9" />
      {/* 连接管 */}
      <path d="M160 84 C175 84, 185 78, 200 78" stroke="#086c7b" strokeWidth="1.5" />
      <path d="M160 96 C175 96, 185 102, 200 102" stroke="#086c7b" strokeWidth="1.5" />
      {/* 压缩机示意 */}
      <ellipse cx="100" cy="108" rx="14" ry="10" fill="#dbeafe" stroke="#086c7b" strokeWidth="1.2" />
    </g>
  );
}

function CalloutLine({ ax, ay, lx, ly }) {
  const midX = (ax + lx) / 2;
  return (
    <path
      d={`M ${ax} ${ay} L ${midX} ${ay} L ${lx} ${ly}`}
      fill="none"
      stroke="#7c6cb0"
      strokeWidth="1.1"
      strokeLinecap="round"
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
    <div className="relative w-full rounded-2xl bg-white/90 shadow-lg shadow-primary/5 ring-1 ring-slate-200/80 p-3 sm:p-4">
      <svg
        viewBox="0 0 360 200"
        className="w-full h-auto"
        role="img"
        aria-label={t('home.applicationHero.diagramAria')}
      >
        <DiagramArtwork />
        {anchors.map((item, i) => {
          const ax = (item.anchorX / 100) * 360;
          const ay = (item.anchorY / 100) * 200;
          const lx = item.side === 'left' ? 8 : 352;
          const ly = ay + (i % 2 === 0 ? -8 : 8);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
            >
              <CalloutLine ax={ax} ay={ay} lx={lx} ly={ly} />
              <circle cx={ax} cy={ay} r="2.5" fill="#086c7b" />
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {anchors.map((item, i) => {
          const top = `${item.anchorY}%`;
          const isLeft = item.side === 'left';
          return (
            <motion.div
              key={i}
              className={`absolute max-w-[38%] sm:max-w-[42%] text-[10px] sm:text-[11px] leading-snug pointer-events-auto ${
                isLeft ? 'left-1 sm:left-2 text-left' : 'right-1 sm:right-2 text-right'
              }`}
              style={{
                top,
                transform: `translateY(-50%) translateY(${i % 2 === 0 ? '-6px' : '6px'})`,
              }}
              initial={{ opacity: 0, x: isLeft ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
            >
              <p className="font-semibold text-slate-800">{item.title}</p>
              {item.description && (
                <p className="text-slate-500 mt-0.5 hidden sm:block">{item.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

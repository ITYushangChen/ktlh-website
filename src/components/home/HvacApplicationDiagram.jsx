/**
 * 左侧「产品应用」示意图（仅底图，无标注）
 */
import { useTranslation } from 'react-i18next';

const DIAGRAM_SRC = '/images/app/home/hvac-diagram.svg';
const VB_W = 1250;
const VB_H = 1478;

export default function HvacApplicationDiagram() {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full rounded-2xl bg-[#fcfbf5] shadow-lg shadow-primary/5 ring-1 ring-slate-200/70 overflow-hidden"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <img
        src={DIAGRAM_SRC}
        alt={t('home.applicationHero.diagramAria')}
        className="absolute inset-0 w-full h-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

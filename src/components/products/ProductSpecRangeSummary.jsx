import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { computeSpecColumnRanges, isSpecTableVisible, normalizeSpecTable } from '../../utils/specTable';

/**
 * 从技术参数表自动归纳的参数区间概览
 */
export default function ProductSpecRangeSummary({ table, gl, variant = 'full', className = '' }) {
  const { t } = useTranslation();

  const { ranges, modelCount } = useMemo(() => {
    const normalized = normalizeSpecTable(table);
    if (!isSpecTableVisible(normalized)) {
      return { ranges: [], modelCount: 0 };
    }
    return {
      ranges: computeSpecColumnRanges(normalized),
      modelCount: normalized.rows.length,
    };
  }, [table]);

  if (ranges.length === 0) return null;

  const isCompact = variant === 'compact';

  return (
    <section
      className={`rounded-xl border border-[#086c7b]/15 bg-gradient-to-br from-[#086c7b]/5 to-white ${
        isCompact ? 'p-5' : 'p-6 md:p-8'
      } ${className}`}
      aria-labelledby="spec-range-summary-heading"
    >
      <div className={isCompact ? 'mb-4' : 'mb-5 md:mb-6'}>
        <h2
          id="spec-range-summary-heading"
          className={`font-semibold text-gray-900 ${isCompact ? 'text-base' : 'text-lg md:text-xl'}`}
        >
          {t('products.specRangeSummary')}
        </h2>
        {modelCount > 0 && (
          <p className={`text-gray-600 mt-1 ${isCompact ? 'text-xs' : 'text-sm md:text-base'}`}>
            {t('products.specRangeModelCount', { count: modelCount })}
          </p>
        )}
      </div>

      <dl
        className={
          isCompact
            ? 'space-y-2.5'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4'
        }
      >
        {ranges.map((item, idx) => (
          <div
            key={`${gl(item.label)}-${idx}`}
            className={
              isCompact
                ? 'flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-4 border-b border-gray-100 pb-2 last:border-0 last:pb-0'
                : 'rounded-lg bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-100'
            }
          >
            <dt className={`text-gray-600 ${isCompact ? 'text-sm' : 'text-sm md:text-[15px]'}`}>
              {gl(item.label)}
              {item.unit && !item.rangeText.includes(item.unit) ? (
                <span className="text-gray-400 ml-1">({item.unit})</span>
              ) : null}
            </dt>
            <dd
              className={`font-semibold text-[#086c7b] tabular-nums ${
                isCompact ? 'text-sm sm:text-right' : 'text-base md:text-lg mt-0.5'
              }`}
            >
              {item.rangeText}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

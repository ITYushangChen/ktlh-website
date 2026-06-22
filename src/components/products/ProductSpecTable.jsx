import { useTranslation } from 'react-i18next';
import { isSpecTableVisible, normalizeSpecTable } from '../../utils/specTable';

/**
 * 产品参数表（技术规格表，样式参考储液器尺寸表）
 */
export default function ProductSpecTable({ table, gl }) {
  const { t } = useTranslation();
  const normalized = normalizeSpecTable(table);

  if (!isSpecTableVisible(normalized)) return null;

  const heading = gl(normalized.title) || t('products.specTableTitle');
  const hasUnits = normalized.columns.some((col) => col.unit?.trim());

  return (
    <div className="mb-8 mt-10">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{heading}</h2>
      <div className="overflow-x-auto rounded-lg shadow-md ring-1 ring-slate-200/80">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-[#086c7b] text-white">
              {normalized.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-3 py-3 text-center font-semibold border border-[#065562]/80 whitespace-normal min-w-[5rem]"
                >
                  {gl(col)}
                </th>
              ))}
            </tr>
            {hasUnits && (
              <tr className="bg-[#3a9db0] text-white">
                {normalized.columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-3 py-1.5 text-center text-xs md:text-sm font-medium border border-[#065562]/60"
                  >
                    {col.unit || ''}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {normalized.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.cells.map((cell, cellIdx) => {
                  const isModelCol = cellIdx === 0;
                  const stripe = rowIdx % 2 === 0;
                  const cellClass = isModelCol
                    ? 'bg-[#086c7b] text-white font-semibold'
                    : stripe
                      ? 'bg-[#dceef3] text-gray-800'
                      : 'bg-[#c5e4ec] text-gray-800';

                  return (
                    <td
                      key={cellIdx}
                      className={`px-3 py-2.5 text-center border border-white/60 align-middle ${cellClass}`}
                    >
                      {gl(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  applyExcelPasteToSpecTable,
  receiverDimensionSpecTable,
  syncSpecTableI18nFromZh,
} from '../../utils/specTable';

const LANG_BADGE = { zh: '中', en: 'EN', ja: 'JA' };

function cloneTable(table) {
  return JSON.parse(JSON.stringify(table));
}

/**
 * 后台：参数表编辑（支持 Excel 粘贴、单位行、规格表模板）
 */
export default function AdminSpecTableEditor({ specTable, activeLang, onChange }) {
  const [pasteText, setPasteText] = useState('');
  const [pasteError, setPasteError] = useState('');
  const enabled = specTable != null;

  const enable = () => onChange(receiverDimensionSpecTable());
  const disable = () => {
    if (!window.confirm('确认删除参数表？表格数据将清除。')) return;
    onChange(null);
  };

  if (!enabled) {
    return (
      <div className="border-t pt-5">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <label className="block text-sm font-medium text-gray-700">参数表格</label>
          <button
            type="button"
            onClick={enable}
            className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium"
          >
            + 添加参数表
          </button>
        </div>
        <p className="text-xs text-gray-400">
          支持从 Excel 复制多行多列数据直接粘贴导入（型号、尺寸、容积等）。
        </p>
      </div>
    );
  }

  const table = specTable;
  const colCount = table.columns.length;

  const update = (patch) => onChange({ ...table, ...patch });

  const setTitle = (lang, value) => update({ title: { ...table.title, [lang]: value } });

  const setColumn = (index, lang, value) => {
    const columns = cloneTable(table.columns);
    columns[index] = { ...columns[index], [lang]: value };
    update({ columns });
  };

  const setColumnUnit = (index, unit) => {
    const columns = cloneTable(table.columns);
    columns[index] = { ...columns[index], unit };
    update({ columns });
  };

  const setCellAllLangs = (rowIndex, colIndex, value) => {
    const rows = cloneTable(table.rows);
    rows[rowIndex].cells[colIndex] = { zh: value, en: value, ja: value };
    update({ rows });
  };

  const addColumn = () => {
    const columns = [...table.columns, { zh: '', en: '', ja: '', unit: '' }];
    const rows = table.rows.map((row) => ({
      cells: [...row.cells, { zh: '', en: '', ja: '' }],
    }));
    update({ columns, rows });
  };

  const removeColumn = (index) => {
    if (colCount <= 1) return;
    update({
      columns: table.columns.filter((_, i) => i !== index),
      rows: table.rows.map((row) => ({ cells: row.cells.filter((_, i) => i !== index) })),
    });
  };

  const addRow = () => {
    const cells = table.columns.map(() => ({ zh: '', en: '', ja: '' }));
    update({ rows: [...table.rows, { cells }] });
  };

  const removeRow = (rowIndex) => {
    if (table.rows.length <= 1) return;
    update({ rows: table.rows.filter((_, i) => i !== rowIndex) });
  };

  const importPaste = (text, options) => {
    setPasteError('');
    const raw = text?.trim();
    if (!raw) {
      setPasteError('请先粘贴 Excel 表格内容');
      return;
    }
    try {
      const next = applyExcelPasteToSpecTable(table, raw, options);
      onChange(next);
      setPasteText('');
    } catch (e) {
      setPasteError(e.message || '解析失败');
    }
  };

  const handlePasteEvent = (e) => {
    const text = e.clipboardData?.getData('text');
    if (!text?.includes('\t')) return;
    e.preventDefault();
    importPaste(text, { treatFirstRowAsHeader: true });
  };

  return (
    <div className="border-t pt-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <label className="block text-sm font-medium text-gray-700">
          参数表格
          <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal">
            {LANG_BADGE[activeLang]}
          </span>
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onChange(syncSpecTableI18nFromZh(table))}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            同步英日翻译
          </button>
          <button
            type="button"
            onClick={() => onChange(receiverDimensionSpecTable())}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            使用规格表模板
          </button>
          <button type="button" onClick={addColumn} className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium">
            + 列
          </button>
          <button type="button" onClick={addRow} className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium">
            + 行
          </button>
          <button type="button" onClick={disable} className="text-sm text-red-500 hover:text-red-600 font-medium">
            删除表格
          </button>
        </div>
      </div>

      {/* Excel 粘贴区 */}
      <div className="rounded-xl border border-dashed border-[#086c7b]/45 bg-teal-50/40 p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-800 mb-1">从 Excel 粘贴</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            在 Excel 中选中表格（含表头）后复制，粘贴到下方。第一行为列名，第二行若为 mm、L 等单位会自动识别；其后为数据行。
            也可直接 Ctrl+V 到文本框内。
          </p>
        </div>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          onPaste={handlePasteEvent}
          rows={5}
          placeholder="示例：&#10;产品型号	A(筒径)	B(进气管...)	C(...)	F(...)	容积&#10;	mm	mm	mm	mm	L&#10;KTA076023A	76	40	40	76	2.3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#086c7b] bg-white"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={() => importPaste(pasteText, { treatFirstRowAsHeader: true })}
            className="px-4 py-2 rounded-lg bg-[#086c7b] text-white text-sm font-medium hover:bg-[#065a67]"
          >
            导入（含表头）
          </button>
          <button
            type="button"
            onClick={() => importPaste(pasteText, { treatFirstRowAsHeader: false })}
            className="px-4 py-2 rounded-lg border border-[#086c7b] text-[#086c7b] text-sm font-medium hover:bg-teal-50"
          >
            仅导入数据行
          </button>
          {pasteError && <span className="text-xs text-red-500">{pasteError}</span>}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">表格标题（可选）</label>
        <input
          type="text"
          value={table.title?.[activeLang] || ''}
          onChange={(e) => setTitle(activeLang, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
          placeholder="技术参数表"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#086c7b] text-white">
              {table.columns.map((col, colIdx) => (
                <th key={colIdx} className="p-2 border border-[#065562] align-top min-w-[120px]">
                  <input
                    type="text"
                    value={col[activeLang] || ''}
                    onChange={(e) => setColumn(colIdx, activeLang, e.target.value)}
                    className="w-full bg-white/10 border border-white/30 rounded px-2 py-1 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/60"
                    placeholder={`列 ${colIdx + 1}`}
                  />
                  <input
                    type="text"
                    value={col.unit || ''}
                    onChange={(e) => setColumnUnit(colIdx, e.target.value)}
                    className="w-full mt-1 bg-white/90 border border-white/40 rounded px-2 py-0.5 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    placeholder="单位 mm / L"
                  />
                  {colCount > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(colIdx)}
                      className="mt-1 text-xs text-white/80 hover:text-white"
                    >
                      删除列
                    </button>
                  )}
                </th>
              ))}
              <th className="p-2 w-8 border border-[#065562]" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-t border-gray-100">
                {row.cells.map((cell, cellIdx) => (
                  <td key={cellIdx} className="p-1 align-top">
                    <input
                      type="text"
                      value={cell.zh || ''}
                      onChange={(e) => setCellAllLangs(rowIdx, cellIdx, e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#086c7b]"
                      placeholder="—"
                    />
                  </td>
                ))}
                <td className="p-1 w-8 align-top">
                  {table.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="text-red-400 hover:text-red-600 text-lg"
                      aria-label="删除行"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        列名按当前编辑语言保存；数据单元格会同步写入中/英/日（型号与数值通常无需翻译）。保存产品后记得点「保存到 GitHub」。
      </p>
    </div>
  );
}

const EMPTY_I18N = { zh: '', en: '', ja: '' };

function mkCell(value = '') {
  return { zh: value, en: value, ja: value };
}

function mkColumn(label = '', unit = '') {
  return { zh: label, en: label, ja: label, unit };
}

/** 解析 Excel / 表格复制的 TSV 文本为二维数组 */
export function parseExcelGrid(text) {
  if (!text || !String(text).trim()) return [];
  return String(text)
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.replace(/\t/g, '').trim().length > 0)
    .map((line) => line.split('\t').map((cell) => cell.trim()));
}

/** 第二行是否像单位行（mm、L 等） */
export function looksLikeUnitRow(row) {
  if (!row?.length) return false;
  return row.every((cell) => {
    const t = String(cell).trim();
    if (!t) return true;
    return t.length <= 8 && /^[a-zA-Zμ%°²³/°]+$/.test(t);
  });
}

/** 储液器类尺寸参数表模板（6 列） */
export function receiverDimensionSpecTable() {
  return {
    title: { zh: '技术参数表', en: 'Specification Table', ja: '技術仕様表' },
    columns: [
      mkColumn('产品型号', ''),
      mkColumn('A(筒径)', 'mm'),
      mkColumn('B(进气管管口尺寸)', 'mm'),
      mkColumn('C(出气管管口尺寸)', 'mm'),
      mkColumn('F(两管中心距)', 'mm'),
      mkColumn('容积', 'L'),
    ],
    rows: [{ cells: Array(6).fill(null).map(() => mkCell()) }],
  };
}

/** 空参数表 */
export function emptySpecTable() {
  return receiverDimensionSpecTable();
}

function normalizeColumn(c) {
  if (typeof c === 'object' && c !== null) {
    return {
      zh: c.zh || '',
      en: c.en || '',
      ja: c.ja || '',
      unit: c.unit || '',
    };
  }
  const s = c != null ? String(c) : '';
  return { zh: s, en: s, ja: s, unit: '' };
}

export function normalizeSpecTable(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return null;
  const colCount = table.columns.length;
  if (colCount === 0) return null;

  const columns = table.columns.map(normalizeColumn);

  const rows = table.rows.map((row) => {
    const cells = Array.isArray(row?.cells) ? row.cells : [];
    const normalized = columns.map((_, i) => {
      const cell = cells[i];
      if (typeof cell === 'object' && cell !== null) {
        return {
          zh: cell.zh || '',
          en: cell.en || '',
          ja: cell.ja || '',
        };
      }
      const s = cell != null ? String(cell) : '';
      return { zh: s, en: s, ja: s };
    });
    return { cells: normalized };
  });

  const title =
    typeof table.title === 'object' && table.title !== null
      ? { zh: table.title.zh || '', en: table.title.en || '', ja: table.title.ja || '' }
      : { ...EMPTY_I18N };

  return { title, columns, rows };
}

export function isSpecTableVisible(table) {
  const normalized = normalizeSpecTable(table);
  if (!normalized) return false;
  const hasData = normalized.rows.some((row) =>
    row.cells.some((cell) => cell.zh?.trim() || cell.en?.trim()),
  );
  return normalized.columns.length > 0 && hasData;
}

/**
 * 将 Excel 粘贴内容合并进 specTable
 * - 第一行：列名
 * - 第二行（可选）：单位
 * - 其余行：数据
 */
export function applyExcelPasteToSpecTable(existingTable, text, { treatFirstRowAsHeader = true } = {}) {
  const grid = parseExcelGrid(text);
  if (!grid.length) return existingTable;

  let headerRow = grid[0];
  let unitsRow = null;
  let dataStart = 1;

  if (treatFirstRowAsHeader && grid.length >= 2 && looksLikeUnitRow(grid[1])) {
    unitsRow = grid[1];
    dataStart = 2;
  } else if (!treatFirstRowAsHeader) {
    dataStart = 0;
    headerRow = existingTable?.columns?.map((c) => c.zh || c.en || '') || [];
    if (!headerRow.length) return existingTable;
  }

  const colCount = headerRow.length;
  const columns = headerRow.map((label, i) => {
    const prev = existingTable?.columns?.[i];
    const unit = unitsRow?.[i] || prev?.unit || '';
    if (prev && typeof prev === 'object') {
      return {
        zh: label || prev.zh || '',
        en: prev.en || label || '',
        ja: prev.ja || label || '',
        unit,
      };
    }
    return mkColumn(label, unit);
  });

  const rows = grid.slice(dataStart).map((row) => {
    const cells = [];
    for (let i = 0; i < colCount; i++) {
      cells.push(mkCell(row[i] ?? ''));
    }
    return { cells };
  });

  return syncSpecTableI18nFromZh({
    title: existingTable?.title || { ...EMPTY_I18N },
    columns,
    rows: rows.length ? rows : [{ cells: columns.map(() => mkCell()) }],
  });
}
const SPEC_LABEL_I18N = {
  技术参数表: { en: 'Specification Table', ja: '技術仕様表' },
  型号: { en: 'Model', ja: '型式' },
  产品型号: { en: 'Model', ja: '製品型式' },
  产品名: { en: 'Product Name', ja: '製品名' },
  'A(筒径)': { en: 'A (Shell Diameter)', ja: 'A（筒径）' },
  'A（筒径）': { en: 'A (Shell Diameter)', ja: 'A（筒径）' },
  'B(进气管管口尺寸)': { en: 'B (Suction Pipe Port Size)', ja: 'B（吸気管口サイズ）' },
  'B（进气管管口尺寸）': { en: 'B (Suction Pipe Port Size)', ja: 'B（吸気管口サイズ）' },
  'C(出气管管口尺寸)': { en: 'C (Discharge Pipe Port Size)', ja: 'C（吐出管口サイズ）' },
  'C（出气管管口尺寸）': { en: 'C (Discharge Pipe Port Size)', ja: 'C（吐出管口サイズ）' },
  'D(上下端盖距离)': { en: 'D (End Cover Distance)', ja: 'D（上下端蓋間距離）' },
  'D（上下端盖距离）': { en: 'D (End Cover Distance)', ja: 'D（上下端蓋間距離）' },
  'F(两管中心距)': { en: 'F (Center Distance Between Pipes)', ja: 'F（両管中心距）' },
  'F（两管中心距）': { en: 'F (Center Distance Between Pipes)', ja: 'F（両管中心距）' },
  'D(回油管管口尺寸)': { en: 'D (Oil Return Pipe Port Size)', ja: 'D（オイル戻り管口サイズ）' },
  'D（回油管管口尺寸）': { en: 'D (Oil Return Pipe Port Size)', ja: 'D（オイル戻り管口サイズ）' },
  'E(消音器高度)': { en: 'E (Muffler Height)', ja: 'E（消音器高さ）' },
  'E（消音器高度）': { en: 'E (Muffler Height)', ja: 'E（消音器高さ）' },
  容积: { en: 'Volume', ja: '容積' },
  额定制冷量: { en: 'Rated Cooling Capacity', ja: '定格冷却能力' },
  片数: { en: 'Number of Plates', ja: '枚数' },
  通道容积: { en: 'Channel Volume', ja: 'チャンネル容積' },
  '通道容积（dm³）': { en: 'Channel Volume (dm³)', ja: 'チャンネル容積（dm³）' },
  单片面积: { en: 'Single Plate Area', ja: '単板面積' },
  '单片面积（m²）': { en: 'Single Plate Area (m²)', ja: '単板面積（m²）' },
  材料: { en: 'Material', ja: '材料' },
  进出口径: { en: 'Inlet/Outlet Diameter', ja: '出入口径' },
};

const SIX_COL_RECEIVER_HEADERS = [
  { zh: '型号', unit: '' },
  { zh: 'A（筒径）', unit: 'mm' },
  { zh: 'B（进气管管口尺寸）', unit: 'mm' },
  { zh: 'C（出气管管口尺寸）', unit: 'mm' },
  { zh: 'F（两管中心距）', unit: 'mm' },
  { zh: '容积', unit: 'L' },
];

function normalizeSpecZhKey(text) {
  return String(text ?? '').trim().replace(/（/g, '(').replace(/）/g, ')');
}

/** 数值、型号等无需翻译，三语保持一致 */
export function isSpecDataValue(text) {
  const t = String(text ?? '').trim();
  if (!t) return true;
  if (/^[A-Za-z](\/[A-Za-z])?$/.test(t)) return false;
  if (/^[\d.]+$/.test(t)) return true;
  if (/^\d+-\d+\/\d+$/.test(t)) return true;
  if (/^\d+\/\d+$/.test(t)) return true;
  if (/^[A-Z]{2,}[A-Z0-9-]+[A-Z]?$/i.test(t)) return true;
  return false;
}

export function translateSpecLabel(zh) {
  const raw = String(zh ?? '').trim();
  if (!raw) return { en: '', ja: '' };
  if (isSpecDataValue(raw)) return { en: raw, ja: raw };

  const key = normalizeSpecZhKey(raw);
  const hit = SPEC_LABEL_I18N[key] || SPEC_LABEL_I18N[raw];
  if (hit) return hit;

  return { en: raw, ja: raw };
}

function syncI18nField(field) {
  if (!field || typeof field !== 'object') return field;
  const zh = field.zh ?? '';
  if (isSpecDataValue(zh)) {
    return { zh, en: zh, ja: zh };
  }
  const { en, ja } = translateSpecLabel(zh);
  return { zh, en, ja };
}

function looksLikeCorruptedColumnHeaders(columns) {
  const first = String(columns?.[0]?.zh ?? '').trim();
  if (!first) return false;
  return /^[A-Z]{2,}[A-Z0-9-]+/i.test(first);
}

/** 表头被误粘贴为第一行数据时，恢复标准列名并补回数据行 */
export function repairCorruptedSpecTableHeaders(specTable) {
  if (!specTable?.columns?.length || !looksLikeCorruptedColumnHeaders(specTable.columns)) {
    return specTable;
  }

  const dataFromHeader = specTable.columns.map((col) => ({
    zh: col.zh ?? '',
    unit: col.unit || '',
  }));

  const columns = SIX_COL_RECEIVER_HEADERS.map((tpl, i) => {
    const unit = dataFromHeader[i]?.unit || tpl.unit;
    const label = syncI18nField({ zh: tpl.zh });
    return { ...label, unit };
  });

  const firstRow = {
    cells: dataFromHeader.map((d) => syncI18nField({ zh: d.zh })),
  };

  return {
    ...specTable,
    columns,
    rows: [firstRow, ...(specTable.rows || [])],
  };
}

/** 以 zh 为准同步 specTable 的 en / ja（列名、数据行） */
export function syncSpecTableI18nFromZh(specTable) {
  if (!specTable) return specTable;

  const repaired = repairCorruptedSpecTableHeaders(specTable);

  const title = syncI18nField(repaired.title || EMPTY_I18N);
  const columns = (repaired.columns || []).map((col) => {
    const synced = syncI18nField(col);
    return { ...synced, unit: col.unit || '' };
  });

  const rows = (repaired.rows || []).map((row) => ({
    cells: (row.cells || []).map((cell) => syncI18nField(cell)),
  }));

  return { ...repaired, title, columns, rows };
}

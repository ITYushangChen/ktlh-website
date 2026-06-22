/** 产品大类 → 子分类 ID 顺序（与 products.json groups 同步） */
export const DEFAULT_PRODUCT_GROUPS = [
  {
    id: 'pressure-vessels',
    categoryIds: ['receivers', 'gas-liquid-separators', 'oil-separators'],
    title: {
      zh: '压力容器',
      en: 'Pressure Vessels',
      ja: '圧力容器',
    },
  },
  {
    id: 'piping-components',
    categoryIds: ['copper-tube-series', 'steel-pipes'],
    title: {
      zh: '管路件',
      en: 'Piping Components',
      ja: '配管部品',
    },
  },
  {
    id: 'heat-exchangers',
    categoryIds: ['shell-tube-heat-exchangers', 'plate-heat-exchangers'],
    title: {
      zh: '换热器',
      en: 'Heat Exchangers',
      ja: '熱交換器',
    },
  },
  {
    id: 'damping-blocks',
    categoryIds: ['damping-blocks'],
    title: {
      zh: '阻尼块',
      en: 'Damping Blocks',
      ja: 'ダンピングブロック',
    },
  },
];

export const CATEGORY_PATH_BY_ID = {
  receivers: 'receivers',
  'gas-liquid-separators': 'gas-liquid-separators',
  'oil-separators': 'oil-separators',
  'damping-blocks': 'damping-blocks',
  'shell-tube-heat-exchangers': 'shell-tube-heat-exchangers',
  'copper-tube-series': 'copper-tube-series',
  'steel-pipes': 'steel-pipes',
  'plate-heat-exchangers': 'plate-heat-exchangers',
};

export function glField(field, lang) {
  if (!field || typeof field === 'string') return field || '';
  const key = lang?.startsWith('ja') ? 'ja' : lang?.startsWith('en') ? 'en' : 'zh';
  return field[key] || field.zh || field.en || field.ja || '';
}

/** 将 products.json 解析为带 children 的分组列表 */
export function buildProductGroups(data, lang = 'zh') {
  const activeCategories = (data?.categories || []).filter((c) => c.active !== false);
  const byId = Object.fromEntries(activeCategories.map((c) => [c.id, c]));

  const groupDefs = (data?.groups?.length ? data.groups : DEFAULT_PRODUCT_GROUPS).map((g) => ({
    id: g.id,
    title: g.title,
    categoryIds: g.categoryIds || [],
  }));

  return groupDefs
    .map((group) => ({
      id: group.id,
      title: group.title,
      categories: group.categoryIds.map((id) => byId[id]).filter(Boolean),
    }))
    .filter((group) => group.categories.length > 0);
}

export function flattenActiveCategories(data) {
  return (data?.categories || []).filter((c) => c.active !== false);
}

/** 品类前台详情页路径 */
export function getCategoryLink(category) {
  if (!category?.id) return '/products';
  if (category.link && !category.link.match(/\/products\/[^/]+\/[^/]+/)) {
    return category.link;
  }
  return `/products/${CATEGORY_PATH_BY_ID[category.id] || category.id}`;
}

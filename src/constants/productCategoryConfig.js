import { CATEGORY_PATH_BY_ID } from '../utils/productsCatalog';

/** 分类 URL 路径 → 详情页配置（nav、规格文案前缀） */
export const PRODUCT_CATEGORY_DETAIL_CONFIG = {
  receivers: {
    categoryKey: 'receivers',
    specLabelPrefix: 'products.receivers.specLabels',
    navKey: 'nav.products_sub.receivers',
  },
  'gas-liquid-separators': {
    categoryKey: 'gas-liquid-separators',
    specLabelPrefix: 'products.gasLiquidSeparators.specLabels',
    navKey: 'nav.products_sub.gas_liquid_separators',
  },
  'oil-separators': {
    categoryKey: 'oil-separators',
    specLabelPrefix: 'products.oilSeparators.specLabels',
    navKey: 'nav.products_sub.oil_separators',
  },
  'damping-blocks': {
    categoryKey: 'damping-blocks',
    specLabelPrefix: 'products.dampingBlocks.specLabels',
    navKey: 'nav.products_sub.damping_blocks',
  },
  'shell-tube-heat-exchangers': {
    categoryKey: 'shell-tube-heat-exchangers',
    specLabelPrefix: 'products.shellTubeHeatExchangers.specLabels',
    navKey: 'nav.products_sub.shell_tube_heat_exchangers',
  },
  'copper-tube-series': {
    categoryKey: 'copper-tube-series',
    specLabelPrefix: 'products.copperTubeSeries.specLabels',
    navKey: 'nav.products_sub.copper_tube_series',
  },
  'steel-pipes': {
    categoryKey: 'steel-pipes',
    specLabelPrefix: 'products.steelPipes.specLabels',
    navKey: 'nav.products_sub.steel_pipes',
  },
  'plate-heat-exchangers': {
    categoryKey: 'plate-heat-exchangers',
    specLabelPrefix: 'products.plateHeatExchangers.specLabels',
    navKey: 'nav.products_sub.plate_heat_exchangers',
  },
};

export function categoryIdFromPath(categoryPath) {
  return Object.entries(CATEGORY_PATH_BY_ID).find(([, path]) => path === categoryPath)?.[0] ?? null;
}

export function categoryPathFromId(categoryId) {
  return CATEGORY_PATH_BY_ID[categoryId] || categoryId;
}

export function getCategoryPublicPath(categoryId) {
  return `/products/${categoryPathFromId(categoryId)}`;
}

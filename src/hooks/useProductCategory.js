import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryIdFromPath } from '../constants/productCategoryConfig';

/** 从 products.json 加载单个品类（详情页唯一数据源） */
export function useProductCategory(categoryPath) {
  const { i18n } = useTranslation();
  const [category, setCategory] = useState(null);
  const [loaded, setLoaded] = useState(() => categoryPath == null);

  useEffect(() => {
    if (!categoryPath) {
      setCategory(null);
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoaded(false);

    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const categoryId = categoryIdFromPath(categoryPath);
        const found = (data.categories || []).find((c) => c.id === categoryId);
        setCategory(found && found.active !== false ? found : null);
      })
      .catch(() => {
        if (!cancelled) setCategory(null);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryPath]);

  const lang = i18n.language || 'zh';
  const langKey = lang.startsWith('ja') ? 'ja' : lang.startsWith('en') ? 'en' : 'zh';

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[langKey] || field.zh || field.en || field.ja || '';
  };

  const gla = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[langKey] || field.zh || field.en || field.ja || [];
  };

  return { category, gl, gla, loaded };
}

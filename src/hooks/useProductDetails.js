import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useProductDetails(categoryKey) {
  const { i18n } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/content/product-details.json')
      .then(res => res.json())
      .then(data => setItems((data[categoryKey] || []).filter(i => i.active !== false)))
      .catch(() => setItems([]));
  }, [categoryKey]);

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[i18n.language] || field.zh || '';
  };

  const gla = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[i18n.language] || field.zh || [];
  };

  return { items, gl, gla };
}

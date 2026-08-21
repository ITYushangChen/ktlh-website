import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { ProductCategoryCard } from '../components/ProductCategoryCard';
import { buildProductGroups, glField } from '../utils/productsCatalog';

const fadeUp = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

const Products = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  // 分组按顺序依次浮现：前一组浮现完成后，下一组才开始浮现
  const [revealedGroups, setRevealedGroups] = useState(0);

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setGroups(buildProductGroups(data, i18n.language)))
      .catch(() => setGroups([]));
  }, [i18n.language]);

  const gl = (field) => glField(field, i18n.language);

  // 支持从首页卡片跳转到对应产品卡片位置（hash 形如 #group-x / #cat-x）
  useEffect(() => {
    const hash = location.hash?.replace(/^#/, '');
    if (!hash) return undefined;
    const scrollToTarget = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      return false;
    };
    if (scrollToTarget()) return undefined;
    const timer = window.setInterval(() => {
      if (scrollToTarget()) window.clearInterval(timer);
    }, 150);
    const timeout = window.setTimeout(() => window.clearInterval(timer), 4000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timeout);
    };
  }, [location.hash, groups.length]);

  return (
    <div className="products-page-in py-8 pb-16 bg-white">
      <Seo
        title={t('seo.products.title')}
        description={t('seo.products.description')}
        path="/products"
      />
      <section className="bg-white py-8 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-6xl space-y-14 md:space-y-16">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="products-title-in text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.title')}
            </h1>
            <p className="products-subtitle-in text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>
          {groups.map((group, groupIndex) => {
            // 第一个分组在首屏可见，用与联系页一致的 CSS 节奏（标题之后浮现）
            const isFirst = groupIndex === 0;
            return isFirst ? (
              <div
                key={group.id}
                id={`group-${group.id}`}
                className="products-group-in scroll-mt-24"
                onAnimationEnd={() => setRevealedGroups((c) => Math.max(c, 1))}
              >
                <div className="mb-8 md:mb-10 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {gl(group.title)}
                  </h2>
                  <div className="mx-auto mt-3 h-0.5 w-16 bg-[#086c7b]/80" aria-hidden />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.categories.map((category) => (
                    <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-24">
                      <ProductCategoryCard category={category} gl={gl} t={t} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                key={group.id}
                id={`group-${group.id}`}
                className="scroll-mt-24"
                initial={false}
                animate={
                  revealedGroups >= groupIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{ duration: 0.3, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() =>
                  setRevealedGroups((c) => Math.max(c, groupIndex + 1))
                }
              >
                <div className="mb-8 md:mb-10 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {gl(group.title)}
                  </h2>
                  <div className="mx-auto mt-3 h-0.5 w-16 bg-[#086c7b]/80" aria-hidden />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.categories.map((category, cardIndex) => (
                    <motion.div
                      key={category.id}
                      id={`cat-${category.id}`}
                      className="scroll-mt-24"
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ ...fadeUp, delay: Math.min(cardIndex * 0.05, 0.2) }}
                    >
                      <ProductCategoryCard category={category} gl={gl} t={t} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Products;

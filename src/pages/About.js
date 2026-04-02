import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function certTitleForLang(titleObj, lang) {
  if (!titleObj || typeof titleObj !== 'object') return '';
  const key = lang.startsWith('ja') ? 'ja' : lang.startsWith('en') ? 'en' : 'zh';
  return titleObj[key] || titleObj.zh || titleObj.en || titleObj.ja || '';
}

const About = () => {
  const { t, i18n } = useTranslation();
  const [certItems, setCertItems] = useState([]);
  const founderParagraphsRaw = t('about.founder.paragraphs', { returnObjects: true });
  const founderParagraphs = Array.isArray(founderParagraphsRaw) ? founderParagraphsRaw : [];

  useEffect(() => {
    fetch(`/content/certifications.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCertItems(Array.isArray(data.items) ? data.items : []))
      .catch(() => setCertItems([]));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              {t('about.overviewTitle')}
            </h2>
            <div className="prose prose-lg">
              <p className="mb-6">{t('about.overview.0')}</p>
              <p className="mb-6">{t('about.overview.1')}</p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">{t('about.productionTitle')}</h3>
                <ul className="space-y-2">
                  <li>{t('about.production.0')}</li>
                  <li>{t('about.production.1')}</li>
                  <li>{t('about.production.2')}</li>
                  <li>{t('about.production.3')}</li>
                  <li>{t('about.production.4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('about.partners.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-8">{t('about.partners.desc')}</p>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src="/images/world-map-partners.png"
                alt="Global Partners Map"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(t('about.partners.list', { returnObjects: true }) || []).map((partner, index, arr) => {
                const n = arr.length;
                const lastStart = 1.2;
                const delay = n > 1 ? (index / (n - 1)) * lastStart : 0;
                return (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-semibold">{partner}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 创始人致辞 */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-violet-100/90 via-orange-50/95 to-amber-50">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-900">
            {t('about.founderTitle')}
          </h2>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
              className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-xl shadow-lg border border-white/60"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
                <figure className="shrink-0 mx-auto md:mx-0 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[min(38vw,300px)] lg:max-w-[320px]">
                  <img
                    src="/images/chairman.png"
                    alt={t('about.founder.imageAlt')}
                    className="w-full h-auto rounded-xl shadow-md border border-gray-100/90 object-contain bg-white/40"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-lg mb-6 md:mb-8">
                    {t('about.founder.salutation')}
                  </p>
                  <div className="space-y-6 text-gray-800 leading-relaxed text-[15px] md:text-base text-justify">
                    {founderParagraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 资质认证 */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            {t('about.certificationsTitle')}
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            {t('about.certificationsSubtitle')}
          </p>
          {certItems.length === 0 ? (
            <p className="text-center text-gray-500">{t('about.certificationsEmpty')}</p>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
              <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                {certItems.map((item, index) => {
                  const label = certTitleForLang(item.title, i18n.language || 'zh');
                  return (
                    <motion.article
                      key={`${item.image}-${index}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 shrink-0 w-56"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                    >
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 rounded-t-xl"
                      >
                        <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center p-3 min-h-[200px]">
                          <img
                            src={item.image}
                            alt={label}
                            className="max-h-full max-w-full w-auto object-contain"
                            loading="lazy"
                          />
                        </div>
                      </a>
                      <div className="px-4 py-3 border-t border-gray-100 min-h-[3.5rem] flex items-center justify-center">
                        <p className="text-sm font-medium text-gray-800 text-center leading-snug">
                          {label}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;

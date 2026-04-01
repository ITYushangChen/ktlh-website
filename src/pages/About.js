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

  useEffect(() => {
    fetch(`/content/certifications.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCertItems(Array.isArray(data.items) ? data.items : []))
      .catch(() => setCertItems([]));
  }, []);

  return (
    <div className="py-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {certItems.map((item, index) => {
                const label = certTitleForLang(item.title, i18n.language || 'zh');
                return (
                  <motion.article
                    key={`${item.image}-${index}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
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
          )}
        </div>
      </section>

      {/* Founder Message */}
      <section
        className="relative py-20 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/containers.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-sm">
            {t('about.founderTitle')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
              className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-xl border border-white/20"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{t('about.founder.name')}</h3>
                <p className="text-gray-600">{t('about.founder.position')}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.motivation')}</h4>
                  <p className="text-gray-700 leading-relaxed">{t('about.founder.motivationContent')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.journey')}</h4>
                  <p className="text-gray-700 leading-relaxed">{t('about.founder.journeyContent')}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.vision')}</h4>
                  <p className="text-gray-700 leading-relaxed">{t('about.founder.visionContent')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('about.teamTitle')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg mb-6">{t('about.team.intro')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  { title: t('about.team.youth'), description: t('about.team.youthDesc'), icon: '👥' },
                  { title: t('about.team.quality'), description: t('about.team.qualityDesc'), icon: '🎓' },
                  { title: t('about.team.professional'), description: t('about.team.professionalDesc'), icon: '⚡' },
                ].map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
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

            {/* 世界地图 —— 保留图片动画 */}
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
              {t('about.partners.list', { returnObjects: true }).map((partner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="font-semibold">{partner}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('about.products.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: t('about.products.container'), description: t('about.products.containerDesc'), icon: '🏭' },
              { title: t('about.products.pipe'), description: t('about.products.pipeDesc'), icon: '🔧' },
              { title: t('about.products.heatExchanger'), description: t('about.products.heatExchangerDesc'), icon: '🔄' },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

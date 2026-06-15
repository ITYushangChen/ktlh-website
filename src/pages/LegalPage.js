import React from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';

/**
 * @param {'siteStatement' | 'privacy'} pageKey
 */
const LegalPage = ({ pageKey }) => {
  const { t } = useTranslation();
  const title = t(`legal.${pageKey}.title`);
  const seoKey = pageKey === 'siteStatement' ? 'terms' : 'privacy';
  const path = pageKey === 'siteStatement' ? '/terms' : '/privacy';
  const updated = t(`legal.${pageKey}.updated`);
  const raw = t(`legal.${pageKey}.sections`, { returnObjects: true });
  const sections = Array.isArray(raw) ? raw : [];

  return (
    <div className="py-16 bg-gray-50 min-h-[60vh]">
      <Seo
        title={t(`seo.${seoKey}.title`)}
        description={t(`seo.${seoKey}.description`)}
        path={path}
      />
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-10">{updated}</p>
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
          {sections.map((section, i) => (
            <section key={i} className="mb-10 last:mb-0">
              <h2 className="text-lg font-semibold text-[#086c7b] mb-3">{section.heading}</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

export default LegalPage;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import translationZH from './locales/zh/translation.json';
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';
import legalZH from './locales/zh/legal.json';
import legalEN from './locales/en/legal.json';
import legalJA from './locales/ja/legal.json';

const resources = {
  en: {
    translation: {
      ...translationEN,
      legal: legalEN,
    },
  },
  zh: {
    translation: {
      ...translationZH,
      legal: legalZH,
    },
  },
  ja: {
    translation: {
      ...translationJA,
      legal: legalJA,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n; 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import translationZH from './locales/zh/translation.json';
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';

const resources = {
  zh: {
    translation: translationZH
  },
  en: {
    translation: translationEN
  },
  ja: {
    translation: translationJA
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 
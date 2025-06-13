import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => changeLanguage('zh')}
          className={`px-2 py-1 rounded ${
            i18n.language === 'zh'
              ? 'bg-[#086c7b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 rounded ${
            i18n.language === 'en'
              ? 'bg-[#086c7b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('ja')}
          className={`px-2 py-1 rounded ${
            i18n.language === 'ja'
              ? 'bg-[#086c7b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          日本語
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 
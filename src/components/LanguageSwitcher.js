import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: 'CN' },
  { code: 'ja', label: 'JP' },
];

const isActiveLang = (current, code) => {
  if (!current) return false;
  if (current === code) return true;
  return current.startsWith(`${code}-`) || current.startsWith(`${code}_`);
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const resolved = i18n.resolvedLanguage || i18n.language || 'en';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className="group inline-flex rounded-full overflow-hidden bg-white shadow-sm border border-[#4da3b5] hover:border-[#086c7b] transition-colors duration-200"
      role="group"
      aria-label="Language"
    >
      {LANGS.map(({ code, label }, index) => {
        const active = isActiveLang(resolved, code);
        return (
          <button
            key={code}
            type="button"
            onClick={() => changeLanguage(code)}
            className={[
              'px-2.5 sm:px-3 py-1 min-w-[2.25rem] text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-colors duration-200',
              'focus:outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#086c7b]',
              index > 0 ? 'border-l border-[#4da3b5] group-hover:border-[#086c7b]' : '',
              active
                ? 'bg-[#4da3b5] text-white group-hover:bg-[#086c7b]'
                : 'bg-white text-[#4da3b5] group-hover:text-[#086c7b]',
            ].join(' ')}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;

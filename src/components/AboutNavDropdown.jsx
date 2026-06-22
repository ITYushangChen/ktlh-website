import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ABOUT_NAV_SECTIONS } from '../constants/aboutNavSections';

/**
 * 桌面端 About 下拉：跳转到 About 页各板块锚点
 */
export default function AboutNavDropdown({ isOpen, onClose, currentPath, currentHash }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="min-w-[min(100vw-2rem,16rem)] border-t border-gray-100 bg-white shadow-lg rounded-b-lg overflow-hidden"
      role="menu"
      aria-label={t('nav.about')}
    >
      <ul className="py-2">
        {ABOUT_NAV_SECTIONS.map((section) => {
          const hash = `#${section.id}`;
          const isCurrent = currentPath === '/about' && currentHash === section.id;
          return (
            <li key={section.id}>
              <Link
                to={`/about${hash}`}
                role="menuitem"
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  isCurrent
                    ? 'bg-[#086c7b]/10 text-[#086c7b] font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#086c7b]'
                }`}
                onClick={onClose}
              >
                {t(section.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

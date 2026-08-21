import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

const FloatingContactButton = () => {
  const { t } = useTranslation();

  return (
    <Link
      to="/contact"
      className="group fixed bottom-28 right-6 z-50 flex items-center rounded-l-full bg-white text-[#123a63] shadow-lg shadow-black/10 transition-colors duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123a63] focus-visible:ring-offset-2"
      aria-label={t('footer.floatingMessage')}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0 rounded-l-full bg-gradient-to-r from-[#081c34] to-[#0a2f52] transition-all duration-500 group-hover:w-full"
      />
      <span className="relative z-10 max-w-0 overflow-hidden whitespace-nowrap opacity-0 -translate-x-3 transition-all duration-300 group-hover:max-w-[12rem] group-hover:opacity-100 group-hover:translate-x-0">
        <span className="pl-5 text-sm font-medium">{t('footer.floatingMessage')}</span>
      </span>
      <span className="relative z-10 p-3.5">
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden />
      </span>
    </Link>
  );
};

export default FloatingContactButton;

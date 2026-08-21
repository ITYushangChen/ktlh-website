import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** 全局"返回顶部"浮动按钮：滚动超过 300px 显示，点击平滑回到顶部 */
const BackToTopButton = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('products.backToTop')}
      title={t('products.backToTop')}
      className={`md:hidden fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#086c7b] text-white shadow-lg shadow-black/15 transition-all duration-300 hover:bg-[#065a66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'pointer-events-none opacity-0 translate-y-3'
      }`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTopButton;

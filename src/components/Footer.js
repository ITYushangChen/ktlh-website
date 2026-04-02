import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [activeQR, setActiveQR] = useState(null);

  const topNavLinks = [
    { to: '/contact', labelKey: 'footer.topNav.contact' },
    { to: '/terms', labelKey: 'footer.topNav.siteStatement' },
    { to: '/privacy', labelKey: 'footer.topNav.privacy' },
    { to: '/terms#disclaimer', labelKey: 'footer.topNav.disclaimer' },
    { to: '/careers', labelKey: 'footer.topNav.careers' },
  ];

  const socialMedia = [
    {
      nameKey: 'wechat',
      name: t('footer.social.wechat'),
      icon: (
        <img
          src="/images/wechat-logo-svgrepo-com.svg"
          alt=""
          className="h-6 w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          width={24}
          height={24}
          aria-hidden
        />
      ),
      qrCode: '/images/qr-wechat.png',
    },
    {
      nameKey: 'xiaohongshu',
      name: t('footer.social.xiaohongshu'),
      icon: (
        <img
          src="/images/xiaohongshu-vector-logo-seeklogo/xiaohongshu-seeklogo.svg"
          alt=""
          className="h-6 w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          width={24}
          height={24}
          aria-hidden
        />
      ),
      qrCode: '/images/qr-xiaohongshu.png',
    },
    {
      nameKey: 'instagram',
      name: t('footer.social.instagram'),
      icon: (
        <img
          src="/images/500px-Instagram_logo_2022.svg.png"
          alt=""
          className="h-6 w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          width={24}
          height={24}
          aria-hidden
        />
      ),
      qrCode: '/images/qr-instagram.png',
      href: process.env.REACT_APP_INSTAGRAM_URL || 'https://www.instagram.com/',
    },
    {
      nameKey: 'facebook',
      name: t('footer.social.facebook'),
      icon: (
        <img
          src="/images/500px-2023_Facebook_icon.svg.png"
          alt=""
          className="h-6 w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          width={24}
          height={24}
          aria-hidden
        />
      ),
      qrCode: '/images/qr-facebook.png',
      href: process.env.REACT_APP_FACEBOOK_URL || 'https://www.facebook.com/',
    },
  ];

  const icp = t('footer.icpRecord');
  const psb = t('footer.publicSecurityRecord');
  const hasIcp = icp && icp.trim().length > 0;
  const hasPsb = psb && psb.trim().length > 0;

  const linkClass =
    'text-sm text-gray-500 hover:text-[#086c7b] transition-colors duration-200 focus:outline-none focus-visible:underline';

  const qrTriggerClass =
    'group text-gray-500 hover:text-[#086c7b] transition-colors duration-200 focus:outline-none flex items-center justify-center rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f5]';

  return (
    <footer className="bg-[#f5f5f5] text-gray-600 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 上排：品牌 + 快捷链接 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-8 border-b border-gray-200/90">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 rounded-md"
          >
            <img
              src="/images/logo.png"
              alt={t('footer.companyName')}
              className="h-9 w-auto"
              width={120}
              height={36}
            />
            <span className="text-lg sm:text-xl font-bold text-[#086c7b] tracking-tight">
              {t('footer.companyName')}
            </span>
          </Link>

          <nav
            className="flex flex-wrap items-center gap-y-2 gap-x-0 text-sm"
            aria-label="Footer"
          >
            {topNavLinks.map((item, index) => (
              <span key={`${item.to}-${item.labelKey}`} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 sm:mx-3 text-gray-300 select-none" aria-hidden>
                    |
                  </span>
                )}
                <Link to={item.to} className={linkClass}>
                  {t(item.labelKey)}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* 下排：联系与版权 | 社交 */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 py-8 lg:py-10">
          <div className="space-y-3 max-w-3xl text-xs sm:text-sm text-gray-500 leading-relaxed">
            <p>
              {t('footer.sections.contact.address')}　{t('footer.sections.contact.phone')}　
              {t('footer.sections.contact.email')}
            </p>
            <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed">
              © {currentYear} {t('footer.companyLegalName')} {t('footer.copyright')}
              {hasIcp && (
                <>
                  {' '}
                  <span className="text-gray-300">|</span> {icp}
                </>
              )}
              {hasPsb && (
                <>
                  {' '}
                  <span className="text-gray-300">|</span> {psb}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 lg:pb-0.5">
            {socialMedia.map((social) => {
              const qrHandlers = social.qrCode
                ? {
                    onMouseEnter: () => setActiveQR(social.nameKey),
                    onMouseLeave: () => setActiveQR(null),
                  }
                : {};

              return (
                <div key={social.nameKey} className="relative">
                  {social.href ? (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={qrTriggerClass}
                      aria-label={social.name}
                      {...qrHandlers}
                    >
                      <span className="sr-only">{social.name}</span>
                      {social.icon}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={qrTriggerClass}
                      aria-label={social.name}
                      {...qrHandlers}
                    >
                      <span className="sr-only">{social.name}</span>
                      {social.icon}
                    </button>
                  )}
                  {activeQR === social.nameKey && social.qrCode && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white rounded-lg shadow-xl z-50 border border-gray-100"
                      style={{
                        minWidth: '160px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      }}
                    >
                      <img
                        src={social.qrCode}
                        alt={`${social.name} ${t('footer.social.qrSuffix')}`}
                        className="w-40 h-40 object-contain rounded"
                        style={{ maxWidth: 'none' }}
                      />
                      <div className="text-center text-xs text-gray-700 mt-2 font-medium">
                        {social.name} {t('footer.social.qrSuffix')}
                      </div>
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white drop-shadow-sm"
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

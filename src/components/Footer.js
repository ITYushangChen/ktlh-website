import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ABOUT_NAV_SECTIONS } from '../constants/aboutNavSections';
import { buildProductGroups, glField } from '../utils/productsCatalog';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [activeQR, setActiveQR] = useState(null);
  const [productGroups, setProductGroups] = useState([]);

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setProductGroups(buildProductGroups(data, i18n.language)))
      .catch(() => setProductGroups([]));
  }, [i18n.language]);

  const gl = (field) => glField(field, i18n.language);

  const socialMedia = [
    {
      nameKey: 'instagram',
      name: t('footer.social.instagram'),
      icon: (
        <img
          src="/images/app/500px-Instagram_logo_2022.svg.png"
          alt=""
          className="h-5 w-5 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          width={20}
          height={20}
          aria-hidden
        />
      ),
      qrCode: '/images/qr/instagram.png',
      href: process.env.REACT_APP_INSTAGRAM_URL || 'https://www.instagram.com/',
    },
    {
      nameKey: 'facebook',
      name: t('footer.social.facebook'),
      icon: (
        <img
          src="/images/app/500px-2023_Facebook_icon.svg.png"
          alt=""
          className="h-5 w-5 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          width={20}
          height={20}
          aria-hidden
        />
      ),
      qrCode: '/images/qr/facebook.png',
      href: process.env.REACT_APP_FACEBOOK_URL || 'https://www.facebook.com/',
    },
    {
      nameKey: 'tiktok',
      name: t('footer.social.tiktok'),
      icon: (
        <img
          src="/images/app/tiktok-svgrepo-com.svg"
          alt=""
          className="h-5 w-5 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          width={20}
          height={20}
          aria-hidden
        />
      ),
      qrCode: '/images/qr/tiktok.png',
      href: process.env.REACT_APP_TIKTOK_URL || 'https://www.tiktok.com/',
    },
    {
      nameKey: 'whatsapp',
      name: t('footer.social.whatsapp'),
      icon: (
        <img
          src="/images/app/whatsapp-svgrepo-com.svg"
          alt=""
          className="h-5 w-5 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          width={20}
          height={20}
          aria-hidden
        />
      ),
      qrCode: '/images/qr/whatsapp.png',
      href: process.env.REACT_APP_WHATSAPP_URL || 'https://wa.me/',
    },
  ];

  const icp = t('footer.icpRecord');
  const psb = t('footer.publicSecurityRecord');
  const hasIcp = icp && icp.trim().length > 0;
  const hasPsb = psb && psb.trim().length > 0;

  const linkClass =
    'text-lg text-white/85 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:underline';

  const headingClass =
    'text-2xl font-semibold text-[#123a63] hover:text-[#0a2a4a] transition-colors duration-200 focus:outline-none focus-visible:underline';

  const qrTriggerClass =
    'group flex items-center justify-center rounded-full p-2.5 bg-white/10 text-white hover:bg-white/25 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  const socialLinks = (
    <div className="flex items-center gap-2.5">
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
  );

  return (
    <footer className="text-white">
      <div className="w-full bg-[#086c7b] text-white">
        <div className="mx-auto w-[calc(100vw_-_1.5rem)] xl:w-[1280px] xl:max-w-[calc(100vw_-_1.5rem)] px-4 sm:px-8 py-12 md:py-24 min-h-[432px] md:min-h-[720px] flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-[1.8rem] lg:gap-8">
            {/* 四列等宽 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.8rem] lg:gap-10 flex-1">
              {/* 第1列：品牌（左移）+ 联系方式 + 社交 */}
              <div className="min-w-0 lg:-ml-[62px]">
                <Link
                  to="/"
                  className="inline-block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={t('footer.companyName')}
                >
                  <span className="text-white text-3xl md:text-4xl font-bold tracking-wide leading-tight">
                    {t('footer.companyName')}
                  </span>
                </Link>
                <div className="mt-2 text-sm text-white/70 tracking-[0.2em] uppercase">
                  Kaituo Longhai
                </div>

                {/* 联系方式：图标 + 文字 */}
                <ul className="mt-[1.2rem] md:mt-8 space-y-[0.45rem] md:space-y-3 text-lg text-white/95">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-white/70" aria-hidden />
                    <span className="leading-relaxed">{t('contact.info.addressContent')}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 shrink-0 text-white/70" aria-hidden />
                    <span>{t('contact.info.phoneContent')}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 shrink-0 text-white/70" aria-hidden />
                    <span>{t('contact.info.emailContent')}</span>
                  </li>
                </ul>

                {/* 社交媒体联系方式 */}
                <div className="mt-[1.2rem] md:mt-8">{socialLinks}</div>
              </div>

              {/* 第2列：关于我们 */}
              <div className="hidden md:block min-w-0">
                <Link to="/about" className={headingClass}>
                  {t('nav.about')}
                </Link>
                <ul className="mt-[0.9rem] md:mt-6 space-y-[0.45rem] md:space-y-3">
                  {ABOUT_NAV_SECTIONS.map((section) => (
                    <li key={section.id}>
                      <Link to={`/about#${section.id}`} className={linkClass}>
                        {t(section.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 第3列：产品中心 */}
              <div className="hidden md:block min-w-0">
                <Link to="/products" className={headingClass}>
                  {t('nav.products')}
                </Link>
                {productGroups.length > 0 && (
                  <ul className="mt-[0.9rem] md:mt-6 space-y-[0.45rem] md:space-y-3">
                    {productGroups.map((group) => (
                      <li key={group.id}>
                        <Link
                          to={group.categories[0]?.link || '/products'}
                          className={linkClass}
                        >
                          {gl(group.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 第4列：公司地址 + 联系我们 + 法律信息 */}
              <div className="hidden md:block min-w-0">
                <span className={headingClass}>{t('contact.info.addressTitle')}</span>
                <p className="mt-[0.9rem] md:mt-6 text-lg text-white/95 leading-relaxed">
                  {t('contact.info.addressContent')}
                </p>
                <div className="mt-6 md:mt-10 space-y-[0.45rem] md:space-y-3">
                  <div>
                    <Link to="/contact" className={linkClass}>
                      {t('nav.contact')}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link to="/terms" className={linkClass}>
                      {t('footer.topNav.siteStatement')}
                    </Link>
                    <span className="text-white/40" aria-hidden>|</span>
                    <Link to="/privacy" className={linkClass}>
                      {t('footer.topNav.privacy')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 最右侧：圆形联系我们按钮 */}
            <div className="hidden md:flex shrink-0 justify-center lg:justify-end lg:items-start lg:translate-x-8">
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden border-2 border-white bg-white text-[#086c7b] rounded-full h-32 w-32 text-xl font-semibold leading-snug text-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-[#081c34] to-[#0a2f52] w-0 group-hover:w-full transition-all duration-500"
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {t('nav.contact')}
                </span>
              </Link>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="mt-auto pt-[1.2rem] md:pt-8 border-t border-white/15 text-center">
            <p className="text-base text-white/75 leading-relaxed">
              © {currentYear} {t('footer.companyLegalName')} {t('footer.copyright')}
              {hasIcp && (
                <>
                  {' '}
                  <span className="text-white/40">|</span> {icp}
                </>
              )}
              {hasPsb && (
                <>
                  {' '}
                  <span className="text-white/40">|</span> {psb}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

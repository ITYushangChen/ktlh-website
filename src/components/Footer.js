import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [activeQR, setActiveQR] = useState(null);

  const footerSections = [
    {
      key: 'about',
      title: t('footer.sections.about.title'),
      links: [
        { path: '/about', label: t('footer.sections.about.links.companyProfile') },
        { path: '/contact', label: t('footer.sections.about.links.contact') },
      ],
    },
    {
      key: 'products',
      title: t('footer.sections.products.title'),
      links: [
        { path: '/products', label: t('footer.sections.products.links.overview') },
        { path: '/products/solutions', label: t('footer.sections.products.links.solutions') },
        { path: '/products/highlights', label: t('footer.sections.products.links.highlights') },
      ],
    },
    {
      key: 'legal',
      title: t('footer.sections.legal.title'),
      links: [
        { path: '/privacy', label: t('footer.sections.legal.links.privacy') },
        { path: '/terms', label: t('footer.sections.legal.links.terms') },
      ],
    },
  ];

  const socialMedia = [
    {
      nameKey: 'wechat',
      name: t('footer.social.wechat'),
      icon: (
        <img
          src="/images/wechat-logo-svgrepo-com.svg"
          alt=""
          className="h-7 w-7 object-contain"
          width={28}
          height={28}
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
          className="h-7 w-7 object-contain"
          width={28}
          height={28}
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
          className="h-7 w-7 object-contain"
          width={28}
          height={28}
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
          className="h-7 w-7 object-contain"
          width={28}
          height={28}
          aria-hidden
        />
      ),
      qrCode: '/images/qr-facebook.png',
      href: process.env.REACT_APP_FACEBOOK_URL || 'https://www.facebook.com/',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#086c7b]">{t('footer.companyName')}</h3>
            <p className="text-gray-400">{t('footer.companyDesc')}</p>
          </div>

          {/* Footer Link Sections */}
          {footerSections.map((section) => (
            <div key={section.key}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-[#086c7b] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.sections.contact.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('footer.sections.contact.address')}</li>
              <li>{t('footer.sections.contact.phone')}</li>
              <li>{t('footer.sections.contact.email')}</li>
            </ul>
            <div className="mt-6 pt-5 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-3">{t('footer.sections.contact.socialTitle')}</p>
              <div className="flex items-center gap-5">
                {socialMedia.map((social) => {
                  const triggerClass =
                    'text-gray-400 hover:text-[#086c7b] transition-colors duration-200 focus:outline-none flex items-center justify-center rounded-lg hover:bg-gray-800/50 p-1';
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
                          className={`${triggerClass} focus-visible:ring-2 focus-visible:ring-[#086c7b]`}
                          aria-label={social.name}
                          {...qrHandlers}
                        >
                          <span className="sr-only">{social.name}</span>
                          {social.icon}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={triggerClass}
                          aria-label={social.name}
                          {...qrHandlers}
                        >
                          <span className="sr-only">{social.name}</span>
                          {social.icon}
                        </button>
                      )}
                      {activeQR === social.nameKey && social.qrCode && (
                        <div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 p-3 bg-white rounded-lg shadow-xl z-50"
                          style={{
                            minWidth: '160px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                          }}
                        >
                          <img
                            src={social.qrCode}
                            alt={`${social.name} ${t('footer.social.qrSuffix')}`}
                            className="w-40 h-40 object-contain rounded"
                            style={{ maxWidth: 'none' }}
                          />
                          <div className="text-center text-sm text-gray-800 mt-2 font-medium">
                            {social.name} {t('footer.social.qrSuffix')}
                          </div>
                          <div
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '8px solid transparent',
                              borderRight: '8px solid transparent',
                              borderTop: '8px solid white',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} 青岛开拓隆海智控有限公司 {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-[#086c7b] text-sm">
                {t('footer.bottomLinks.privacy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[#086c7b] text-sm">
                {t('footer.bottomLinks.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

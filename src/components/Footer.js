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
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.328.328 0 00.168-.054l1.903-1.113a.864.864 0 01.718-.098 10.16 10.16 0 001.372.471c-.149-.464-.232-.95-.232-1.455 0-2.322 2.226-4.205 4.97-4.205.274 0 .543.02.807.058-.95-2.904-4.17-5.05-8.064-5.05zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm6.6 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm2.332 2.238c-2.322 0-4.97 1.882-4.97 4.205 0 2.324 2.648 4.206 4.97 4.206.403 0 .79-.048 1.162-.137a.59.59 0 01.665.213l1.113 1.903c.054.098.13.168.213.168.163 0 .295-.13.295-.29 0-.072-.03-.142-.048-.213l-.39-1.48a.59.59 0 01.213-.665c1.832-1.347 3.002-3.338 3.002-5.55 0-2.323-2.648-4.205-4.97-4.205zm.807 2.238c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm-4.97 1.18c0-.651.52-1.18 1.162-1.18.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178z"/>
        </svg>
      ),
      qrCode: '/images/qr-wechat.png',
    },
    {
      nameKey: 'xiaohongshu',
      name: t('footer.social.xiaohongshu'),
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      ),
      qrCode: '/images/qr-xiaohongshu.png',
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
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <div key={social.nameKey} className="relative group">
                  <button
                    className="text-gray-400 hover:text-[#086c7b] transition-colors duration-200 focus:outline-none"
                    onMouseEnter={() => setActiveQR(social.nameKey)}
                    onMouseLeave={() => setActiveQR(null)}
                    aria-label={social.name}
                  >
                    <span className="sr-only">{social.name}</span>
                    {social.icon}
                  </button>
                  {activeQR === social.nameKey && (
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
              ))}
            </div>
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

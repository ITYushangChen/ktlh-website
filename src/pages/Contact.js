import React, { useMemo, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';

/** 与文案中的公司地址一致；也可用 REACT_APP_GOOGLE_MAPS_QUERY 覆盖 */
const DEFAULT_MAP_QUERY = '青岛市胶州上合示范区';

/** 默认 Google 嵌入图（胶州上合示范区）；可用 REACT_APP_GOOGLE_MAPS_EMBED_SRC 覆盖 */
const DEFAULT_GOOGLE_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3221.6715530291162!2d120.05987653409888!3d36.15020967351968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDA5JzAwLjgiTiAxMjDCsDAzJzQ0LjYiRQ!5e0!3m2!1szh-CN!2sus!4v1775113511206!5m2!1szh-CN!2sus';

/** 与嵌入图同一点位，用于「在 Google 地图中打开」 */
const DEFAULT_GOOGLE_MAP_OPEN_URL =
  'https://www.google.com/maps/search/?api=1&query=36.15020967351968%2C120.05987653409888';

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [sending, setSending] = useState(false);

  const mapPlaceQuery = (process.env.REACT_APP_GOOGLE_MAPS_QUERY || DEFAULT_MAP_QUERY).trim();
  const mapEmbedSrc = useMemo(() => {
    const custom = process.env.REACT_APP_GOOGLE_MAPS_EMBED_SRC?.trim();
    if (custom) return custom;
    return DEFAULT_GOOGLE_EMBED_SRC;
  }, []);

  const mapOpenUrl = useMemo(() => {
    const custom = process.env.REACT_APP_GOOGLE_MAPS_OPEN_URL?.trim();
    if (custom) return custom;
    return DEFAULT_GOOGLE_MAP_OPEN_URL;
  }, []);

  const mapAppleUrl = useMemo(() => {
    const q = encodeURIComponent(mapPlaceQuery);
    return `https://maps.apple.com/?q=${q}`;
  }, [mapPlaceQuery]);

  const defaultMapTab =
    (process.env.REACT_APP_CONTACT_DEFAULT_MAP || 'google').toLowerCase() === 'apple'
      ? 'apple'
      : 'google';
  const [mapTab, setMapTab] = useState(defaultMapTab);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);

    // 1. 用Formspree提交表单
    const formData = new FormData(formRef.current);
    fetch('https://formspree.io/f/xjkrwloz', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        // 2. 用EmailJS自动回复
        emailjs.send(
          'service_ugav5f1',
          'template_7nh0wql',
          {
            email: formData.get('email'),
            name: formData.get('name'),
            title: formData.get('subject'),
            message: formData.get('message')
          },
          'iRWJfHVzqfCoNK1s-'
        );
        setSending(false);
        setSuccess(true);
        formRef.current.reset();
      })
      .catch((err) => {
        setSending(false);
        setError('发送失败，请稍后再试');
        // console.error('Formspree error:', err);
      });
  };

  const contactInfo = [
    {
      title: t('contact.info.addressTitle'),
      content: t('contact.info.addressContent'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: t('contact.info.phoneTitle'),
      content: t('contact.info.phoneContent'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      title: t('contact.info.emailTitle'),
      content: t('contact.info.emailContent'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">{t('contact.formTitle')}</h2>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.subject')}</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.message')}</label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder={t('contact.form.messagePlaceholder')}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#086c7b] text-white px-6 py-3 rounded-md hover:bg-[#065a67] transition-colors duration-300"
                  disabled={sending}
                >
                  {sending ? t('contact.form.sending') : t('contact.form.send')}
                </button>
                {success && <p className="text-green-600 mt-2">{t('contact.form.success')}</p>}
                {error && <p className="text-red-600 mt-2">{t('contact.form.error')}</p>}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">{t('contact.infoTitle')}</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#086c7b] mr-4">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">{t('contact.companyInfoTitle')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t('contact.companyInfo.nameTitle')}</h3>
                    <p className="text-gray-600">{t('contact.companyInfo.name')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('contact.companyInfo.foundedTitle')}</h3>
                    <p className="text-gray-600">{t('contact.companyInfo.founded')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('contact.companyInfo.capitalTitle')}</h3>
                    <p className="text-gray-600">{t('contact.companyInfo.capital')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('contact.companyInfo.scopeTitle')}</h3>
                    <p className="text-gray-600">{t('contact.companyInfo.scope')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('contact.locationTitle')}</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-center text-sm text-gray-500 mb-4">{t('contact.mapsChooseHint')}</p>
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setMapTab('apple')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    mapTab === 'apple'
                      ? 'bg-[#086c7b] text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('contact.mapTabApple')}
                </button>
                <button
                  type="button"
                  onClick={() => setMapTab('google')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    mapTab === 'google'
                      ? 'bg-[#086c7b] text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('contact.mapTabGoogle')}
                </button>
              </div>

              {mapTab === 'apple' ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 min-h-[24rem] flex flex-col items-center justify-center px-6 py-10 text-center">
                  <p className="text-gray-800 font-medium text-lg mb-2">{mapPlaceQuery}</p>
                  <p className="text-sm text-gray-500 mb-6 max-w-md">{t('contact.appleMapsPanelHint')}</p>
                  <a
                    href={mapAppleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#086c7b] text-white font-medium hover:bg-[#065a67] transition-colors"
                  >
                    {t('contact.openInAppleMaps')}
                  </a>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-lg bg-gray-100">
                    <iframe
                      title={t('contact.mapTabGoogle')}
                      src={mapEmbedSrc}
                      className="w-full h-[450px] max-h-[min(450px,70vh)] border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-center mt-4 text-sm text-gray-600">
                    <a
                      href={mapOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#086c7b] hover:text-[#065a67] font-medium underline-offset-2 hover:underline"
                    >
                      {t('contact.openInGoogleMaps')}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
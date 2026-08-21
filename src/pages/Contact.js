import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { contactFormErrorMessage, submitContactForm } from '../utils/contactForm';

/** 默认 Google 嵌入图（胶州上合示范区湘江路）；可用 REACT_APP_GOOGLE_MAPS_EMBED_SRC 覆盖 */
const DEFAULT_GOOGLE_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3221.6715530291162!2d120.05987653409888!3d36.15020967351968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDA5JzAwLjgiTiAxMjDCsDAzJzQ0LjYiRQ!5e0!3m2!1szh-CN!2sus!4v1775113511206!5m2!1szh-CN!2sus';

/** 与嵌入图同一点位，用于「在 Google 地图中打开」 */
const DEFAULT_GOOGLE_MAP_OPEN_URL =
  'https://www.google.com/maps/search/?api=1&query=36.15020967351968%2C120.05987653409888';

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [sending, setSending] = useState(false);

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

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(formRef.current);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const gotcha = String(formData.get('_gotcha') || '').trim();

    if (gotcha) {
      setSuccess(true);
      formRef.current?.reset();
      setSending(false);
      return;
    }

    try {
      const { ok, data } = await submitContactForm({ name, email, subject, message });

      if (!ok) {
        throw new Error(contactFormErrorMessage(data, t('contact.form.error')));
      }

      setSuccess(true);
      formRef.current?.reset();
    } catch (err) {
      const fallback = t('contact.form.error');
      if (err instanceof TypeError && /fetch/i.test(err.message)) {
        setError(fallback);
      } else {
        setError(err instanceof Error && err.message ? err.message : fallback);
      }
    } finally {
      setSending(false);
    }
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
    <div className="contact-page-in pt-0 pb-16 md:pt-16 md:pb-24">
      <Seo
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
        path="/contact"
      />
      {/* Hero Section */}
      <section className="pt-[10px] md:pt-10 pb-4 md:pb-20">
        <div className="container mx-auto px-4">
          <h1 className="contact-title-in text-3xl md:text-6xl font-bold text-center mb-2 md:mb-6 text-[#123a63]">
            {t('contact.title')}
          </h1>
          <p className="contact-title-in text-base md:text-xl text-gray-500 text-center max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* 左右分栏：左联系方式 / 右可输入表单 */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 max-w-7xl mx-auto">
            {/* 左侧：联系方式 */}
            <div className="contact-left-in space-y-12 order-2 lg:order-1">
              <div className="bg-white p-10 md:p-12 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-[#123a63]">{t('contact.infoTitle')}</h2>
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-5">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#086c7b]/10 text-[#086c7b] flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 md:p-12 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-[#123a63]">{t('contact.companyInfoTitle')}</h2>
                <div className="space-y-6">
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

            {/* 右侧：可输入表单 */}
            <div className="contact-right-in bg-white p-5 md:p-12 rounded-3xl shadow-lg border border-gray-100 order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-[#123a63]">{t('contact.formTitle')}</h2>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-7"
              >
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none h-0 w-0"
                  aria-hidden="true"
                />
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-[#086c7b] focus:border-[#086c7b]"
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
                    className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-[#086c7b] focus:border-[#086c7b]"
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
                    className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-[#086c7b] focus:border-[#086c7b]"
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
                    className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder={t('contact.form.messagePlaceholder')}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative w-full overflow-hidden rounded-full bg-[#086c7b] px-8 py-3.5 md:py-4 text-white text-base md:text-lg font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-[#123a63] to-[#081c34] transition-all duration-500 group-hover:w-full"
                  />
                  <span className="relative z-10">
                    {sending ? t('contact.form.sending') : t('contact.form.send')}
                  </span>
                </button>
                {success && <p className="text-green-600 mt-2">{t('contact.form.success')}</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section — Google Maps 全宽嵌入 */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 pt-12 pb-6">
          <h2 className="text-3xl font-bold text-center">{t('contact.locationTitle')}</h2>
        </div>
        <div className="w-full">
          <iframe
            title={t('contact.mapTabGoogle')}
            src={mapEmbedSrc}
            className="block w-full max-w-full h-[320px] md:h-[min(85vh,820px)] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="container mx-auto px-4 py-4 text-center">
          <a
            href={mapOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium underline-offset-2 hover:underline"
          >
            {t('contact.openInGoogleMaps')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact; 

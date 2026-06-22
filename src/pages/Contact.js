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
    <div className="py-16">
      <Seo
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
        path="/contact"
      />
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
                {error && <p className="text-red-600 mt-2">{error}</p>}
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

      {/* Map Section — Google Maps 全宽嵌入 */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 pt-12 pb-6">
          <h2 className="text-3xl font-bold text-center">{t('contact.locationTitle')}</h2>
        </div>
        <div className="w-full">
          <iframe
            title={t('contact.mapTabGoogle')}
            src={mapEmbedSrc}
            className="block w-full h-[min(85vh,820px)] border-0"
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
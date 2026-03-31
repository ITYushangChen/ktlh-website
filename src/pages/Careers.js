import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Careers = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`/content/jobs.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setJobs((data.jobs || []).filter(j => j.active !== false)))
      .catch(() => setJobs([]));
  }, []);

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[i18n.language] || field.zh || '';
  };

  const gla = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[i18n.language] || field.zh || [];
  };

  const benefits = [
    {
      category: '工作环境',
      items: ['现代化生产车间', '5.1万平方米厂区', '完善的配套设施', '安全的工作环境']
    },
    {
      category: '职业发展',
      items: ['市级企业技术中心', '校企合作研发平台', '专业培训机会', '清晰的晋升通道']
    },
    {
      category: '员工福利',
      items: ['具有竞争力的薪资', '完善的五险一金', '节日福利', '定期团建活动']
    }
  ];

  const values = [
    { title: '创新驱动', description: '持续技术创新，提升产品竞争力', icon: '💡' },
    { title: '品质至上', description: '严格的质量控制，确保产品可靠性', icon: '✨' },
    { title: '合作共赢', description: '与客户、员工共同发展，实现多方共赢', icon: '🤝' }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">
            {t('careers.title')}
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('careers.subtitle')}
          </p>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('careers.cultureTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{t(`careers.values.${index}.title`)}</h3>
                <p className="text-gray-600">{t(`careers.values.${index}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('careers.benefitsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((category, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-6 text-[#086c7b]">
                  {t(`careers.benefits.${index}.category`)}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-[#086c7b] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(`careers.benefits.${index}.items.${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('careers.jobsTitle')}
          </h2>
          <div className="max-w-5xl mx-auto space-y-8">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Job Header */}
                <div className="bg-gradient-to-r from-[#086c7b] to-[#0a7a8a] text-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{gl(job.title)}</h3>
                      <div className="flex flex-wrap gap-4 text-blue-100">
                        <span>{gl(job.department)}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{gl(job.type)}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <div className="text-2xl font-bold mb-2">{gl(job.salary)}</div>
                      <Link
                        to="/contact"
                        className="inline-block bg-white text-[#086c7b] px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
                      >
                        {t('careers.applyNow')}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Job Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Responsibilities */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        岗位职责
                      </h4>
                      <ul className="space-y-2">
                        {gla(job.responsibilities).map((responsibility, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <span className="inline-block w-2 h-2 bg-[#086c7b] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        任职要求
                      </h4>
                      <ul className="space-y-2">
                        {gla(job.requirements).map((requirement, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <svg
                              className="h-5 w-5 text-[#086c7b] mr-2 flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-[#086c7b] text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('careers.noJobTitle')}</h2>
            <p className="text-xl mb-8">{t('careers.noJobDesc')}</p>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#086c7b] px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              {t('careers.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;

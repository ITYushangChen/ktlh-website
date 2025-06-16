import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Careers = () => {
  const { t } = useTranslation();

  // 动画变体
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  const slideInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };



  const benefits = [
    {
      category: '工作环境',
      items: [
        '现代化生产车间',
        '5.1万平方米厂区',
        '完善的配套设施',
        '安全的工作环境'
      ]
    },
    {
      category: '职业发展',
      items: [
        '市级企业技术中心',
        '校企合作研发平台',
        '专业培训机会',
        '清晰的晋升通道'
      ]
    },
    {
      category: '员工福利',
      items: [
        '具有竞争力的薪资',
        '完善的五险一金',
        '节日福利',
        '定期团建活动'
      ]
    }
  ];

  const values = [
    {
      title: '创新驱动',
      description: '持续技术创新，提升产品竞争力',
      icon: '💡'
    },
    {
      title: '品质至上',
      description: '严格的质量控制，确保产品可靠性',
      icon: '✨'
    },
    {
      title: '合作共赢',
      description: '与客户、员工共同发展，实现多方共赢',
      icon: '🤝'
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <motion.section 
        className="bg-gray-50 py-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold text-center mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {t('careers.title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('careers.subtitle')}
          </motion.p>
        </div>
      </motion.section>

      {/* Company Culture */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            {t('careers.cultureTitle')}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center"
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">{t(`careers.values.${index}.title`)}</h3>
                <p className="text-gray-600">{t(`careers.values.${index}.description`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            {t('careers.benefitsTitle')}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {benefits.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                variants={slideInFromBottom}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-6 text-[#086c7b]"
                  whileHover={{ scale: 1.05 }}
                >
                  {t(`careers.benefits.${index}.category`)}
                </motion.h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.svg
                        className="h-6 w-6 text-[#086c7b] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      <span>{t(`careers.benefits.${index}.items.${idx}`)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Job Openings */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            {t('careers.jobsTitle')}
          </motion.h2>
          <motion.div 
            className="max-w-5xl mx-auto space-y-8"
            variants={staggerContainer}
          >
            {t('careers.jobs', { returnObjects: true }).map((job, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ 
                  scale: 1.01,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Job Header */}
                <div className="bg-gradient-to-r from-[#086c7b] to-[#0a7a8a] text-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.h3 
                        className="text-2xl font-bold mb-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        {job.title}
                      </motion.h3>
                      <div className="flex flex-wrap gap-4 text-blue-100">
                        <motion.span whileHover={{ scale: 1.05 }}>{job.department}</motion.span>
                        <span>•</span>
                        <motion.span whileHover={{ scale: 1.05 }}>{job.location}</motion.span>
                        <span>•</span>
                        <motion.span whileHover={{ scale: 1.05 }}>{job.type}</motion.span>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="mt-4 md:mt-0 flex flex-col items-end"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold mb-2">{job.salary}</div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/contact"
                          className="inline-block bg-white text-[#086c7b] px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
                        >
                          {t('careers.applyNow')}
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Job Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Responsibilities */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-4 flex items-center">
                        <motion.svg 
                          className="w-5 h-5 mr-2"
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </motion.svg>
                        岗位职责
                      </h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((responsibility, idx) => (
                          <motion.li 
                            key={idx}
                            className="flex items-start text-gray-700"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <motion.span 
                              className="inline-block w-2 h-2 bg-[#086c7b] rounded-full mt-2 mr-3 flex-shrink-0"
                              whileHover={{ scale: 1.5 }}
                            ></motion.span>
                            <span>{responsibility}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-4 flex items-center">
                        <motion.svg 
                          className="w-5 h-5 mr-2"
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </motion.svg>
                        任职要求
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((requirement, idx) => (
                          <motion.li 
                            key={idx}
                            className="flex items-start text-gray-700"
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: -5 }}
                          >
                            <motion.svg
                              className="h-5 w-5 text-[#086c7b] mr-2 flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                            <span>{requirement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-[#086c7b] text-white rounded-lg p-12 text-center"
            variants={scaleIn}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              {t('careers.noJobTitle')}
            </motion.h2>
            <motion.p 
              className="text-xl mb-8"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {t('careers.noJobDesc')}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-block bg-white text-[#086c7b] px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                {t('careers.contactUs')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Careers; 
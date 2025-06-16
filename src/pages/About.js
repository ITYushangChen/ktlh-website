import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();

  // 动画变体
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="py-16">
      {/* Hero Section */}
      <motion.section 
        className="bg-gray-50 py-20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold text-center mb-6"
            variants={fadeInUp}
          >
            {t('about.title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </motion.section>

      {/* Company Overview */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold mb-8"
              variants={fadeInUp}
            >
              {t('about.overviewTitle')}
            </motion.h2>
            <motion.div 
              className="prose prose-lg"
              variants={fadeInUp}
            >
              <motion.p 
                className="mb-6"
                variants={fadeInUp}
              >
                {t('about.overview.0')}
              </motion.p>
              <motion.p 
                className="mb-6"
                variants={fadeInUp}
              >
                {t('about.overview.1')}
              </motion.p>
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg mb-6"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold mb-4">{t('about.productionTitle')}</h3>
                <ul className="space-y-2">
                  <li>{t('about.production.0')}</li>
                  <li>{t('about.production.1')}</li>
                  <li>{t('about.production.2')}</li>
                  <li>{t('about.production.3')}</li>
                  <li>{t('about.production.4')}</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Founder Message */}
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
            {t('about.founderTitle')}
          </motion.h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Video Section */}
              <motion.div 
                className="order-2 lg:order-1"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-200">
                  <iframe
                    className="w-full h-auto"
                    src="//player.bilibili.com/player.html?bvid=BV1neM1zKEmE&page=1&high_quality=1&danmaku=0"
                    style={{ aspectRatio: '16/9' }}
                    frameBorder="0"
                    allowFullScreen
                    title="创始人寄语视频"
                  ></iframe>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div 
                className="order-1 lg:order-2"
                variants={staggerContainer}
              >
                <motion.div 
                  className="bg-white p-8 rounded-lg shadow-md"
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-center mb-6"
                    variants={fadeInUp}
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{t('about.founder.name')}</h3>
                    <p className="text-gray-600">{t('about.founder.position')}</p>
                  </motion.div>

                  <motion.div 
                    className="space-y-6"
                    variants={staggerContainer}
                  >
                    <motion.div variants={fadeInUp}>
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.motivation')}</h4>
                      <p className="text-gray-700 leading-relaxed">{t('about.founder.motivationContent')}</p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.journey')}</h4>
                      <p className="text-gray-700 leading-relaxed">{t('about.founder.journeyContent')}</p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <h4 className="text-lg font-semibold text-[#086c7b] mb-3">{t('about.founder.vision')}</h4>
                      <p className="text-gray-700 leading-relaxed">{t('about.founder.visionContent')}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
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
            {t('about.teamTitle')}
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              variants={scaleIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.p 
                className="text-lg mb-6"
                variants={fadeInUp}
              >
                {t('about.team.intro')}
              </motion.p>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
                variants={staggerContainer}
              >
                {[
                  {
                    title: t('about.team.youth'),
                    description: t('about.team.youthDesc'),
                    icon: '👥',
                  },
                  {
                    title: t('about.team.quality'),
                    description: t('about.team.qualityDesc'),
                    icon: '🎓',
                  },
                  {
                    title: t('about.team.professional'),
                    description: t('about.team.professionalDesc'),
                    icon: '⚡',
                  },
                ].map((value, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="text-4xl mb-4"
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {value.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Business Partners */}
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
            {t('about.partners.title')}
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.p 
              className="text-lg text-center mb-8"
              variants={fadeInUp}
            >
              {t('about.partners.desc')}
            </motion.p>
            
            {/* World Map */}
            <motion.div 
              className="mb-12"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/images/world-map-partners.png"
                alt="Global Partners Map"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerContainer}
            >
              {t('about.partners.list', { returnObjects: true }).map((partner, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold">{partner}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Products Overview */}
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
            {t('about.products.title')}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {[
              {
                title: t('about.products.container'),
                description: t('about.products.containerDesc'),
                icon: '🏭',
              },
              {
                title: t('about.products.pipe'),
                description: t('about.products.pipeDesc'),
                icon: '🔧',
              },
              {
                title: t('about.products.heatExchanger'),
                description: t('about.products.heatExchangerDesc'),
                icon: '🔄',
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {product.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About; 
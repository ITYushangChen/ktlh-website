import React from 'react';
import { Link } from 'react-router-dom';

const Highlights = () => {
  const highlights = [
    {
      title: '高精度制造工艺',
      description: '采用先进的制造设备和工艺，确保产品精度和质量达到国际标准。',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: '专业减震降噪',
      description: '阻尼块产品采用特殊材料配方，有效降低空调系统运行噪音。',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
        </svg>
      )
    },
    {
      title: '高效换热技术',
      description: '板式换热器和壳管式换热器采用创新设计，提高换热效率。',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: '优质铜材应用',
      description: '采用高品质铜材，确保管路件产品的耐用性和可靠性。',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];

  const features = [
    {
      title: '严格的质量控制',
      description: '建立完善的质量管理体系，确保产品符合国际标准'
    },
    {
      title: '稳定的供货能力',
      description: '年产能：容器320万台，铜管件5000吨，阻尼块2000吨'
    },
    {
      title: '定制化服务',
      description: '根据客户需求提供定制化产品解决方案'
    },
    {
      title: '全球供应链',
      description: '与全球知名空调企业建立长期战略合作'
    },
    {
      title: '技术创新',
      description: '市级企业技术中心，校企合作研发平台'
    },
    {
      title: '专业团队',
      description: '350余名员工，35%以上具有大学学历'
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">产品亮点</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            专注空调系统元件研发与制造，为全球知名空调企业提供优质产品
          </p>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-[#086c7b] mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">核心优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-[#086c7b]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Capacity */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">生产能力</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: '容器类',
                capacity: '320万台/年',
                description: '专业生产各类空调系统容器'
              },
              {
                title: '铜管件',
                capacity: '5000吨/年',
                description: '高品质铜材加工制造'
              },
              {
                title: '阻尼块',
                capacity: '2000吨/年',
                description: '专业减震降噪产品'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <h3 className="text-2xl font-bold mb-2 text-[#086c7b]">
                  {item.title}
                </h3>
                <div className="text-3xl font-bold mb-4">{item.capacity}</div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-[#086c7b] text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">寻找优质供应商？</h2>
            <p className="text-xl mb-8">
              我们期待与您建立长期合作关系，共同打造优质空调系统
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block bg-white text-[#086c7b] px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                联系我们
              </Link>
              <Link
                to="/products/solutions"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-[#086c7b] transition-colors duration-300"
              >
                查看解决方案
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Highlights; 
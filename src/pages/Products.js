import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const products = [
    {
      title: '容器类产品',
      description: '专业生产各类空调系统容器，年产能320万台，为空调系统提供关键组件支持。',
      features: [
        '高精度制造工艺',
        '严格的质量控制',
        '完善的检测体系',
        '稳定的供货能力'
      ],
      link: '/products/solutions'
    },
    {
      title: '管路件类产品',
      description: '包括铜管件和阻尼块等产品，铜管件年产能5000吨，阻尼块年产能2000吨。',
      features: [
        '优质铜材原料',
        '精密加工技术',
        '专业减震降噪',
        '高效节能设计'
      ],
      link: '/products/highlights'
    },
    {
      title: '换热器类产品',
      description: '专业生产板式换热器、壳管式换热器等产品，为空调系统提供高效换热解决方案。',
      features: [
        '高效换热效率',
        '紧凑型设计',
        '耐腐蚀材料',
        '易于维护保养'
      ],
      link: '/products/solutions'
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">产品中心</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            专注空调系统元件研发与制造，为全球知名空调企业提供优质产品
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-[#086c7b]">{product.title}</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-[#086c7b] mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={product.link}
                    className="inline-block bg-[#086c7b] text-white px-6 py-3 rounded-md hover:bg-[#065a67] transition-colors duration-300"
                  >
                    了解更多
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">品质保证</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: '研发实力',
                description: '市级企业技术中心，校企合作研发平台',
                icon: '🔬'
              },
              {
                title: '生产规模',
                description: '5.1万平方米厂区，4.3万平方米建筑面积',
                icon: '🏭'
              },
              {
                title: '品质认证',
                description: '严格的质量管理体系，完善的检测设备',
                icon: '✅'
              },
              {
                title: '全球合作',
                description: '产品远销日本、欧美、泰国、韩国等国家',
                icon: '🌍'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-[#086c7b] text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">寻找专业解决方案？</h2>
            <p className="text-xl mb-8">
              我们为全球知名空调企业提供优质产品，期待与您建立长期合作关系
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#086c7b] px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products; 
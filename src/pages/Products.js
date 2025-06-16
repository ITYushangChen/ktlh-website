import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();

  const productCategories = [
    {
      title: '储液器',
      description: '专业生产各类空调系统储液器，确保制冷剂的稳定供应',
      image: '/images/products/receivers.jpg',
      link: '/products/receivers',
      features: ['高效储液', '耐压设计', '多规格可选', '质量可靠']
    },
    {
      title: '气液分离器',
      description: '高效分离气液混合物，提升空调系统运行效率',
      image: '/images/products/gas-liquid-separators.jpg',
      link: '/products/gas-liquid-separators',
      features: ['高效分离', '低压降', '结构紧凑', '维护简便']
    },
    {
      title: '油分离器',
      description: '专业油分离技术，保护压缩机延长使用寿命',
      image: '/images/products/oil-separators.jpg',
      link: '/products/oil-separators',
      features: ['高效油分', '节能环保', '智能设计', '长寿命']
    },
    {
      title: '阻尼块',
      description: '专业减震降噪产品，有效降低空调系统运行噪音',
      image: '/images/products/damping-blocks.jpg',
      link: '/products/damping-blocks',
      features: ['减震降噪', '耐久性强', '安装简便', '环保材料']
    },
    {
      title: '壳管式换热器',
      description: '高效传热设备，广泛应用于各类空调制冷系统',
      image: '/images/products/shell-tube-heat-exchangers.jpg',
      link: '/products/shell-tube-heat-exchangers',
      features: ['传热高效', '结构稳定', '耐腐蚀', '易维护']
    },
    {
      title: '铜管系列',
      description: '优质铜材制造，提供各类规格的铜管产品',
      image: '/images/products/copper-tube-series.jpg',
      link: '/products/copper-tube-series',
      features: ['优质铜材', '精密加工', '规格齐全', '导热优良']
    },
    {
      title: '板式换热器',
      description: '紧凑型换热设备，高效节能的理想选择',
      image: '/images/products/plate-heat-exchangers.jpg',
      link: '/products/plate-heat-exchangers',
      features: ['紧凑设计', '换热高效', '节能环保', '维护方便']
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">{t('products.title')}</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">产品类别</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">产品特点：</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#086c7b] bg-opacity-10 text-[#086c7b] text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={category.link}
                    className="inline-flex items-center justify-center w-full bg-[#086c7b] text-white px-4 py-2 rounded-md hover:bg-[#065a66] transition-colors duration-300"
                  >
                    查看详情
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Advantages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">生产优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: '专业制造',
                description: '20年专注空调系统元件制造经验',
                icon: '🏭',
                stat: '20年+'
              },
              {
                title: '生产规模',
                description: '年产能容器320万台，铜管件5000吨',
                icon: '📊',
                stat: '320万台'
              },
              {
                title: '质量认证',
                description: 'ISO9001质量管理体系认证',
                icon: '✅',
                stat: 'ISO9001'
              },
              {
                title: '全球服务',
                description: '产品远销日本、欧美、东南亚等地',
                icon: '🌍',
                stat: '全球化'
              }
            ].map((advantage, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <div className="text-2xl font-bold text-[#086c7b] mb-2">{advantage.stat}</div>
                <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                <p className="text-gray-600 text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Capacity */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">生产能力</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">320万台</div>
                <div className="text-lg font-semibold mb-1">容器类产品</div>
                <div className="text-gray-600">年产能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">5000吨</div>
                <div className="text-lg font-semibold mb-1">铜管件</div>
                <div className="text-gray-600">年产能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#086c7b] mb-2">2000吨</div>
                <div className="text-lg font-semibold mb-1">阻尼块</div>
                <div className="text-gray-600">年产能</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                公司拥有现代化生产设备和完善的质量管理体系，确保产品质量稳定可靠
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#086c7b]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">寻找专业解决方案？</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
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
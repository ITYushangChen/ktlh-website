import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: '专业制造',
      description: '专注于空调系统元件的研发与生产，拥有20年行业经验',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: '品质保证',
      description: '通过ISO9001质量管理体系认证，产品远销海内外',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: '技术创新',
      description: '持续投入研发，拥有多项专利技术，引领行业发展',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const products = [
    {
      title: '容器类产品',
      description: '包括储液器、气液分离器等，年产能达1000万件',
      image: '/images/products/container.jpg',
      link: '/products/solutions'
    },
    {
      title: '管路件类产品',
      description: '包括铜管件、阻尼块等，年产能达2000万件',
      image: '/images/products/pipe.jpg',
      link: '/products/solutions'
    },
    {
      title: '换热器类产品',
      description: '高效换热器，满足各类空调系统需求',
      image: '/images/products/heat-exchanger.jpg',
      link: '/products/solutions'
    }
  ];

  const partners = [
    '格力', '美的', '海尔', '奥克斯', '海信', '志高', 'TCL', '长虹'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#086c7b] to-[#065a67] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              青岛开拓隆海制冷配件有限公司
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              专业空调系统元件制造商，为全球知名空调企业提供优质产品
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="bg-white text-[#086c7b] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                了解产品
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#086c7b] transition-colors duration-300"
              >
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">我们的优势</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              20年专注空调系统元件制造，以专业品质服务全球客户
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-[#086c7b] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">产品中心</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              专业生产各类空调系统元件，为全球知名空调企业提供配套服务
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <Link
                key={index}
                to={product.link}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    产品图片
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#086c7b] transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-[#086c7b] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#065a67] transition-colors duration-300"
            >
              查看更多产品
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">合作伙伴</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              与全球知名空调企业建立长期战略合作关系
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-lg font-semibold text-gray-800">{partner}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#086c7b] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">期待与您合作</h2>
            <p className="text-xl mb-8">
              我们致力于为客户提供高品质的空调系统元件，期待与您建立长期合作关系
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-[#086c7b] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                联系我们
              </Link>
              <Link
                to="/products/solutions"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#086c7b] transition-colors duration-300"
              >
                了解解决方案
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
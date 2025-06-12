import React from 'react';
import { Link } from 'react-router-dom';

const Solutions = () => {
  const solutions = [
    {
      title: '空调系统容器解决方案',
      description: '为空调系统提供各类专业容器产品，年产能320万台，满足不同规模企业的需求。',
      features: [
        '高精度制造工艺',
        '严格的质量控制体系',
        '完善的检测设备',
        '稳定的供货能力',
        '定制化生产服务'
      ],
      benefits: [
        '提高系统稳定性',
        '优化空间利用',
        '降低维护成本',
        '延长使用寿命'
      ]
    },
    {
      title: '管路件系统解决方案',
      description: '提供铜管件和阻尼块等专业产品，铜管件年产能5000吨，阻尼块年产能2000吨。',
      features: [
        '优质铜材原料',
        '精密加工技术',
        '专业减震降噪设计',
        '高效节能方案',
        '标准化生产流程'
      ],
      benefits: [
        '提升系统效率',
        '降低噪音污染',
        '减少能源消耗',
        '简化安装维护'
      ]
    },
    {
      title: '换热器系统解决方案',
      description: '专业生产板式换热器、壳管式换热器等产品，为空调系统提供高效换热解决方案。',
      features: [
        '高效换热效率',
        '紧凑型设计',
        '耐腐蚀材料',
        '易于维护保养',
        '智能温控系统'
      ],
      benefits: [
        '提高换热效率',
        '节省空间占用',
        '降低运行成本',
        '延长设备寿命'
      ]
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">解决方案</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            为全球知名空调企业提供专业的系统解决方案
          </p>
        </div>
      </section>

      {/* Solutions List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-[#086c7b]">
                    {solution.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {solution.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">核心优势</h3>
                      <ul className="space-y-3">
                        {solution.features.map((feature, idx) => (
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
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">产品效益</h3>
                      <ul className="space-y-3">
                        {solution.benefits.map((benefit, idx) => (
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{benefit}</span>
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

      {/* Quality Assurance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">品质保证</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: '研发创新',
                description: '市级企业技术中心，与山东大学、山东科技大学建立校企合作研发平台',
                icon: '🔬'
              },
              {
                title: '生产规模',
                description: '5.1万平方米厂区，4.3万平方米建筑面积，年产值计划8.8亿元',
                icon: '🏭'
              },
              {
                title: '全球合作',
                description: '与三菱电机、日立、松下等全球知名企业建立长期战略合作',
                icon: '🤝'
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
            <h2 className="text-3xl font-bold mb-4">需要专业解决方案？</h2>
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
                to="/products/highlights"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-[#086c7b] transition-colors duration-300"
              >
                查看产品亮点
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions; 
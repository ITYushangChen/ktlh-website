import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  const jobOpenings = [
    {
      title: '工艺工程师',
      department: '技术研发部',
      location: '青岛胶州',
      type: '全职',
      description: '负责空调系统元件的工艺改进和优化，提升产品质量和生产效率。要求：本科及以上学历，机械、制冷等相关专业，3年以上相关工作经验。'
    },
    {
      title: '质量工程师',
      department: '质量管理部',
      location: '青岛胶州',
      type: '全职',
      description: '负责产品质量控制体系的建立和维护，确保产品符合国际标准。要求：本科及以上学历，质量管理或相关专业，熟悉ISO9001质量管理体系。'
    },
    {
      title: '生产主管',
      department: '生产部',
      location: '青岛胶州',
      type: '全职',
      description: '负责生产线的日常管理和优化，确保生产计划按时完成。要求：大专及以上学历，5年以上制造业生产管理经验，熟悉空调配件生产工艺。'
    },
    {
      title: '销售工程师',
      department: '销售部',
      location: '青岛胶州',
      type: '全职',
      description: '负责空调系统元件的销售工作，维护客户关系。要求：本科及以上学历，机械、制冷等相关专业，有空调行业销售经验优先。'
    }
  ];

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
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">加入我们</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            加入开拓隆海，与350余名优秀同事一起，共同打造空调系统元件的未来
          </p>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">企业文化</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">员工福利</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((category, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-6 text-[#086c7b]">
                  {category.category}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{item}</span>
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
          <h2 className="text-3xl font-bold text-center mb-12">职位机会</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#086c7b] mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="mt-4 md:mt-0 inline-block bg-[#086c7b] text-white px-6 py-3 rounded-md hover:bg-[#065a67] transition-colors duration-300"
                  >
                    立即申请
                  </Link>
                </div>
                <p className="text-gray-600">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-[#086c7b] text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">没有找到合适的职位？</h2>
            <p className="text-xl mb-8">
              我们始终欢迎优秀人才的加入，请发送您的简历至我们的招聘邮箱
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

export default Careers; 
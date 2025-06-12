import React from 'react';

const About = () => {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">关于开拓隆海</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            专注空调系统元件研发与制造的高新技术企业
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">公司概况</h2>
            <div className="prose prose-lg">
              <p className="mb-6">
                青岛开拓隆海制冷配件有限公司成立于2002年3月29日。经过二十余年专注经营，现已发展成为制造空调系统元件的高科技、高附加值的高新技术企业。公司研发中心为青岛市认定的市级企业技术中心，同时与山东大学、山东科技大学成立校企合作研发平台。
              </p>
              <p className="mb-6">
                应企业的发展需求，于2021年8月16日，全资建成"青岛开拓隆海智控有限公司"。公司坐落于青岛市胶州上合示范区，厂区占地5.1万平方米，建筑面积4.3万平方米，注册资金2000万元。
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">生产能力</h3>
                <ul className="space-y-2">
                  <li>• 容器：320万台/年</li>
                  <li>• 铜管件：5000吨/年</li>
                  <li>• 阻尼块：2000吨/年</li>
                  <li>• 板换、壳管式换热器、护网等业务同步提升</li>
                  <li>• 计划年产值8.8亿元</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">人才团队</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg mb-6">
                公司有着年轻化、素质化、专业化的人才梯队。员工总人数350余人，其中大学以上学历人才占35%，行业内中高级工程师三十余人。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  {
                    title: '年轻化',
                    description: '充满活力的团队，平均年龄35岁',
                    icon: '👥',
                  },
                  {
                    title: '素质化',
                    description: '高学历人才占比35%，持续提升团队素质',
                    icon: '🎓',
                  },
                  {
                    title: '专业化',
                    description: '三十余位中高级工程师，专业领域经验丰富',
                    icon: '⚡',
                  },
                ].map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">战略合作伙伴</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-8">
              公司与国内外著名企业建立长期战略合作联盟，产品远销日本、欧美、泰国、韩国等国家。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                '三菱电机',
                '日立',
                '三菱重工',
                '松下',
                '富士通',
                '开利',
                'LG',
                '海尔',
                '海信',
                '澳柯玛',
                '长虹',
                '美的',
              ].map((partner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="font-semibold">{partner}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">核心产品</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: '容器类',
                description: '专业生产各类空调系统容器，年产能320万台',
                icon: '🏭',
              },
              {
                title: '管路件类',
                description: '铜管件年产能5000吨，阻尼块年产能2000吨',
                icon: '🔧',
              },
              {
                title: '换热器类',
                description: '板式换热器、壳管式换热器等专业产品',
                icon: '🔄',
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 
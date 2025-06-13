import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里添加表单提交逻辑
    console.log('Form submitted:', formData);
    // 重置表单
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // 显示提交成功消息
    alert('感谢您的留言，我们会尽快与您联系！');
  };

  const contactInfo = [
    {
      title: '公司地址',
      content: '青岛市胶州上合示范区',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: '联系电话',
      content: '0532-XXXXXXXX',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      title: '电子邮箱',
      content: 'contact@ktlh.com',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">联系我们</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            期待与您建立长期合作关系，共同打造优质空调系统
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">发送消息</h2>
              <form
                action="https://formspree.io/f/xjkrwloz"
                method="POST"
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">主题</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder="请输入主题"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">留言内容</label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#086c7b] focus:border-[#086c7b]"
                    placeholder="请输入您的留言内容"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">上传简历（PDF）</label>
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-400 mt-1">仅支持PDF格式，最大5MB。</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#086c7b] text-white px-6 py-3 rounded-md hover:bg-[#065a67] transition-colors duration-300"
                >
                  发送消息
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">联系方式</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#086c7b] mr-4">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">公司信息</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">公司名称</h3>
                    <p className="text-gray-600">青岛开拓隆海制冷配件有限公司</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">成立时间</h3>
                    <p className="text-gray-600">2002年3月29日</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">注册资金</h3>
                    <p className="text-gray-600">2000万元</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">经营范围</h3>
                    <p className="text-gray-600">
                      空调系统元件的研发、生产与销售，包括容器类、管路件类、换热器类等产品
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">办公时间</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">周一至周五：8:30 - 17:30</p>
                  <p className="text-gray-600">周六：8:30 - 12:00</p>
                  <p className="text-gray-600">周日：休息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">公司位置</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              {/* 这里可以嵌入地图组件，例如百度地图或高德地图 */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
                <div className="w-full h-96 flex items-center justify-center text-gray-500">
                  地图加载中...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
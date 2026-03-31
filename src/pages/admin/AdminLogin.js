import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'ktlh2024admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [form, setForm] = useState({
    password: '',
    githubToken: '',
    owner: process.env.REACT_APP_GITHUB_OWNER || '',
    repo: process.env.REACT_APP_GITHUB_REPO || '',
    branch: process.env.REACT_APP_GITHUB_BRANCH || 'main',
  });
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== ADMIN_PASSWORD) {
      setError('密码错误，请重试');
      return;
    }
    if (!form.githubToken.trim()) {
      setError('请输入 GitHub Token');
      return;
    }
    if (!form.owner.trim() || !form.repo.trim()) {
      setError('请填写 GitHub 仓库信息');
      return;
    }
    login({
      githubToken: form.githubToken.trim(),
      owner: form.owner.trim(),
      repo: form.repo.trim(),
      branch: form.branch.trim() || 'main',
    });
    navigate('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-[#086c7b] mb-1">KTLH</div>
          <div className="text-gray-500 text-sm">后台管理系统</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">管理员密码</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="请输入管理员密码"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Token
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=KTLH+Admin"
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-xs text-[#086c7b] hover:underline"
              >
                如何获取？
              </a>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                name="githubToken"
                value={form.githubToken}
                onChange={handleChange}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showToken ? '隐藏' : '显示'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">需要 repo 权限，仅在本次浏览器会话中保存</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub 用户名</label>
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                placeholder="ITYushangChen"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">仓库名</label>
              <input
                type="text"
                name="repo"
                value={form.repo}
                onChange={handleChange}
                placeholder="ktlh-website"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分支</label>
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="main"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#086c7b] hover:bg-[#065a67] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}

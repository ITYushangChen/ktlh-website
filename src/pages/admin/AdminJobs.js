import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import { translateJobContent } from '../../utils/deepseekApi';

const FILE_PATH = 'public/content/jobs.json';

const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

function emptyJob() {
  return {
    id: `job-${Date.now()}`,
    active: true,
    salary: '',
    location: '青岛胶州',
    title: { zh: '', en: '', ja: '' },
    department: { zh: '', en: '', ja: '' },
    type: { zh: '全职', en: 'Full-time', ja: '正社員' },
    responsibilities: { zh: [''], en: [''], ja: [''] },
    requirements: { zh: [''], en: [''], ja: [''] },
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function AdminJobs() {
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [jobs, setJobs] = useState([]);
  const [fileSha, setFileSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [activeLang, setActiveLang] = useState('zh');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  const loadJobs = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const { content, sha } = await fetchFileFromGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch,
        path: FILE_PATH,
      });
      setJobs(content.jobs || []);
      setFileSha(sha);
    } catch (err) {
      showToast('加载失败：' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (isLoggedIn) loadJobs();
  }, [isLoggedIn, loadJobs]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveToGitHub = async () => {
    setSaving(true);
    try {
      const result = await commitFileToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch,
        path: FILE_PATH,
        content: { jobs },
        sha: fileSha,
        message: `更新职位信息 [${new Date().toLocaleString('zh-CN')}]`,
      });
      setFileSha(result.content.sha);
      showToast('已保存到 GitHub！Vercel 将在 1-2 分钟内重新部署。', 'success');
    } catch (err) {
      showToast('保存失败：' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingJob(deepClone(jobs[index]));
    setActiveLang('zh');
    setView('edit');
  };

  const handleNewJob = () => {
    setEditingIndex(null);
    setEditingJob(emptyJob());
    setActiveLang('zh');
    setView('edit');
  };

  const handleDelete = (index) => {
    if (!window.confirm(`确认删除职位"${jobs[index].title.zh}"吗？`)) return;
    const updated = jobs.filter((_, i) => i !== index);
    setJobs(updated);
  };

  const handleToggleActive = (index) => {
    const updated = deepClone(jobs);
    updated[index].active = !updated[index].active;
    setJobs(updated);
  };

  const handleConfirmEdit = () => {
    const updated = deepClone(jobs);
    const cleaned = deepClone(editingJob);
    LANGS.forEach(({ key }) => {
      cleaned.responsibilities[key] = cleaned.responsibilities[key].filter(s => s.trim());
      cleaned.requirements[key] = cleaned.requirements[key].filter(s => s.trim());
    });
    if (editingIndex === null) {
      updated.push(cleaned);
    } else {
      updated[editingIndex] = cleaned;
    }
    setJobs(updated);
    setView('list');
  };

  const handleCancelEdit = () => {
    setView('list');
  };

  const setField = (field, value) => {
    setEditingJob(prev => ({ ...prev, [field]: value }));
  };

  const setLangField = (field, lang, value) => {
    setEditingJob(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const setListItem = (field, lang, index, value) => {
    setEditingJob(prev => {
      const arr = [...prev[field][lang]];
      arr[index] = value;
      return { ...prev, [field]: { ...prev[field], [lang]: arr } };
    });
  };

  const addListItem = (field, lang) => {
    setEditingJob(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: [...prev[field][lang], ''] },
    }));
  };

  const removeListItem = (field, lang, index) => {
    setEditingJob(prev => {
      const arr = prev[field][lang].filter((_, i) => i !== index);
      return { ...prev, [field]: { ...prev[field], [lang]: arr.length ? arr : [''] } };
    });
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#086c7b] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-wide">KTLH 后台管理</span>
          <span className="text-blue-200 text-sm hidden sm:inline">/ 职位管理</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/careers"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            查看前台页面 ↗
          </a>
          <button
            onClick={logout}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' ? (
          <>
            {/* List view */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">职位管理</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleNewJob}
                  className="bg-[#086c7b] hover:bg-[#065a67] text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>+</span> 添加职位
                </button>
                <button
                  onClick={handleSaveToGitHub}
                  disabled={saving || loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      保存中...
                    </>
                  ) : (
                    '保存到 GitHub'
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              在此页面编辑职位后，点击右上角"保存到 GitHub"提交更改。Vercel 将自动在 1-2 分钟内重新部署网站。
            </p>

            {loading ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                正在从 GitHub 加载...
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg mb-4">暂无职位</p>
                <button
                  onClick={handleNewJob}
                  className="bg-[#086c7b] text-white px-6 py-2 rounded-lg hover:bg-[#065a67] transition-colors"
                >
                  添加第一个职位
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${
                      job.active ? 'border-[#086c7b]' : 'border-gray-300'
                    } p-5`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {job.title.zh || '（未命名）'}
                          </h2>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              job.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {job.active ? '显示中' : '已隐藏'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                          <span>{job.department.zh}</span>
                          <span>·</span>
                          <span>{job.location}</span>
                          <span>·</span>
                          <span className="font-medium text-[#086c7b]">{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleActive(index)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            job.active
                              ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                              : 'border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {job.active ? '隐藏' : '显示'}
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Edit view */
          <EditJobForm
            job={editingJob}
            isNew={editingIndex === null}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            setField={setField}
            setLangField={setLangField}
            setListItem={setListItem}
            addListItem={addListItem}
            removeListItem={removeListItem}
            onConfirm={handleConfirmEdit}
            onCancel={handleCancelEdit}
            onFillTranslation={(result) => {
              setEditingJob(prev => ({
                ...prev,
                title: { ...prev.title, en: result.en.title, ja: result.ja.title },
                department: { ...prev.department, en: result.en.department, ja: result.ja.department },
                type: { ...prev.type, en: result.en.type, ja: result.ja.type },
                responsibilities: {
                  ...prev.responsibilities,
                  en: result.en.responsibilities,
                  ja: result.ja.responsibilities,
                },
                requirements: {
                  ...prev.requirements,
                  en: result.en.requirements,
                  ja: result.ja.requirements,
                },
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditJobForm({
  job,
  isNew,
  activeLang,
  setActiveLang,
  setField,
  setLangField,
  setListItem,
  addListItem,
  removeListItem,
  onConfirm,
  onCancel,
  onFillTranslation,
}) {
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');

  if (!job) return null;

  const handleTranslate = async () => {
    const zhData = {
      title: job.title.zh,
      department: job.department.zh,
      type: job.type.zh,
      responsibilities: job.responsibilities.zh.filter(s => s.trim()),
      requirements: job.requirements.zh.filter(s => s.trim()),
    };
    if (!zhData.title) {
      setTranslateError('请先填写中文职位名称');
      return;
    }
    setTranslating(true);
    setTranslateError('');
    try {
      const result = await translateJobContent(zhData);
      onFillTranslation(result);
      setActiveLang('en');
    } catch (err) {
      setTranslateError(err.message);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1"
          >
            ← 返回列表
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? '添加新职位' : `编辑职位：${job.title.zh || '（未命名）'}`}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Language tabs + translate button */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">编辑语言</label>
            <div className="flex gap-2">
              {LANGS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveLang(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeLang === key
                      ? 'bg-[#086c7b] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {translating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  翻译中...
                </>
              ) : (
                <>✨ 一键翻译英文/日文</>
              )}
            </button>
            <p className="text-xs text-gray-400">
              根据中文内容自动生成，之后可手动修改
            </p>
            {translateError && (
              <p className="text-xs text-red-500">{translateError}</p>
            )}
          </div>
        </div>

        {/* Shared fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">工作地点（所有语言通用）</label>
            <input
              type="text"
              value={job.location}
              onChange={e => setField('location', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
              placeholder="青岛胶州"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">薪资范围（所有语言通用）</label>
            <input
              type="text"
              value={job.salary}
              onChange={e => setField('salary', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
              placeholder="8K-15K"
            />
          </div>
        </div>

        {/* Lang-specific fields */}
        <div className="border-t pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                职位名称 <LangBadge lang={activeLang} />
              </label>
              <input
                type="text"
                value={job.title[activeLang]}
                onChange={e => setLangField('title', activeLang, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                placeholder="工艺工程师"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属部门 <LangBadge lang={activeLang} />
              </label>
              <input
                type="text"
                value={job.department[activeLang]}
                onChange={e => setLangField('department', activeLang, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                placeholder="技术研发部"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工作类型 <LangBadge lang={activeLang} />
              </label>
              <input
                type="text"
                value={job.type[activeLang]}
                onChange={e => setLangField('type', activeLang, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                placeholder="全职"
              />
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="border-t pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            岗位职责 <LangBadge lang={activeLang} />
          </label>
          <div className="space-y-2">
            {job.responsibilities[activeLang].map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="mt-2 text-gray-400 text-sm w-5 text-center shrink-0">{idx + 1}</span>
                <textarea
                  value={item}
                  onChange={e => setListItem('responsibilities', activeLang, idx, e.target.value)}
                  rows={2}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b] resize-none text-sm"
                  placeholder="输入职责描述..."
                />
                <button
                  onClick={() => removeListItem('responsibilities', activeLang, idx)}
                  className="mt-1 text-red-400 hover:text-red-600 transition-colors text-lg leading-none p-1"
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addListItem('responsibilities', activeLang)}
            className="mt-3 text-sm text-[#086c7b] hover:text-[#065a67] font-medium flex items-center gap-1"
          >
            + 添加职责
          </button>
        </div>

        {/* Requirements */}
        <div className="border-t pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            任职要求 <LangBadge lang={activeLang} />
          </label>
          <div className="space-y-2">
            {job.requirements[activeLang].map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="mt-2 text-gray-400 text-sm w-5 text-center shrink-0">{idx + 1}</span>
                <textarea
                  value={item}
                  onChange={e => setListItem('requirements', activeLang, idx, e.target.value)}
                  rows={2}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b] resize-none text-sm"
                  placeholder="输入任职要求..."
                />
                <button
                  onClick={() => removeListItem('requirements', activeLang, idx)}
                  className="mt-1 text-red-400 hover:text-red-600 transition-colors text-lg leading-none p-1"
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addListItem('requirements', activeLang)}
            className="mt-3 text-sm text-[#086c7b] hover:text-[#065a67] font-medium flex items-center gap-1"
          >
            + 添加要求
          </button>
        </div>

        {/* Active toggle */}
        <div className="border-t pt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField('active', !job.active)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
              job.active ? 'bg-[#086c7b]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                job.active ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            {job.active ? '在前台显示此职位' : '隐藏此职位（不对外展示）'}
          </span>
        </div>

        {/* Actions */}
        <div className="border-t pt-5 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-[#086c7b] hover:bg-[#065a67] text-white font-medium transition-colors"
          >
            确认修改
          </button>
        </div>
      </div>
    </div>
  );
}

function LangBadge({ lang }) {
  const labels = { zh: '中', en: 'EN', ja: 'JA' };
  return (
    <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal">
      {labels[lang]}
    </span>
  );
}

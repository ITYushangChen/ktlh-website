import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import AdminImageField from '../../components/admin/AdminImageField';

const FILE_PATH = 'public/content/certifications.json';

const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

function emptyItem() {
  return {
    image: '/images/certifications/',
    title: { zh: '', en: '', ja: '' },
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function AdminCertifications() {
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [fileSha, setFileSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [activeLang, setActiveLang] = useState('zh');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login');
  }, [isLoggedIn, navigate]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
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
      setItems(Array.isArray(content.items) ? content.items : []);
      setFileSha(sha);
    } catch (err) {
      showToast('加载失败：' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (isLoggedIn) loadData();
  }, [isLoggedIn, loadData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await commitFileToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch,
        path: FILE_PATH,
        content: { items },
        sha: fileSha,
        message: `更新资质认证 [${new Date().toLocaleString('zh-CN')}]`,
      });
      setFileSha(result.content.sha);
      showToast('已保存到 GitHub！');
    } catch (err) {
      showToast('保存失败：' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const row = items[index];
    const title = row.title && typeof row.title === 'object'
      ? { zh: row.title.zh || '', en: row.title.en || '', ja: row.title.ja || '' }
      : { zh: '', en: '', ja: '' };
    setEditingItem({ image: row.image || '', title });
    setActiveLang('zh');
    setView('edit');
  };

  const handleNew = () => {
    setEditingIndex(null);
    setEditingItem(emptyItem());
    setActiveLang('zh');
    setView('edit');
  };

  const handleDelete = (index) => {
    const label = items[index]?.title?.zh || items[index]?.image || `第 ${index + 1} 项`;
    if (!window.confirm(`确认删除「${label}」吗？`)) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleConfirmEdit = () => {
    const cleaned = deepClone(editingItem);
    LANGS.forEach(({ key }) => {
      if (!cleaned.title[key]) cleaned.title[key] = '';
    });
    const next = deepClone(items);
    if (editingIndex === null) next.push(cleaned);
    else next[editingIndex] = cleaned;
    setItems(next);
    setView('list');
  };

  const slt = (lang, value) => {
    setEditingItem((p) => ({
      ...p,
      title: { ...p.title, [lang]: value },
    }));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#086c7b] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-wide">KTLH 后台管理</span>
          <span className="text-blue-200 text-sm hidden sm:inline">/ 资质认证</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Link to="/admin/products" className="text-sm text-blue-200 hover:text-white transition-colors">
            产品管理
          </Link>
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            查看关于页 ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {view === 'list' ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">资质认证</h1>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleNew}
                  className="bg-[#086c7b] hover:bg-[#065a67] text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  + 新增证书
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  {saving ? '保存中…' : '保存到 GitHub'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              图片可填写路径或使用「上传图片」提交到 <code className="text-xs">public/images/certifications/</code>
              ，保存后前台关于页将读取最新 JSON。
            </p>

            {loading ? (
              <div className="text-center py-16 text-gray-400">加载中…</div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-sm border">
                暂无证书，点击「新增证书」添加。
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li
                    key={`${item.image}-${index}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-full sm:w-28 h-36 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.title?.zh || '（无中文标题）'}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{item.image}</p>
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : !editingItem ? null : (
          <div>
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              ← 返回列表
            </button>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {editingIndex === null ? '新增证书' : '编辑证书'}
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">语言</label>
                <div className="flex gap-2 flex-wrap">
                  {LANGS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
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

              <AdminImageField
                label="证书图片路径"
                value={editingItem.image}
                onChange={(v) => setEditingItem((p) => ({ ...p, image: v }))}
                placeholder="/images/certifications/xxx.jpg"
                subdir="certifications"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题（{LANGS.find((l) => l.key === activeLang)?.label}）
                </label>
                <input
                  type="text"
                  value={editingItem.title[activeLang] || ''}
                  onChange={(e) => slt(activeLang, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#086c7b] focus:border-[#086c7b]"
                  placeholder="证书名称"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  className="bg-[#086c7b] hover:bg-[#065a67] text-white px-6 py-2 rounded-lg font-medium"
                >
                  确定
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import { translateProductContent } from '../../utils/deepseekApi';
import { saveContentLocally } from '../../utils/localContentApi';
import AdminImageField from '../../components/admin/AdminImageField';
import AdminSpecTableEditor from '../../components/admin/AdminSpecTableEditor';
import AdminSeo from '../../components/AdminSeo';
import { categoryPathFromId } from '../../constants/productCategoryConfig';

const FILE_PATH = 'public/content/products.json';
const LOCAL_CONTENT_PATH = 'content/products.json';

const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

function emptyProduct() {
  return {
    id: `category-${Date.now()}`,
    active: true,
    image: '',
    detailImage: '',
    link: '/products/',
    viewer3dGlb: '',
    title: { zh: '', en: '', ja: '' },
    description: { zh: '', en: '', ja: '' },
    features: { zh: [''], en: [''], ja: [''] },
    specifications: {},
    specTable: null,
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fileSha, setFileSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeLang, setActiveLang] = useState('zh');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login');
  }, [isLoggedIn, navigate]);

  const loadProducts = useCallback(async () => {
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

      let loadedFromLocal = false;
      if (process.env.NODE_ENV === 'development') {
        try {
          const res = await fetch(`/content/products.json?t=${Date.now()}`);
          if (res.ok) {
            const local = await res.json();
            setGroups(local.groups || []);
            setCategories(local.categories || []);
            loadedFromLocal = true;
          }
        } catch {
          /* 使用 GitHub 数据 */
        }
      }

      if (!loadedFromLocal) {
        setGroups(content.groups || []);
        setCategories(content.categories || []);
      }
      setFileSha(sha);
    } catch (err) {
      showToast('加载失败：' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (isLoggedIn) loadProducts();
  }, [isLoggedIn, loadProducts]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveToGitHub = async () => {
    setSaving(true);
    try {
      const payload = { groups, categories };
      const result = await commitFileToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch,
        path: FILE_PATH,
        content: payload,
        sha: fileSha,
        message: `更新产品信息 [${new Date().toLocaleString('zh-CN')}]`,
      });
      setFileSha(result.content.sha);

      if (process.env.NODE_ENV === 'development') {
        try {
          await saveContentLocally(LOCAL_CONTENT_PATH, payload);
          showToast('已保存到 GitHub 和本地文件！刷新前台即可预览。');
        } catch (localErr) {
          showToast(`已保存到 GitHub，但本地写入失败：${localErr.message}`, 'error');
        }
      } else {
        showToast('已保存到 GitHub！Vercel 将在 1-2 分钟内重新部署。');
      }
    } catch (err) {
      showToast('保存失败：' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocal = async () => {
    setSaving(true);
    try {
      await saveContentLocally(LOCAL_CONTENT_PATH, { groups, categories });
      showToast('已保存到本地！请刷新产品页查看（无需 push GitHub）。');
    } catch (err) {
      showToast('本地保存失败：' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingProduct(deepClone(categories[index]));
    setActiveLang('zh');
    setView('edit');
  };

  const handleNewProduct = () => {
    setEditingIndex(null);
    setEditingProduct(emptyProduct());
    setActiveLang('zh');
    setView('edit');
  };

  const handleDelete = (index) => {
    if (!window.confirm(`确认删除产品"${categories[index].title.zh}"吗？`)) return;
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleToggleActive = (index) => {
    const updated = deepClone(categories);
    updated[index].active = !updated[index].active;
    setCategories(updated);
  };

  const handleConfirmEdit = () => {
    const updated = deepClone(categories);
    const cleaned = deepClone(editingProduct);
    LANGS.forEach(({ key }) => {
      cleaned.features[key] = cleaned.features[key].filter(s => s.trim());
    });
    const pathSegment = categoryPathFromId(cleaned.id) || cleaned.id;
    cleaned.link = `/products/${pathSegment}`;
    if (editingIndex === null) {
      updated.push(cleaned);
    } else {
      updated[editingIndex] = cleaned;
    }
    setCategories(updated);
    setView('list');
  };

  const setField = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  const setLangField = (field, lang, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const setFeatureItem = (lang, index, value) => {
    setEditingProduct(prev => {
      const arr = [...prev.features[lang]];
      arr[index] = value;
      return { ...prev, features: { ...prev.features, [lang]: arr } };
    });
  };

  const addFeatureItem = (lang) => {
    setEditingProduct(prev => ({
      ...prev,
      features: { ...prev.features, [lang]: [...prev.features[lang], ''] },
    }));
  };

  const removeFeatureItem = (lang, index) => {
    setEditingProduct(prev => {
      const arr = prev.features[lang].filter((_, i) => i !== index);
      return { ...prev, features: { ...prev.features, [lang]: arr.length ? arr : [''] } };
    });
  };

  const setSpecField = (key, value) => {
    setEditingProduct((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const setSpecLangField = (key, lang, value) => {
    setEditingProduct((prev) => {
      const cur = prev.specifications?.[key];
      if (typeof cur === 'object' && cur !== null && !Array.isArray(cur)) {
        return {
          ...prev,
          specifications: { ...prev.specifications, [key]: { ...cur, [lang]: value } },
        };
      }
      return { ...prev, specifications: { ...prev.specifications, [key]: value } };
    });
  };

  const addSpecField = () => {
    const key = window.prompt('规格参数英文 key（如 capacity, pressure）：');
    if (!key?.trim()) return;
    setEditingProduct((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key.trim()]: '' },
    }));
  };

  const removeSpecField = (key) => {
    setEditingProduct((prev) => {
      const s = { ...prev.specifications };
      delete s[key];
      return { ...prev, specifications: s };
    });
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSeo />
      {/* Top nav */}
      <header className="bg-[#086c7b] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-wide">KTLH 后台管理</span>
          <span className="text-blue-200 text-sm hidden sm:inline">/ 产品管理</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Link
            to="/admin/company-history"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            公司历程
          </Link>
          <Link
            to="/admin/certifications"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            资质认证
          </Link>
          <Link
            to="/admin/partners-map"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            战略伙伴地图
          </Link>
          <a
            href="/products"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            查看前台 ↗
          </a>
          <button
            onClick={logout}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">产品管理</h1>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleNewProduct}
                  className="bg-[#086c7b] hover:bg-[#065a67] text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>+</span> 添加产品
                </button>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleSaveLocal}
                    disabled={saving || loading}
                    className="bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    {saving ? '保存中...' : '保存到本地'}
                  </button>
                )}
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
                  ) : '保存到 GitHub'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              管理产品品类：列表与详情共用一份数据。编辑后点「确认修改」回到列表，再点
              <strong className="text-gray-700">「保存到本地」</strong>（localhost 预览）或
              <strong className="text-gray-700">「保存到 GitHub」</strong>（上线）。
              参数表需有数据行才会在前台显示。
            </p>

            {loading ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                正在从 GitHub 加载...
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((prod, index) => (
                  <div
                    key={prod.id}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${
                      prod.active ? 'border-[#086c7b]' : 'border-gray-300'
                    } p-5`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.title.zh}
                          className="w-20 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                          onError={(e) => { e.target.src = '/images/app/logo.png'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg font-semibold text-gray-800">
                              {prod.title.zh || '（未命名）'}
                            </h2>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              prod.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {prod.active ? '显示中' : '已隐藏'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 truncate">{prod.description.zh}</p>
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {(prod.features.zh || []).slice(0, 4).map((f, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleActive(index)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            prod.active
                              ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                              : 'border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {prod.active ? '隐藏' : '显示'}
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          编辑详情
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
          <EditProductForm
            product={editingProduct}
            isNew={editingIndex === null}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            setField={setField}
            setLangField={setLangField}
            setFeatureItem={setFeatureItem}
            addFeatureItem={addFeatureItem}
            removeFeatureItem={removeFeatureItem}
            setSpecField={setSpecField}
            setSpecLangField={setSpecLangField}
            addSpecField={addSpecField}
            removeSpecField={removeSpecField}
            setSpecTable={(specTable) => setEditingProduct((p) => ({ ...p, specTable }))}
            onConfirm={handleConfirmEdit}
            onCancel={() => setView('list')}
            onFillTranslation={(result) => {
              setEditingProduct(prev => ({
                ...prev,
                title: { ...prev.title, en: result.en.title, ja: result.ja.title },
                description: { ...prev.description, en: result.en.description, ja: result.ja.description },
                features: { ...prev.features, en: result.en.features, ja: result.ja.features },
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditProductForm({
  product,
  isNew,
  activeLang,
  setActiveLang,
  setField,
  setLangField,
  setFeatureItem,
  addFeatureItem,
  removeFeatureItem,
  setSpecField,
  setSpecLangField,
  addSpecField,
  removeSpecField,
  setSpecTable,
  onConfirm,
  onCancel,
  onFillTranslation,
}) {
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');

  if (!product) return null;

  const specEntries = Object.entries(product.specifications || {});
  const publicPath = `/products/${categoryPathFromId(product.id) || product.id}`;

  const handleTranslate = async () => {
    const zhData = {
      title: product.title.zh,
      description: product.description.zh,
      features: product.features.zh.filter(s => s.trim()),
    };
    if (!zhData.title) {
      setTranslateError('请先填写中文产品名称');
      return;
    }
    setTranslating(true);
    setTranslateError('');
    try {
      const result = await translateProductContent(zhData);
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
            {isNew ? '添加新产品' : `编辑产品：${product.title.zh || '（未命名）'}`}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Language tabs + translate */}
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
            <p className="text-xs text-gray-400">根据中文内容自动生成，之后可手动修改</p>
            {translateError && <p className="text-xs text-red-500">{translateError}</p>}
          </div>
        </div>

        {/* 图片与详情页路径 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <AdminImageField
              label="列表卡片图片"
              value={product.image}
              onChange={(v) => setField('image', v)}
              placeholder="/images/app/products/xxx.jpg"
              subdir="products"
            />
          </div>
          <div>
            <AdminImageField
              label="详情页大图（可选，不填则用列表图）"
              value={product.detailImage || ''}
              onChange={(v) => setField('detailImage', v)}
              placeholder="/images/app/products/xxx.jpg"
              subdir="products"
            />
          </div>
        </div>

        <div>
          <AdminImageField
            label="三维模型（GLB）路径"
            value={product.viewer3dGlb || ''}
            onChange={(v) => setField('viewer3dGlb', v)}
            placeholder="/images/products_3d/example.glb"
            subdir="products_3d"
            repoBaseDir="public/images"
            publicBaseDir="/images"
            accept=".glb,model/gltf-binary,application/octet-stream"
            fileTypeLabel="GLB"
            uploadButtonLabel="上传GLB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">前台详情页链接</label>
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono">
            {publicPath}
          </p>
          <p className="text-xs text-gray-400 mt-1">根据品类 ID 自动生成，保存后生效</p>
        </div>

        {/* Preview */}
        {product.image && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">列表图预览</label>
            <img
              src={product.image}
              alt="预览"
              className="w-40 h-28 object-cover rounded-lg bg-gray-100 border"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Lang-specific fields */}
        <div className="border-t pt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              产品名称 <LangBadge lang={activeLang} />
            </label>
            <input
              type="text"
              value={product.title[activeLang]}
              onChange={e => setLangField('title', activeLang, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
              placeholder="储液器"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              产品描述 <LangBadge lang={activeLang} />
            </label>
            <textarea
              value={product.description[activeLang]}
              onChange={e => setLangField('description', activeLang, e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b] resize-none"
              placeholder="输入产品描述..."
            />
          </div>
        </div>

        {/* Features */}
        <div className="border-t pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            产品特点 <LangBadge lang={activeLang} />
          </label>
          <div className="space-y-2">
            {product.features[activeLang].map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-gray-400 text-sm w-5 text-center shrink-0">{idx + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={e => setFeatureItem(activeLang, idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b] text-sm"
                  placeholder="输入特点..."
                />
                <button
                  onClick={() => removeFeatureItem(activeLang, idx)}
                  className="text-red-400 hover:text-red-600 transition-colors text-lg p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addFeatureItem(activeLang)}
            className="mt-3 text-sm text-[#086c7b] hover:text-[#065a67] font-medium flex items-center gap-1"
          >
            + 添加特点
          </button>
        </div>

        {/* Specifications */}
        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">规格参数（键值列表）</label>
            <button type="button" onClick={addSpecField} className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium">
              + 添加参数
            </button>
          </div>
          <div className="space-y-3">
            {specEntries.map(([key, value]) => {
              const isMultiLang = typeof value === 'object' && value !== null && !Array.isArray(value);
              return (
                <div key={key} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 w-24 shrink-0 font-mono">{key}</span>
                  {isMultiLang ? (
                    <input
                      type="text"
                      value={value[activeLang] || ''}
                      onChange={(e) => setSpecLangField(key, activeLang, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => setSpecField(key, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                    />
                  )}
                  <button type="button" onClick={() => removeSpecField(key)} className="text-red-400 hover:text-red-600 text-lg p-1">×</button>
                </div>
              );
            })}
            {specEntries.length === 0 && <p className="text-sm text-gray-400">暂无键值参数</p>}
          </div>
        </div>

        <AdminSpecTableEditor
          specTable={product.specTable}
          activeLang={activeLang}
          onChange={setSpecTable}
        />

        {/* Active toggle */}
        <div className="border-t pt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField('active', !product.active)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
              product.active ? 'bg-[#086c7b]' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              product.active ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
          <span className="text-sm text-gray-700">
            {product.active ? '在前台显示此产品' : '隐藏此产品（不对外展示）'}
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

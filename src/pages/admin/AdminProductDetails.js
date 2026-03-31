import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import AdminImageField from '../../components/admin/AdminImageField';

const FILE_PATH = 'public/content/product-details.json';
const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

function emptyItem(categoryId) {
  const prefix = categoryId === 'receivers' ? 'R' : categoryId === 'gas-liquid-separators' ? 'GLS' : 'P';
  return {
    id: `${prefix.toLowerCase()}-${Date.now()}`,
    active: true,
    image: '',
    name: { zh: '', en: '', ja: '' },
    description: { zh: '', en: '', ja: '' },
    specifications: {},
    features: { zh: [''], en: [''], ja: [''] },
  };
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

const gl = (field) => {
  if (!field || typeof field === 'string') return field || '';
  return field.zh || '';
};

export default function AdminProductDetails() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [allData, setAllData] = useState({});
  const [fileSha, setFileSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [activeLang, setActiveLang] = useState('zh');
  const [toast, setToast] = useState(null);

  const items = allData[categoryId] || [];

  useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login');
  }, [isLoggedIn, navigate]);

  const loadData = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const { content, sha } = await fetchFileFromGitHub({
        token: auth.githubToken, owner: auth.owner, repo: auth.repo, branch: auth.branch, path: FILE_PATH,
      });
      setAllData(content || {});
      setFileSha(sha);
    } catch (err) {
      showToast('加载失败：' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => { if (isLoggedIn) loadData(); }, [isLoggedIn, loadData]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setItems = (newItems) => {
    setAllData(prev => ({ ...prev, [categoryId]: newItems }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await commitFileToGitHub({
        token: auth.githubToken, owner: auth.owner, repo: auth.repo, branch: auth.branch,
        path: FILE_PATH, content: allData, sha: fileSha,
        message: `更新${categoryId}子产品信息 [${new Date().toLocaleString('zh-CN')}]`,
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
    setEditingItem(deepClone(items[index]));
    setActiveLang('zh');
    setView('edit');
  };

  const handleNew = () => {
    setEditingIndex(null);
    setEditingItem(emptyItem(categoryId));
    setActiveLang('zh');
    setView('edit');
  };

  const handleDelete = (index) => {
    if (!window.confirm(`确认删除"${items[index].name.zh}"吗？`)) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleToggleActive = (index) => {
    const u = deepClone(items);
    u[index].active = !u[index].active;
    setItems(u);
  };

  const handleConfirmEdit = () => {
    const u = deepClone(items);
    const cleaned = deepClone(editingItem);
    LANGS.forEach(({ key }) => {
      cleaned.features[key] = (cleaned.features[key] || []).filter(s => s.trim());
      if (!cleaned.features[key].length) cleaned.features[key] = [];
    });
    if (editingIndex === null) u.push(cleaned); else u[editingIndex] = cleaned;
    setItems(u);
    setView('list');
  };

  const sf = (field, value) => setEditingItem(p => ({ ...p, [field]: value }));
  const slf = (field, lang, value) => setEditingItem(p => ({ ...p, [field]: { ...p[field], [lang]: value } }));
  const setSpecField = (key, value) => setEditingItem(p => ({ ...p, specifications: { ...p.specifications, [key]: value } }));
  const setSpecLangField = (key, lang, value) => {
    setEditingItem(p => {
      const cur = p.specifications[key];
      if (typeof cur === 'object' && cur !== null && !Array.isArray(cur)) {
        return { ...p, specifications: { ...p.specifications, [key]: { ...cur, [lang]: value } } };
      }
      return { ...p, specifications: { ...p.specifications, [key]: value } };
    });
  };
  const addSpecField = () => {
    const key = window.prompt('规格参数英文 key（如 capacity, pressure 等）：');
    if (!key || !key.trim()) return;
    setEditingItem(p => ({ ...p, specifications: { ...p.specifications, [key.trim()]: '' } }));
  };
  const removeSpecField = (key) => {
    setEditingItem(p => {
      const s = { ...p.specifications };
      delete s[key];
      return { ...p, specifications: s };
    });
  };

  const setFeatureItem = (lang, idx, val) => {
    setEditingItem(p => {
      const arr = [...(p.features[lang] || [])];
      arr[idx] = val;
      return { ...p, features: { ...p.features, [lang]: arr } };
    });
  };
  const addFeature = (lang) => {
    setEditingItem(p => ({ ...p, features: { ...p.features, [lang]: [...(p.features[lang] || []), ''] } }));
  };
  const removeFeature = (lang, idx) => {
    setEditingItem(p => {
      const arr = (p.features[lang] || []).filter((_, i) => i !== idx);
      return { ...p, features: { ...p.features, [lang]: arr.length ? arr : [''] } };
    });
  };

  const categoryNames = {
    'receivers': '储液器',
    'gas-liquid-separators': '气液分离器',
    'oil-separators': '油分离器',
    'damping-blocks': '阻尼块',
    'shell-tube-heat-exchangers': '壳管式换热器',
    'copper-tube-series': '铜管系列',
    'plate-heat-exchangers': '板式换热器',
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#086c7b] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-wide">KTLH 后台管理</span>
          <span className="text-blue-200 text-sm hidden sm:inline">
            / <Link to="/admin/products" className="hover:text-white">产品管理</Link> / {categoryNames[categoryId] || categoryId} 子产品
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="text-sm text-blue-200 hover:text-white transition-colors">产品管理</Link>
          <Link to="/admin/jobs" className="text-sm text-blue-200 hover:text-white transition-colors">职位管理</Link>
          <button onClick={logout} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors">退出登录</button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1">← 返回产品列表</Link>
                <h1 className="text-2xl font-bold text-gray-800">{categoryNames[categoryId] || categoryId} — 子产品管理</h1>
              </div>
              <div className="flex gap-3">
                <button onClick={handleNew} className="bg-[#086c7b] hover:bg-[#065a67] text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <span>+</span> 添加子产品
                </button>
                <button onClick={handleSave} disabled={saving || loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  {saving ? '保存中...' : '保存到 GitHub'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              管理"{categoryNames[categoryId]}"品类下的明星产品列表。每个子产品包含名称、描述、规格参数、特点。
            </p>

            {loading ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                正在加载...
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg mb-4">该品类暂无子产品</p>
                <button onClick={handleNew} className="bg-[#086c7b] text-white px-6 py-2 rounded-lg hover:bg-[#065a67]">添加第一个</button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${item.active ? 'border-[#086c7b]' : 'border-gray-300'} p-5`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <img src={item.image} alt="" className="w-16 h-12 object-cover rounded bg-gray-100 shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-base font-semibold text-gray-800">{item.name.zh || '（未命名）'}</h2>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {item.active ? '显示中' : '已隐藏'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 truncate">{item.description.zh}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {Object.entries(item.specifications || {}).slice(0, 3).map(([k, v]) => (
                              <span key={k} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                {k}: {gl(v)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleToggleActive(index)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${item.active ? 'border-orange-300 text-orange-600 hover:bg-orange-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
                          {item.active ? '隐藏' : '显示'}
                        </button>
                        <button onClick={() => handleEdit(index)} className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50">编辑</button>
                        <button onClick={() => handleDelete(index)} className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50">删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <EditItemForm
            categoryId={categoryId}
            item={editingItem} isNew={editingIndex === null}
            activeLang={activeLang} setActiveLang={setActiveLang}
            sf={sf} slf={slf}
            setSpecField={setSpecField} setSpecLangField={setSpecLangField}
            addSpecField={addSpecField} removeSpecField={removeSpecField}
            setFeatureItem={setFeatureItem} addFeature={addFeature} removeFeature={removeFeature}
            onConfirm={handleConfirmEdit} onCancel={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
}

function EditItemForm({
  categoryId,
  item, isNew, activeLang, setActiveLang,
  sf, slf, setSpecField, setSpecLangField, addSpecField, removeSpecField,
  setFeatureItem, addFeature, removeFeature,
  onConfirm, onCancel,
}) {
  if (!item) return null;

  const specEntries = Object.entries(item.specifications || {});

  return (
    <div>
      <div className="mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1">← 返回列表</button>
        <h1 className="text-2xl font-bold text-gray-800">{isNew ? '添加子产品' : `编辑：${item.name.zh || '（未命名）'}`}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Lang tabs */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">编辑语言</label>
          <div className="flex gap-2">
            {LANGS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveLang(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === key ? 'bg-[#086c7b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <AdminImageField
            label="产品图片路径"
            value={item.image}
            onChange={(v) => sf('image', v)}
            placeholder="/images/products/receivers/r-001.jpg"
            subdir={`products/${categoryId}`}
          />
          {item.image && (
            <img src={item.image} alt="预览" className="mt-2 w-32 h-24 object-cover rounded bg-gray-100 border"
              onError={(e) => { e.target.style.display = 'none'; }} />
          )}
        </div>

        {/* Name + description */}
        <div className="border-t pt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">产品名称 <LangBadge lang={activeLang} /></label>
            <input type="text" value={item.name[activeLang] || ''} onChange={e => slf('name', activeLang, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b]" placeholder="R-001 立式储液器" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">产品描述 <LangBadge lang={activeLang} /></label>
            <textarea value={item.description[activeLang] || ''} onChange={e => slf('description', activeLang, e.target.value)}
              rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#086c7b] resize-none" />
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">规格参数</label>
            <button onClick={addSpecField} className="text-sm text-[#086c7b] hover:text-[#065a67] font-medium">+ 添加参数</button>
          </div>
          <div className="space-y-3">
            {specEntries.map(([key, value]) => {
              const isMultiLang = typeof value === 'object' && value !== null && !Array.isArray(value);
              return (
                <div key={key} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 w-24 shrink-0 font-mono">{key}</span>
                  {isMultiLang ? (
                    <input type="text" value={value[activeLang] || ''} onChange={e => setSpecLangField(key, activeLang, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                      placeholder={`${key} (${activeLang})`} />
                  ) : (
                    <input type="text" value={value || ''} onChange={e => setSpecField(key, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]"
                      placeholder={key} />
                  )}
                  <button onClick={() => removeSpecField(key)} className="text-red-400 hover:text-red-600 text-lg p-1">×</button>
                </div>
              );
            })}
            {specEntries.length === 0 && <p className="text-sm text-gray-400">暂无参数，点击"添加参数"开始</p>}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            纯数值参数（如 capacity: "1.5L - 5L"）所有语言共用。需要翻译的参数（如 material）会自动按语言切换。
          </p>
        </div>

        {/* Features */}
        <div className="border-t pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">产品特点 <LangBadge lang={activeLang} /></label>
          <div className="space-y-2">
            {(item.features[activeLang] || []).map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-gray-400 text-sm w-5 text-center shrink-0">{idx + 1}</span>
                <input type="text" value={feat} onChange={e => setFeatureItem(activeLang, idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#086c7b]" placeholder="特点..." />
                <button onClick={() => removeFeature(activeLang, idx)} className="text-red-400 hover:text-red-600 text-lg p-1">×</button>
              </div>
            ))}
          </div>
          <button onClick={() => addFeature(activeLang)} className="mt-3 text-sm text-[#086c7b] hover:text-[#065a67] font-medium">+ 添加特点</button>
        </div>

        {/* Active */}
        <div className="border-t pt-5 flex items-center gap-3">
          <button type="button" onClick={() => sf('active', !item.active)}
            className={`relative w-12 h-6 rounded-full transition-colors ${item.active ? 'bg-[#086c7b]' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-gray-700">{item.active ? '显示此产品' : '隐藏此产品'}</span>
        </div>

        {/* Actions */}
        <div className="border-t pt-5 flex gap-3 justify-end">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium">取消</button>
          <button onClick={onConfirm} className="px-6 py-2.5 rounded-lg bg-[#086c7b] hover:bg-[#065a67] text-white font-medium">确认修改</button>
        </div>
      </div>
    </div>
  );
}

function LangBadge({ lang }) {
  const labels = { zh: '中', en: 'EN', ja: 'JA' };
  return <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal">{labels[lang]}</span>;
}

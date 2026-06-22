import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import { saveContentLocally } from '../../utils/localContentApi';
import AdminImageField from '../../components/admin/AdminImageField';
import AdminSeo from '../../components/AdminSeo';

const FILE_PATH = 'public/content/partners-map.json';
const LOCAL_CONTENT_PATH = 'content/partners-map.json';

const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

const DEFAULT_MAP = {
  viewBox: { w: 1000, h: 520 },
  hub: {
    id: 'qingdao_hub',
    lat: 36.15,
    lng: 120.05,
    title: { zh: '开拓隆海', en: 'Kaituo Longhai', ja: '開拓隆海' },
    subtitle: {
      zh: '青岛胶州 · 全球战略合作枢纽',
      en: 'Jiaozhou, Qingdao · Global hub',
      ja: '青島膠州・グローバルハブ',
    },
    image: '',
  },
  nodes: [],
};

function emptyNode() {
  return {
    id: `node-${Date.now()}`,
    lat: 0,
    lng: 0,
    connectToHub: true,
    title: { zh: '', en: '', ja: '' },
    subtitle: { zh: '', en: '', ja: '' },
    image: '',
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function buildMapPayload(mapData) {
  const payload = {
    viewBox: mapData.viewBox || DEFAULT_MAP.viewBox,
    hub: mapData.hub,
    nodes: mapData.nodes,
  };
  if (Array.isArray(mapData.highlightCountries) && mapData.highlightCountries.length > 0) {
    payload.highlightCountries = mapData.highlightCountries;
  }
  return payload;
}

export default function AdminPartnersMap() {
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [mapData, setMapData] = useState(deepClone(DEFAULT_MAP));
  const [fileSha, setFileSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('zh');
  const [toast, setToast] = useState(null);
  const [jsonImport, setJsonImport] = useState('');
  const [editingNodeIndex, setEditingNodeIndex] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login');
  }, [isLoggedIn, navigate]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
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
      if (content && content.hub && Array.isArray(content.nodes)) {
        setMapData({
          viewBox: content.viewBox || DEFAULT_MAP.viewBox,
          hub: { ...DEFAULT_MAP.hub, ...content.hub },
          nodes: content.nodes,
          highlightCountries: content.highlightCountries,
        });
        setFileSha(sha);
      } else {
        setMapData(deepClone(DEFAULT_MAP));
        setFileSha(sha);
      }
    } catch (err) {
      try {
        const res = await fetch(`/content/partners-map.json?t=${Date.now()}`);
        if (res.ok) {
          const j = await res.json();
          setMapData({
            viewBox: j.viewBox || DEFAULT_MAP.viewBox,
            hub: { ...DEFAULT_MAP.hub, ...j.hub },
            nodes: j.nodes || [],
            highlightCountries: j.highlightCountries,
          });
          setFileSha(null);
          showToast('仓库中尚无该文件，已加载站点默认 JSON。首次保存将创建 public/content/partners-map.json', 'success');
        } else {
          setMapData(deepClone(DEFAULT_MAP));
          setFileSha(null);
          showToast('无法从 GitHub 加载：' + err.message + '。已使用内置默认。', 'error');
        }
      } catch {
        setMapData(deepClone(DEFAULT_MAP));
        setFileSha(null);
        showToast('加载失败：' + err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (isLoggedIn) loadData();
  }, [isLoggedIn, loadData]);

  const handleSaveToGitHub = async () => {
    setSaving(true);
    try {
      const payload = buildMapPayload(mapData);
      const result = await commitFileToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch,
        path: FILE_PATH,
        content: payload,
        sha: fileSha,
        message: `更新战略伙伴地图数据 [${new Date().toLocaleString('zh-CN')}]`,
      });
      setFileSha(result.content.sha);

      if (process.env.NODE_ENV === 'development') {
        try {
          await saveContentLocally(LOCAL_CONTENT_PATH, payload);
          showToast('已保存到 GitHub 和本地文件！刷新「关于我们」即可预览。');
        } catch (localErr) {
          showToast(`已保存到 GitHub，但本地写入失败：${localErr.message}`, 'error');
        }
      } else {
        showToast('已保存到 GitHub！前台「关于我们」将读取 partners-map.json。');
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
      await saveContentLocally(LOCAL_CONTENT_PATH, buildMapPayload(mapData));
      showToast('已保存到本地！请刷新「关于我们」页查看（无需 push GitHub）。');
    } catch (err) {
      showToast('本地保存失败：' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const setHubField = (field, value) => {
    setMapData((prev) => ({ ...prev, hub: { ...prev.hub, [field]: value } }));
  };

  const setHubLang = (field, lang, value) => {
    setMapData((prev) => ({
      ...prev,
      hub: {
        ...prev.hub,
        [field]: { ...(prev.hub[field] || {}), [lang]: value },
      },
    }));
  };

  const setNode = (index, patch) => {
    setMapData((prev) => {
      const nodes = [...prev.nodes];
      nodes[index] = { ...nodes[index], ...patch };
      return { ...prev, nodes };
    });
  };

  const setNodeLang = (index, field, lang, value) => {
    setMapData((prev) => {
      const nodes = [...prev.nodes];
      const n = { ...nodes[index] };
      n[field] = { ...(n[field] || {}), [lang]: value };
      nodes[index] = n;
      return { ...prev, nodes };
    });
  };

  const addNode = () => {
    setMapData((prev) => ({
      ...prev,
      nodes: [...prev.nodes, emptyNode()],
    }));
    setEditingNodeIndex(mapData.nodes.length);
  };

  const removeNode = (index) => {
    if (!window.confirm('确认删除该节点？')) return;
    setMapData((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index),
    }));
  };

  const applyJsonImport = () => {
    try {
      const j = JSON.parse(jsonImport);
      if (!j.hub || !Array.isArray(j.nodes)) {
        showToast('JSON 须包含 hub 与 nodes 数组', 'error');
        return;
      }
      setMapData({
        viewBox: j.viewBox || DEFAULT_MAP.viewBox,
        hub: { ...DEFAULT_MAP.hub, ...j.hub },
        nodes: j.nodes,
        highlightCountries: j.highlightCountries,
      });
      showToast('已从 JSON 导入（尚未保存到 GitHub）');
      setJsonImport('');
    } catch (e) {
      showToast('JSON 解析失败：' + e.message, 'error');
    }
  };

  const exportJson = () => {
    const text = JSON.stringify(buildMapPayload(mapData), null, 2);
    navigator.clipboard.writeText(text).then(
      () => showToast('已复制到剪贴板，可粘贴到 Excel/记事本'),
      () => showToast('复制失败', 'error')
    );
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSeo />
      <header className="bg-[#086c7b] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">KTLH 后台</span>
          <span className="text-blue-200 text-sm">/ 战略伙伴地图（经纬度）</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Link to="/admin/company-history" className="text-sm text-blue-200 hover:text-white">
            公司历程
          </Link>
          <Link to="/admin/certifications" className="text-sm text-blue-200 hover:text-white">
            资质认证
          </Link>
          <Link to="/admin/products" className="text-sm text-blue-200 hover:text-white">
            产品管理
          </Link>
          <a href="/about" target="_blank" rel="noreferrer" className="text-sm text-blue-200 hover:text-white">
            查看关于我们 ↗
          </a>
          <button type="button" onClick={logout} className="text-sm text-blue-200 hover:text-white">
            退出
          </button>
        </div>
      </header>

      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm max-w-[90vw] ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">战略伙伴世界地图</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            数据保存在仓库 <code className="text-xs bg-gray-100 px-1 rounded">public/content/partners-map.json</code>
            。枢纽默认为青岛胶州（可改经纬度）；其余节点填写纬度 <code>lat</code>、经度 <code>lng</code>（WGS84）。
            图片填相对路径如 <code>/images/app/partners-map/xxx.png</code>，或使用下方上传。
          </p>
          <p className="text-sm text-gray-500 mt-2">
            可从 Excel 导出为 CSV 再转 JSON，或把整份 JSON 粘贴到下方「导入」区域。部署后「关于我们」页自动读取。
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm text-gray-500 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              本地开发请使用 <strong className="text-gray-700">npm start</strong>（会启动 dev-content-api）。
              修改后点 <strong className="text-gray-700">「保存到本地」</strong> 写入{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">public/content/partners-map.json</code>，刷新前台即可预览。
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">加载中…</p>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">枢纽（蓝线汇聚点）</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="text-gray-600">纬度 lat</span>
                  <input
                    type="number"
                    step="any"
                    value={mapData.hub.lat}
                    onChange={(e) => setHubField('lat', parseFloat(e.target.value, 10) || 0)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-600">经度 lng</span>
                  <input
                    type="number"
                    step="any"
                    value={mapData.hub.lng}
                    onChange={(e) => setHubField('lng', parseFloat(e.target.value, 10) || 0)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="text-gray-600">节点 id（勿重复）</span>
                  <input
                    type="text"
                    value={mapData.hub.id}
                    onChange={(e) => setHubField('id', e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {LANGS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveLang(key)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      activeLang === key ? 'bg-[#086c7b] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={mapData.hub.title?.[activeLang] || ''}
                onChange={(e) => setHubLang('title', activeLang, e.target.value)}
                placeholder="标题"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={mapData.hub.subtitle?.[activeLang] || ''}
                onChange={(e) => setHubLang('subtitle', activeLang, e.target.value)}
                placeholder="副标题"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <AdminImageField
                label="枢纽图片（可选）"
                value={mapData.hub.image || ''}
                onChange={(v) => setHubField('image', v)}
                placeholder="/images/app/partners-map/hub.png"
                subdir="partners-map"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">外圈节点（经纬度 → 自动投影）</h2>
                <button
                  type="button"
                  onClick={addNode}
                  className="px-4 py-2 rounded-lg bg-[#086c7b] text-white text-sm hover:bg-[#065a66]"
                >
                  添加节点
                </button>
              </div>

              <div className="space-y-6">
                {mapData.nodes.map((node, index) => (
                  <div
                    key={node.id || index}
                    className="border border-gray-100 rounded-lg p-4 bg-gray-50/80 space-y-3"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium text-gray-800">节点 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeNode(index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        删除
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <label className="text-xs text-gray-600">
                        id
                        <input
                          value={node.id}
                          onChange={(e) => setNode(index, { id: e.target.value })}
                          className="mt-0.5 w-full border rounded px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        lat
                        <input
                          type="number"
                          step="any"
                          value={node.lat}
                          onChange={(e) => setNode(index, { lat: parseFloat(e.target.value, 10) || 0 })}
                          className="mt-0.5 w-full border rounded px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        lng
                        <input
                          type="number"
                          step="any"
                          value={node.lng}
                          onChange={(e) => setNode(index, { lng: parseFloat(e.target.value, 10) || 0 })}
                          className="mt-0.5 w-full border rounded px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600 flex items-end gap-2">
                        <input
                          type="checkbox"
                          checked={node.connectToHub !== false}
                          onChange={(e) => setNode(index, { connectToHub: e.target.checked })}
                        />
                        连到枢纽
                      </label>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {LANGS.map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setActiveLang(key);
                            setEditingNodeIndex(index);
                          }}
                          className={`px-2 py-0.5 rounded text-xs ${
                            activeLang === key && editingNodeIndex === index
                              ? 'bg-[#086c7b] text-white'
                              : 'bg-white border text-gray-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={node.title?.[activeLang] || ''}
                      onChange={(e) => setNodeLang(index, 'title', activeLang, e.target.value)}
                      placeholder="标题"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={node.subtitle?.[activeLang] || ''}
                      onChange={(e) => setNodeLang(index, 'subtitle', activeLang, e.target.value)}
                      placeholder="副标题 / 地点"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                    <AdminImageField
                      label="图片（可选）"
                      value={node.image || ''}
                      onChange={(v) => setNode(index, { image: v })}
                      placeholder="/images/app/partners-map/xxx.png"
                      subdir="partners-map"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-semibold">导入 / 导出 JSON</h2>
              <p className="text-xs text-gray-500">
                可将 Excel 另存为 CSV 后自行合并为 JSON，或把完整 JSON 粘贴下方。
              </p>
              <textarea
                value={jsonImport}
                onChange={(e) => setJsonImport(e.target.value)}
                placeholder='粘贴 { "hub": {...}, "nodes": [...] }'
                rows={6}
                className="w-full border rounded-lg px-3 py-2 text-xs font-mono"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyJsonImport}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm"
                >
                  应用导入
                </button>
                <button
                  type="button"
                  onClick={exportJson}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  复制当前 JSON
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 flex-wrap">
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  disabled={saving || loading}
                  onClick={handleSaveLocal}
                  className="px-6 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? '保存中…' : '保存到本地'}
                </button>
              )}
              <button
                type="button"
                disabled={saving || loading}
                onClick={handleSaveToGitHub}
                className="px-8 py-3 rounded-xl bg-[#086c7b] text-white font-medium hover:bg-[#065a66] disabled:opacity-50"
              >
                {saving ? '保存中…' : '保存到 GitHub'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

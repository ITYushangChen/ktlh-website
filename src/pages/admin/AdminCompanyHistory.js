import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchFileFromGitHub, commitFileToGitHub } from '../../utils/githubApi';
import AdminImageField from '../../components/admin/AdminImageField';
import AdminSeo from '../../components/AdminSeo';

const FILE_PATH = 'public/content/company-history.json';

const LANGS = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

function emptyEvent() {
  return {
    id: `e-${Date.now()}`,
    image: '/images/app/history/',
    description: { zh: '', en: '', ja: '' },
  };
}

function emptyMilestone() {
  return {
    id: `m-${Date.now()}`,
    active: true,
    year: '',
    phase: { zh: '', en: '', ja: '' },
    position: '',
    events: [],
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeMilestone(row) {
  const phase =
    row.phase && typeof row.phase === 'object'
      ? { zh: row.phase.zh || '', en: row.phase.en || '', ja: row.phase.ja || '' }
      : { zh: '', en: '', ja: '' };
  const events = Array.isArray(row.events)
    ? row.events.map((ev) => ({
        id: ev.id || `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        image: ev.image || '',
        description:
          ev.description && typeof ev.description === 'object'
            ? {
                zh: ev.description.zh || '',
                en: ev.description.en || '',
                ja: ev.description.ja || '',
              }
            : { zh: '', en: '', ja: '' },
      }))
    : [];
  return {
    id: row.id || `m-${Date.now()}`,
    active: row.active !== false,
    year: row.year || '',
    phase,
    position: row.position === 'above' || row.position === 'below' ? row.position : '',
    events,
  };
}

export default function AdminCompanyHistory() {
  const navigate = useNavigate();
  const { auth, logout, isLoggedIn } = useAdminAuth();

  const [milestones, setMilestones] = useState([]);
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
      setMilestones(
        Array.isArray(content.milestones) ? content.milestones.map(normalizeMilestone) : []
      );
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
        content: { milestones },
        sha: fileSha,
        message: `更新公司历程 [${new Date().toLocaleString('zh-CN')}]`,
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
    setEditingItem(deepClone(normalizeMilestone(milestones[index])));
    setActiveLang('zh');
    setView('edit');
  };

  const handleNew = () => {
    setEditingIndex(null);
    setEditingItem(emptyMilestone());
    setActiveLang('zh');
    setView('edit');
  };

  const handleDelete = (index) => {
    const label = milestones[index]?.year || milestones[index]?.phase?.zh || `第 ${index + 1} 项`;
    if (!window.confirm(`确认删除「${label}」吗？`)) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMove = (index, dir) => {
    const next = deepClone(milestones);
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setMilestones(next);
  };

  const handleConfirmEdit = () => {
    const cleaned = normalizeMilestone(editingItem);
    LANGS.forEach(({ key }) => {
      if (!cleaned.phase[key]) cleaned.phase[key] = '';
      cleaned.events.forEach((ev) => {
        if (!ev.description[key]) ev.description[key] = '';
      });
    });
    const next = deepClone(milestones);
    if (editingIndex === null) next.push(cleaned);
    else next[editingIndex] = cleaned;
    setMilestones(next);
    setView('list');
  };

  const sltPhase = (lang, value) => {
    setEditingItem((p) => ({
      ...p,
      phase: { ...p.phase, [lang]: value },
    }));
  };

  const updateEvent = (eventIndex, patch) => {
    setEditingItem((prev) => {
      const events = deepClone(prev.events || []);
      events[eventIndex] = { ...events[eventIndex], ...patch };
      return { ...prev, events };
    });
  };

  const updateEventDesc = (eventIndex, lang, value) => {
    setEditingItem((prev) => {
      const events = deepClone(prev.events || []);
      events[eventIndex] = {
        ...events[eventIndex],
        description: { ...events[eventIndex].description, [lang]: value },
      };
      return { ...prev, events };
    });
  };

  const addEvent = () => {
    setEditingItem((prev) => ({
      ...prev,
      events: [...(prev.events || []), emptyEvent()],
    }));
  };

  const removeEvent = (eventIndex) => {
    if (!window.confirm('确认删除该事件吗？')) return;
    setEditingItem((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== eventIndex),
    }));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSeo />
      <header className="bg-[#086c7b] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-wide">KTLH 后台管理</span>
          <span className="text-blue-200 text-sm hidden sm:inline">/ 公司历程</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Link to="/admin/products" className="text-sm text-blue-200 hover:text-white transition-colors">
            产品管理
          </Link>
          <Link to="/admin/certifications" className="text-sm text-blue-200 hover:text-white transition-colors">
            资质认证
          </Link>
          <Link to="/admin/partners-map" className="text-sm text-blue-200 hover:text-white transition-colors">
            战略伙伴地图
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">公司历程时间轴</h1>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleNew}
                  className="px-4 py-2 rounded-lg bg-[#086c7b] text-white text-sm font-medium hover:bg-[#065a66]"
                >
                  新增节点
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-300"
                >
                  {saving ? '保存中...' : '保存到 GitHub'}
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500">加载中...</p>
            ) : milestones.length === 0 ? (
              <p className="text-gray-500">暂无节点，点击「新增节点」开始配置。</p>
            ) : (
              <ul className="space-y-3">
                {milestones.map((row, index) => (
                  <li
                    key={row.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {row.year || '（未填年份）'}
                        <span className="ml-2 text-sm text-gray-500">{row.phase?.zh}</span>
                        {!row.active && (
                          <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            已隐藏
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {row.events?.length || 0} 条事件 · ID: {row.id}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === milestones.length - 1}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        下移
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-[#086c7b] text-[#086c7b] hover:bg-[#086c7b]/5"
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
        ) : editingItem ? (
          <div>
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              ← 返回列表
            </button>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {editingIndex === null ? '新增历程节点' : '编辑历程节点'}
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">年份 / 时间段</label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={(e) => setEditingItem((p) => ({ ...p, year: e.target.value }))}
                    placeholder="如 2014–16、2024–26"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    阶段关键词（{LANGS.find((l) => l.key === activeLang)?.label}）
                  </label>
                  <input
                    type="text"
                    value={editingItem.phase?.[activeLang] || ''}
                    onChange={(e) => sltPhase(activeLang, e.target.value)}
                    placeholder="如 BREAKTHROUGH、突破"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">文案位置</label>
                  <select
                    value={editingItem.position || ''}
                    onChange={(e) =>
                      setEditingItem((p) => ({ ...p, position: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="">自动交替（上/下）</option>
                    <option value="above">时间轴上方</option>
                    <option value="below">时间轴下方</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editingItem.active !== false}
                  onChange={(e) => setEditingItem((p) => ({ ...p, active: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                在前台显示此节点
              </label>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">节点事件</h2>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    + 添加事件
                  </button>
                </div>

                {(editingItem.events || []).length === 0 ? (
                  <p className="text-sm text-gray-400">暂无事件，点击「添加事件」。</p>
                ) : (
                  <ul className="space-y-6">
                    {(editingItem.events || []).map((ev, evIndex) => (
                      <li
                        key={ev.id}
                        className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">事件 {evIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeEvent(evIndex)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                        <AdminImageField
                          label="事件配图"
                          value={ev.image}
                          onChange={(v) => updateEvent(evIndex, { image: v })}
                          placeholder="/images/app/history/xxx.jpg"
                          subdir="history"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-2">
                            事件描述（{LANGS.find((l) => l.key === activeLang)?.label}）
                          </label>
                          <textarea
                            rows={3}
                            value={ev.description?.[activeLang] || ''}
                            onChange={(e) => updateEventDesc(evIndex, activeLang, e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  className="px-5 py-2 rounded-lg bg-[#086c7b] text-white text-sm font-medium hover:bg-[#065a66]"
                >
                  确认
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

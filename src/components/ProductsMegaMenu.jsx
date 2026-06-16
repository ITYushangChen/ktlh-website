import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { glField } from '../utils/productsCatalog';

/**
 * 桌面端产品 Mega Menu：左侧一级分类，右侧横向展示二级分类。
 */
export default function ProductsMegaMenu({ groups, lang, isOpen, onClose, currentPath }) {
  const gl = (field) => glField(field, lang);
  const [activeGroupId, setActiveGroupId] = useState(null);

  useEffect(() => {
    if (!isOpen || groups.length === 0) return;
    const match = groups.find((group) =>
      group.categories.some(
        (cat) =>
          currentPath === cat.link || currentPath.startsWith(`${cat.link}/`)
      )
    );
    setActiveGroupId(match?.id ?? groups[0].id);
  }, [isOpen, groups, currentPath]);

  if (!isOpen || groups.length === 0) return null;

  const activeGroup =
    groups.find((g) => g.id === activeGroupId) ?? groups[0];

  return (
    <div
      className="w-full border-t border-gray-100 bg-white shadow-lg rounded-b-lg overflow-hidden"
      role="menu"
      aria-label="Products"
    >
      <div className="max-w-6xl mx-auto flex min-h-[min(220px,40vh)]">
        {/* 一级分类侧栏 */}
        <aside
          className="w-[min(100%,13rem)] shrink-0 bg-gray-50/90 border-r border-gray-100 py-2"
          role="presentation"
        >
          {groups.map((group) => {
            const isActive = group.id === activeGroup?.id;
            return (
              <button
                key={group.id}
                type="button"
                role="menuitem"
                aria-current={isActive ? 'true' : undefined}
                onMouseEnter={() => setActiveGroupId(group.id)}
                onFocus={() => setActiveGroupId(group.id)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-l-[3px] ${
                  isActive
                    ? 'border-[#086c7b] bg-white text-[#086c7b] font-semibold shadow-sm'
                    : 'border-transparent text-gray-700 hover:bg-white/80 hover:text-[#086c7b]'
                }`}
              >
                {gl(group.title)}
              </button>
            );
          })}
        </aside>

        {/* 二级分类：横向分列 */}
        <div className="flex-1 min-w-0 px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-1">
            {activeGroup?.categories.map((cat) => {
              const isCurrent =
                currentPath === cat.link || currentPath.startsWith(`${cat.link}/`);
              const desc = gl(cat.description);
              return (
                <Link
                  key={cat.id}
                  to={cat.link}
                  role="menuitem"
                  onClick={onClose}
                  className={`group block rounded-md py-2.5 px-2 -mx-2 transition-colors ${
                    isCurrent
                      ? 'text-[#086c7b]'
                      : 'text-gray-800 hover:text-[#086c7b]'
                  }`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span className="inline-flex items-center text-sm font-semibold">
                    {gl(cat.title)}
                    <span
                      className="ml-1 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#086c7b]"
                      aria-hidden
                    >
                      ›
                    </span>
                  </span>
                  {desc && (
                    <span className="mt-0.5 block text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {desc}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/products"
              onClick={onClose}
              className="text-sm font-medium text-[#086c7b] hover:text-[#065a66] transition-colors"
            >
              {lang?.startsWith('zh')
                ? '查看全部产品'
                : lang?.startsWith('ja')
                  ? 'すべての製品を見る'
                  : 'View all products'}
              <span className="ml-0.5" aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

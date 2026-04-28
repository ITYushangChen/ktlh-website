import '@google/model-viewer';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function encodePublicPath(path) {
  if (/^https?:\/\//i.test(path)) {
    return encodeURI(path);
  }
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const segments = withSlash.split('/').filter(Boolean);
  return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

/** model-viewer 需要 kebab-case 布尔/字符串属性：用对象 spread（见官方 React 示例）。 */
const viewerHtmlProps = {
  'camera-controls': true,
  'touch-action': 'pan-y',
  'auto-rotate': true,
  ar: true,
  'background-color': '#ffffff',
};

export default function ProductGlbViewer({ glbUrl }) {
  const { t } = useTranslation();
  const mvRef = useRef(null);
  const [phase, setPhase] = useState(() => 'loading');

  const src = useMemo(() => (glbUrl ? encodePublicPath(glbUrl) : ''), [glbUrl]);

  const flushLoadedState = useCallback((el) => {
    try {
      if (el.loaded) setPhase('ready');
    } catch {
      /* model-viewer 未就绪 */
    }
  }, []);

  useLayoutEffect(() => {
    if (!src) {
      setPhase('error');
      return undefined;
    }

    const el = mvRef.current;
    if (!el) return undefined;

    setPhase('loading');

    const onLoad = () => setPhase('ready');
    const onError = (e) => {
      console.error('[ProductGlbViewer]', e);
      setPhase('error');
    };

    el.addEventListener('load', onLoad);
    el.addEventListener('error', onError);
    flushLoadedState(el);
    const raf = requestAnimationFrame(() => flushLoadedState(el));

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onError);
    };
  }, [src, flushLoadedState]);

  if (!glbUrl) {
    return null;
  }

  return (
    <div className="mt-6 w-full">
      <div className="mb-2 text-sm font-medium text-gray-800">{t('products.viewer3dTitle')}</div>
      <div
        className="relative w-full min-h-[260px] h-[min(52vh,420px)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
        role="img"
        aria-label={t('products.viewer3dAria')}
      >
        {phase === 'error' ? (
          <div className="flex min-h-[260px] h-full flex-col justify-center px-4 py-12 text-center text-sm text-gray-600">
            {t('products.viewer3dError')}
          </div>
        ) : (
          <>
            {phase === 'loading' && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/80 px-4 text-center text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block size-4 animate-spin rounded-full border-2 border-[#086c7b] border-t-transparent"
                    aria-hidden
                  />
                  {t('products.viewer3dLoading')}
                </span>
              </div>
            )}
            {/* @google/model-viewer 原生标签；布尔属性为空字符串等价于勾选 */}
            {/* eslint-disable-next-line react/no-unknown-property -- web component */}
            <model-viewer
              key={src}
              ref={mvRef}
              src={src}
              alt={t('products.viewer3dAria')}
              className="block h-full w-full"
              style={{ width: '100%', height: '100%', minHeight: 260 }}
              {...viewerHtmlProps}
            />
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">{t('products.viewer3dTip')}</p>
    </div>
  );
}

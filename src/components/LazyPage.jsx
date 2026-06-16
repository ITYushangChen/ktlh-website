import { Suspense, lazy } from 'react';
import PageFallback from './PageFallback';

/** 包裹 React.lazy 页面，统一 Suspense 占位 */
export function LazyPage({ page: Page }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  );
}

export { lazy, Suspense };

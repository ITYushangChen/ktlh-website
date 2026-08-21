import { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import PageFallback from './PageFallback';

/** 包裹 React.lazy 页面，统一 Suspense 占位 */
export function LazyPage({ page: Page }) {
  const location = useLocation();
  return (
    // 用路径作为 key，切换路由时重建 Suspense 边界：
    // 防止上一个懒加载页面的挂起块在切换瞬间被错误渲染进新页面
    <Suspense key={location.pathname} fallback={<PageFallback />}>
      <Page />
    </Suspense>
  );
}

export { lazy, Suspense };

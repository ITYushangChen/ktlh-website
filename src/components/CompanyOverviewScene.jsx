import { useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * 公司概况虚线空心圆环：
 * - 中空的环形圆，边缘线使用虚线（品牌绿）；
 * - 圆环中心落在容器左/右边缘，只呈现半圆（另一半被容器裁掉）；
 * - 随鼠标下滑按滚动进度旋转（完整下滑两圈）；
 * - 淡入上浮由外层区块的 CSS 动画统一提供。
 */
export default function CompanyOverviewScene({ side = 'right' }) {
  const rootRef = useRef(null);
  const progress = useScrollProgress(rootRef);
  const angle = progress * 720;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* 环形圆容器：中心对准容器左/右边缘 */}
      <div
        className="absolute inset-y-0"
        style={{ left: side === 'right' ? '0%' : '-100%', width: '200%' }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-[min(88%,720px)] aspect-square rounded-full border-4 border-dashed border-[#086c7b]/85"
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            boxShadow:
              'inset 0 0 70px rgba(8,108,123,0.10), 0 0 70px rgba(8,108,123,0.10)',
          }}
        />
      </div>
    </div>
  );
}

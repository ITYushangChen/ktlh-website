import { useEffect, useState } from 'react';

/**
 * 手机端判定（<768px，与导航栏 md 断点一致）。
 * 用于仅在手机版关闭动画/滚动定格，桌面版行为不受影响。
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}

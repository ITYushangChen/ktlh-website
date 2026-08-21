import { useEffect, useState } from 'react';

/**
 * 根据元素在视口中的位置计算滚动进度（0 ~ 1）。
 * 默认：元素顶部进入视口 80% 高度时开始（0），
 * 元素底部到达视口 40% 高度时完成（1）。
 */
export function useScrollProgress(ref, { start = 0.8, end = 0.4 } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh * (start - end);
      const p = (vh * start - rect.top) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, start, end]);

  return progress;
}

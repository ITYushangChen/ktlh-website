import { useEffect, useRef, useState } from 'react';

/**
 * 滚动锁定 + 进度驱动：
 * - 元素 100% 进入视口后进入 animating 阶段（IntersectionObserver 检测）；
 * - animating 期间拦截滚轮 / 触摸滚动，页面保持不动，滚动量转换为 progress(0~1)；
 * - progress 达到 1 后进入 done，恢复页面正常滚动；
 * - 元素滚出视口会自动解锁（避免页面被永久拦截）。
 */
export function useScrollPinReveal(ref) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('inactive'); // inactive | animating | done
  const stateRef = useRef({ progress: 0, phase: 'inactive' });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const s = stateRef.current;
        if (entry.isIntersecting) {
          if (s.phase === 'inactive') {
            s.phase = 'animating';
            setPhase('animating');
          }
        } else if (s.phase === 'animating') {
          s.phase = 'inactive';
          setPhase('inactive');
        }
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    let touchStartY = null;

    const engageIfVisible = () => {
      const s = stateRef.current;
      if (s.phase !== 'inactive') return;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 元素完整在视口内，或高度接近视口且覆盖了视口大部分区域时进入锁定动画
      const fullyVisible = r.height >= 4 && r.top >= -2 && r.bottom <= vh + 2;
      const fillsViewport =
        r.height >= vh * 0.5 &&
        r.height <= vh * 1.15 &&
        r.top <= vh * 0.18 &&
        r.bottom >= vh * 0.82;
      if (fullyVisible || fillsViewport) {
        s.phase = 'animating';
        setPhase('animating');
      }
    };

    const onWheel = (e) => {
      const s = stateRef.current;
      if (s.phase !== 'animating') {
        engageIfVisible();
        if (s.phase !== 'animating') return;
      }
      e.preventDefault();
      const next = Math.min(1, Math.max(0, s.progress + e.deltaY / 1000));
      s.progress = next;
      setProgress(next);
      if (next >= 1) {
        s.phase = 'done';
        setPhase('done');
      } else if (next <= 0 && e.deltaY < 0) {
        s.phase = 'inactive';
        s.progress = 0;
        setProgress(0);
        setPhase('inactive');
      }
    };

    const onTouchStart = (e) => {
      if (stateRef.current.phase !== 'animating') return;
      touchStartY = e.touches?.[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      const s = stateRef.current;
      if (s.phase !== 'animating') {
        engageIfVisible();
        if (s.phase !== 'animating') return;
      }
      const y = e.touches?.[0]?.clientY ?? touchStartY;
      if (touchStartY == null || y == null) {
        touchStartY = y;
        return;
      }
      const delta = touchStartY - y;
      touchStartY = y;
      e.preventDefault();
      const next = Math.min(1, Math.max(0, s.progress + delta / 500));
      s.progress = next;
      setProgress(next);
      if (next >= 1) {
        s.phase = 'done';
        setPhase('done');
      } else if (next <= 0 && delta < 0) {
        s.phase = 'inactive';
        s.progress = 0;
        setProgress(0);
        setPhase('inactive');
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [ref]);

  return { progress, phase };
}

import { useEffect, useRef, useState } from 'react';

/**
 * 自动播放式滚动锁定：
 * - 区块顶部到达视口上沿附近后自动进入 animating（无需用户输入）；
 * - animating 期间锁定滚轮 / 触摸 / 键盘滚动，页面保持不动，
 *   progress 按 duration 自动从 0 播放到 1；
 * - 播放结束进入 done，恢复页面正常滚动；
 * - 用户滚回区块上方时重置，可再次触发。
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useScrollPinPlay(
  ref,
  { duration = 2600, enabled = true, minWidth = 0 } = {},
) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('inactive'); // inactive | animating | done
  const stateRef = useRef({ progress: 0, phase: 'inactive' });
  const playbackRef = useRef(0);
  const optsRef = useRef({ duration, enabled, minWidth });
  optsRef.current = { duration, enabled, minWidth };

  const reset = () => {
    const s = stateRef.current;
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = 0;
    }
    s.progress = 0;
    s.phase = 'inactive';
    setProgress(0);
    setPhase('inactive');
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const mqWidth =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(`(min-width: ${Math.max(0, optsRef.current.minWidth)}px)`)
        : null;
    const mqReduced =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const eligible = () => {
      const { enabled: on, minWidth: minW } = optsRef.current;
      if (!on) return false;
      if (minW > 0 && mqWidth && !mqWidth.matches) return false;
      return true;
    };

    const cancelPlayback = () => {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
        playbackRef.current = 0;
      }
    };

    const begin = () => {
      const s = stateRef.current;
      if (!eligible() || s.phase !== 'inactive') return;

      // 系统偏好减弱动效：直接完成，不锁定页面
      if (mqReduced && mqReduced.matches) {
        s.progress = 1;
        s.phase = 'done';
        setProgress(1);
        setPhase('done');
        return;
      }

      cancelPlayback();
      s.phase = 'animating';
      setPhase('animating');
      const startedAt = performance.now();
      const { duration: ms } = optsRef.current;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - startedAt) / ms));
        const value = easeInOutCubic(t);
        s.progress = value;
        setProgress(value);
        if (t >= 1) {
          s.phase = 'done';
          setPhase('done');
          playbackRef.current = 0;
        } else {
          playbackRef.current = requestAnimationFrame(tick);
        }
      };
      playbackRef.current = requestAnimationFrame(tick);
    };

    const check = () => {
      const s = stateRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const inZone = r.top <= vh * 0.12 && r.bottom >= vh * 0.35;
      if (s.phase === 'inactive') {
        if (inZone) begin();
      } else if (s.phase === 'animating') {
        if (!inZone) reset();
      } else if (s.phase === 'done') {
        if (r.top > vh * 0.55) reset();
      }
    };

    const onScroll = () => check();

    const onWheel = (e) => {
      const s = stateRef.current;
      if (s.phase !== 'animating') {
        check();
        if (s.phase !== 'animating') return;
      }
      if (s.phase === 'animating') e.preventDefault();
    };

    const onTouchStart = () => {
      // 占位：进入 animating 后由 touchmove 统一拦截
    };
    const onTouchMove = (e) => {
      const s = stateRef.current;
      if (s.phase !== 'animating') {
        check();
        if (s.phase !== 'animating') return;
      }
      if (s.phase === 'animating') e.preventDefault();
    };

    const onKeyDown = (e) => {
      if (stateRef.current.phase !== 'animating') return;
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) e.preventDefault();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    // 首帧检查（例如通过锚点直接进入区块）
    check();

    return () => {
      cancelPlayback();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ref]);

  return { progress, phase };
}

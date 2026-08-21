import { useEffect, useRef, useState } from 'react';

/**
 * 滚动锁定 + 分步驱动：
 * - trigger='top-zone'：元素顶部进入视口上部后进入 animating（适合整块高于视口的情况）；
 * - trigger='fully-visible'：元素 100% 进入视口后进入 animating（IntersectionObserver 检测）；
 * - animating 期间通过 CSS 级滚动锁（overflow:hidden + 滚动条宽度补偿）让页面物理上无法
 *   滚动，配合滚轮/触摸/键盘拦截，页面完全静止、不会上下移动或闪动；
 * - 每次滚轮/触摸事件最多推进 1 步，到达最后一步后进入 done，恢复页面正常滚动；
 * - 只在向下滚动时触发锁定，向上滚动回到区块时不会卡住页面。
 */
export function useScrollPinSteps(
  ref,
  {
    stepCount = 1,
    enabled = true,
    minWidth = 0,
    resetOnExit = false,
    trigger = 'fully-visible',
  } = {},
) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('inactive'); // inactive | animating | done
  const stateRef = useRef({ step: 0, phase: 'inactive' });
  const optsRef = useRef({ stepCount, enabled, minWidth, resetOnExit, trigger });
  optsRef.current = { stepCount, enabled, minWidth, resetOnExit, trigger };
  const pinnedYRef = useRef(null);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const lockStateRef = useRef(null);

  const applyScrollLock = () => {
    const de = document.documentElement;
    const body = document.body;
    if (lockStateRef.current || !de || !body) return;
    lockStateRef.current = {
      htmlOverflow: de.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - de.clientWidth;
    de.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  const releaseScrollLock = () => {
    const st = lockStateRef.current;
    if (!st) return;
    const de = document.documentElement;
    const body = document.body;
    de.style.overflow = st.htmlOverflow;
    body.style.overflow = st.bodyOverflow;
    body.style.paddingRight = st.bodyPaddingRight;
    lockStateRef.current = null;
  };

  useEffect(() => {
    return () => releaseScrollLock();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined' && trigger !== 'top-zone') {
      return undefined;
    }

    const widthOk = () => {
      const { minWidth: minW } = optsRef.current;
      if (minW <= 0) return true;
      const mq =
        typeof window !== 'undefined' && window.matchMedia
          ? window.matchMedia(`(min-width: ${minW}px)`)
          : null;
      return !mq || mq.matches;
    };

    const inZone = () => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (optsRef.current.trigger === 'top-zone') {
        return r.top <= vh * 0.18 && r.bottom >= vh * 0.3;
      }
      return r.height >= 4 && r.top >= -2 && r.bottom <= vh + 2;
    };

    const toInactive = () => {
      const s = stateRef.current;
      releaseScrollLock();
      pinnedYRef.current = null;
      s.step = 0;
      s.phase = 'inactive';
      setStep(0);
      setPhase('inactive');
    };

    const engage = () => {
      const s = stateRef.current;
      applyScrollLock();
      s.phase = 'animating';
      setPhase('animating');
      // 定格更严谨：把元素顶部对齐到视口 8% 处，让每次锁定位置一致（限制回拉幅度避免跳动）
      const vh = window.innerHeight || 1;
      const r = el.getBoundingClientRect();
      const delta = r.top - vh * 0.08;
      pinnedYRef.current = window.scrollY;
      if (Math.abs(delta) > 4 && Math.abs(delta) < vh * 0.18) {
        pinnedYRef.current = window.scrollY + delta;
        window.scrollTo(0, pinnedYRef.current);
      }
    };

    const check = () => {
      const s = stateRef.current;
      const { enabled: on, stepCount: count } = optsRef.current;
      if (!on || count < 2 || !widthOk()) return;
      const y = window.scrollY;
      const scrollingDown = y > lastScrollYRef.current;
      lastScrollYRef.current = y;
      if (s.phase === 'inactive') {
        // 只在向下滚动时触发锁定，避免向上滚动回到区块时页面被卡住
        if (scrollingDown && inZone()) engage();
      } else if (s.phase === 'animating' && !inZone()) {
        toInactive();
      } else if (s.phase === 'done' && optsRef.current.resetOnExit && !inZone()) {
        toInactive();
      }
    };

    const onScroll = () => {
      // 页面已通过 CSS 级滚动锁（overflow:hidden）物理锁定，
      // 不再做 scrollTo 回拉，避免任何向上闪动。
      check();
    };

    if (optsRef.current.trigger === 'top-zone') {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => {
        window.removeEventListener('scroll', onScroll);
        releaseScrollLock();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const s = stateRef.current;
        const { stepCount: count, enabled: on, resetOnExit: reset } = optsRef.current;
        if (!on || count < 2 || !widthOk()) return;
        if (entry.isIntersecting) {
          if (s.phase === 'inactive') engage();
        } else if (reset && s.phase !== 'inactive') {
          toInactive();
        } else if (s.phase === 'animating') {
          toInactive();
        }
      },
      { threshold: 1 },
    );
    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      releaseScrollLock();
    };
  }, [ref, trigger]);

  useEffect(() => {
    const el = ref.current;
    let acc = 0;
    let touchStartY = null;
    let touchAcc = 0;

    const engageIfVisible = () => {
      const s = stateRef.current;
      const { stepCount: count, enabled: on, minWidth: minW } = optsRef.current;
      if (s.phase !== 'inactive' || !on || count < 2) return;
      if (minW > 0) {
        const mq = window.matchMedia?.(`(min-width: ${minW}px)`);
        if (mq && !mq.matches) return;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const inZone =
        optsRef.current.trigger === 'top-zone'
          ? r.top <= vh * 0.18 && r.bottom >= vh * 0.3
          : r.height >= 4 && r.top >= -2 && r.bottom <= vh + 2;
      if (inZone) {
        applyScrollLock();
        s.phase = 'animating';
        setPhase('animating');
        pinnedYRef.current = window.scrollY;
      }
    };

    const advance = (dir) => {
      const s = stateRef.current;
      const { stepCount: count } = optsRef.current;
      const last = Math.max(0, count - 1);
      const next = Math.min(last, Math.max(0, s.step + dir));
      s.step = next;
      setStep(next);
      if (next >= last) {
        releaseScrollLock();
        s.phase = 'done';
        pinnedYRef.current = null;
        setPhase('done');
      } else if (next <= 0 && dir < 0) {
        releaseScrollLock();
        s.phase = 'inactive';
        s.step = 0;
        pinnedYRef.current = null;
        setStep(0);
        setPhase('inactive');
      }
    };

    const onWheel = (e) => {
      const s = stateRef.current;
      if (s.phase !== 'animating') {
        // 向上滚动时不做锁定，保证可以从区块往回滚动
        if (e.deltaY > 0) engageIfVisible();
        if (s.phase !== 'animating') return;
      }
      e.preventDefault();
      acc += e.deltaY;
      // 一次滚轮事件最多推进 1 步，避免快速/高精度滚动一次跳过整个动画
      if (acc >= 100) {
        acc = 0;
        advance(1);
      } else if (acc <= -100) {
        acc = 0;
        advance(-1);
      }
    };

    const onTouchStart = (e) => {
      if (stateRef.current.phase !== 'animating') return;
      touchStartY = e.touches?.[0]?.clientY ?? null;
      touchAcc = 0;
    };
    const onTouchMove = (e) => {
      const s = stateRef.current;
      const y = e.touches?.[0]?.clientY ?? touchStartY;
      if (touchStartY == null || y == null) {
        touchStartY = y;
        return;
      }
      const delta = touchStartY - y;
      touchStartY = y;
      if (s.phase !== 'animating') {
        // 向下滑动（delta>0）才触发锁定
        if (delta > 0) engageIfVisible();
        if (s.phase !== 'animating') return;
      }
      e.preventDefault();
      touchAcc += delta;
      // 一次触摸移动事件最多推进 1 步
      if (touchAcc >= 80) {
        touchAcc = 0;
        advance(1);
      } else if (touchAcc <= -80) {
        touchAcc = 0;
        advance(-1);
      }
    };

    const onKeyDown = (e) => {
      if (stateRef.current.phase !== 'animating') return;
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) e.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      releaseScrollLock();
    };
  }, [ref]);

  return { step, phase };
}

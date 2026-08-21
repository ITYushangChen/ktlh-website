import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 关闭浏览器自动恢复滚动位置，避免从其他页面（已滚动到底部）跳转回来时先闪现中间/底部内容
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // 在浏览器绘制新页面前把滚动位置重置到顶部，保证首屏定格视图直接出现
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null; // 这个组件不需要渲染任何内容
};

export default ScrollToTop;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // 使用 'instant' 而不是 'smooth' 以避免滚动动画
    });
  }, [pathname]);

  return null; // 这个组件不需要渲染任何内容
};

export default ScrollToTop; 
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import './i18n';
import App from './App';
import { fetchProductsJson } from './utils/productsCatalog';

// 应用启动时预取 products.json（单例缓存），保证进入首页时首屏数据已就绪，直接展示定格视图
fetchProductsJson().catch(() => {});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
); 

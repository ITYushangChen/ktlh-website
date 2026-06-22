import React, { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { LazyPage } from './components/LazyPage';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const SiteStatement = lazy(() => import('./pages/SiteStatement'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ProductCategoryDetail = lazy(() => import('./pages/products/ProductCategoryDetail'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCertifications = lazy(() => import('./pages/admin/AdminCertifications'));
const AdminPartnersMap = lazy(() => import('./pages/admin/AdminPartnersMap'));
const AdminCompanyHistory = lazy(() => import('./pages/admin/AdminCompanyHistory'));

function LegacyProductDetailRedirect() {
  const { categoryPath } = useParams();
  return <Navigate to={`/products/${categoryPath}`} replace />;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<LazyPage page={About} />} />
          <Route path="/products" element={<LazyPage page={Products} />} />
          <Route path="/products/:categoryPath/:productId" element={<LegacyProductDetailRedirect />} />
          <Route path="/products/:categoryPath" element={<LazyPage page={ProductCategoryDetail} />} />
          <Route path="/careers" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<LazyPage page={Contact} />} />
          <Route path="/terms" element={<LazyPage page={SiteStatement} />} />
          <Route path="/privacy" element={<LazyPage page={PrivacyPolicy} />} />
        </Route>
        <Route path="/admin/login" element={<LazyPage page={AdminLogin} />} />
        <Route path="/admin/jobs" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/product-details/*" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/products" element={<LazyPage page={AdminProducts} />} />
        <Route path="/admin/certifications" element={<LazyPage page={AdminCertifications} />} />
        <Route path="/admin/partners-map" element={<LazyPage page={AdminPartnersMap} />} />
        <Route path="/admin/company-history" element={<LazyPage page={AdminCompanyHistory} />} />
        <Route path="/admin" element={<LazyPage page={AdminLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;

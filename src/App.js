import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Receivers from './pages/products/Receivers';
import GasLiquidSeparators from './pages/products/GasLiquidSeparators';
import OilSeparators from './pages/products/OilSeparators';
import DampingBlocks from './pages/products/DampingBlocks';
import ShellTubeHeatExchangers from './pages/products/ShellTubeHeatExchangers';
import CopperTubeSeries from './pages/products/CopperTubeSeries';
import PlateHeatExchangers from './pages/products/PlateHeatExchangers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminJobs from './pages/admin/AdminJobs';
import './i18n';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
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
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/receivers" element={<Receivers />} />
          <Route path="/products/gas-liquid-separators" element={<GasLiquidSeparators />} />
          <Route path="/products/oil-separators" element={<OilSeparators />} />
          <Route path="/products/damping-blocks" element={<DampingBlocks />} />
          <Route path="/products/shell-tube-heat-exchangers" element={<ShellTubeHeatExchangers />} />
          <Route path="/products/copper-tube-series" element={<CopperTubeSeries />} />
          <Route path="/products/plate-heat-exchangers" element={<PlateHeatExchangers />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App; 
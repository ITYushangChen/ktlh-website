import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './i18n'; // 导入i18n配置

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 
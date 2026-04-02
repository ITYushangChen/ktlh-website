import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [productSubItems, setProductSubItems] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(`/content/products.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        const active = (data.categories || []).filter(c => c.active !== false);
        setProductSubItems(active.map(c => ({
          path: c.link,
          titleObj: c.title,
        })));
      })
      .catch(() => setProductSubItems([]));
  }, []);

  const gl = (field) => {
    if (!field || typeof field === 'string') return field || '';
    return field[i18n.language] || field.zh || '';
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    {
      path: '/products',
      label: t('nav.products'),
      subItems: productSubItems.map(s => ({ path: s.path, label: gl(s.titleObj) })),
    },
    { path: '/contact', label: t('nav.contact') }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  /** 当前一级导航是否激活（首页仅匹配 /） */
  const isNavActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navActiveClass = 'font-semibold text-[#086c7b] bg-[#086c7b]/12';
  const navInactiveClass = 'text-gray-700 hover:text-[#086c7b]';
  const navLinkBase =
    'px-2 py-1.5 rounded-md text-sm transition-colors duration-300';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="Logo" className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.subItems ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.path}
                      className={`inline-flex items-center space-x-1 ${navLinkBase} ${
                        isNavActive(item.path) ? navActiveClass : navInactiveClass
                      } transition-colors duration-300`}
                      aria-current={isNavActive(item.path) ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`w-4 h-4 shrink-0 transform transition-transform duration-200 pointer-events-none ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Link>
                    <div
                      className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${
                        activeDropdown === index
                          ? 'opacity-100 transform translate-y-0 visible'
                          : 'opacity-0 transform -translate-y-2 invisible'
                      }`}
                    >
                      {item.subItems.map((subItem, subIndex) => {
                        const subCurrent = location.pathname === subItem.path;
                        return (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                              subCurrent
                                ? 'font-semibold text-[#086c7b] bg-[#086c7b]/8'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-[#086c7b]'
                            }`}
                            aria-current={subCurrent ? 'page' : undefined}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`${navLinkBase} ${
                      isNavActive(item.path) ? navActiveClass : navInactiveClass
                    }`}
                    aria-current={isNavActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#086c7b] focus:outline-none"
              aria-label="菜单"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[min(70vh,calc(100vh-3.5rem))] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-100">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.subItems ? (
                  <div>
                    <div className="flex items-stretch rounded-md overflow-hidden border border-transparent">
                      <Link
                        to={item.path}
                        className={`flex-1 min-w-0 px-3 py-2 text-left transition-colors ${
                          isNavActive(item.path)
                            ? `${navActiveClass}`
                            : 'text-gray-700 hover:text-[#086c7b] hover:bg-gray-50'
                        }`}
                        aria-current={isNavActive(item.path) ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(index)}
                        className={`shrink-0 px-3 py-2 border-l border-gray-100 text-gray-500 hover:text-[#086c7b] hover:bg-gray-50 transition-colors ${
                          isNavActive(item.path) ? 'bg-[#086c7b]/5' : ''
                        }`}
                        aria-expanded={activeDropdown === index}
                        aria-label={t('nav.expandSubmenu')}
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-200 ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={`pl-4 space-y-1 transition-all duration-200 z-50 ${
                        activeDropdown === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      {item.subItems.map((subItem, subIndex) => {
                        const subCurrent = location.pathname === subItem.path;
                        return (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`block px-3 py-2 rounded-md transition-colors ${
                              subCurrent
                                ? 'font-semibold text-[#086c7b] bg-[#086c7b]/10'
                                : 'text-gray-700 hover:text-[#086c7b] hover:bg-gray-50'
                            }`}
                            aria-current={subCurrent ? 'page' : undefined}
                            onClick={() => {
                              setIsOpen(false);
                              setActiveDropdown(null);
                            }}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md transition-colors ${
                      isNavActive(item.path)
                        ? 'font-semibold text-[#086c7b] bg-[#086c7b]/10'
                        : 'text-gray-700 hover:text-[#086c7b] hover:bg-gray-50'
                    }`}
                    aria-current={isNavActive(item.path) ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Newspaper,
  Bot,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  LogIn,
  Menu,
  X,
  Languages,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard, authRequired: false },
    { to: '/market-prices', label: t('nav_mandi'), icon: Sprout, authRequired: false },
    { to: '/price-trends', label: t('nav_trends'), icon: TrendingUp, authRequired: false },
    { to: '/weather', label: t('nav_weather'), icon: CloudSun, authRequired: false },
    { to: '/schemes', label: t('nav_schemes'), icon: FileText, authRequired: false },
    { to: '/news', label: t('nav_news'), icon: Newspaper, authRequired: false },
    { to: '/assistant', label: t('nav_assistant'), icon: Bot, authRequired: false, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      {/* Top emergency / advisory ticker */}
      <div className="bg-krishi-800 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-harvest-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">Toll Free</span>
            <span>Kisan Call Center: <strong>1800-180-1551</strong> (6:00 AM - 10:00 PM)</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-krishi-200 transition-colors font-medium bg-krishi-900/60 px-2 py-0.5 rounded text-xs"
            title="Toggle English / हिंदी"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
          </button>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-krishi-700 to-krishi-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-krishi-900 tracking-tight block leading-none">
                {t('app_name')}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-krishi-600">
                {language === 'hi' ? 'स्मार्ट कृषि मंच' : 'Smart Agriculture Hub'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-krishi-50 text-krishi-700 font-semibold shadow-xs'
                        : item.highlight
                        ? 'text-krishi-700 bg-harvest-50 hover:bg-harvest-100'
                        : 'text-gray-600 hover:text-krishi-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-harvest-600' : ''}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`
                }
              >
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>{t('nav_admin')}</span>
              </NavLink>
            )}
          </div>

          {/* User Profile / Auth Action */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-krishi-300 hover:bg-krishi-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-krishi-100 text-krishi-800 font-bold flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-gray-800 leading-tight">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-gray-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-krishi-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-krishi-600 hover:bg-krishi-700 rounded-lg shadow-sm transition-all"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-krishi-50 text-krishi-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-krishi-600" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
            >
              <ShieldAlert className="w-5 h-5 text-purple-600" />
              <span>{t('nav_admin')}</span>
            </NavLink>
          )}

          <div className="pt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 font-medium hover:bg-gray-50"
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span>{user?.name} ({t('nav_profile')})</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 font-medium hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav_logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-krishi-600 rounded-lg shadow-sm"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

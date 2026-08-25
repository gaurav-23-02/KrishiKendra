import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-krishi-500 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t('app_name')}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A unified agricultural intelligence platform empowering farmers with live market price discovery, weather forecasting, and official government welfare schemes.
            </p>
            <div className="flex items-center gap-2 text-xs text-krishi-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded on Official Open Government Data</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Farmer Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/market-prices" className="hover:text-krishi-400 transition-colors">
                  Mandi Market Rates
                </Link>
              </li>
              <li>
                <Link to="/price-trends" className="hover:text-krishi-400 transition-colors">
                  Historical Price Trends
                </Link>
              </li>
              <li>
                <Link to="/weather" className="hover:text-krishi-400 transition-colors">
                  Weather & Agro-Advisories
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-krishi-400 transition-colors">
                  Government Subsidies & Schemes
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-krishi-400 transition-colors">
                  Krishi AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-krishi-400 transition-colors">
                  <span>Open Government Data (data.gov.in)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-krishi-400 transition-colors">
                  <span>Agmarknet Mandi Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-krishi-400 transition-colors">
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-krishi-400 transition-colors">
                  <span>Pradhan Mantri Fasal Bima</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-krishi-400 transition-colors">
                  <span>National Agriculture Market (e-NAM)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Farmer Helplines
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 text-krishi-400 font-semibold mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Kisan Call Centre</span>
                </div>
                <p className="text-xl font-bold text-white">1800-180-1551</p>
                <p className="text-xs text-gray-400 mt-0.5">Toll-free 24x7 farmer advisory</p>
              </div>

              <p className="text-xs text-gray-400">
                Contact your district Krishi Vigyan Kendra (KVK) or local APMC Mandi secretary for physical verification.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Krishi Kendra Platform. Designed for Indian Farmers & Agriculture.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for India's Annadatas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Bot,
  ShieldCheck,
  ArrowRight,
  Search,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { weatherService } from '../services/weatherService';
import { schemeService } from '../services/schemeService';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/formatters';

const LandingPage = () => {
  const { t } = useLanguage();
  const [highlights, setHighlights] = useState([]);
  const [weatherSample, setWeatherSample] = useState(null);
  const [popularSchemes, setPopularSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [prices, weather, schemes] = await Promise.all([
          marketService.getHighlights(null, 4),
          weatherService.getWeather('Bhopal'),
          schemeService.getRecentSchemes(3)
        ]);
        setHighlights(prices || []);
        setWeatherSample(weather || null);
        setPopularSchemes(schemes || []);
      } catch (e) {
        console.error("Landing page data load error:", e);
      }
    };
    loadLandingData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-krishi-900 via-krishi-800 to-krishi-900 text-white pt-16 pb-24 rounded-3xl mx-4 sm:mx-8 mt-4 shadow-2xl border border-krishi-700">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-harvest-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-harvest-400" />
            <span>Official Smart Agriculture Information Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {t('hero_title')}
          </h1>

          <p className="text-base sm:text-xl text-krishi-100 max-w-3xl mx-auto leading-relaxed font-normal">
            {t('hero_subtitle')}
          </p>

          {/* Quick Search & Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/market-prices"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              <Sprout className="w-5 h-5" />
              <span>{t('btn_check_mandi')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/assistant"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2 text-base"
            >
              <Bot className="w-5 h-5 text-harvest-300" />
              <span>{t('btn_ask_ai')}</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-krishi-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-harvest-400" />
              <span>100% Verified Mandi APMC Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-harvest-400" />
              <span>Agrometeorological Advisories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-harvest-400" />
              <span>Central & State Direct DBT Links</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Mandi Ticker Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">Live Rates</span>
            <h2 className="text-2xl font-black text-gray-900">Today's Mandi Price Highlights</h2>
          </div>
          <Link
            to="/market-prices"
            className="text-sm font-bold text-krishi-700 hover:text-krishi-900 flex items-center gap-1"
          >
            <span>Explore All Mandis</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-krishi-50 text-krishi-700 border border-krishi-100">
                  {item.commodity}
                </span>
                <span className="text-xs text-gray-400">{item.state}</span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">{item.market} APMC</h4>
              <div className="my-3">
                <span className="text-2xl font-black text-krishi-800 block">
                  {formatCurrency(item.modalPrice)}
                </span>
                <span className="text-xs text-gray-500">Range: {formatCurrency(item.minimumPrice)} - {formatCurrency(item.maximumPrice)} / quintal</span>
              </div>
              <Link
                to={`/price-trends?commodity=${encodeURIComponent(item.commodity)}&market=${encodeURIComponent(item.market)}`}
                className="text-xs font-semibold text-krishi-600 hover:text-krishi-800 flex items-center gap-1 mt-2"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>View Historical Trend</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Key Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">Complete Agricultural Suite</span>
          <h2 className="text-3xl font-black text-gray-900">Everything a Farmer Needs in One Place</h2>
          <p className="text-sm text-gray-600">
            Designed simply for seamless access across mobile phones, tablets, and computers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-krishi-50 text-krishi-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mandi Market Rates</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Real-time commodity price tracking across hundreds of APMC mandis. Filter by state, district, and crop to discover the best modal prices.
            </p>
            <Link to="/market-prices" className="text-xs font-bold text-krishi-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Search Mandi Prices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Weather & Agro-Advisories</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Accurate 5-day forecasts and practical informational suggestions for irrigation, spraying windows, and extreme temperature precautions.
            </p>
            <Link to="/weather" className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Check Weather Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Price Trend Charts</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Visualize 7-day to 1-year historical price fluctuations with Recharts. Spot price peaks, averages, and percentage growth trends before selling.
            </p>
            <Link to="/price-trends" className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Price Graphs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Government Schemes</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Central and state welfare programs including PM-KISAN, PMFBY crop insurance, micro-irrigation subsidies, and Kisan Credit Card.
            </p>
            <Link to="/schemes" className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Browse All Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Grounded AI Assistant</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Ask natural-language questions about crop rates, weather, and subsidies. The AI is grounded in verified database facts to prevent hallucinations.
            </p>
            <Link to="/assistant" className="text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Chat with Krishi Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-krishi-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Farmer Hub</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Bookmark favorite crops and mandis for instant tracking on your dashboard. Manage state and language preferences in English or Hindi.
            </p>
            <Link to="/register" className="text-xs font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Register Farmer Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Government Schemes */}
      <section className="bg-krishi-50/60 py-16 border-y border-krishi-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-2">
            <div>
              <span className="text-xs font-bold text-krishi-700 uppercase tracking-wider">Direct Benefits</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Featured Government Welfare Schemes</h2>
            </div>
            <Link to="/schemes" className="text-sm font-bold text-krishi-800 hover:underline flex items-center gap-1">
              <span>View All Schemes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-3 inline-block">
                    {scheme.category}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{scheme.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">{scheme.description}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-400 capitalize">{scheme.state} Scheme</span>
                  <Link to="/schemes" className="font-bold text-krishi-700 hover:text-krishi-900">
                    Apply & Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-krishi-800 via-krishi-700 to-krishi-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-krishi-600 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Start Accessing Verified Agricultural Information Today
            </h2>
            <p className="text-krishi-100 text-sm sm:text-base max-w-xl mx-auto">
              Join thousands of farmers making informed decisions on harvesting, mandi selling, and government welfare benefits.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-bold shadow-md transition-all text-base"
              >
                Create Free Account
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all text-base"
              >
                Open Farmer Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

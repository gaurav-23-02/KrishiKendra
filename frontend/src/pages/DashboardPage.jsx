import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Newspaper,
  Bot,
  Star,
  MapPin,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { weatherService } from '../services/weatherService';
import { schemeService } from '../services/schemeService';
import { newsService } from '../services/newsService';
import { favoriteService } from '../services/favoriteService';
import WeatherCard from '../components/WeatherCard';
import PriceCard from '../components/PriceCard';
import SchemeCard from '../components/SchemeCard';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatCurrency, timeAgo } from '../utils/formatters';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  const userCity = user?.district || user?.state || 'Bhopal';
  const userState = user?.state || 'Madhya Pradesh';

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, priceData, schemeData, newsData] = await Promise.all([
        weatherService.getWeather(userCity),
        marketService.getHighlights(userState, 4),
        schemeService.getRecentSchemes(3),
        newsService.getRecentNews(3)
      ]);

      setWeather(weatherData);
      setHighlights(priceData || []);
      setSchemes(schemeData || []);
      setNews(newsData || []);

      if (isAuthenticated) {
        try {
          const favData = await favoriteService.getFavorites();
          setFavorites(favData || []);
        } catch (favErr) {
          console.warn("Favorites fetch failed:", favErr);
        }
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("Unable to load live dashboard data. Displaying cached records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [userCity, userState, isAuthenticated]);

  const toggleFavorite = async (item) => {
    if (!isAuthenticated) return;
    try {
      const existing = favorites.find(
        (f) => f.commodity.toLowerCase() === item.commodity.toLowerCase() && f.market.toLowerCase() === item.market.toLowerCase()
      );
      if (existing) {
        await favoriteService.removeFavorite(existing.id);
        setFavorites(favorites.filter((f) => f.id !== existing.id));
      } else {
        const added = await favoriteService.addFavorite(item.commodity, item.market);
        setFavorites([added, ...favorites]);
      }
    } catch (e) {
      console.error("Toggle favorite failed:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your farmer dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting & Location */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
            Farmer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Namaste, {user?.name || "Kisan Mitra"}! 🙏
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-krishi-600" />
            <span>Serving {userCity}, {userState}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboard}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            to="/assistant"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-harvest-400 hover:bg-harvest-300 rounded-xl shadow-xs transition-all"
          >
            <Bot className="w-4 h-4 text-slate-900" />
            <span>Ask Krishi AI</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {t('card_quick_actions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/market-prices"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-krishi-50 text-krishi-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-krishi-700">{t('btn_check_mandi')}</span>
          </Link>

          <Link
            to="/price-trends"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-amber-700">{t('btn_view_trends')}</span>
          </Link>

          <Link
            to="/weather"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700">{t('btn_view_weather')}</span>
          </Link>

          <Link
            to="/schemes"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">{t('btn_view_schemes')}</span>
          </Link>

          <Link
            to="/news"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700">{t('btn_view_news')}</span>
          </Link>

          <Link
            to="/assistant"
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-krishi-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-harvest-50 text-harvest-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-harvest-700">{t('btn_ask_ai')}</span>
          </Link>
        </div>
      </div>

      {/* Weather & Bookmarked Favorites Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="lg:col-span-1">
          <WeatherCard weather={weather} onRefresh={loadDashboard} />
        </div>

        {/* Favorites Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {t('card_favorites_title')}
                </h3>
              </div>
              <Link to="/market-prices" className="text-xs font-bold text-krishi-700 hover:underline">
                + Add More
              </Link>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {favorites.map((fav) => (
                  <div key={fav.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 relative group">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-800">{fav.commodity}</span>
                      <span className="text-[10px] text-gray-500">{fav.market}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-lg font-extrabold text-krishi-800">
                        {fav.latestModalPrice ? formatCurrency(fav.latestModalPrice) : 'Fetching...'}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{t('lbl_quintal')}</span>
                    </div>
                    <Link
                      to={`/price-trends?commodity=${encodeURIComponent(fav.commodity)}&market=${encodeURIComponent(fav.market)}`}
                      className="text-[11px] font-semibold text-krishi-600 hover:underline flex items-center gap-1 mt-2"
                    >
                      <span>Chart</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500 bg-gray-50 rounded-xl">
                <p>No crops bookmarked yet. Click the star icon on any crop in Mandi Rates to track it here.</p>
                <Link to="/market-prices" className="inline-block mt-2 font-bold text-krishi-700 hover:underline">
                  Browse Mandi Prices →
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Prices refreshed continuously from state APMC servers</span>
            <Link to="/price-trends" className="font-semibold text-krishi-700 hover:underline">
              Analyze all trends →
            </Link>
          </div>
        </div>
      </div>

      {/* Mandi Price Highlights Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-gray-900">{t('card_mandi_title')} ({userState})</h3>
            <p className="text-xs text-gray-500">Live modal transaction rates per quintal</p>
          </div>
          <Link to="/market-prices" className="text-xs font-bold text-krishi-700 hover:underline flex items-center gap-1">
            <span>View All Mandis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item) => {
            const isFav = favorites.some(
              (f) => f.commodity.toLowerCase() === item.commodity.toLowerCase() && f.market.toLowerCase() === item.market.toLowerCase()
            );
            return (
              <PriceCard
                key={item.id}
                item={item}
                isFavorite={isFav}
                onToggleFavorite={isAuthenticated ? toggleFavorite : null}
              />
            );
          })}
        </div>
      </div>

      {/* Government Schemes & News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schemes Widget */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">{t('card_schemes_title')}</h3>
            <Link to="/schemes" className="text-xs font-bold text-krishi-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-krishi-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize">{scheme.state}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{scheme.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{scheme.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-krishi-700">
                  <span>Click to view benefits & apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural News & Advisories Widget */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">{t('card_news_title')}</h3>
            <Link to="/news" className="text-xs font-bold text-krishi-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-krishi-300 transition-all cursor-pointer flex items-start gap-3"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-0.5">
                    <span className="font-semibold text-gray-600">{item.source}</span>
                    <span>•</span>
                    <span>{timeAgo(item.publishedAt)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-krishi-50 text-krishi-800 border border-krishi-100 inline-block mb-2">
                  {selectedScheme.category} • {selectedScheme.state}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">{selectedScheme.name}</h3>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Description</h4>
                <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">{selectedScheme.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Key Benefits</h4>
                <p className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-emerald-900">{selectedScheme.benefits}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Eligibility Criteria</h4>
                <p className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-blue-900">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">How to Apply</h4>
                <p className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 text-purple-900">{selectedScheme.applicationProcess}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close
              </button>

              {selectedScheme.officialUrl && (
                <a
                  href={selectedScheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider block mb-1">
                  {selectedNews.category} • {selectedNews.source}
                </span>
                <h3 className="text-xl font-black text-gray-900">{selectedNews.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {selectedNews.imageUrl && (
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-56 object-cover rounded-2xl"
              />
            )}

            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <div className="bg-gray-50 p-4 rounded-xl font-medium border border-gray-100">
                {selectedNews.summary}
              </div>
              {selectedNews.content && (
                <div className="p-2 whitespace-pre-line">
                  {selectedNews.content}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close
              </button>

              {selectedNews.sourceUrl && (
                <a
                  href={selectedNews.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Full Official Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

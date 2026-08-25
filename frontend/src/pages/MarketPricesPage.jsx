import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Star,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Download
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';

const MarketPricesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState('');
  const [market, setMarket] = useState('');
  const [commodity, setCommodity] = useState('');
  const [priceDate, setPriceDate] = useState('');

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);
  const [commoditiesList, setCommoditiesList] = useState([]);

  const [pricesData, setPricesData] = useState({
    content: [],
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
    last: true
  });

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load distinct filters on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [states, commodities] = await Promise.all([
          marketService.getStates(),
          marketService.getCommodities()
        ]);
        setStatesList(states || []);
        setCommoditiesList(commodities || []);
      } catch (e) {
        console.error("Filter metadata load error:", e);
      }
    };
    loadMetadata();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (state) {
      marketService.getDistricts(state).then(setDistrictsList).catch(console.error);
    } else {
      setDistrictsList([]);
    }
    setDistrict('');
    setMarket('');
  }, [state]);

  // Update markets when district/state changes
  useEffect(() => {
    marketService.getMarkets(state, district).then(setMarketsList).catch(console.error);
    setMarket('');
  }, [state, district]);

  // Load user favorites
  useEffect(() => {
    if (isAuthenticated) {
      favoriteService.getFavorites().then(setFavorites).catch(console.error);
    }
  }, [isAuthenticated]);

  // Fetch prices
  const fetchPrices = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await marketService.searchPrices({
        state: state || undefined,
        district: district || undefined,
        market: market || undefined,
        commodity: commodity || undefined,
        priceDate: priceDate || undefined,
        page: pageNumber,
        size: 15
      });
      setPricesData(data);
    } catch (err) {
      console.error("Search prices error:", err);
      setError("Market data is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrices(0);
  };

  const handleReset = () => {
    setState('');
    setDistrict('');
    setMarket('');
    setCommodity('');
    setPriceDate('');
    setTimeout(() => {
      marketService.searchPrices({ page: 0, size: 15 }).then(setPricesData).catch(console.error);
    }, 50);
  };

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
      console.error("Favorite toggle error:", e);
    }
  };

  const isFavorite = (comm, mkt) => {
    return favorites.some(
      (f) => f.commodity.toLowerCase() === comm.toLowerCase() && f.market.toLowerCase() === mkt.toLowerCase()
    );
  };

  const exportCSV = () => {
    if (!pricesData.content || pricesData.content.length === 0) return;
    const headers = "Commodity,Market,District,State,Min Price (Rs),Max Price (Rs),Modal Price (Rs),Date\n";
    const rows = pricesData.content.map(p =>
      `"${p.commodity}","${p.market}","${p.district}","${p.state}",${p.minimumPrice},${p.maximumPrice},${p.modalPrice},"${p.priceDate}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mandi_prices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
            Agricultural Produce Market Committee (APMC)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {t('nav_mandi')} Discovery
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Search arrival rates, minimums, maximums, and modal prices across India
          </p>
        </div>

        {pricesData.content?.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-krishi-600" />
            <span>Export Table (CSV)</span>
          </button>
        )}
      </div>

      {/* Filter Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t('lbl_state')}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
              >
                <option value="">All States</option>
                {statesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t('lbl_district')}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state || districtsList.length === 0}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all disabled:opacity-50"
              >
                <option value="">All Districts</option>
                {districtsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Market */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t('lbl_market')}
              </label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
              >
                <option value="">All Markets</option>
                {marketsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Commodity */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t('lbl_commodity')}
              </label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                placeholder="e.g. Wheat, Mustard"
                list="commodity-suggestions"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
              />
              <datalist id="commodity-suggestions">
                {commoditiesList.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t('lbl_date')}
              </label>
              <input
                type="date"
                value={priceDate}
                onChange={(e) => setPriceDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {pricesData.totalElements} recorded transactions
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                {t('btn_reset')}
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-krishi-600 hover:bg-krishi-700 rounded-xl shadow-xs transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('btn_search')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <LoadingSpinner message="Searching verified mandi price data..." />
      ) : pricesData.content?.length === 0 ? (
        <EmptyState
          title={t('empty_mandi')}
          message="Try selecting 'All States' or removing the date filter to view historical records."
          onReset={handleReset}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Commodity</th>
                  <th className="py-3.5 px-4">Market / Mandi</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Min Price</th>
                  <th className="py-3.5 px-4">Max Price</th>
                  <th className="py-3.5 px-4">Modal Price</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricesData.content.map((p) => {
                  const fav = isFavorite(p.commodity, p.market);
                  return (
                    <tr key={p.id} className="hover:bg-krishi-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-krishi-50 text-krishi-800 border border-krishi-100">
                          {p.commodity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        {p.market}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {p.district}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {p.state}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {formatCurrency(p.minimumPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {formatCurrency(p.maximumPrice)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-black text-krishi-700 bg-krishi-100/70 px-2.5 py-1 rounded-md">
                          {formatCurrency(p.modalPrice)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(p.priceDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isAuthenticated && (
                            <button
                              onClick={() => toggleFavorite(p)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                fav
                                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
                              }`}
                              title={fav ? "Remove favorite" : "Bookmark crop"}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          )}

                          <Link
                            to={`/price-trends?commodity=${encodeURIComponent(p.commodity)}&market=${encodeURIComponent(p.market)}`}
                            className="p-1.5 rounded-lg text-krishi-600 hover:text-krishi-800 hover:bg-krishi-50 transition-colors"
                            title="View price trend line chart"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="text-gray-500">
              Page <strong>{pricesData.page + 1}</strong> of <strong>{pricesData.totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={pricesData.page === 0}
                onClick={() => fetchPrices(pricesData.page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={pricesData.last || pricesData.page + 1 >= pricesData.totalPages}
                onClick={() => fetchPrices(pricesData.page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPricesPage;

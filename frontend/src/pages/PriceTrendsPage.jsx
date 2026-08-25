import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { POPULAR_CROPS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const PriceTrendsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const initialCommodity = searchParams.get('commodity') || 'Wheat';
  const initialMarket = searchParams.get('market') || '';

  const [commodity, setCommodity] = useState(initialCommodity);
  const [market, setMarket] = useState(initialMarket);
  const [days, setDays] = useState(30);

  const [commoditiesList, setCommoditiesList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);

  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    marketService.getCommodities().then(list => {
      setCommoditiesList(list?.length > 0 ? list : POPULAR_CROPS);
    }).catch(console.error);

    marketService.getMarkets(null, null).then(setMarketsList).catch(console.error);
  }, []);

  const loadTrends = async (c = commodity, m = market, d = days) => {
    setLoading(true);
    setError(null);
    try {
      const data = await marketService.getPriceTrends(c, m || undefined, d);
      setTrendData(data);
    } catch (err) {
      console.error("Trends fetch error:", err);
      setError("Historical price trend data is currently unavailable for this selection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends(commodity, market, days);
    // Update URL query parameters cleanly
    setSearchParams({ commodity, ...(market ? { market } : {}) });
  }, [commodity, market, days]);

  const formattedPoints = trendData?.dataPoints?.map((p) => ({
    date: formatDate(p.date),
    rawDate: p.date,
    modalPrice: p.modalPrice,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
          <p className="font-semibold text-gray-300 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-krishi-400" />
            <span>{label}</span>
          </p>
          <p className="text-harvest-400 font-extrabold text-sm">
            Modal: {formatCurrency(payload[0]?.value)} / q
          </p>
          {payload[1] && (
            <p className="text-gray-300 text-[11px]">
              Min: {formatCurrency(payload[1]?.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
            Market Intelligence & Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {t('nav_trends')} Visualization
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Analyze historical modal pricing patterns and price momentum before selling produce
          </p>
        </div>

        {/* Timeframe selector pills */}
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          {[
            { label: '7 Days', val: 7 },
            { label: '1 Month', val: 30 },
            { label: '3 Months', val: 90 },
            { label: '1 Year', val: 365 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDays(item.val)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                days === item.val
                  ? 'bg-white text-krishi-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Select Crop / Commodity
          </label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
          >
            {commoditiesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Select Mandi / Market (Optional)
          </label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
          >
            <option value="">All Markets (Regional Aggregate)</option>
            {marketsList.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Rendering historical price analytics..." />
      ) : error || !trendData || formattedPoints.length === 0 ? (
        <EmptyState
          title="Historical trend information is unavailable for this selection"
          message="Try selecting another commodity like Wheat, Mustard, or Soybean, or choose 'All Markets'."
          onReset={() => {
            setCommodity('Wheat');
            setMarket('');
            setDays(30);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Current Modal Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Current Price
              </span>
              <div className="text-2xl font-black text-krishi-800 mt-1">
                {formatCurrency(trendData.currentPrice)}
              </div>
              <span className="text-[10px] text-gray-400">Latest recorded modal rate</span>
            </div>

            {/* Highest Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Highest (Peak)
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {formatCurrency(trendData.highestPrice)}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">In selected timeframe</span>
            </div>

            {/* Lowest Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Lowest Price
              </span>
              <div className="text-2xl font-black text-red-600 mt-1">
                {formatCurrency(trendData.lowestPrice)}
              </div>
              <span className="text-[10px] text-red-500 font-medium">In selected timeframe</span>
            </div>

            {/* Average Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Average Price
              </span>
              <div className="text-2xl font-black text-gray-800 mt-1">
                {formatCurrency(trendData.averagePrice)}
              </div>
              <span className="text-[10px] text-gray-400">Mean modal price</span>
            </div>

            {/* Percentage Change */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                Period Trend
              </span>
              <div className={`text-2xl font-black mt-1 flex items-center gap-1 ${
                trendData.percentageChange > 0
                  ? 'text-emerald-600'
                  : trendData.percentageChange < 0
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {trendData.percentageChange > 0 && <ArrowUpRight className="w-5 h-5" />}
                {trendData.percentageChange < 0 && <ArrowDownRight className="w-5 h-5" />}
                {trendData.percentageChange === 0 && <Minus className="w-5 h-5" />}
                <span>{trendData.percentageChange > 0 ? `+${trendData.percentageChange}%` : `${trendData.percentageChange}%`}</span>
              </div>
              <span className="text-[10px] text-gray-400">Since start of period</span>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {commodity} Price Movement ({trendData.market})
                </h3>
                <p className="text-xs text-gray-500">
                  Daily Modal Price (₹/Quintal) over time
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-krishi-600"></span>
                  <span>Modal Price (₹)</span>
                </span>
              </div>
            </div>

            <div className="h-80 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedPoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#46993d" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#46993d" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="modalPrice"
                    stroke="#357c2e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorModal)"
                    activeDot={{ r: 6, fill: '#264f23', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Farmer Advisory / Timing Insight */}
          <div className="bg-gradient-to-r from-krishi-50 to-emerald-50/60 p-6 rounded-3xl border border-krishi-200/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-krishi-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-krishi-900 text-sm">
                Mandi Selling Advisory for {commodity}
              </h4>
              <p className="text-krishi-800 leading-relaxed">
                Prices for <strong>{commodity}</strong> in {trendData.market} are currently trading at <strong>{formatCurrency(trendData.currentPrice)}</strong>, representing a <strong>{trendData.percentageChange}%</strong> trend over the past {days} days. Ensure harvested lots are graded for optimal moisture (below 10-12%) before arrival to capture top modal rates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTrendsPage;

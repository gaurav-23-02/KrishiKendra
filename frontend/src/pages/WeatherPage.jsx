import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Navigation,
  Droplets,
  Wind,
  Compass,
  Sunrise,
  Sunset,
  ShieldAlert,
  Thermometer,
  CloudRain,
  Info,
  Calendar
} from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const WeatherPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const defaultCity = user?.district || user?.state || 'Bhopal';
  const [city, setCity] = useState(defaultCity);
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (targetCity = city, lat = null, lon = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeather(targetCity, lat, lon);
      setWeatherData(data);
      if (data?.location) setCity(data.location);
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setError("Unable to load weather forecast for the specified location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(defaultCity);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      loadWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleGPSLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(null, position.coords.latitude, position.coords.longitude);
        },
        (geoErr) => {
          console.warn("Geolocation denied:", geoErr);
          loadWeather(city);
        }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Agrometeorological Advisory Service
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {t('nav_weather')} & Farm Guidance
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time conditions, 5-day forecast, and weather-driven agricultural advisories
          </p>
        </div>

        {/* Location Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city/district..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            {t('btn_search')}
          </button>

          <button
            type="button"
            onClick={handleGPSLocation}
            title="Use current GPS location"
            className="p-2 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-2xs"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching live meteorological data..." />
      ) : error || !weatherData ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-4">{error || "No weather data found."}</p>
          <button
            onClick={() => loadWeather('Bhopal')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Load Default (Bhopal)
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Weather Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{weatherData.location}, {weatherData.country}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white capitalize">
                  {weatherData.description || weatherData.condition}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Updated today at {weatherData.sunrise ? weatherData.sunrise : 'Morning'}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-5xl sm:text-6xl font-black text-harvest-400">
                    {Math.round(weatherData.temperature)}°C
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {t('lbl_feels_like')} {weatherData.feelsLike}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-white/10 text-xs">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <Droplets className="w-6 h-6 text-blue-300 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">{t('lbl_humidity')}</span>
                  <span className="text-base font-bold">{weatherData.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <Wind className="w-6 h-6 text-teal-300 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">{t('lbl_wind')}</span>
                  <span className="text-base font-bold">{weatherData.windSpeed} km/h</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <Sunrise className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Sunrise</span>
                  <span className="text-base font-bold">{weatherData.sunrise || "05:58 AM"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <Sunset className="w-6 h-6 text-orange-300 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Sunset</span>
                  <span className="text-base font-bold">{weatherData.sunset || "06:45 PM"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Agricultural Forecast */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">5-Day Agricultural Forecast</h3>
                <p className="text-xs text-gray-500">Anticipate moisture, temperature swings, and rain probability</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {weatherData.forecast?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-center"
                >
                  <span className="text-xs font-bold text-gray-800 block mb-2">{item.date}</span>
                  <div className="my-2">
                    <CloudSun className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-gray-700 capitalize block">{item.condition}</span>
                  </div>

                  <div className="my-2">
                    <span className="text-xl font-black text-gray-900">{Math.round(item.temp)}°C</span>
                    <span className="text-[11px] text-gray-400 block">{Math.round(item.tempMin)}° / {Math.round(item.tempMax)}°</span>
                  </div>

                  {item.rainProbability > 0 && (
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 py-1 rounded-lg mt-2">
                      <CloudRain className="w-3 h-3" />
                      <span>{Math.round(item.rainProbability)}% Rain</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weather-Based Agricultural Guidance Cards */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-krishi-600" />
              <h3 className="text-lg font-black text-gray-900">Weather-Based Agricultural Suggestions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherData.advisories?.map((adv, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-krishi-100 shadow-xs flex items-start gap-3.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-krishi-50 text-krishi-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-black">{idx + 1}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {adv}
                  </p>
                </div>
              ))}
            </div>

            {/* Disclaimer Alert */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Informational Notice:</strong> These weather-based suggestions are general guidance based on meteorological thresholds. Please adapt practices based on soil type, local crop stage, and consultation with your local Krishi Vigyan Kendra (KVK).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;

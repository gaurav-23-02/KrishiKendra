import React from 'react';
import { CloudSun, Droplets, Wind, Thermometer, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WeatherCard = ({ weather, onRefresh }) => {
  const { t } = useLanguage();

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-krishi-800 to-krishi-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
      {/* Background soft glow decor */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-krishi-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-krishi-300 block">
            {t('card_weather_title')}
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {weather.location}
          </h3>
          <p className="text-xs text-krishi-200 capitalize mt-0.5">
            {weather.description || weather.condition}
          </p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-extrabold text-harvest-400 flex items-start justify-end">
            <span>{Math.round(weather.temperature)}</span>
            <span className="text-2xl text-harvest-300 font-medium">°C</span>
          </div>
          <span className="text-[11px] text-gray-300">
            {t('lbl_feels_like')}: {weather.feelsLike}°C
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 my-4 text-xs">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-300" />
          <div>
            <span className="text-gray-300 block text-[10px]">{t('lbl_humidity')}</span>
            <span className="font-bold">{weather.humidity}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-teal-300" />
          <div>
            <span className="text-gray-300 block text-[10px]">{t('lbl_wind')}</span>
            <span className="font-bold">{weather.windSpeed} km/h</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-300" />
          <div>
            <span className="text-gray-300 block text-[10px]">Min / Max</span>
            <span className="font-bold">{weather.tempMin}° / {weather.tempMax}°</span>
          </div>
        </div>
      </div>

      {/* Weather Agro-Advisory */}
      {weather.advisories && weather.advisories.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-xs border border-white/10">
          <div className="flex items-center gap-1.5 text-harvest-300 font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('lbl_advisories')}</span>
          </div>
          <p className="text-gray-200 leading-relaxed text-[11px]">
            {weather.advisories[0]}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;

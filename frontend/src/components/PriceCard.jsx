import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, MapPin, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

const PriceCard = ({ item, isFavorite, onToggleFavorite }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-krishi-50 text-krishi-700 border border-krishi-100 mb-1">
              {item.commodity}
            </span>
            <h4 className="text-base font-bold text-gray-900 group-hover:text-krishi-700 transition-colors">
              {item.market} Mandi
            </h4>
          </div>

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(item)}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{item.district}, {item.state}</span>
        </div>

        {/* Modal Price Highlight */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
          <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            {t('lbl_modal_price')}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-krishi-800">
              {formatCurrency(item.modalPrice)}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {t('lbl_quintal')}
            </span>
          </div>

          {/* Min - Max Range */}
          <div className="flex justify-between items-center text-[11px] text-gray-500 pt-2 mt-2 border-t border-gray-200/60">
            <span>Min: <strong className="text-gray-700">{formatCurrency(item.minimumPrice)}</strong></span>
            <span>Max: <strong className="text-gray-700">{formatCurrency(item.maximumPrice)}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(item.priceDate)}</span>
        </div>

        <Link
          to={`/price-trends?commodity=${encodeURIComponent(item.commodity)}&market=${encodeURIComponent(item.market)}`}
          className="inline-flex items-center gap-1 font-semibold text-krishi-600 hover:text-krishi-800 hover:underline"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{t('nav_trends')}</span>
        </Link>
      </div>
    </div>
  );
};

export default PriceCard;

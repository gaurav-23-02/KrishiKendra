import React from 'react';
import { ExternalLink, CheckCircle2, Award, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

const SchemeCard = ({ scheme, onSelect }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            scheme.state === 'Central' || scheme.state === 'central'
              ? 'bg-blue-50 text-blue-700 border border-blue-100'
              : 'bg-purple-50 text-purple-700 border border-purple-100'
          }`}>
            {scheme.state === 'Central' || scheme.state === 'central' ? 'Central Scheme' : `${scheme.state} State`}
          </span>

          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-harvest-50 text-harvest-700 border border-harvest-100">
            {scheme.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-krishi-700 transition-colors line-clamp-2">
          {scheme.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {scheme.description}
        </p>

        {/* Quick Benefits Highlight */}
        <div className="bg-krishi-50/60 rounded-xl p-3 mb-4 border border-krishi-100/60 space-y-2">
          <div className="flex items-start gap-2 text-xs text-krishi-900">
            <Award className="w-4 h-4 text-krishi-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Benefits:</strong>
              <span className="line-clamp-2 text-gray-700">{scheme.benefits}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-krishi-900 pt-1 border-t border-krishi-100">
            <CheckCircle2 className="w-4 h-4 text-krishi-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Eligibility:</strong>
              <span className="line-clamp-1 text-gray-700">{scheme.eligibility}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(scheme.lastUpdated)}</span>
        </span>

        <button
          onClick={() => onSelect(scheme)}
          className="inline-flex items-center gap-1 font-bold text-krishi-700 hover:text-krishi-900 hover:translate-x-0.5 transition-all"
        >
          <span>{t('btn_view_details')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;

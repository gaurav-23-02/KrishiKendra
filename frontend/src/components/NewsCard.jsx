import React from 'react';
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { formatDate, timeAgo } from '../utils/formatters';

const NewsCard = ({ article, onSelect }) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {article.imageUrl ? (
          <div className="h-44 overflow-hidden relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-krishi-800 shadow-xs">
              {article.category}
            </span>
          </div>
        ) : (
          <div className="h-28 bg-gradient-to-tr from-krishi-100 to-krishi-50 flex items-center justify-center p-4 relative">
            <Newspaper className="w-10 h-10 text-krishi-300" />
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-krishi-800 shadow-xs">
              {article.category}
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span className="font-semibold text-gray-600">{article.source}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{timeAgo(article.publishedAt) || formatDate(article.publishedAt)}</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900 group-hover:text-krishi-700 transition-colors line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 flex justify-between items-center text-xs">
        <button
          onClick={() => onSelect(article)}
          className="font-bold text-krishi-700 hover:text-krishi-900 flex items-center gap-1"
        >
          <span>Read Advisory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {article.sourceUrl && (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
            title="Open official source"
          >
            <span>Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
};

export default NewsCard;

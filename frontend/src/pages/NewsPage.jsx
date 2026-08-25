import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Search,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { NEWS_CATEGORIES } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDate, timeAgo } from '../utils/formatters';

const NewsPage = () => {
  const { t } = useLanguage();

  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState({
    content: [],
    page: 0,
    size: 9,
    totalElements: 0,
    totalPages: 0,
    last: true
  });

  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchNews = async (page = 0) => {
    setLoading(true);
    try {
      const data = await newsService.getNews({
        category: category !== 'All' ? category : undefined,
        query: searchQuery || undefined,
        page,
        size: 9
      });
      setNewsData(data);
    } catch (e) {
      console.error("News fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(0);
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
          Market Intelligence & Field Updates
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {t('nav_news')} & Advisories
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Stay updated on MSP announcements, monsoon forecasts, APMC arrival trends, and technical farm guides
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agricultural news headlines, advisories..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            {t('btn_search')}
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-krishi-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching latest agricultural updates..." />
      ) : newsData.content?.length === 0 ? (
        <EmptyState
          title={t('empty_news')}
          message="Try searching for another topic or selecting 'All' categories."
          onReset={() => {
            setCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.content.map((item) => (
              <NewsCard
                key={item.id}
                article={item}
                onSelect={(art) => setSelectedArticle(art)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
            <span className="text-gray-500">
              Page <strong>{newsData.page + 1}</strong> of <strong>{newsData.totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={newsData.page === 0}
                onClick={() => fetchNews(newsData.page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={newsData.last || newsData.page + 1 >= newsData.totalPages}
                onClick={() => fetchNews(newsData.page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider block mb-1">
                  {selectedArticle.category} • {selectedArticle.source}
                </span>
                <h3 className="text-xl font-black text-gray-900">{selectedArticle.title}</h3>
                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Published {formatDate(selectedArticle.publishedAt)}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {selectedArticle.imageUrl && (
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-2xl"
              />
            )}

            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <div className="bg-gray-50 p-4 rounded-xl font-medium border border-gray-100 text-gray-800">
                {selectedArticle.summary}
              </div>
              {selectedArticle.content && (
                <div className="p-2 whitespace-pre-line leading-relaxed">
                  {selectedArticle.content}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close
              </button>

              {selectedArticle.sourceUrl && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Full Official Source</span>
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

export default NewsPage;

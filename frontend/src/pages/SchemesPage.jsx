import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { schemeService } from '../services/schemeService';
import { SCHEME_CATEGORIES, INDIAN_STATES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeCard from '../components/SchemeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/formatters';

const SchemesPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const [type, setType] = useState('ALL'); // ALL, CENTRAL, STATE
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [schemesData, setSchemesData] = useState({
    content: [],
    page: 0,
    size: 9,
    totalElements: 0,
    totalPages: 0,
    last: true
  });

  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const fetchSchemes = async (page = 0) => {
    setLoading(true);
    try {
      const data = await schemeService.getSchemes({
        type: type !== 'ALL' ? type : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        state: selectedState || undefined,
        query: searchQuery || undefined,
        page,
        size: 9
      });
      setSchemesData(data);
    } catch (e) {
      console.error("Schemes fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(0);
  }, [type, selectedCategory, selectedState]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
            Farmer Welfare & Direct Benefit Transfer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {t('nav_schemes')} Directory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Explore authentic Central and State government agricultural subsidies, insurance, and credit support
          </p>
        </div>

        {/* Central / State Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          {[
            { label: 'All Schemes', val: 'ALL' },
            { label: 'Central Govt', val: 'CENTRAL' },
            { label: 'State Govt', val: 'STATE' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setType(tab.val)}
              className={`px-4 py-2 rounded-xl transition-all ${
                type === tab.val
                  ? 'bg-white text-krishi-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & State Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, eligibility, or benefit..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
            />
          </div>

          {type !== 'CENTRAL' && (
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-krishi-500"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            {t('btn_search')}
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-krishi-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingSpinner message="Searching official government agricultural schemes..." />
      ) : schemesData.content?.length === 0 ? (
        <EmptyState
          title={t('empty_schemes')}
          message="Try selecting 'All Schemes' or adjusting category filters."
          onReset={() => {
            setType('ALL');
            setSelectedCategory('All');
            setSelectedState('');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemesData.content.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onSelect={(s) => setSelectedScheme(s)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
            <span className="text-gray-500">
              Showing <strong>{schemesData.totalElements}</strong> schemes (Page {schemesData.page + 1} of {schemesData.totalPages || 1})
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={schemesData.page === 0}
                onClick={() => fetchSchemes(schemesData.page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={schemesData.last || schemesData.page + 1 >= schemesData.totalPages}
                onClick={() => fetchSchemes(schemesData.page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span>Visit Official Application Portal</span>
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

export default SchemesPage;

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Sprout,
  FileText,
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { schemeService } from '../services/schemeService';
import { newsService } from '../services/newsService';
import { SCHEME_CATEGORIES, NEWS_CATEGORIES, INDIAN_STATES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('stats'); // stats, schemes, news, users
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Schemes admin state
  const [schemes, setSchemes] = useState([]);
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    description: '',
    category: 'Financial Assistance',
    state: 'Central',
    benefits: '',
    eligibility: '',
    applicationProcess: '',
    officialUrl: ''
  });

  // News admin state
  const [newsList, setNewsList] = useState([]);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    source: 'Ministry of Agriculture',
    sourceUrl: '',
    category: 'Agriculture',
    imageUrl: ''
  });

  // Users admin state
  const [usersList, setUsersList] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, schemesData, newsData, usersData] = await Promise.all([
        adminService.getStats(),
        schemeService.getSchemes({ size: 100 }),
        newsService.getNews({ size: 100 }),
        adminService.getUsers(0, 50)
      ]);
      setStats(statsData);
      setSchemes(schemesData?.content || []);
      setNewsList(newsData?.content || []);
      setUsersList(usersData?.content || []);
    } catch (e) {
      console.error("Admin data load error:", e);
      setActionError("Failed to load administration data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Scheme CRUD
  const handleOpenSchemeModal = (scheme = null) => {
    if (scheme) {
      setEditingScheme(scheme);
      setSchemeForm({
        name: scheme.name,
        description: scheme.description,
        category: scheme.category,
        state: scheme.state,
        benefits: scheme.benefits,
        eligibility: scheme.eligibility,
        applicationProcess: scheme.applicationProcess,
        officialUrl: scheme.officialUrl || ''
      });
    } else {
      setEditingScheme(null);
      setSchemeForm({
        name: '',
        description: '',
        category: 'Financial Assistance',
        state: 'Central',
        benefits: '',
        eligibility: '',
        applicationProcess: '',
        officialUrl: ''
      });
    }
    setSchemeModalOpen(true);
  };

  const handleSaveScheme = async (e) => {
    e.preventDefault();
    try {
      if (editingScheme) {
        await schemeService.updateScheme(editingScheme.id, schemeForm);
        triggerSuccess("Scheme updated successfully.");
      } else {
        await schemeService.createScheme(schemeForm);
        triggerSuccess("New government scheme created.");
      }
      setSchemeModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save scheme failed:", err);
      setActionError("Failed to save scheme.");
    }
  };

  const handleDeleteScheme = async (id) => {
    if (window.confirm("Are you sure you want to delete this government scheme?")) {
      try {
        await schemeService.deleteScheme(id);
        triggerSuccess("Scheme deleted.");
        loadData();
      } catch (err) {
        console.error("Delete scheme failed:", err);
      }
    }
  };

  // News CRUD
  const handleOpenNewsModal = (item = null) => {
    if (item) {
      setEditingNews(item);
      setNewsForm({
        title: item.title,
        summary: item.summary,
        content: item.content || '',
        source: item.source,
        sourceUrl: item.sourceUrl || '',
        category: item.category,
        imageUrl: item.imageUrl || ''
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: '',
        summary: '',
        content: '',
        source: 'Ministry of Agriculture',
        sourceUrl: '',
        category: 'Agriculture',
        imageUrl: ''
      });
    }
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsService.updateNews(editingNews.id, newsForm);
        triggerSuccess("News article updated.");
      } else {
        await newsService.createNews(newsForm);
        triggerSuccess("New news article published.");
      }
      setNewsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save news failed:", err);
      setActionError("Failed to save news article.");
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Are you sure you want to delete this news advisory?")) {
      try {
        await newsService.deleteNews(id);
        triggerSuccess("News article deleted.");
        loadData();
      } catch (err) {
        console.error("Delete news failed:", err);
      }
    }
  };

  // User Management
  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'FARMER' : 'ADMIN';
    if (window.confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      try {
        await adminService.updateUserRole(user.id, newRole);
        triggerSuccess(`User role changed to ${newRole}.`);
        loadData();
      } catch (err) {
        console.error("Update role failed:", err);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(id);
        triggerSuccess("User removed.");
        loadData();
      } catch (err) {
        console.error("Delete user failed:", err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading platform administration portal..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Krishi Kendra Administration</h1>
          <p className="text-xs text-purple-200 mt-1">
            Manage official government welfare schemes, agricultural advisories, and system users
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1 bg-purple-950/60 p-1.5 rounded-2xl text-xs font-bold">
          {['stats', 'schemes', 'news', 'users'].map((tKey) => (
            <button
              key={tKey}
              onClick={() => setActiveTab(tKey)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                activeTab === tKey
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              {tKey}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 1. STATS VIEW */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Registered Users</span>
              <div className="text-3xl font-black text-gray-900 mt-1">{stats.totalUsers}</div>
              <span className="text-xs text-gray-400 mt-1 block">
                {stats.farmerUsers} Farmers • {stats.adminUsers} Admins
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-krishi-50 text-krishi-600 flex items-center justify-center mb-3">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Mandi Price Records</span>
              <div className="text-3xl font-black text-krishi-800 mt-1">{stats.totalPriceRecords}</div>
              <span className="text-xs text-gray-400 mt-1 block">Indexed from APMC servers</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Active Schemes</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">{stats.totalSchemes}</div>
              <span className="text-xs text-gray-400 mt-1 block">Central & State DBT Programs</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">News & Advisories</span>
              <div className="text-3xl font-black text-purple-700 mt-1">{stats.totalNews}</div>
              <span className="text-xs text-gray-400 mt-1 block">Field advisories published</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHEMES MANAGER */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Manage Welfare Schemes</h3>
            <button
              onClick={() => handleOpenSchemeModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scheme</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Scheme Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">State / Central</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                    <td className="py-3 px-4 text-gray-600">{s.category}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{s.state}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(s.lastUpdated)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenSchemeModal(s)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScheme(s.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. NEWS MANAGER */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Manage Agricultural News & Advisories</h3>
            <button
              onClick={() => handleOpenNewsModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Advisory</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Headline</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {newsList.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900 max-w-sm truncate">{n.title}</td>
                    <td className="py-3 px-4 text-gray-600">{n.category}</td>
                    <td className="py-3 px-4 text-gray-600">{n.source}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(n.publishedAt)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenNewsModal(n)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(n.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">User Directory</h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-600">{u.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{u.district}, {u.state}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-krishi-100 text-krishi-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-semibold"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scheme Create / Edit Modal */}
      {schemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">
              {editingScheme ? "Edit Scheme" : "Create New Government Scheme"}
            </h3>

            <form onSubmit={handleSaveScheme} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={schemeForm.name}
                  onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={schemeForm.category}
                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {SCHEME_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">State / Scope</label>
                  <select
                    value={schemeForm.state}
                    onChange={(e) => setSchemeForm({ ...schemeForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option value="Central">Central (National)</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.description}
                  onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Benefits *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.benefits}
                  onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Eligibility *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.eligibility}
                  onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Application Process *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.applicationProcess}
                  onChange={(e) => setSchemeForm({ ...schemeForm, applicationProcess: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={schemeForm.officialUrl}
                  onChange={(e) => setSchemeForm({ ...schemeForm, officialUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSchemeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-krishi-600 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Create / Edit Modal */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">
              {editingNews ? "Edit Advisory Article" : "Publish New Agricultural Advisory"}
            </h3>

            <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {NEWS_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Source Name *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.source}
                    onChange={(e) => setNewsForm({ ...newsForm, source: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Full Content</label>
                <textarea
                  rows={4}
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Source URL</label>
                <input
                  type="url"
                  value={newsForm.sourceUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-krishi-600 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Publish Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Star,
  Trash2,
  Check,
  AlertCircle,
  Save,
  Calendar
} from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { INDIAN_STATES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { language, setSpecificLanguage, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || 'Madhya Pradesh',
    district: user?.district || 'Bhopal',
    preferredLanguage: user?.preferredLanguage || 'en'
  });

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        state: user.state || 'Madhya Pradesh',
        district: user.district || 'Bhopal',
        preferredLanguage: user.preferredLanguage || 'en'
      });
    }
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data || []);
    } catch (e) {
      console.error("Favorites load error:", e);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await favoriteService.removeFavorite(id);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (e) {
      console.error("Remove favorite failed:", e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSavedSuccess(false);

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      setSpecificLanguage(formData.preferredLanguage);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
          Farmer Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {t('nav_profile')} Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal details, regional preferences, and favorite crop alerts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card / Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs text-center">
            <div className="w-20 h-20 rounded-full bg-krishi-100 text-krishi-700 font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
            <p className="text-xs text-gray-500">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                user?.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-krishi-50 text-krishi-800 border border-krishi-200'
              }`}>
                {user?.role} ACCOUNT
              </span>
            </div>

            <div className="mt-4 text-left text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{user?.district}, {user?.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Member since {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form & Favorites */}
        <div className="md:col-span-2 space-y-8">
          {/* Edit Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <h3 className="text-lg font-black text-gray-900 mb-6">Personal & Regional Settings</h3>

            {savedSuccess && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile details successfully updated!</span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (10 digits)
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Preferred App Language
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bookmarked Crops & Mandis */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <h3 className="text-lg font-black text-gray-900">Saved Favorite Crops & Mandis</h3>
            </div>

            {favorites.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {favorites.map((fav) => (
                  <div key={fav.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">{fav.commodity}</span>
                      <span className="text-gray-500">{fav.market} Mandi</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {fav.latestModalPrice && (
                        <span className="font-black text-krishi-800 text-sm">
                          {formatCurrency(fav.latestModalPrice)} / q
                        </span>
                      )}

                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">
                You haven't bookmarked any crops yet. Star crops on the Mandi Rates page to track them here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

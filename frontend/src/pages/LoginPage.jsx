import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.message || "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setEmail('farmer@krishikendra.gov.in');
    setPassword('Farmer@123');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@krishikendra.gov.in');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-krishi-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Welcome to {t('app_name')}
          </h2>
          <p className="text-sm text-gray-500">
            Log in to access personalized mandi rates and weather advisories
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="bg-krishi-50/80 border border-krishi-100 rounded-2xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold text-krishi-800 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Fill
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoFarmer}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-white text-krishi-700 hover:bg-krishi-100/60 border border-krishi-200 transition-colors shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Farmer Account</span>
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-krishi-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Log In to Krishi Kendra</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-krishi-700 hover:underline">
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

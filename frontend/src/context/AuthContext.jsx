import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('krishi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('krishi_user', JSON.stringify(currentUser));
        } catch (e) {
          console.error("Session verification error:", e);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('krishi_token', data.token);
    localStorage.setItem('krishi_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('krishi_token', data.token);
    localStorage.setItem('krishi_user', JSON.stringify(data.user));
    return data;
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    localStorage.setItem('krishi_user', JSON.stringify(updated));
    return updated;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isFarmer = user?.role === 'FARMER';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      isFarmer,
      login,
      register,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

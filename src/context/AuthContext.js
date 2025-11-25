import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------- Fetch User Data from Token & API ----------------------
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);

      // Token expiration check
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        logout();
        setLoading(false);
        return;
      }

      // Basic user info from JWT
      let userData = {
        id: decoded.user_id,
        email: decoded.email,
        username: decoded.username || 'User',
        role: decoded.role || 'buyer',
        displayName: decoded.username || 'User',
      };

      // Try fetching additional profile data
      try {
        const { data: profileData } = await api.get('/profiles/me/');
        if (profileData.name && profileData.name.trim() !== '') {
          userData.displayName = profileData.name;
        }
        userData = { ...userData, ...profileData };
      } catch (err) {
        // Silent fail is okay; keep JWT data
        console.warn("Profile fetch failed:", err);
      }

      setUser(userData);
    } catch (error) {
      console.error("Auth Init Error:", error);
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ---------------------- Login ----------------------
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/jwt/create/', { email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      await fetchUserData();
      return true;
    } catch (error) {
      throw error;
    }
  };

  // ---------------------- Register ----------------------
  const register = async (email, username, password, role) => {
    await api.post('/auth/users/', { email, username, password, role });
    await login(email, password);
  };

  // ---------------------- Logout ----------------------
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  // ---------------------- Context Value ----------------------
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);

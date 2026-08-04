import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { adminLogin, adminLogout, getAdminMe } from '../services/admin/authService';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem('admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('admin_token') || null;
  });

  const [loading, setLoading] = useState(true);

  const verifyAdmin = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getAdminMe();
      setAdminUser(data);
    } catch (err) {
      console.error('Verify admin session failed', err);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      setAdminToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAdmin();
  }, [verifyAdmin]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await adminLogin(email, password);
      localStorage.setItem('admin_token', data.token);
      const u = {
        fullName: data.fullName,
        email: data.email,
        role: data.role
      };
      localStorage.setItem('admin_user', JSON.stringify(u));
      setAdminToken(data.token);
      setAdminUser(u);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || { message: 'Authentication failed' };
    }
  };

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      setAdminToken(null);
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminToken, loading, login, logout, isAuthenticated: !!adminToken && adminUser?.role === 'ADMIN' }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

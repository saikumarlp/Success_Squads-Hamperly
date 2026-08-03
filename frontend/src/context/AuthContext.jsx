import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart/count');
      setCartCount(response.data.cartCount || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Check if token exists and fetch current user profile on init
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token validity with backend
          const response = await api.get('/users/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          // Fetch cart count
          const countRes = await api.get('/cart/count');
          setCartCount(countRes.data.cartCount || 0);
        } catch (error) {
          console.error("Token verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, fullName, email: userEmail } = response.data;

      localStorage.setItem('token', token);
      const userData = { fullName, email: userEmail };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Fetch cart count on login
      try {
        const countRes = await api.get('/cart/count');
        setCartCount(countRes.data.cartCount || 0);
      } catch (e) {
        console.error("Error fetching cart count on login", e);
      }

      return userData;
    } catch (error) {
      throw error.response?.data || { message: "Something went wrong" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      setCartCount(response.data.cartCount || 0);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add item to cart" };
    }
  };

  const updateCartQty = async (productId, quantity) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      setCartCount(response.data.cartCount || 0);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update item quantity" };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCartCount(response.data.cartCount || 0);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to remove item from cart" };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { message: error.response?.data?.message || error.message || "Something went wrong" };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { message: error.response?.data?.message || error.message || "Something went wrong" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, setUser, cartCount, addToCart, fetchCartCount, updateCartQty, removeFromCart }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart/count');
      setCartCount(response.data.cartCount || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlistItems(response.data || []);
      setWishlistCount(response.data.length || 0);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
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
          // Fetch wishlist
          await fetchWishlist();
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

      // Fetch wishlist on login
      try {
        await fetchWishlist();
      } catch (e) {
        console.error("Error fetching wishlist on login", e);
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

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCartCount(0);
      setWishlistCount(0);
      setWishlistItems([]);
    }
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

  const addToWishlist = async (productId) => {
    try {
      // Optimistic update
      setWishlistItems(prev => {
        if (prev.some(item => item.id === productId)) return prev;
        return [...prev, { id: productId }];
      });
      setWishlistCount(c => c + 1);

      const response = await api.post(`/wishlist/${productId}`);
      await fetchWishlist();
      return response.data;
    } catch (error) {
      await fetchWishlist();
      throw error.response?.data || { message: "Failed to add item to wishlist" };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // Optimistic update
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      setWishlistCount(c => Math.max(0, c - 1));

      const response = await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
      return response.data;
    } catch (error) {
      await fetchWishlist();
      throw error.response?.data || { message: "Failed to remove item from wishlist" };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, register, logout, forgotPassword, resetPassword, setUser, 
      cartCount, addToCart, fetchCartCount, updateCartQty, removeFromCart,
      wishlistCount, wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

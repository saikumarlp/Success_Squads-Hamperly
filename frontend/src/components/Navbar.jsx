import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from './Toast';
import api from '../services/api';

/**
 * Extracts initials from the user's full name (e.g., "Sai Prasad" -> "SP")
 */
const getInitials = (fullName) => {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Navbar = () => {
  const { user, logout, cartCount, updateCartQty, removeFromCart, fetchCartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');

  // Notifications States
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Local notifications list
  const [toasts, setToasts] = useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      const data = res.data || [];
      setNotifications(data);
      const countRes = await api.get('/notifications/unread-count');
      const newCount = countRes.data.unreadCount || 0;
      
      if (newCount > unreadNotificationsCount) {
        // Find newest unread notification
        const unread = data.filter(n => !n.read);
        if (unread.length > 0) {
          addToast(unread[0].message);
        }
      }
      setUnreadNotificationsCount(newCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [user, unreadNotificationsCount]);

  const handleNotificationClick = async (n) => {
    try {
      await api.patch(`/notifications/${n.id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
    setShowNotificationsDropdown(false);
    navigate('/orders');
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
        await api.patch(`/notifications/${n.id}/read`);
      }
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim() || !city.trim() || !stateVal.trim() || !postalCode.trim()) {
      addToast("Please fill in all shipping details.");
      return;
    }

    const loadScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const isScriptLoaded = await loadScript();
    if (!isScriptLoaded) {
      addToast("Failed to load payment gateway. Please check your internet connection.");
      return;
    }

    setCartLoading(true);
    try {
      const payload = {
        shippingAddress: shippingAddress.trim(),
        city: city.trim(),
        state: stateVal.trim(),
        country: country.trim(),
        postalCode: postalCode.trim()
      };
      const orderResponse = await api.post('/orders/create', payload);
      const { orderId, amount, currency, keyId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Luxury Gift Hampers",
        description: "Gift Hamper Purchase",
        order_id: orderId,
        handler: async function (response) {
          setCartLoading(true);
          try {
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };
            const verifyRes = await api.post('/orders/verify', verifyPayload);
            if (verifyRes.data.status === "SUCCESS") {
              addToast("Payment successful! Your order has been placed.");
              setCartItems([]);
              await fetchCartCount();
              setShowCartDrawer(false);
              setShowAddressForm(false);
              setShippingAddress('');
              setCity('');
              setStateVal('');
              setPostalCode('');
              navigate('/orders');
            } else {
              addToast("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Signature verification failed:", err);
            addToast(err.response?.data?.message || "Failed to verify payment signature.");
          } finally {
            setCartLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.mobileNumber || ''
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function () {
            addToast("Payment cancelled by user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      addToast(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleOpenCart = async () => {
    setShowCartDrawer(true);
    setCartLoading(true);
    try {
      const response = await api.get('/cart');
      setCartItems(response.data || []);
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
      addToast("Failed to retrieve cart items.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleUpdateQty = async (productId, nextQty) => {
    setCartLoading(true);
    try {
      await updateCartQty(productId, nextQty);
      const response = await api.get('/cart');
      setCartItems(response.data || []);
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      addToast(err.message || "Failed to update item quantity.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setCartLoading(true);
    try {
      await removeFromCart(productId);
      const response = await api.get('/cart');
      setCartItems(response.data || []);
      addToast("Item removed from cart.");
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      addToast("Failed to remove item.");
    } finally {
      setCartLoading(false);
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleDummyAction = (featureName) => {
    addToast(`"${featureName}" features will be available soon.`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 py-lg-3 position-relative">
      {/* Local Navbar Toast Stack */}
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center text-dark me-3" to={user ? "/dashboard" : "/login"}>
          <img 
            src="/Hamperly.png" 
            alt="Luxury Gift Hampers Logo" 
            className="me-2"
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: '700', 
            letterSpacing: '1.5px', 
            color: '#1a1a1a',
            fontSize: '1.2rem'
          }}>
            LUXURY <span style={{ color: '#D4AF37' }}>GIFT HAMPERS</span>
          </span>
        </Link>

        {/* Dummy Search bar - visible on Desktop in the center */}
        <form 
          className="d-none d-lg-block mx-auto flex-grow-1" 
          style={{ maxWidth: '350px' }} 
          onSubmit={(e) => { e.preventDefault(); handleDummyAction('Hamper Search'); }}
        >
          <div className="position-relative">
            <input 
              type="search" 
              className="form-control navbar-search-input" 
              placeholder="Search luxury collections..." 
            />
            <button 
              type="submit" 
              className="position-absolute border-0 bg-transparent" 
              style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
              aria-label="Submit search"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Action Widgets Area (Wishlist, Cart, Profile Avatar) - always visible right next to search/collapse */}
        <div className="d-flex align-items-center gap-1 gap-sm-2 order-lg-3">
          {user && (
            <>
              {/* Notifications Icon */}
              <div className="position-relative d-inline-block">
                <button 
                  type="button" 
                  className="btn btn-link text-dark p-2 position-relative border-0 navbar-icon-btn" 
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  title="Notifications"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotificationsCount > 0 && (
                    <span className="position-absolute translate-middle badge rounded-pill badge-gold" style={{ top: '6px', right: '-1px', fontSize: '0.58rem', padding: '3px 5px' }}>
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="navbar-notifications-dropdown shadow-lg position-absolute bg-white border p-3 rounded" style={{ top: '45px', right: 0, width: '320px', zIndex: 1100 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                      <h6 className="m-0 fw-bold">Notifications</h6>
                      {unreadNotificationsCount > 0 && (
                        <button className="btn btn-link p-0 small text-decoration-none text-muted" onClick={handleMarkAllNotificationsAsRead} style={{ fontSize: '0.75rem' }}>Mark all read</button>
                      )}
                    </div>
                    <div className="notifications-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div className="text-center text-muted py-3 small">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-2 border-bottom small d-flex flex-column gap-1 ${n.read ? 'text-muted' : 'bg-light fw-semibold text-dark'}`} style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick(n)}>
                            <div>{n.message}</div>
                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>{new Date(n.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <button 
                type="button" 
                className="btn btn-link text-dark p-2 position-relative border-0 navbar-icon-btn" 
                onClick={() => handleDummyAction('Wishlist')}
                title="My Wishlist"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="position-absolute translate-middle badge rounded-pill badge-gold" style={{ top: '6px', right: '-1px', fontSize: '0.58rem', padding: '3px 5px' }}>
                  0
                </span>
              </button>

              {/* Cart Icon */}
              <button 
                type="button" 
                className="btn btn-link text-dark p-2 position-relative border-0 navbar-icon-btn" 
                onClick={handleOpenCart}
                title="My Cart"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="position-absolute translate-middle badge rounded-pill badge-gold" style={{ top: '6px', right: '-1px', fontSize: '0.58rem', padding: '3px 5px' }}>
                  {cartCount}
                </span>
              </button>
            </>
          )}

          {/* Collapsible Hamburger Menu Trigger (Mobile only) */}
          <button 
            className="navbar-toggler border-0 p-2" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" style={{ width: '22px', height: '22px' }}></span>
          </button>

          {/* User Profile Avatar dropdown - always visible on mobile/desktop */}
          {user && (
            <div className="position-relative ms-1" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`navbar-avatar-circle border-0 ${showDropdown ? 'active' : ''}`}
                aria-expanded={showDropdown}
                aria-label="Toggle profile menu"
              >
                {getInitials(user.fullName)}
              </button>

              {showDropdown && (
                <div className="navbar-profile-dropdown shadow-lg">
                  <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
                    <div className="profile-avatar-circle flex-shrink-0" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <span 
                        className="d-block mb-0.5 fw-bold" 
                        style={{ 
                          fontFamily: "'Playfair Display', serif", 
                          fontSize: '0.65rem', 
                          letterSpacing: '1px',
                          color: '#D4AF37'
                        }}
                      >
                        LUXURY MEMBER
                      </span>
                      <h6 className="mb-0 text-dark fw-bold text-truncate" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', maxWidth: '170px' }}>
                        {user.fullName}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-4 text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>Member ID</span>
                      <span className="text-dark fw-semibold small">LGH-{String(user.id || 0).padStart(5, '0')}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>Email</span>
                      <span className="text-dark fw-medium small text-truncate ms-2" style={{ maxWidth: '150px' }} title={user.email}>{user.email}</span>
                    </div>
                    {user.mobileNumber && (
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>Mobile</span>
                        <span className="text-dark fw-medium small">{user.mobileNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/orders');
                      }} 
                      className="btn btn-gold btn-sm w-100 py-2.5 text-uppercase fw-bold"
                      style={{ 
                        backgroundColor: '#D4AF37', 
                        borderColor: '#D4AF37', 
                        color: '#fff',
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                        fontSize: '0.72rem'
                      }}
                    >
                      My Orders
                    </button>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }} 
                      className="btn btn-gold btn-sm w-100 py-2 text-uppercase fw-bold"
                      style={{ 
                        backgroundColor: '#D4AF37', 
                        borderColor: '#D4AF37', 
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                        fontSize: '0.72rem'
                      }}
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }} 
                      className="btn btn-outline-gold btn-sm w-100 py-2 text-uppercase fw-bold"
                      style={{ 
                        borderColor: '#D4AF37', 
                        color: '#D4AF37', 
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                        fontSize: '0.72rem'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Content: Search Bar (Mobile only) and Links (Both mobile/desktop) */}
        <div className="collapse navbar-collapse order-lg-2" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center mx-lg-4 gap-2 gap-lg-3 mt-3 mt-lg-0 w-100 justify-content-lg-center">
            {/* Search Input (Mobile only, inside collapse menu) */}
            <li className="nav-item d-lg-none w-100 my-2">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleDummyAction('Hamper Search'); }}
                className="w-100"
              >
                <div className="position-relative">
                  <input 
                    type="search" 
                    className="form-control navbar-search-input w-100" 
                    placeholder="Search luxury collections..." 
                  />
                  <button 
                    type="submit" 
                    className="position-absolute border-0 bg-transparent" 
                    style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </li>

            {/* Main Navigation Store Links */}
            <li className="nav-item">
              <Link 
                to="/shop" 
                className="nav-link text-start fw-medium small p-0" 
                style={{ 
                  letterSpacing: '0.5px', 
                  color: location.pathname === '/shop' ? '#D4AF37' : '#212529',
                  textDecoration: 'none'
                }}
              >
                SHOP
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link 
                  to="/orders" 
                  className="nav-link text-start fw-medium small p-0" 
                  style={{ 
                    letterSpacing: '0.5px', 
                    color: location.pathname === '/orders' ? '#D4AF37' : '#212529',
                    textDecoration: 'none'
                  }}
                >
                  MY ORDERS
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                to="/collections" 
                className="nav-link text-start fw-medium small p-0" 
                style={{ 
                  letterSpacing: '0.5px', 
                  color: location.pathname === '/collections' ? '#D4AF37' : '#212529',
                  textDecoration: 'none'
                }}
              >
                COLLECTIONS
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className="nav-link text-start fw-medium small p-0" 
                style={{ 
                  letterSpacing: '0.5px', 
                  color: location.pathname === '/about' ? '#D4AF37' : '#212529',
                  textDecoration: 'none'
                }}
              >
                ABOUT US
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className="nav-link text-start fw-medium small p-0" 
                style={{ 
                  letterSpacing: '0.5px', 
                  color: location.pathname === '/contact' ? '#D4AF37' : '#212529',
                  textDecoration: 'none'
                }}
              >
                CONTACT
              </Link>
            </li>

            {/* If NO USER: show login/register links inside collapse */}
            {!user && (
              <>
                <li className="nav-item ms-lg-auto">
                  <Link 
                    to="/login" 
                    className="nav-link text-dark fw-semibold small"
                    style={{ letterSpacing: '1px' }}
                  >
                    LOGIN
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/register" 
                    className="btn btn-gold btn-sm px-4 text-white text-uppercase"
                    style={{ 
                      backgroundColor: '#D4AF37', 
                      borderColor: '#D4AF37',
                      borderRadius: '6px',
                      letterSpacing: '1px',
                      fontSize: '0.8rem'
                    }}
                  >
                    REGISTER
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Active Cart Drawer overlay & panel */}
      {showCartDrawer && (
        <>
          <div className="cart-drawer-overlay" onClick={() => setShowCartDrawer(false)}></div>
          <div className="cart-drawer">
            <div className="cart-drawer-header">
              <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Shopping Cart</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowCartDrawer(false)}
                aria-label="Close cart"
              ></button>
            </div>
            <div className="cart-drawer-body">
              {showAddressForm ? (
                <div className="p-3 text-start">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold m-0 text-uppercase tracking-wider" style={{ fontSize: '0.8rem', color: '#D4AF37' }}>Shipping Address</h6>
                    <button type="button" className="btn btn-link p-0 text-decoration-none small text-dark fw-bold" onClick={() => setShowAddressForm(false)} style={{ fontSize: '0.75rem' }}>← Back to Cart</button>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Full Address</label>
                    <textarea 
                      className="form-control form-control-sm rounded-0"
                      rows="3"
                      placeholder="Street address, apartment, suite..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>City</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-0"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>State</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-0"
                        placeholder="State"
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Postal Code</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-0"
                        placeholder="PIN Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Country</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-0"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ) : cartLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
                    <span className="visually-hidden">Loading cart items...</span>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center text-muted">
                  <span style={{ fontSize: '2.5rem' }}>✨</span>
                  <h6 className="mt-3 fw-bold">Your Cart is Empty</h6>
                  <p className="small px-4">Our handcrafted signature luxury gift hampers are waiting to be selected.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item-row" key={item.id}>
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200"} 
                      alt={item.productName} 
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-title">{item.productName}</div>
                      <div className="cart-item-price-qty">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center border" style={{ borderColor: 'rgba(0,0,0,0.15)' }}>
                          <button
                            type="button"
                            className="btn btn-sm px-2.5 py-0.5 border-0"
                            style={{ color: '#555', background: 'transparent', fontSize: '0.85rem', fontWeight: 'bold' }}
                            onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                            disabled={cartLoading}
                          >
                            -
                          </button>
                          <span className="px-2 small fw-bold text-dark" style={{ minWidth: '22px', textAlign: 'center', fontSize: '0.85rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm px-2.5 py-0.5 border-0"
                            style={{ color: '#555', background: 'transparent', fontSize: '0.85rem', fontWeight: 'bold' }}
                            onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                            disabled={cartLoading}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm text-uppercase p-0 border-0"
                          style={{ color: '#c62828', fontSize: '0.72rem', letterSpacing: '0.5px', background: 'transparent', fontWeight: '700' }}
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={cartLoading}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="fw-semibold text-dark mt-2.5 text-start" style={{ fontSize: '0.85rem' }}>
                        Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.subTotal)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-uppercase text-muted fw-semibold small" style={{ letterSpacing: '1px' }}>Subtotal</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '1.2rem' }}>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(cartItems.reduce((sum, item) => sum + (item.subTotal || 0), 0))}
                  </span>
                </div>
                {showAddressForm ? (
                  <button 
                    type="button" 
                    className="btn btn-gold w-100 py-3 text-white text-uppercase fw-bold"
                    style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1.5px', fontSize: '0.8rem' }}
                    onClick={handleCheckout}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-gold w-100 py-3 text-white text-uppercase fw-bold"
                    style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1.5px', fontSize: '0.8rem' }}
                    onClick={() => setShowAddressForm(true)}
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;

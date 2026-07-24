import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from './Toast';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Local notifications list
  const [toasts, setToasts] = useState([]);

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
                onClick={() => handleDummyAction('Cart Checkout')}
                title="My Cart"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="position-absolute translate-middle badge rounded-pill badge-gold" style={{ top: '6px', right: '-1px', fontSize: '0.58rem', padding: '3px 5px' }}>
                  0
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
              <button 
                onClick={() => handleDummyAction('Shop Catalog')} 
                className="nav-link btn btn-link text-start text-dark fw-medium small border-0 p-0 bg-transparent" 
                style={{ letterSpacing: '0.5px' }}
              >
                SHOP
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => handleDummyAction('Premium Collections')} 
                className="nav-link btn btn-link text-start text-dark fw-medium small border-0 p-0 bg-transparent" 
                style={{ letterSpacing: '0.5px' }}
              >
                COLLECTIONS
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => handleDummyAction('About LGH')} 
                className="nav-link btn btn-link text-start text-dark fw-medium small border-0 p-0 bg-transparent" 
                style={{ letterSpacing: '0.5px' }}
              >
                ABOUT US
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => handleDummyAction('Contact Support')} 
                className="nav-link btn btn-link text-start text-dark fw-medium small border-0 p-0 bg-transparent" 
                style={{ letterSpacing: '0.5px' }}
              >
                CONTACT
              </button>
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
    </nav>
  );
};

export default Navbar;

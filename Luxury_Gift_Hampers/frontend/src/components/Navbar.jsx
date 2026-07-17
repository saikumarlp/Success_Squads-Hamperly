import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-dark" to={user ? "/dashboard" : "/login"}>
          <span style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: '700', 
            letterSpacing: '2px', 
            color: '#1a1a1a' 
          }}>
            LUXURY <span style={{ color: '#D4AF37' }}>GIFT HAMPERS</span>
          </span>
        </Link>
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="text-secondary small me-2">Authenticated as</span>
                  <span className="fw-semibold text-dark">{user.fullName}</span>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-gold btn-sm px-4"
                    style={{ 
                      borderColor: '#D4AF37', 
                      color: '#D4AF37',
                      borderRadius: '0',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#D4AF37';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#D4AF37';
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className="nav-link text-dark font-weight-medium"
                    style={{ letterSpacing: '1px' }}
                  >
                    LOGIN
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/register" 
                    className="btn btn-gold btn-sm px-4 text-white"
                    style={{ 
                      backgroundColor: '#D4AF37', 
                      borderColor: '#D4AF37',
                      borderRadius: '0',
                      letterSpacing: '1px'
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

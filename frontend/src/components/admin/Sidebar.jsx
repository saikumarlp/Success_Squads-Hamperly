import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAdminAuth from '../../hooks/admin/useAdminAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Reviews',
      path: '/admin/reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Sidebar shell */}
      <div 
        className={`sidebar d-flex flex-column justify-content-between p-3 border-end border-secondary`}
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: '#111827',
          borderColor: '#1f2937',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1040,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(0)' // managed responsively via media queries
        }}
      >
        <div>
          {/* Brand header */}
          <div className="d-flex align-items-center gap-2 mb-4 px-2 py-1">
            <img 
              src="/Hamperly.png" 
              alt="LGH Logo" 
              className="rounded animate-pulse"
              style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h5 className="m-0 fw-bold tracking-wide text-truncate" style={{ color: '#fbbf24', fontSize: '0.95rem', maxWidth: '140px' }}>luxury_gift_hampers</h5>
              <small className="text-secondary tracking-widest fs-8 text-uppercase">Admin Portal</small>
            </div>
          </div>

          {/* Navigation link group */}
          <nav className="nav flex-column gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition-all ${
                    isActive 
                      ? 'bg-warning text-dark fw-semibold' 
                      : 'text-light-muted hover-sidebar'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile Card Footer */}
        <div className="pt-3 border-top border-secondary" style={{ borderColor: '#1f2937' }}>
          <div className="d-flex align-items-center gap-3 mb-3 px-2 py-1">
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white font-semibold shadow-sm" style={{ width: '42px', height: '42px', backgroundColor: '#475569' }}>
              {adminUser?.fullName ? adminUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden flex-grow-1">
              <p className="m-0 fw-semibold text-truncate small" style={{ color: '#f8fafc' }}>
                {adminUser?.fullName || 'Administrator'}
              </p>
              <p className="m-0 text-secondary text-truncate tiny" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {adminUser?.email || 'admin@salessavvy.com'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderRadius: '6px' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="modal-backdrop fade show d-lg-none" 
          onClick={onClose} 
          style={{ zIndex: 1030 }}
        />
      )}

      {/* Embedded Styles */}
      <style>{`
        .w-5 { width: 1.25rem; }
        .h-5 { height: 1.25rem; }
        .w-4 { width: 1rem; }
        .h-4 { height: 1rem; }
        .py-2.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
        .text-light-muted {
          color: #94a3b8;
          text-decoration: none;
        }
        .text-light-muted:hover {
          color: #f1f5f9;
        }
        .hover-sidebar:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .tracking-widest { letter-spacing: 0.1em; }
        .tracking-wide { letter-spacing: 0.025em; }
        .fs-8 { font-size: 0.7rem; }
        
        @media (max-width: 991.98px) {
          .sidebar {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-260px)'} !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;

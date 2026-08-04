import React from 'react';
import Breadcrumbs from './Breadcrumbs';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="navbar navbar-expand-lg border-bottom px-4" style={{ height: '70px', backgroundColor: '#111827', borderColor: '#1f2937', color: '#f8fafc' }}>
      <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          {/* Hamburger button for mobile toggling */}
          <button 
            type="button" 
            className="btn btn-outline-secondary d-lg-none p-1 text-light border-0" 
            onClick={onToggleSidebar}
            style={{ color: '#94a3b8' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Breadcrumbs for tracking route context */}
          <div className="d-none d-sm-block">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right side items */}
        <div className="d-flex align-items-center gap-3">
          <span className="badge rounded-pill bg-success-subtle border border-success text-success px-3 py-2 fs-7 text-uppercase font-semibold">
            Status: Active
          </span>
        </div>
      </div>
      <style>{`
        .w-6 { width: 1.5rem; }
        .h-6 { height: 1.5rem; }
        .fs-7 { font-size: 0.8rem; }
        .bg-success-subtle {
          background-color: rgba(34, 197, 94, 0.1) !important;
        }
      `}</style>
    </header>
  );
};

export default Navbar;

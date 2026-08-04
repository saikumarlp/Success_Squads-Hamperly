import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb m-0 d-flex align-items-center gap-1 bg-transparent p-0 fs-8 font-semibold">
        <li className="breadcrumb-item text-secondary text-capitalize d-flex align-items-center">
          <Link to="/admin/dashboard" className="text-decoration-none" style={{ color: '#94a3b8' }}>
            admin
          </Link>
          <span className="mx-2 text-secondary" style={{ fontSize: '0.8rem' }}>/</span>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          if (value.toLowerCase() === 'admin') return null;

          return last ? (
            <li key={to} className="breadcrumb-item active text-capitalize text-warning" aria-current="page" style={{ color: '#fbbf24' }}>
              {value}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item text-secondary text-capitalize d-flex align-items-center">
              <Link to={to} className="text-decoration-none" style={{ color: '#94a3b8' }}>
                {value}
              </Link>
              <span className="mx-2 text-secondary" style={{ fontSize: '0.8rem' }}>/</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

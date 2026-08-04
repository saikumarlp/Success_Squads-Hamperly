import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout d-flex min-vh-100 text-light font-sans" style={{ backgroundColor: '#0b0f19', color: '#f8fafc' }}>
      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ marginLeft: '260px', transition: 'margin-left 0.3s ease' }}>
        {/* Navbar component */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Box */}
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#0f172a', minHeight: 'calc(100vh - 70px)' }}>
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Responsive CSS helper */}
      <style>{`
        .font-sans {
          font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
        }
        @media (max-width: 991.98px) {
          .admin-layout > div:nth-child(2) {
            margin-left: 0px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

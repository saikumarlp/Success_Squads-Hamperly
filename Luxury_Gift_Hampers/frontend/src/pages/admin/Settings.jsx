import React, { useState } from 'react';
import useAdminAuth from '../../hooks/admin/useAdminAuth';

const Settings = () => {
  const { adminUser } = useAdminAuth();
  
  // Local state for layout preferences
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [enableTelemetry, setEnableTelemetry] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('System configurations updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>System Settings</h2>
        <p className="text-secondary small m-0 mt-1">Configure workspace parameters, administrator credentials, and notification thresholds.</p>
      </div>

      {successMsg && (
        <div className="alert alert-success border-0 mb-4 shadow" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '12px' }}>
          {successMsg}
        </div>
      )}

      <div className="row g-4">
        {/* Profile overview card */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 p-4 shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <h5 className="text-white fw-bold mb-4 font-sans tracking-wide">Administrator Identity</h5>
            
            <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom" style={{ borderColor: '#1f2937' }}>
              <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center text-dark font-bold" style={{ width: '64px', height: '64px', fontSize: '1.75rem', backgroundColor: '#fbbf24' }}>
                {adminUser?.fullName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h5 className="m-0 fw-bold text-white">{adminUser?.fullName || 'Administrator'}</h5>
                <span className="badge bg-danger mt-1 fs-9 text-uppercase tracking-wider">Access: {adminUser?.role || 'ADMIN'}</span>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <span className="text-secondary small d-block mb-1">Email Address</span>
                <span className="font-monospace text-white">{adminUser?.email || 'admin@salessavvy.com'}</span>
              </div>
              <div>
                <span className="text-secondary small d-block mb-1">Security Scope</span>
                <span className="text-white small">Read & Write (Global Inventory, Accounts management, Analytics)</span>
              </div>
              <div>
                <span className="text-secondary small d-block mb-1">Database Node Link</span>
                <span className="text-success small font-semibold">Active: com.mysql.cj.jdbc.Driver</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global configurations */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 p-4 shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <h5 className="text-white fw-bold mb-4 font-sans tracking-wide">Workspace Preferences</h5>
            
            <form onSubmit={handlePreferencesSubmit}>
              <div className="mb-3">
                <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Currency symbol</label>
                <select 
                  className="form-select admin-input"
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>

              {/* Checks */}
              <div className="form-check form-switch mb-3 text-start">
                <input 
                  type="checkbox" 
                  className="form-check-input admin-checkbox" 
                  id="notifToggle"
                  checked={allowNotifications}
                  onChange={(e) => setAllowNotifications(e.target.checked)}
                />
                <label className="form-check-label text-secondary small" htmlFor="notifToggle">
                  Enable system logs notifications
                </label>
              </div>

              <div className="form-check form-switch mb-4 text-start">
                <input 
                  type="checkbox" 
                  className="form-check-input admin-checkbox" 
                  id="telemetryToggle"
                  checked={enableTelemetry}
                  onChange={(e) => setEnableTelemetry(e.target.checked)}
                />
                <label className="form-check-label text-secondary small" htmlFor="telemetryToggle">
                  Share anonymized usage indicators
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-warning py-2.5 px-4 text-dark border-0 fw-semibold"
                style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        .admin-input {
          background-color: #0f172a !important;
          border: 1px solid #1f2937 !important;
          color: #f8fafc !important;
          border-radius: 10px;
          padding: 0.625rem 0.875rem;
        }
        .admin-input:focus {
          border-color: #fbbf24 !important;
        }
        .admin-checkbox {
          cursor: pointer;
        }
        .admin-checkbox:checked {
          background-color: #fbbf24 !important;
          border-color: #fbbf24 !important;
        }
      `}</style>
    </div>
  );
};

export default Settings;

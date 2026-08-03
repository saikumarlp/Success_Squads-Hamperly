import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FeaturedProducts from '../components/FeaturedProducts';
import { ToastContainer } from '../components/Toast';

/**
 * Customer Dashboard Component
 * Manages user session checks, toast alerts, and houses the featured luxury e-commerce catalog.
 */
const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom toast alerts state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setProfileDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch profile details", err);
        setError("Could not retrieve secure profile information.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="container py-5 flex-grow-1 d-flex flex-column">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {loading ? (
        <div className="py-5 text-center my-auto">
          <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
            <span className="visually-hidden">Loading profile...</span>
          </div>
        </div>
      ) : error ? (
        <div className="row justify-content-center my-auto">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm p-4 p-md-5 bg-white text-center" style={{ borderTop: '5px solid #D4AF37', borderRadius: '12px' }}>
              <div className="alert alert-danger border-0 small mb-4 text-center" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
                {error}
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-gold text-white text-uppercase"
                style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', letterSpacing: '1px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Compact welcome text section */}
          <div className="mb-4 text-start">
            <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#D4AF37' }}>
              LUXURY GIFT SELECTIONS
            </span>
            <h3 className="mb-0 text-dark fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginTop: '4px' }}>
              Welcome back, {profileDetails?.fullName}!
            </h3>
          </div>

          {/* Spacer */}
          <div className="mb-4" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }}></div>

          {/* Curated Featured E-Commerce Catalog Section */}
          <FeaturedProducts onAction={addToast} />
        </>
      )}
    </div>
  );
};

export default Dashboard;

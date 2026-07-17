import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="container py-5 flex-grow-1 d-flex flex-column justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div 
            className="card border-0 shadow-sm p-4 p-md-5 bg-white text-center position-relative"
            style={{ 
              borderRadius: '0',
              borderTop: '5px solid #D4AF37'
            }}
          >
            <div className="mb-4">
              <span 
                className="d-block" 
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  letterSpacing: '3px',
                  color: '#D4AF37'
                }}
              >
                LUXURY GIFT HAMPERS
              </span>
              <div className="mx-auto my-2" style={{ width: '40px', height: '1px', backgroundColor: '#e0e0e0' }}></div>
            </div>

            {loading ? (
              <div className="py-5">
                <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="py-4">
                <div className="alert alert-danger border-0 small mb-4" style={{ borderRadius: '0', backgroundColor: '#ffebee', color: '#c62828' }}>
                  {error}
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-gold text-white text-uppercase"
                  style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700' }}>
                  Welcome, {profileDetails?.fullName}!
                </h3>
                <p className="text-muted small mb-4">Your premium customer dashboard</p>

                <div 
                  className="text-start mx-auto p-4 mb-4 bg-light" 
                  style={{ 
                    maxWidth: '400px', 
                    borderRadius: '0',
                    borderLeft: '3px solid #D4AF37'
                  }}
                >
                  <div className="mb-2.5">
                    <span className="text-uppercase text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Email Address</span>
                    <span className="text-dark fw-medium">{profileDetails?.email}</span>
                  </div>
                  <div className="mb-2.5 mt-3">
                    <span className="text-uppercase text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Mobile Number</span>
                    <span className="text-dark fw-medium">{profileDetails?.mobileNumber}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-uppercase text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Member ID</span>
                    <span className="text-dark fw-medium">LGH-{String(profileDetails?.id).padStart(5, '0')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-gold px-5 py-2.5 text-uppercase fw-semibold"
                    style={{ 
                      borderColor: '#D4AF37', 
                      color: '#D4AF37', 
                      borderRadius: '0',
                      letterSpacing: '1px',
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminAuth from '../../hooks/admin/useAdminAuth';

const Login = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Success - redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
      {/* Decorative ambient background lights */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="card glass-card shadow-lg w-100" style={{ maxWidth: '440px', borderRadius: '24px', zIndex: 10 }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <img 
              src="/Hamperly.png" 
              alt="LGH Logo" 
              className="mx-auto mb-3 d-block rounded"
              style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '4px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <h3 className="text-white fw-bold m-0 font-sans tracking-wide fs-4 text-break">luxury_gift_hampers</h3>
            <p className="text-secondary small tracking-widest text-uppercase m-0 mt-1" style={{ color: '#94a3b8' }}>Admin Console</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 text-center py-2.5 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: '10px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                id="email"
                className={`form-control admin-input ${validationErrors.email ? 'is-invalid' : ''}`}
                placeholder="admin@salessavvy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {validationErrors.email && (
                <div className="invalid-feedback text-start" style={{ color: '#f87171' }}>
                  {validationErrors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="password" className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider m-0">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact system administrator to reset password.'); }} className="text-decoration-none text-warning small font-semibold hover-gold">
                  Forgot Password?
                </a>
              </div>
              <div className="position-relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  className={`form-control admin-input pe-5 ${validationErrors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-secondary me-2 p-1 d-flex align-items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', strokeWidth: 2 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', strokeWidth: 2 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <div className="invalid-feedback text-start d-block" style={{ color: '#f87171' }}>
                  {validationErrors.password}
                </div>
              )}
            </div>

            {/* Remember Me Check */}
            <div className="form-check text-start mb-4">
              <input 
                type="checkbox" 
                className="form-check-input admin-checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label text-light-muted small" htmlFor="remember">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-warning w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm btn-submit-hover"
              disabled={loading}
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(95deg, #fbbf24 0%, #d97706 100%)',
                color: '#111827',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '16px', height: '16px' }}></span>
                  <span>Verifying Admin...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '18px', height: '18px', strokeWidth: 2.5, flexShrink: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .admin-login-bg {
          background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
          position: relative;
          overflow: hidden;
          width: 100vw;
        }
        .bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          z-index: 1;
        }
        .bg-glow-1 {
          width: 400px;
          height: 400px;
          background: #fbbf24;
          top: -100px;
          left: -100px;
        }
        .bg-glow-2 {
          width: 500px;
          height: 500px;
          background: #4f46e5;
          bottom: -150px;
          right: -150px;
        }
        .glass-card {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-input {
          background-color: rgba(15, 23, 42, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .admin-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15) !important;
          outline: none;
        }
        .admin-input::placeholder {
          color: #475569 !important;
        }
        .admin-checkbox {
          background-color: rgba(15, 23, 42, 0.8) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .admin-checkbox:checked {
          background-color: #fbbf24 !important;
          border-color: #fbbf24 !important;
        }
        .text-light-muted {
          color: #94a3b8;
        }
        .hover-gold:hover {
          color: #fcd34d !important;
        }
        .btn-submit-hover:hover:not(:disabled) {
          background-color: #f59e0b !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.25) !important;
        }
        .brand-logo-glow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }
        .w-4.5 { width: 1.125rem; }
        .h-4.5 { height: 1.125rem; }
      `}</style>
    </div>
  );
};

export default Login;

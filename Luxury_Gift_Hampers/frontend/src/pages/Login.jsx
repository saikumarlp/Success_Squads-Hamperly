import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const registrationSuccess = location.state?.successMessage;

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    let errorMsg = '';
    if (!val) {
      errorMsg = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
      errorMsg = 'Please enter a valid email address';
    }
    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) next.email = errorMsg;
      else delete next.email;
      return next;
    });
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    let errorMsg = '';
    if (!val) {
      errorMsg = 'Password is required';
    }
    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) next.password = errorMsg;
      else delete next.password;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Authentication failed. Please check your credentials.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
      <div className="card shadow-sm border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '450px', borderRadius: '0' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '1px' }}>
            Welcome Back
          </h2>
          <p className="text-muted small">Sign in to your premium hampers account</p>
        </div>

        {registrationSuccess && (
          <div className="alert alert-success border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            {registrationSuccess}
          </div>
        )}

        {errors.general && (
          <div className="alert alert-danger border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#ffebee', color: '#c62828' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="e.g. name@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-gold w-100 py-2.5 text-white text-uppercase font-weight-bold"
            disabled={loading}
            style={{ 
              backgroundColor: '#D4AF37', 
              borderColor: '#D4AF37', 
              borderRadius: '0', 
              height: '45px',
              letterSpacing: '1px',
              fontWeight: '600'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted small">
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold" style={{ color: '#D4AF37', textDecoration: 'none' }}>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

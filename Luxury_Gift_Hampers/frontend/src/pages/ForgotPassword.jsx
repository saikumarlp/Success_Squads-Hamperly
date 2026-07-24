import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const validate = () => {
    const tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    let errorMsg = '';
    if (!val.trim()) {
      errorMsg = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())) {
      errorMsg = 'Please enter a valid email address';
    }
    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) next.email = errorMsg;
      else delete next.email;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMessage(res?.message || 'If an account with this email exists, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err?.errors?.email) {
        setErrors({ email: err.errors.email });
      } else {
        const errorMessage = err?.response?.data?.message || err?.message || (typeof err === 'string' ? err : 'Something went wrong');
        setErrors({ general: errorMessage });
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
            Forgot Password
          </h2>
          <p className="text-muted small">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>
        </div>

        {successMessage && (
          <div className="alert alert-success border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="alert alert-danger border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#ffebee', color: '#c62828' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending Link...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted small">
            Remember your password?{' '}
            <Link to="/login" className="fw-semibold" style={{ color: '#D4AF37', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

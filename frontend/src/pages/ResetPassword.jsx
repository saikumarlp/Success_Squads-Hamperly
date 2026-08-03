import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Password validation helper
  const passwordCriteria = {
    length: newPassword.length >= 8 && newPassword.length <= 20,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const validate = () => {
    const tempErrors = {};

    if (!token) {
      setGeneralError('Invalid or missing password reset token. Please request a new link.');
      return false;
    }

    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (!isPasswordValid) {
      tempErrors.newPassword = 'Password does not meet complexity requirements';
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePasswordChange = (val) => {
    setNewPassword(val);
    setErrors(prev => {
      const next = { ...prev };
      delete next.newPassword;
      if (confirmPassword && val !== confirmPassword) {
        next.confirmPassword = 'Passwords do not match';
      } else {
        delete next.confirmPassword;
      }
      return next;
    });
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    setErrors(prev => {
      const next = { ...prev };
      if (!val) {
        next.confirmPassword = 'Please confirm your new password';
      } else if (val !== newPassword) {
        next.confirmPassword = 'Passwords do not match';
      } else {
        delete next.confirmPassword;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', {
          state: { successMessage: 'Your password has been reset successfully. Please sign in with your new password.' }
        });
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setGeneralError(err.message || 'Failed to reset password. The token may be invalid or expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
      <div className="card shadow-sm border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '480px', borderRadius: '0' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '1px' }}>
            Reset Password
          </h2>
          <p className="text-muted small">Choose a strong new password for your account</p>
        </div>

        {!token && (
          <div className="alert alert-warning border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#fff8e1', color: '#b78103' }}>
            Missing or invalid reset token. Please request a new password reset link from the{' '}
            <Link to="/forgot-password" style={{ color: '#D4AF37', fontWeight: '600' }}>
              Forgot Password page
            </Link>.
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            {successMessage}
          </div>
        )}

        {generalError && (
          <div className="alert alert-danger border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#ffebee', color: '#c62828' }}>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              New Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter new password"
              disabled={!token || loading}
            />
            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
          </div>

          {/* Password Requirements Helper Box */}
          {newPassword.length > 0 && (
            <div className="mb-3 p-3 bg-light" style={{ fontSize: '0.8rem', borderLeft: '3px solid #D4AF37' }}>
              <div className="fw-semibold text-muted mb-1">Password requirements:</div>
              <ul className="list-unstyled mb-0" style={{ lineHeight: '1.6' }}>
                <li style={{ color: passwordCriteria.length ? '#2e7d32' : '#c62828' }}>
                  {passwordCriteria.length ? '✓' : '✕'} 8 to 20 characters
                </li>
                <li style={{ color: passwordCriteria.uppercase ? '#2e7d32' : '#c62828' }}>
                  {passwordCriteria.uppercase ? '✓' : '✕'} At least one uppercase letter
                </li>
                <li style={{ color: passwordCriteria.lowercase ? '#2e7d32' : '#c62828' }}>
                  {passwordCriteria.lowercase ? '✓' : '✕'} At least one lowercase letter
                </li>
                <li style={{ color: passwordCriteria.number ? '#2e7d32' : '#c62828' }}>
                  {passwordCriteria.number ? '✓' : '✕'} At least one number
                </li>
                <li style={{ color: passwordCriteria.special ? '#2e7d32' : '#c62828' }}>
                  {passwordCriteria.special ? '✓' : '✕'} At least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              placeholder="Confirm new password"
              disabled={!token || loading}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-gold w-100 py-2.5 text-white text-uppercase font-weight-bold"
            disabled={!token || loading}
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
                Resetting Password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted small">
            Remembered your password?{' '}
            <Link to="/login" className="fw-semibold" style={{ color: '#D4AF37', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

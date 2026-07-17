import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value, allData) => {
    let errorMsg = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errorMsg = 'Full name is required';
        } else if (value.trim().length < 2) {
          errorMsg = 'Full name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMsg = 'Full name must contain only letters and spaces';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMsg = 'Email address is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMsg = 'Please enter a valid email address (e.g. name@example.com)';
        }
        break;
      case 'mobileNumber':
        if (!value.trim()) {
          errorMsg = 'Mobile number is required';
        } else if (!/^[0-9]+$/.test(value)) {
          errorMsg = 'Mobile number must contain only numbers';
        } else if (value.length !== 10) {
          errorMsg = 'Mobile number must be exactly 10 digits';
        } else if (!/^[6-9][0-9]{9}$/.test(value)) {
          errorMsg = 'Mobile number must be a valid 10-digit number starting with 6, 7, 8, or 9';
        }
        break;
      case 'password':
        if (!value) {
          errorMsg = 'Password is required';
        } else {
          if (value.length < 8) {
            errorMsg = 'Password must be at least 8 characters long';
          } else if (!/[A-Z]/.test(value)) {
            errorMsg = 'Password must contain at least one uppercase letter';
          } else if (!/[a-z]/.test(value)) {
            errorMsg = 'Password must contain at least one lowercase letter';
          } else if (!/[0-9]/.test(value)) {
            errorMsg = 'Password must contain at least one number';
          } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            errorMsg = 'Password must contain at least one special character (!@#$%^&* etc.)';
          }
        }
        // If confirmPassword is already typed, validate that it matches the new password
        if (allData.confirmPassword && value !== allData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else if (allData.confirmPassword && value === allData.confirmPassword) {
          setErrors(prev => {
            const next = { ...prev };
            delete next.confirmPassword;
            return next;
          });
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errorMsg = 'Please confirm your password';
        } else if (value !== allData.password) {
          errorMsg = 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (errorMsg) {
        next[name] = errorMsg;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      validateField(name, value, updated);
      return updated;
    });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      tempErrors.fullName = 'Full name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      tempErrors.fullName = 'Full name must contain only letters and spaces';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    if (!formData.mobileNumber.trim()) {
      tempErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]+$/.test(formData.mobileNumber)) {
      tempErrors.mobileNumber = 'Mobile number must contain only numbers';
    } else if (formData.mobileNumber.length !== 10) {
      tempErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    } else if (!/^[6-9][0-9]{9}$/.test(formData.mobileNumber)) {
      tempErrors.mobileNumber = 'Mobile number must be a valid 10-digit number starting with 6, 7, 8, or 9';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else {
      const password = formData.password;
      if (password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        tempErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(password)) {
        tempErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(password)) {
        tempErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        tempErrors.password = 'Password must contain at least one special character (!@#$%^&* etc.)';
      }
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await register(formData);
      navigate('/login', { 
        state: { successMessage: 'Registration successful! Please sign in.' } 
      });
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
      <div className="card shadow-sm border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '0' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '1px' }}>
            Create Account
          </h2>
          <p className="text-muted small">Register to experience premium hampers services</p>
        </div>

        {errors.general && (
          <div className="alert alert-danger border-0 small text-center mb-4" style={{ borderRadius: '0', backgroundColor: '#ffebee', color: '#c62828' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. name@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="e.g. 9876543210"
            />
            {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min. 8 chars, mixed case, number & special char"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Verify your password"
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted small">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold" style={{ color: '#D4AF37', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

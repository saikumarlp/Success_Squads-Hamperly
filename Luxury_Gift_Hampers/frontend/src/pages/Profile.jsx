import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/userService';

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profilePictureUrl: '',
  });

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setErrors({});
      try {
        const data = await getProfile();
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          bio: data.bio || '',
          profilePictureUrl: data.profilePictureUrl || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrors({ general: err.message || 'Failed to load user profile.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'profilePictureUrl') {
      setImageError(false);
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.general;
      return next;
    });
  };

  const validate = () => {
    const tempErrors = {};

    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length > 100) {
      tempErrors.fullName = 'Full name must not exceed 100 characters';
    }

    if (!formData.mobileNumber.trim()) {
      tempErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      tempErrors.mobileNumber = 'Mobile number must be a valid 10-digit number';
    }

    if (formData.dateOfBirth) {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (selectedDate >= today) {
        tempErrors.dateOfBirth = 'Date of birth must be a past date';
      }
    }

    if (formData.bio && formData.bio.length > 500) {
      tempErrors.bio = 'Bio must not exceed 500 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const updatedProfile = await updateProfile({
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        bio: formData.bio ? formData.bio.trim() : null,
        profilePictureUrl: formData.profilePictureUrl ? formData.profilePictureUrl.trim() : null,
      });

      setSuccessMessage('Your profile has been updated successfully!');
      
      // Update local storage and AuthContext state if fullName changed
      if (setUser && user) {
        const updatedUser = { ...user, fullName: updatedProfile.fullName, mobileNumber: updatedProfile.mobileNumber };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Failed to update profile. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="container py-5 flex-grow-1">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '0', borderTop: '5px solid #D4AF37' }}>
            <div className="text-center mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '1px' }}>
                My Profile
              </h2>
              <p className="text-muted small">
                Manage your personal details, contact information, and account preferences.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
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

                {/* Profile Picture & Preview */}
                <div className="d-flex flex-column align-items-center mb-4">
                  <div 
                    className="position-relative d-flex justify-content-center align-items-center mb-3 shadow-sm" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      backgroundColor: '#1a1a1a', 
                      border: '3px solid #D4AF37' 
                    }}
                  >
                    {formData.profilePictureUrl && !imageError ? (
                      <img 
                        src={formData.profilePictureUrl} 
                        alt="Profile Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="text-white fw-bold" style={{ fontSize: '2rem', letterSpacing: '2px', fontFamily: "'Playfair Display', serif" }}>
                        {getInitials(formData.fullName)}
                      </span>
                    )}
                  </div>
                  <span className="text-muted small">Profile Picture Preview</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. John Doe"
                      />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Email Address (Immutable)
                      </label>
                      <input
                        type="email"
                        className="form-control bg-light"
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0', color: '#666' }}
                        value={formData.email}
                        disabled
                        readOnly
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        placeholder="e.g. 9876543210"
                      />
                      {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                    </div>

                    {/* Date of Birth */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                      {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                    </div>

                    {/* Gender */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Gender
                      </label>
                      <select
                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>

                    {/* Profile Picture URL */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Profile Picture URL
                      </label>
                      <input
                        type="url"
                        className={`form-control ${errors.profilePictureUrl ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', height: '45px', borderColor: '#e0e0e0' }}
                        value={formData.profilePictureUrl}
                        onChange={(e) => handleInputChange('profilePictureUrl', e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                      />
                      {errors.profilePictureUrl && <div className="invalid-feedback">{errors.profilePictureUrl}</div>}
                    </div>

                    {/* Bio */}
                    <div className="col-12">
                      <label className="form-label text-uppercase text-muted small fw-semibold" style={{ letterSpacing: '0.5px' }}>
                        Bio / About Yourself
                      </label>
                      <textarea
                        className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '0', borderColor: '#e0e0e0', minHeight: '90px' }}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us a little bit about your gift preferences or yourself..."
                        maxLength={500}
                      />
                      <div className="d-flex justify-content-between mt-1">
                        {errors.bio ? (
                          <div className="invalid-feedback d-block">{errors.bio}</div>
                        ) : (
                          <div></div>
                        )}
                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {formData.bio.length}/500
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-gold w-100 py-2.5 text-white text-uppercase font-weight-bold"
                      disabled={submitting}
                      style={{ 
                        backgroundColor: '#D4AF37', 
                        borderColor: '#D4AF37', 
                        borderRadius: '0', 
                        height: '45px',
                        letterSpacing: '1px',
                        fontWeight: '600'
                      }}
                    >
                      {submitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving Changes...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

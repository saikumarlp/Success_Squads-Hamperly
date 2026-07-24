import React from 'react';

/**
 * Extracts initials from the user's full name (e.g., "Sai Prasad" -> "SP")
 */
const getInitials = (fullName) => {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Reusable ProfileCard component for the Customer Dashboard
 */
const ProfileCard = ({ profileDetails, onEditProfile, onLogout }) => {
  const memberId = profileDetails?.id 
    ? `LGH-${String(profileDetails.id).padStart(5, '0')}` 
    : 'LGH-00000';

  const initials = getInitials(profileDetails?.fullName);

  return (
    <div 
      className="card border-0 p-4 p-md-5 bg-white shadow-sm"
      style={{ 
        borderRadius: '12px',
        borderTop: '4px solid #D4AF37'
      }}
    >
      <div className="row align-items-center g-4">
        {/* Profile Avatar and Basic Greeting */}
        <div className="col-12 col-md-7 d-flex align-items-center gap-3 flex-wrap flex-sm-nowrap">
          <div className="profile-avatar-circle flex-shrink-0" aria-label={`Avatar initials: ${initials}`}>
            {initials}
          </div>
          <div>
            <span 
              className="d-block mb-1 fw-bold" 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '0.85rem', 
                letterSpacing: '2px',
                color: '#D4AF37'
              }}
            >
              LUXURY MEMBER PORTAL
            </span>
            <h2 className="mb-1 text-dark fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem' }}>
              Welcome, {profileDetails?.fullName}!
            </h2>
            <p className="text-muted small mb-0">Your premium customer dashboard profile</p>
          </div>
        </div>
        
        {/* Profile Details List */}
        <div className="col-12 col-md-5 d-flex flex-column gap-2 border-start-md ps-md-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
            <span className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>Member ID</span>
            <span className="text-dark fw-semibold small">{memberId}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
            <span className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>Email Address</span>
            <span className="text-dark fw-medium small text-truncate ms-2" title={profileDetails?.email}>{profileDetails?.email}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-1">
            <span className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>Mobile Number</span>
            <span className="text-dark fw-medium small">{profileDetails?.mobileNumber || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      {/* Control Buttons row */}
      <div className="row mt-4 pt-3 border-top border-light align-items-center">
        <div className="col-12 d-flex justify-content-end gap-2">
          <button 
            onClick={onEditProfile} 
            className="btn btn-gold px-4 py-2 text-white text-uppercase fw-semibold"
            style={{ 
              backgroundColor: '#D4AF37', 
              borderColor: '#D4AF37', 
              borderRadius: '6px',
              letterSpacing: '1px',
              fontSize: '0.82rem'
            }}
          >
            Edit Profile
          </button>
          <button 
            onClick={onLogout} 
            className="btn btn-outline-gold px-4 py-2 text-uppercase fw-semibold"
            style={{ 
              borderColor: '#D4AF37', 
              color: '#D4AF37', 
              borderRadius: '6px',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              fontSize: '0.82rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

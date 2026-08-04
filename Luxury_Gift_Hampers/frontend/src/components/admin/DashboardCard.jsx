import React from 'react';

const DashboardCard = ({ title, value, icon, trend, gradient }) => {
  return (
    <div 
      className="card border-0 text-light shadow-sm position-relative overflow-hidden hover-card-scale"
      style={{
        borderRadius: '16px',
        background: gradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        minHeight: '120px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default'
      }}
    >
      {/* Decorative ambient lighting circle */}
      <div 
        className="position-absolute" 
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          right: '-20px',
          top: '-20px'
        }}
      />
      
      <div className="card-body p-4 d-flex align-items-center justify-content-between">
        <div>
          <span className="text-secondary small tracking-wider text-uppercase font-semibold" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {title}
          </span>
          <h3 className="m-0 mt-2 fw-bold text-white tracking-wide">
            {value}
          </h3>
          {trend && (
            <div className="d-flex align-items-center gap-1 mt-2">
              <span className={`small font-semibold ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-secondary" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {trend.label || 'since last week'}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fbbf24' }}>
          {icon}
        </div>
      </div>
      <style>{`
        .hover-card-scale:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardCard;

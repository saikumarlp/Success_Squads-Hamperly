import React from 'react';

const AboutUs = () => {
  return (
    <div className="container py-5 flex-grow-1">
      {/* Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          Our Story
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          About Luxury Gift Hampers
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
      </div>

      <div className="row g-5 align-items-center justify-content-center">
        {/* Left Column: Image with premium styling */}
        <div className="col-12 col-md-6 col-lg-5">
          <div 
            className="position-relative"
            style={{ 
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#fff'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600" 
              alt="Gift Hamper Crafting" 
              className="img-fluid"
              style={{ borderRadius: '8px' }}
            />
            {/* Elegant overlay badge */}
            <div 
              className="position-absolute p-3 text-white text-center shadow"
              style={{
                bottom: '-20px',
                right: '20px',
                backgroundColor: '#1a1a1a',
                borderLeft: '4px solid #D4AF37',
                minWidth: '150px'
              }}
            >
              <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>EST. 2020</h5>
              <span className="small text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '0.62rem' }}>Artisinal Quality</span>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="col-12 col-md-6 col-lg-6">
          <span 
            className="d-block text-uppercase mb-2 fw-semibold text-muted"
            style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#D4AF37' }}
          >
            THE ART OF GIVING
          </span>
          <h3 
            className="mb-4 text-dark fw-bold"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }}
          >
            Crafting Unforgettable Moments
          </h3>
          <p className="text-muted leading-relaxed mb-3" style={{ fontSize: '1.02rem', lineHeight: '1.7' }}>
            At Luxury Gift Hampers, we believe that a gift is more than just items in a basket—it is a tangible reflection of appreciation, love, and connection. Our journey began with a simple mission: to elevate the standard of gifting by curating only the finest gourmet treats, luxurious keepsakes, and premium products.
          </p>
          <p className="text-muted leading-relaxed mb-4" style={{ fontSize: '1.02rem', lineHeight: '1.7' }}>
            Every single hamper is hand-assembled by our team of custom designers, styled with delicate silk ribbons, and wrapped in premium boxes with personalized greetings. Whether you are celebrating a wedding milestone, expressing corporate gratitude, marking a birthday, or toast to an anniversary, our hampers are designed to deliver a premium experience from the first glance to the final taste.
          </p>

          {/* Key pillars */}
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', borderRadius: '50%' }}
                >
                  ✓
                </div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Handpicked Quality</h6>
                  <span className="text-muted small">Only the finest brands</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', borderRadius: '50%' }}
                >
                  ✓
                </div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Custom Styled</h6>
                  <span className="text-muted small">Elegant ribbon wrapping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

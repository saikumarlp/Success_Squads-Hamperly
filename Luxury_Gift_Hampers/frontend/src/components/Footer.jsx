import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-0 text-muted small" style={{ letterSpacing: '1px' }}>
          &copy; {new Date().getFullYear()} <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600' }}>LUXURY GIFT HAMPERS</span>. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

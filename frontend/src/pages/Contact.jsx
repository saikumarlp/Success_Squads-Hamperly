import React, { useState } from 'react';
import { ToastContainer } from '../components/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [toasts, setToasts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      addToast("Thank you! Your message has been sent successfully. Our concierge team will reach out shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container py-5 flex-grow-1">
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          Get in Touch
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          Contact Concierge Support
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
      </div>

      <div className="row g-5 justify-content-center">
        {/* Left Column: Contact Cards */}
        <div className="col-12 col-md-5">
          <div className="d-flex flex-column gap-4">
            
            {/* Call card */}
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderLeft: '4px solid #D4AF37', borderRadius: '8px' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: '1.8rem' }}>📞</div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Customer Concierge</h6>
                  <span className="text-muted small">+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Email card */}
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderLeft: '4px solid #D4AF37', borderRadius: '8px' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: '1.8rem' }}>✉️</div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Support Inquiries</h6>
                  <span className="text-muted small">support@hamperly.com</span>
                </div>
              </div>
            </div>

            {/* Location card */}
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderLeft: '4px solid #D4AF37', borderRadius: '8px' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: '1.8rem' }}>📍</div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Boutique Headquarters</h6>
                  <span className="text-muted small">100 Gold Crest Blvd, Mumbai, MH, India</span>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderLeft: '4px solid #D4AF37', borderRadius: '8px' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: '1.8rem' }}>🕒</div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Boutique Hours</h6>
                  <span className="text-muted small">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm p-4 p-md-5 bg-white" style={{ borderRadius: '12px' }}>
            <h4 className="mb-4 fw-bold text-dark" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h4>
            
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3.5">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-muted">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control py-2.5"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ borderRadius: '6px', borderColor: '#e0e0e0' }}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-muted">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control py-2.5"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ borderRadius: '6px', borderColor: '#e0e0e0' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label small fw-semibold text-muted">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control py-2.5"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ borderRadius: '6px', borderColor: '#e0e0e0' }}
                />
              </div>

              <div>
                <label className="form-label small fw-semibold text-muted">Concierge Message *</label>
                <textarea
                  name="message"
                  className="form-control py-2.5"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ borderRadius: '6px', borderColor: '#e0e0e0' }}
                  required
                ></textarea>
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="btn btn-gold w-100 py-3 text-white text-uppercase fw-bold"
                  style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '6px', letterSpacing: '1.5px', fontSize: '0.8rem' }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

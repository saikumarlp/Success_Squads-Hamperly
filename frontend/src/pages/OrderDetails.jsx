import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ToastContainer } from '../components/Toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const pollIntervalRef = useRef(null);

  // Review states
  const [reviewStatus, setReviewStatus] = useState({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const fetchOrderDetails = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const orderRes = await api.get(`/orders/${orderId}`);
      const orderData = orderRes.data;
      setOrder(orderData);
      
      const trackingRes = await api.get(`/orders/${orderId}/tracking`);
      setTracking(trackingRes.data || []);

      if (orderData && orderData.status === 'DELIVERED') {
        const reviewRes = await api.get(`/reviews/check-order/${orderId}`);
        setReviewStatus(reviewRes.data || {});
      }
    } catch (err) {
      console.error("Error loading order details:", err);
      addToast(err.response?.data?.message || "Failed to load order information.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleOpenReviewModal = (item) => {
    setActiveItem(item);
    setRating(5);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setUploadedImages([]);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setActiveItem(null);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await api.post("/reviews/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data && res.data.imageUrl) {
          setUploadedImages((prev) => [...prev, res.data.imageUrl]);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        addToast("Failed to upload image. Please try again.");
      }
    }
    setUploading(false);
  };

  const handleRemoveUploadedImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      addToast("Rating is required.");
      return;
    }
    if (!comment.trim()) {
      addToast("Review description is required.");
      return;
    }
    
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        productId: activeItem.productId,
        orderId: orderId,
        rating: rating,
        title: title,
        comment: comment,
        imageUrls: uploadedImages
      });
      
      addToast("Thank you for reviewing this product.");
      
      // Update local reviewed map
      setReviewStatus((prev) => ({
        ...prev,
        [activeItem.productId]: true
      }));
      
      handleCloseReviewModal();
    } catch (err) {
      console.error("Review submission failed:", err);
      addToast(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrderDetails(true);

    // Setup polling every 5 seconds for real-time order status and tracking updates
    pollIntervalRef.current = setInterval(() => {
      fetchOrderDetails(false);
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      addToast("Preparing invoice for download...");
      const res = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      addToast("Invoice PDF downloaded successfully.");
    } catch (err) {
      console.error("Error downloading invoice:", err);
      addToast("Failed to download invoice. Please try again.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'CONFIRMED':
      case 'DELIVERED':
        return 'bg-success-subtle text-success border border-success px-3.5 py-1 rounded-pill small fw-bold';
      case 'PENDING':
      case 'PACKED':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-warning-subtle text-warning border border-warning px-3.5 py-1 rounded-pill small fw-bold';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-danger-subtle text-danger border border-danger px-3.5 py-1 rounded-pill small fw-bold';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary px-3.5 py-1 rounded-pill small fw-bold';
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37', width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center flex-grow-1">
        <h3>Order Not Found</h3>
        <p className="text-muted">The requested order details could not be found.</p>
        <Link to="/orders" className="btn btn-gold text-white text-uppercase rounded-0 px-4 py-2 mt-3" style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 flex-grow-1">
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Breadcrumb / Back Button */}
      <div className="mb-4 text-start">
        <Link to="/orders" className="text-decoration-none text-muted small fw-semibold">
          ← Back to Order History
        </Link>
      </div>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-4 mb-4 text-start">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Order Details
          </h2>
          <p className="text-muted small mb-0">
            ID: <span className="font-monospace fw-bold text-dark">{order.orderId}</span> | Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="d-flex gap-2">
          {order.status === 'DELIVERED' && (
            <button
              onClick={handleDownloadInvoice}
              className="btn btn-outline-gold d-flex align-items-center gap-2 rounded-0 px-4"
              style={{ borderColor: '#D4AF37', color: '#D4AF37', fontWeight: '600', letterSpacing: '0.5px' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Invoice PDF
            </button>
          )}
          <span className={getStatusBadgeClass(order.status)}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Timeline */}
      <div className="card shadow-sm border-0 mb-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h5 className="fw-bold text-start m-0" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tracking Timeline
          </h5>
          {order && (
            <span className="badge bg-warning-subtle text-dark border border-warning px-3 py-2 fs-7 fw-bold" style={{ borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
              Expected Delivery: {order.expectedDeliveryDate 
                ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                : order.estimatedDelivery 
                  ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                  : 'N/A'}
            </span>
          )}
        </div>
        
        {/* Timeline Desktop View */}
        <div className="d-none d-lg-block position-relative py-4">
          {/* Timeline Bar Line */}
          <div 
            className="position-absolute" 
            style={{ 
              top: '40px', 
              left: '50px', 
              right: '50px', 
              height: '4px', 
              backgroundColor: '#e9ecef',
              zIndex: 1
            }}
          >
            {/* Active completed line overlay */}
            <div 
              className="h-100" 
              style={{ 
                width: `${(tracking.filter(t => t.completed).length - 1) * 20}%`, 
                backgroundColor: '#D4AF37', 
                transition: 'width 0.4s ease'
              }}
            ></div>
          </div>

          <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
            {tracking.map((step, idx) => (
              <div key={idx} className="text-center" style={{ width: '120px' }}>
                <div 
                  className={`mx-auto rounded-circle d-flex align-items-center justify-content-center border-4`}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: step.completed ? '#D4AF37' : '#fff',
                    borderColor: step.completed ? '#D4AF37' : '#e9ecef',
                    color: step.completed ? '#fff' : '#888',
                    transition: 'all 0.4s ease',
                    boxShadow: step.completed ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none'
                  }}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>
                <div className="mt-3">
                  <h6 className={`mb-1 fw-bold small ${step.completed ? 'text-dark' : 'text-muted'}`}>
                    {step.name}
                  </h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                    {step.completed && step.timestamp ? formatDate(step.timestamp) : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile Vertical View */}
        <div className="d-block d-lg-none text-start ms-2">
          {tracking.map((step, idx) => (
            <div key={idx} className="d-flex gap-3 position-relative pb-4">
              {idx < tracking.length - 1 && (
                <div 
                  className="position-absolute"
                  style={{ 
                    left: '15px', 
                    top: '30px', 
                    bottom: '0', 
                    width: '2px', 
                    backgroundColor: step.completed && tracking[idx + 1].completed ? '#D4AF37' : '#e9ecef' 
                  }}
                ></div>
              )}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center border flex-shrink-0"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: step.completed ? '#D4AF37' : '#fff',
                  borderColor: step.completed ? '#D4AF37' : '#e9ecef',
                  color: step.completed ? '#fff' : '#888'
                }}
              >
                {step.completed ? '✓' : idx + 1}
              </div>
              <div>
                <h6 className={`mb-1 fw-bold small ${step.completed ? 'text-dark' : 'text-muted'}`}>
                  {step.name}
                </h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                  {step.completed && step.timestamp ? formatDate(step.timestamp) : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column - Product list */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold text-start mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ordered Products
            </h5>
            <div className="d-flex flex-column gap-4">
              {order.orderItems && order.orderItems.map((item, idx) => (
                <div key={idx} className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 pb-3 border-bottom text-start">
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200"} 
                      alt={item.productName} 
                      className="img-thumbnail rounded-0"
                      style={{ width: '90px', height: '90px', objectFit: 'cover', borderColor: 'rgba(212, 175, 55, 0.15)' }}
                    />
                  </Link>
                  <div className="flex-grow-1">
                    <Link to={`/product/${item.productId}`} className="text-decoration-none text-dark">
                      <h6 className="fw-bold mb-1 fs-6">{item.productName}</h6>
                    </Link>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                        Brand: {item.brand || "Hamperly"}
                      </span>
                      <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                        Category: {item.category || "General"}
                      </span>
                    </div>
                    <div className="text-muted small">
                      Price: <span className="fw-semibold text-dark">{formatCurrency(item.pricePerUnit)}</span> | Qty: <span className="fw-semibold text-dark">{item.quantity}</span>
                    </div>

                    {order.status === 'DELIVERED' && (
                      <div className="mt-2">
                        {reviewStatus[item.productId] ? (
                          <span className="text-success small fw-semibold d-flex align-items-center gap-1">
                            ✔ You have already reviewed this product.
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenReviewModal(item)}
                            className="btn btn-sm btn-gold text-white d-flex align-items-center gap-1.5 px-3 py-1 rounded-0"
                            style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', fontSize: '0.8rem', fontWeight: '600' }}
                          >
                            ⭐ Write Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm-end">
                    <div className="text-muted small mb-0.5">Subtotal</div>
                    <span className="fw-bold text-dark fs-6">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summaries & Address info */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          {/* Order Summary & Payment info */}
          <div className="card shadow-sm border-0 p-4 text-start">
            <h5 className="fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order Information
            </h5>
            <div className="d-flex flex-column gap-3 small border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Expected Delivery:</span>
                <span className="fw-semibold text-dark">
                  {order.expectedDeliveryDate 
                    ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) 
                    : order.estimatedDelivery 
                      ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) 
                      : 'N/A'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Tracking Number:</span>
                <span className="fw-semibold font-monospace text-dark">{order.trackingNumber || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Payment Method:</span>
                <span className="fw-semibold text-dark">{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Payment ID:</span>
                <span className="fw-semibold font-monospace text-dark">{order.paymentId || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Payment Status:</span>
                <span className="fw-semibold text-dark">{order.paymentStatus || 'PENDING'}</span>
              </div>
            </div>

            <h6 className="fw-bold mb-3">Cost Breakdown</h6>
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Item Total:</span>
                <span className="text-dark">{formatCurrency(order.itemTotal)}</span>
              </div>
              <div className="d-flex justify-content-between text-danger">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
              <div className="d-flex justify-content-between text-danger">
                <span>Coupon Discount:</span>
                <span>-{formatCurrency(order.couponDiscount)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Shipping Charge:</span>
                <span className="text-dark">{formatCurrency(order.shippingCharge)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">GST (18%):</span>
                <span className="text-dark">{formatCurrency(order.tax)}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-2.5 mt-2 fw-bold text-dark fs-6">
                <span>Grand Total:</span>
                <span style={{ color: '#D4AF37' }}>{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="card shadow-sm border-0 p-4 text-start">
            <h5 className="fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Shipping Summary
            </h5>
            
            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-2">Recipient</h6>
            <div className="mb-4">
              <div className="fw-bold text-dark">{order.customerName}</div>
              <div className="small text-muted">{order.customerEmail}</div>
              <div className="small text-muted">Phone: {order.customerPhone}</div>
            </div>

            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-2">Shipping Address</h6>
            <div className="small text-dark">
              <div>{order.shippingAddress}</div>
              <div>{order.city}, {order.state}</div>
              <div>{order.country} - {order.postalCode}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal Backdrop & Dialog */}
      {reviewModalOpen && activeItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1060 }}>
            <div className="modal-content border-0 shadow-lg rounded-0" style={{ backgroundColor: '#fff', color: '#333' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ⭐ Write a Review
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseReviewModal} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body text-start pt-3">
                  <div className="d-flex gap-3 align-items-center mb-4 bg-light p-2.5 border">
                    <img 
                      src={activeItem.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=100"} 
                      alt={activeItem.productName} 
                      style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0.5 text-truncate" style={{ maxWidth: '300px' }}>{activeItem.productName}</h6>
                      <small className="text-muted">Order ID: {orderId}</small>
                    </div>
                  </div>
                  
                  {/* Star Rating Select */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Your Rating *</label>
                    <div className="d-flex align-items-center gap-1.5 fs-4">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating;
                        return (
                          <span 
                            key={starValue}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(starValue)}
                            style={{ cursor: 'pointer', color: isFilled ? '#D4AF37' : '#e0e0e0', transition: 'color 0.15s ease' }}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Review Title</label>
                    <input 
                      type="text" 
                      className="form-control rounded-0" 
                      placeholder="Summarize your review (e.g. Excellent presentation!)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {/* Review Description */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Review Description *</label>
                      <span className="small text-muted">{comment.length}/500</span>
                    </div>
                    <textarea 
                      className="form-control rounded-0" 
                      rows="4" 
                      placeholder="What did you like or dislike about this hamper?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.substring(0, 500))}
                      required
                    ></textarea>
                  </div>

                  {/* Upload Images */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Upload Images (Optional)</label>
                    <input 
                      type="file" 
                      className="form-control rounded-0 animate-fade-in" 
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="small text-muted mt-1.5">
                        <span className="spinner-border spinner-border-sm me-1.5" role="status"></span>
                        Uploading images...
                      </div>
                    )}
                    
                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="d-flex gap-2 flex-wrap mt-3">
                        {uploadedImages.map((url, idx) => (
                          <div key={idx} className="position-relative">
                            <img 
                              src={url} 
                              alt="Review Upload Preview" 
                              style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #ccc' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedImage(idx)}
                              className="btn btn-danger btn-sm p-0 position-absolute d-flex align-items-center justify-content-center"
                              style={{ top: '-8px', right: '-8px', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary rounded-0 px-4" onClick={handleCloseReviewModal}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-gold text-white rounded-0 px-4" 
                    style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37' }}
                    disabled={submittingReview || uploading}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

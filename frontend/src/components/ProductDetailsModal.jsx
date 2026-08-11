import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600";

const ProductDetailsModal = ({ product, onClose, onAddToCart, onWishlistToggle, inWishlist, addingToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Edit Review states
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editImages, setEditImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${product.id}/reviews`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchReviews();
    }
  }, [product?.id]);

  if (!product) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Helper to render rating stars
  const renderStars = (ratingValue, size = 14, color = "#D4AF37") => {
    const stars = [];
    const floorRating = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.25 && ratingValue % 1 <= 0.75;
    const gradientId = `half-grad-modal-${Math.random().toString(36).substr(2, 9)}`;

    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <svg key={i} width={size} height={size} fill={color} viewBox="0 0 24 24" className="me-0.5">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        );
      } else if (i === floorRating + 1 && (hasHalf || ratingValue % 1 > 0.75)) {
        if (ratingValue % 1 > 0.75) {
          stars.push(
            <svg key={i} width={size} height={size} fill={color} viewBox="0 0 24 24" className="me-0.5">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          );
        } else {
          stars.push(
            <svg key={i} width={size} height={size} fill={color} viewBox="0 0 24 24" className="me-0.5" style={{ display: 'inline-block' }}>
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset="50%" stopColor={color} />
                  <stop offset="50%" stopColor="#e0e0e0" />
                </linearGradient>
              </defs>
              <path fill={`url(#${gradientId})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          );
        }
      } else {
        stars.push(
          <svg key={i} width={size} height={size} fill="#e0e0e0" viewBox="0 0 24 24" className="me-0.5">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  // Calculations for rating distributions
  const totalReviews = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRating = 0;
  reviews.forEach((r) => {
    sumRating += r.rating;
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : "0.0";

  // Edit Review Operations
  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title || '');
    setEditComment(review.comment || '');
    setEditImages(review.imageUrls || []);
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
        if (res.data?.imageUrl) {
          setEditImages((prev) => [...prev, res.data.imageUrl]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        addToast("Image upload failed.");
      }
    }
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editComment.trim()) {
      addToast("Review description is required.");
      return;
    }
    setSubmittingEdit(true);
    try {
      const res = await api.put(`/reviews/${editingReview.id}`, {
        productId: product.id,
        orderId: editingReview.orderId,
        rating: editRating,
        title: editTitle,
        comment: editComment,
        imageUrls: editImages
      });
      addToast("Review updated successfully.");
      setReviews((prev) => prev.map((r) => (r.id === editingReview.id ? res.data : r)));
      setEditingReview(null);
    } catch (err) {
      addToast("Failed to update review.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        addToast("Review deleted successfully.");
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } catch (err) {
        addToast("Failed to delete review.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1040 }}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <div className="details-modal-header">
          <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Hamper Details</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        
        <div className="details-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', padding: '24px' }}>
          {/* Toast Notification Handler */}
          {toasts.length > 0 && (
            <div className="position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 2000 }}>
              {toasts.map((t) => (
                <div key={t.id} className="alert alert-dark text-white rounded-0 shadow px-4 py-2 border-0 mb-2">
                  {t.message}
                </div>
              ))}
            </div>
          )}

          <div className="details-grid">
            <div className="details-img-wrapper">
              <img 
                src={product.imageUrl || DEFAULT_IMAGE} 
                alt={product.name} 
                className="details-img"
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
              />
            </div>
            
            <div className="details-info text-start">
              <span className="details-category">{product.categoryName || 'Signature Hamper'}</span>
              <h3 className="details-title">{product.name}</h3>

              {/* Reviews Summary Header */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="text-gold d-inline-flex">
                  {renderStars(Number(averageRating), 16)}
                </span>
                <span className="fw-semibold text-muted small" style={{ fontSize: '0.82rem' }}>
                  ({averageRating} rating | {totalReviews} premium {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <p className="details-desc">{product.description}</p>
              
              <div className="details-price-row">
                <span className="details-price">{formatCurrency(product.price)}</span>
                <span className="details-price-original">{formatCurrency(product.price * 1.25)}</span>
                <span className="details-badge-discount">20% OFF</span>
              </div>

              <div className={`details-stock-status fw-semibold ${product.stock <= 0 ? 'text-danger' : (product.stock < 15 ? 'text-warning' : 'text-success')}`}>
                <span className="me-1.5">●</span>
                {product.stock <= 0 ? "Out of Stock" : (product.stock < 15 ? `Limited Stock: Only ${product.stock} left!` : "In Stock - Hand-wrapped to order")}
              </div>

              {/* Specifications */}
              <div className="mt-4 pt-3 border-top mb-4">
                <span className="d-block text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>Specifications</span>
                <ul className="list-unstyled small text-muted mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.82rem' }}>
                  <li>• <strong>Gift Style:</strong> Hand-wrapped Signature Luxury Trunk</li>
                  <li>• <strong>Presentation:</strong> Elegant gold-inlaid finish with silk ribbons</li>
                  <li>• <strong>Availability:</strong> Ready for custom shipping</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="d-flex gap-3 mt-auto pt-3">
                <button
                  type="button"
                  className="btn btn-gold flex-grow-1 py-3 text-white text-uppercase fw-bold"
                  style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1.5px', fontSize: '0.8rem' }}
                  onClick={() => onAddToCart(product)}
                  disabled={addingToCart || product.stock <= 0}
                >
                  {addingToCart ? (
                    <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                  ) : product.stock <= 0 ? (
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-gold px-3.5"
                  style={{ borderColor: '#D4AF37', color: '#D4AF37', borderRadius: '0' }}
                  onClick={onWishlistToggle}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {inWishlist ? (
                    <svg width="20" height="20" fill="#dc3545" stroke="#dc3545" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-5 border-top pt-4 text-start">
            <h4 className="fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Customer Reviews & Ratings</h4>
            
            {loading ? (
              <div className="text-center py-4">
                <span className="spinner-border text-gold" style={{ color: '#D4AF37' }}></span>
                <p className="text-muted small mt-2">Loading reviews...</p>
              </div>
            ) : (
              <div className="row g-4">
                {/* Left Column: Rating breakdown */}
                <div className="col-md-4">
                  <div className="bg-light p-4 text-center border">
                    <h1 className="fw-bold display-4 m-0" style={{ color: '#333' }}>{averageRating}</h1>
                    <div className="text-gold my-2 d-inline-flex">
                      {renderStars(Number(averageRating), 20)}
                    </div>
                    <p className="text-muted small mb-0">Based on {totalReviews} customer {totalReviews === 1 ? 'review' : 'reviews'}</p>
                  </div>
                  
                  {/* Rating Distribution list */}
                  <div className="mt-4">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = distribution[stars] || 0;
                      const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={stars} className="d-flex align-items-center gap-2 mb-2 small text-muted">
                          <span style={{ width: '25px', fontWeight: 'bold' }}>{stars}★</span>
                          <div className="progress flex-grow-1 rounded-0" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ width: `${percent}%`, backgroundColor: '#D4AF37' }} 
                              aria-valuenow={percent} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <span style={{ width: '30px', textAlign: 'right' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Reviews list feed */}
                <div className="col-md-8">
                  {reviews.length === 0 ? (
                    <div className="text-center py-5 border bg-light">
                      <p className="text-muted mb-0">No reviews yet for this luxury hamper. Purchase this item to be the first to leave a review!</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-4">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-3 border shadow-xs bg-white rounded-0">
                          {/* Review header: user profile picture & name */}
                          <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap mb-2">
                            <div className="d-flex align-items-center gap-2.5">
                              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-secondary" style={{ width: '40px', height: '40px', backgroundColor: '#475569' }}>
                                {rev.userProfilePictureUrl ? (
                                  <img 
                                    src={rev.userProfilePictureUrl} 
                                    alt={rev.userFullName} 
                                    className="rounded-circle w-100 h-100" 
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  rev.userFullName ? rev.userFullName.charAt(0).toUpperCase() : 'U'
                                )}
                              </div>
                              <div>
                                <h6 className="fw-bold mb-0.5 small">{rev.userFullName}</h6>
                                <div className="d-flex align-items-center gap-2">
                                  {rev.verifiedPurchase && (
                                    <span className="badge bg-success-subtle text-success border border-success d-flex align-items-center gap-1 py-0.5 px-2" style={{ fontSize: '0.68rem', borderRadius: '4px' }}>
                                      ✔ Verified Purchase
                                    </span>
                                  )}
                                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>{rev.createdAt.substring(0, 10)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Stars */}
                            <div className="text-gold d-inline-flex">
                              {renderStars(rev.rating, 13)}
                            </div>
                          </div>

                          {/* Review content body */}
                          <div className="mt-2 text-start">
                            {rev.title && <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{rev.title}</h6>}
                            <p className="text-secondary small mb-2" style={{ lineHeight: '1.4' }}>{rev.comment}</p>
                            
                            {/* Uploaded Images rendering */}
                            {rev.imageUrls && rev.imageUrls.length > 0 && (
                              <div className="d-flex gap-2 flex-wrap mb-2.5">
                                {rev.imageUrls.map((imgUrl, i) => (
                                  <a href={imgUrl} target="_blank" rel="noopener noreferrer" key={i} className="border p-0.5 bg-light">
                                    <img 
                                      src={imgUrl} 
                                      alt="Customer Review Photo" 
                                      style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                                    />
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Edit / Delete actions for own reviews */}
                            {user && user.email === rev.userEmail && (
                              <div className="d-flex gap-3.5 border-top pt-2 mt-2" style={{ fontSize: '0.8rem' }}>
                                <button 
                                  onClick={() => handleOpenEdit(rev)}
                                  className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1 small fw-semibold"
                                >
                                  ✏ Edit Review
                                </button>
                                <button 
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="btn btn-link text-decoration-none text-danger p-0 d-flex align-items-center gap-1 small fw-semibold"
                                >
                                  🗑 Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Review Form Overlay (Inner Modal) */}
      {editingReview && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1110 }}>
            <div className="modal-content border-0 shadow-lg rounded-0 text-dark" style={{ backgroundColor: '#fff' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ✏ Edit Your Review
                </h5>
                <button type="button" className="btn-close" onClick={() => setEditingReview(null)}></button>
              </div>
              <form onSubmit={handleUpdateReview}>
                <div className="modal-body text-start pt-3">
                  {/* Star Rating Select */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Your Rating *</label>
                    <div className="d-flex align-items-center gap-1.5 fs-4">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = editHoverRating ? starValue <= editHoverRating : starValue <= editRating;
                        return (
                          <span 
                            key={starValue}
                            onMouseEnter={() => setEditHoverRating(starValue)}
                            onMouseLeave={() => setEditHoverRating(0)}
                            onClick={() => setEditRating(starValue)}
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
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {/* Review Description */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Review Description *</label>
                      <span className="small text-muted">{editComment.length}/500</span>
                    </div>
                    <textarea 
                      className="form-control rounded-0" 
                      rows="4" 
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value.substring(0, 500))}
                      required
                    ></textarea>
                  </div>

                  {/* Upload Images */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase tracking-wider mb-1">Uploaded Images</label>
                    <input 
                      type="file" 
                      className="form-control rounded-0 mb-2" 
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="small text-muted mb-2">Uploading image...</div>
                    )}
                    
                    {/* Images preview list */}
                    {editImages.length > 0 && (
                      <div className="d-flex gap-2 flex-wrap">
                        {editImages.map((url, idx) => (
                          <div key={idx} className="position-relative">
                            <img 
                              src={url} 
                              alt="Edit Preview" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #ccc' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="btn btn-danger btn-sm p-0 position-absolute d-flex align-items-center justify-content-center"
                              style={{ top: '-6px', right: '-6px', width: '16px', height: '16px', borderRadius: '50%', fontSize: '0.6rem' }}
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
                  <button type="button" className="btn btn-outline-secondary rounded-0 px-4" onClick={() => setEditingReview(null)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-gold text-white rounded-0 px-4" 
                    style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37' }}
                    disabled={submittingEdit || uploading}
                  >
                    {submittingEdit ? 'Saving...' : 'Save Changes'}
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

export default ProductDetailsModal;

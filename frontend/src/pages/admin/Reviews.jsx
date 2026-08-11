import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Toast alert
  const [toast, setToast] = useState(null);

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/reviews/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load review stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        search: search.trim() ? search.trim() : undefined,
        rating: ratingFilter ? parseInt(ratingFilter) : undefined,
        isHidden: statusFilter === 'hidden' ? true : (statusFilter === 'active' ? false : undefined)
      };
      
      const res = await api.get('/admin/reviews', { params });
      setReviews(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load reviews', err);
      triggerToast('danger', 'Could not load reviews moderation list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page]);

  useEffect(() => {
    loadStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadReviews();
  };

  const handleResetFilters = () => {
    setSearch('');
    setRatingFilter('');
    setStatusFilter('');
    setPage(0);
    // Timeout to ensure state updates propagate
    setTimeout(() => {
      loadReviews();
    }, 50);
  };

  const handleToggleHide = async (reviewId, currentIsHidden) => {
    const action = currentIsHidden ? 'unhide' : 'hide';
    try {
      await api.patch(`/admin/reviews/${reviewId}/${action}`);
      triggerToast('success', `Review ${currentIsHidden ? 'unhidden' : 'hidden'} successfully.`);
      // Update local state list
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isHidden: !currentIsHidden } : r));
      loadStats(); // reload stats today / average rating
    } catch (err) {
      console.error(err);
      triggerToast('danger', `Failed to ${action} review.`);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/reviews/${reviewId}`);
      triggerToast('success', 'Review deleted successfully.');
      // Update local state list
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      loadStats();
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to delete review.');
    }
  };

  const renderStars = (ratingValue) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < ratingValue ? '#fbbf24' : '#4b5563' }} className="me-0.5">★</span>
    ));
  };

  return (
    <div className="p-2 text-start font-sans text-light">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 2000 }}>
          <div className={`alert alert-${toast.type} border-0 shadow px-4 py-2 text-white`} style={{ borderRadius: '8px', backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444' }}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Reviews Moderation</h2>
          <p className="text-secondary small m-0 mt-1">Moderate customer ratings, check verified purchases, and view stores feedback.</p>
        </div>
      </div>

      {/* Statistics Analytics Panel */}
      <div className="row g-3 mb-4">
        {/* Metric Card 1: Total Reviews */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 p-4" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-secondary small fw-semibold text-uppercase tracking-wider">Total Reviews</span>
                <h3 className="m-0 mt-2 fw-bold" style={{ color: '#f8fafc' }}>
                  {statsLoading ? '...' : (stats?.totalReviews || 0)}
                </h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
                ★
              </div>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Average rating */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 p-4" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-secondary small fw-semibold text-uppercase tracking-wider">Avg Rating</span>
                <h3 className="m-0 mt-2 fw-bold" style={{ color: '#fbbf24' }}>
                  {statsLoading ? '...' : (stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0')} / 5.0
                </h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                ✔
              </div>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Reviews today */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 p-4" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-secondary small fw-semibold text-uppercase tracking-wider">Reviews Today</span>
                <h3 className="m-0 mt-2 fw-bold" style={{ color: '#f8fafc' }}>
                  {statsLoading ? '...' : (stats?.reviewsToday || 0)}
                </h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                ⏰
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Rating Lists (Most Reviewed & Lowest Rated) */}
      <div className="row g-4 mb-4">
        {/* Most Reviewed */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 p-4 h-100" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#f8fafc' }}>🔥 Most Reviewed Products</h5>
            {stats?.mostReviewedProducts && stats.mostReviewedProducts.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {stats.mostReviewedProducts.map((p, i) => (
                  <div key={p.productId} className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2">
                    <div>
                      <span className="fw-semibold text-light small d-block">{i + 1}. {p.productName}</span>
                      <small className="text-secondary">Avg Rating: {p.averageRating.toFixed(1)}★</small>
                    </div>
                    <span className="badge bg-warning text-dark fw-bold px-2 py-1 rounded">{p.reviewCount} Reviews</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary small mb-0">No ratings data yet.</p>
            )}
          </div>
        </div>

        {/* Lowest Rated */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 p-4 h-100" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#ef4444' }}>⚠ Lowest Rated Products</h5>
            {stats?.lowestRatedProducts && stats.lowestRatedProducts.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {stats.lowestRatedProducts.map((p, i) => (
                  <div key={p.productId} className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2">
                    <div>
                      <span className="fw-semibold text-light small d-block">{i + 1}. {p.productName}</span>
                      <small className="text-secondary">Based on {p.reviewCount} reviews</small>
                    </div>
                    <span className="badge bg-danger text-white fw-bold px-2 py-1 rounded">{p.averageRating.toFixed(1)}★</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary small mb-0">No reviews data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Controls / Search filters */}
      <div className="card border-0 p-4 mb-4" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label text-secondary small fw-bold">Search Reviewers/Products</label>
            <input 
              type="text" 
              className="form-control text-white border-secondary rounded" 
              style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
              placeholder="Search name, product, comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="col-6 col-md-2.5">
            <label className="form-label text-secondary small fw-bold">Filter Rating</label>
            <select 
              className="form-select text-white border-secondary rounded" 
              style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5★ Stars</option>
              <option value="4">4★ Stars</option>
              <option value="3">3★ Stars</option>
              <option value="2">2★ Stars</option>
              <option value="1">1★ Star</option>
            </select>
          </div>

          <div className="col-6 col-md-2.5">
            <label className="form-label text-secondary small fw-bold">Status Filter</label>
            <select 
              className="form-select text-white border-secondary rounded" 
              style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>

          <div className="col-12 col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-warning flex-grow-1 text-dark fw-bold" style={{ backgroundColor: '#fbbf24', border: '0' }}>
              Apply
            </button>
            <button type="button" onClick={handleResetFilters} className="btn btn-outline-secondary text-white" style={{ borderColor: '#334155' }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Moderation Table */}
      <div className="card border-0 overflow-hidden" style={{ backgroundColor: '#1e293b', borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0 text-start" style={{ backgroundColor: '#1e293b' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th className="px-4 py-3">Product</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Rating</th>
                <th className="py-3" style={{ width: '35%' }}>Review Title & Comment</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="text-secondary small mt-2 mb-0">Loading reviews list...</p>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    No matching customer reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-light small">{rev.productName}</div>
                      <small className="text-secondary font-monospace">Order ID: {rev.orderId}</small>
                    </td>
                    <td className="py-3">
                      <div className="small fw-semibold">{rev.userFullName}</div>
                      <div className="text-secondary tiny" style={{ fontSize: '0.72rem' }}>{rev.userEmail}</div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex text-gold" style={{ fontSize: '0.8rem' }}>
                        {renderStars(rev.rating)}
                      </div>
                    </td>
                    <td className="py-3">
                      {rev.title && <div className="fw-bold text-light small mb-0.5">{rev.title}</div>}
                      <div className="text-secondary small text-truncate" style={{ maxWidth: '300px' }} title={rev.comment}>
                        {rev.comment}
                      </div>
                      
                      {/* Review Images Preview */}
                      {rev.imageUrls && rev.imageUrls.length > 0 && (
                        <div className="d-flex gap-1.5 mt-1.5">
                          {rev.imageUrls.map((url, i) => (
                            <a href={url} target="_blank" rel="noopener noreferrer" key={i} className="border border-secondary p-0.5 bg-dark">
                              <img src={url} alt="Review attachment" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-secondary small">
                      {rev.createdAt.substring(0, 10)}
                    </td>
                    <td className="py-3">
                      {rev.isHidden ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger px-2.5 py-1" style={{ fontSize: '0.7rem' }}>Hidden</span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success px-2.5 py-1" style={{ fontSize: '0.7rem' }}>Active</span>
                      )}
                      {rev.verifiedPurchase && (
                        <div className="tiny mt-1 text-success fw-bold" style={{ fontSize: '0.65rem' }}>✔ Verified</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => handleToggleHide(rev.id, rev.isHidden)}
                          className={`btn btn-sm ${rev.isHidden ? 'btn-outline-success' : 'btn-outline-warning'} px-3`}
                          style={{ borderRadius: '6px' }}
                        >
                          {rev.isHidden ? 'Unhide' : 'Hide'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: '6px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top border-secondary" style={{ borderColor: '#334155' }}>
            <span className="text-secondary small">Showing {reviews.length} of {totalElements} entries</span>
            <div className="d-flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="btn btn-outline-secondary text-white btn-sm px-3"
                style={{ borderColor: '#334155' }}
              >
                Previous
              </button>
              <span className="text-light align-self-center mx-2 small">Page {page + 1} of {totalPages}</span>
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="btn btn-outline-secondary text-white btn-sm px-3"
                style={{ borderColor: '#334155' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;

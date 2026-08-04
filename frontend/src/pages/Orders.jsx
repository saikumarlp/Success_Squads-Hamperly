import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ToastContainer } from '../components/Toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        addToast(err.response?.data?.message || "Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Order ID copied to clipboard.");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="container py-5 flex-grow-1">
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          My Profile
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          Order History
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
        <p className="text-muted small">View and track all your luxury gift hamper orders.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading orders...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 border bg-white shadow-sm p-4 d-flex flex-column align-items-center" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: '3rem' }}>✨</span>
          <h4 className="mt-3 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>No Orders Placed Yet</h4>
          <p className="text-muted small max-width-md px-4 mt-1" style={{ maxWidth: '400px' }}>
            Your premium shopping list is empty. Explore our collection of hand-wrapped signature luxury gift hampers.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="btn btn-gold px-4 py-2.5 text-white text-uppercase fw-semibold mt-3"
            style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1px', fontSize: '0.8rem' }}
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div 
              key={order.orderId} 
              className="card border-0 shadow-sm bg-white" 
              style={{ borderLeft: '4px solid #D4AF37', borderRadius: '0' }}
            >
              {/* Order Card Header */}
              <div className="card-header bg-white border-bottom py-3.5 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                      Order ID:
                    </span>
                    <span className="badge bg-light text-dark border font-monospace py-1.5 px-2.5" style={{ fontSize: '0.8rem' }}>
                      {order.orderId}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleCopyToClipboard(order.orderId)}
                      className="btn btn-link p-0 text-muted border-0 align-baseline"
                      style={{ fontSize: '0.75rem', textDecoration: 'none' }}
                      title="Copy Order ID"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-muted small mt-1.5">
                    Ordered on: <span className="fw-semibold text-dark">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="text-md-end">
                    <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                      Total Amount
                    </div>
                    <div className="fw-bold text-dark fs-5">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                  <div>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="btn btn-gold btn-sm px-3 text-white text-uppercase fw-semibold"
                      style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', fontSize: '0.75rem', letterSpacing: '0.5px' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Card Body - Items List */}
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-3">
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div 
                      key={item.productId || index} 
                      className="d-flex align-items-center gap-3 py-2"
                      style={{ borderBottom: index < order.orderItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                    >
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200"} 
                        alt={item.productName} 
                        className="img-thumbnail rounded-0"
                        style={{ width: '65px', height: '65px', objectFit: 'cover', borderColor: 'rgba(212, 175, 55, 0.15)' }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200";
                        }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="mb-0.5 fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                          {item.productName}
                        </h6>
                        <div className="text-muted small">
                          Qty: <span className="fw-semibold text-dark">{item.quantity}</span> 
                          <span className="mx-2 text-muted">|</span> 
                          Price: <span className="fw-semibold text-dark">{formatCurrency(item.pricePerUnit)}</span>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

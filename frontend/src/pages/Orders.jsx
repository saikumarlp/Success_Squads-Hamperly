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

  const formatEstimatedDelivery = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="status-pill status-pill-pending">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="status-pill status-pill-confirmed">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Confirmed
          </span>
        );
      case 'PACKED':
        return (
          <span className="status-pill status-pill-packed">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Packed
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="status-pill status-pill-shipped">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M8.25 18.75V14.25m0 0H21m-9.75 0h7.5" />
            </svg>
            Shipped
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="status-pill status-pill-out_for_delivery">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1H9v1m4-1h2m0 0h4a2 2 0 002-2v-3a2 2 0 00-2-2h-3v5z" />
            </svg>
            Out for Delivery
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="status-pill status-pill-delivered">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Delivered
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className={`status-pill status-pill-${status.toLowerCase()}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {status}
          </span>
        );
      default:
        return (
          <span className="status-pill bg-light text-dark border">
            {status}
          </span>
        );
    }
  };

  const renderStepper = (status) => {
    if (status === 'CANCELLED' || status === 'FAILED') {
      return (
        <div className="d-flex align-items-center gap-2 p-3 bg-danger-subtle rounded-3 text-danger border border-danger-subtle mt-4">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="small fw-semibold">This order was {status === 'CANCELLED' ? 'cancelled' : 'marked as failed'}.</span>
        </div>
      );
    }

    const steps = [
      { key: 'PENDING', label: 'Placed' },
      { key: 'CONFIRMED', label: 'Confirmed' },
      { key: 'PACKED', label: 'Packed' },
      { key: 'SHIPPED', label: 'Shipped' },
      { key: 'DELIVERED', label: 'Delivered' }
    ];

    const getStatusIndex = (currentStatus) => {
      switch (currentStatus) {
        case 'PENDING':
          return 0;
        case 'CONFIRMED':
          return 1;
        case 'PACKED':
          return 2;
        case 'SHIPPED':
        case 'OUT_FOR_DELIVERY':
          return 3;
        case 'DELIVERED':
          return 4;
        default:
          return 0;
      }
    };

    const currentIndex = getStatusIndex(status);
    const progressWidths = ['0%', '25%', '50%', '75%', '100%'];
    const barWidth = progressWidths[currentIndex];

    return (
      <div className="progress-stepper mt-4">
        <div className="progress-stepper-bar" style={{ width: barWidth }}></div>
        {steps.map((step, idx) => {
          let stepClass = 'stepper-step';
          if (idx < currentIndex) {
            stepClass += ' completed';
          } else if (idx === currentIndex) {
            stepClass += ' active';
          }

          return (
            <div key={step.key} className={stepClass}>
              <div className="stepper-dot"></div>
              <div className="stepper-label d-none d-sm-block">{step.label}</div>
            </div>
          );
        })}
      </div>
    );
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
        <div className="d-flex flex-column gap-4" style={{ maxWidth: '960px', margin: '0 auto' }}>
          {orders.map((order) => (
            <div 
              key={order.orderId} 
              className="luxury-order-card border-0"
            >
              {/* Order Card Header */}
              <div className="luxury-order-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                      Order ID:
                    </span>
                    <span className="badge bg-light text-dark border font-monospace py-1 px-2.5" style={{ fontSize: '0.78rem' }}>
                      {order.orderId}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleCopyToClipboard(order.orderId)}
                      className="btn btn-link p-0 text-muted border-0 align-baseline"
                      style={{ fontSize: '0.75rem', textDecoration: 'none' }}
                      title="Copy Order ID"
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-muted small mt-1">
                    Placed on: <span className="fw-semibold text-dark">{formatDate(order.createdAt)}</span>
                  </div>
                  {order.estimatedDelivery && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'FAILED' && (
                    <div className="text-muted small mt-1 d-flex align-items-center gap-1">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M8.25 18.75V14.25m0 0H21m-9.75 0h7.5" />
                      </svg>
                      <span>Est. Delivery: <strong className="text-dark">{formatEstimatedDelivery(order.estimatedDelivery)}</strong></span>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap justify-content-between justify-content-md-end">
                  <div className="text-start text-md-end me-0 me-md-2">
                    <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>
                      Grand Total
                    </div>
                    <div className="fw-bold text-dark fs-5">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {getStatusPill(order.status)}
                    <button
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="btn-premium-action"
                    >
                      <span>Details</span>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Card Body - Items List */}
              <div className="card-body p-4 bg-white">
                <div className="d-flex flex-column gap-3">
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div 
                      key={item.productId || index} 
                      className="d-flex align-items-center gap-4 py-2"
                      style={{ borderBottom: index < order.orderItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                    >
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200"} 
                        alt={item.productName} 
                        className="img-thumbnail border-0 flex-shrink-0"
                        style={{ width: '95px', height: '95px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200";
                        }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <h5 className="mb-1.5 fw-bold text-dark text-truncate" style={{ fontSize: '1.05rem', fontFamily: "var(--body-font)" }}>
                          {item.productName}
                        </h5>
                        <div className="text-muted small">
                          Quantity: <span className="fw-semibold text-dark">{item.quantity}</span> 
                          <span className="mx-2.5 text-muted">|</span> 
                          Unit Price: <span className="fw-semibold text-dark">{formatCurrency(item.pricePerUnit)}</span>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="fw-bold text-dark fs-6">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Indicator */}
                {renderStepper(order.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

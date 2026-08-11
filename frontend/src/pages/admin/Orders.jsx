import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../services/admin/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadOrders = async (searchVal = search, statusVal = statusFilter) => {
    try {
      setLoading(true);
      const data = await getAdminOrders(searchVal, statusVal);
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to retrieve orders list.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(search, statusFilter);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders(search, statusFilter);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    loadOrders('', '');
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await updateAdminOrderStatus(orderId, nextStatus);
      triggerToast('success', `Order status updated to ${nextStatus}.`);
      loadOrders(search, statusFilter);
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to update order status.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'CONFIRMED':
      case 'DELIVERED':
        return 'bg-success-subtle border border-success text-success';
      case 'PENDING':
      case 'PACKED':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-warning-subtle border border-warning text-warning';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-danger-subtle border border-danger text-danger';
      default:
        return 'bg-secondary-subtle border border-secondary text-secondary';
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-alert alert alert-${toast.type} shadow border-0 position-fixed`} style={{ right: '20px', top: '90px', zIndex: 1060, borderRadius: '12px' }}>
          <div className="d-flex align-items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="fw-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 text-start">
        <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Orders Registry</h2>
        <p className="text-secondary small m-0 mt-1">Monitor buyer transactions, evaluate payments, and fulfill shipment states.</p>
      </div>

      {/* Filters & Search Controls */}
      <div className="card border-0 mb-4 p-3" style={{ borderRadius: '12px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-5">
            <input 
              type="text" 
              className="form-control"
              placeholder="Search by ID or customer details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f8fafc' }}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f8fafc' }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-warning fw-semibold px-4 flex-grow-1 text-dark" style={{ backgroundColor: '#fbbf24' }}>
              Search
            </button>
            <button type="button" onClick={handleClearFilters} className="btn btn-outline-secondary px-3" style={{ borderColor: '#374151', color: '#94a3b8' }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Orders list card */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle m-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f2937' }}>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Order ID</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Customer Details</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Amount Paid</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Created Date</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider text-end">Operations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.orderId} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td className="py-3 px-4 border-0 bg-transparent font-monospace text-warning text-start" style={{ fontSize: '0.85rem' }}>{o.orderId}</td>
                    <td className="py-3 border-0 bg-transparent text-start">
                      <div>
                        <span className="d-block fw-semibold text-white">{o.customerName}</span>
                        <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{o.customerEmail}</small>
                      </div>
                    </td>
                    <td className="py-3 border-0 bg-transparent fw-semibold text-white text-start">₹{o.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 border-0 bg-transparent text-secondary small text-start">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="py-3 border-0 bg-transparent text-start">
                      <span className={`badge px-2.5 py-1.5 rounded-pill fs-9 text-uppercase font-bold ${getStatusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-0 bg-transparent text-end">
                      <div className="d-inline-flex gap-2 align-items-center">
                        <select 
                          className="form-select form-select-sm admin-input-status"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                          style={{ width: '150px', fontSize: '0.8rem', backgroundColor: '#0f172a', borderColor: '#1f2937', color: '#f8fafc' }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                        <button 
                          onClick={() => { setSelectedOrder(o); setIsDetailsOpen(true); }}
                          className="btn btn-sm btn-outline-info p-1.5"
                          style={{ borderRadius: '6px' }}
                          title="View items"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    No transaction entries exist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      {isDetailsOpen && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content text-light border-0" style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <div className="modal-header border-bottom text-start" style={{ borderColor: '#1f2937' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#fbbf24' }}>Order Details: {selectedOrder.orderId}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsDetailsOpen(false)}></button>
              </div>
              <div className="modal-body p-4 text-start">
                {/* Shipping & Buyer Details */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <span className="text-secondary small text-uppercase font-semibold tracking-wider block">Buyer Details</span>
                    <div className="mt-2 p-2.5 rounded h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="small">
                        <div className="mb-1"><span className="text-secondary">Name:</span> <strong className="text-white">{selectedOrder.customerName}</strong></div>
                        <div className="mb-1"><span className="text-secondary">Email:</span> <span className="text-white">{selectedOrder.customerEmail}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small text-uppercase font-semibold tracking-wider block">Shipping Destination</span>
                    <div className="mt-2 p-2.5 rounded h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="small">
                        <div className="mb-1"><span className="text-secondary">Address:</span> <span className="text-white">{selectedOrder.shippingAddress || 'N/A'}</span></div>
                        <div className="mb-1"><span className="text-secondary">Location:</span> <span className="text-white">{selectedOrder.city ? `${selectedOrder.city}, ${selectedOrder.state}` : 'N/A'}</span></div>
                        <div className="mb-1"><span className="text-secondary">PIN:</span> <span className="text-white">{selectedOrder.postalCode || 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates & Statuses row */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <span className="text-secondary small text-uppercase font-semibold tracking-wider block">Order Metadata</span>
                    <div className="mt-2 p-2.5 rounded h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="small">
                        <div className="mb-1">
                          <span className="text-secondary">Order Date:</span>{' '}
                          <span className="text-white">
                            {selectedOrder.orderDate 
                              ? new Date(selectedOrder.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                              : selectedOrder.createdAt 
                                ? new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                : 'N/A'}
                          </span>
                        </div>
                        <div className="mb-1">
                          <span className="text-secondary">Order Time:</span>{' '}
                          <span className="text-white">
                            {selectedOrder.orderDate 
                              ? new Date(selectedOrder.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) 
                              : selectedOrder.createdAt 
                                ? new Date(selectedOrder.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                                : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small text-uppercase font-semibold tracking-wider block">Delivery Schedule</span>
                    <div className="mt-2 p-2.5 rounded h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="small">
                        <div className="mb-1">
                          <span className="text-secondary">Expected Delivery:</span>{' '}
                          <strong className="text-warning">
                            {selectedOrder.expectedDeliveryDate 
                              ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                              : 'N/A'}
                          </strong>
                        </div>
                        <div className="mb-1">
                          <span className="text-secondary">Status:</span>{' '}
                          <span className="text-white">{selectedOrder.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-secondary small text-uppercase font-semibold tracking-wider block mb-2">Purchased Products</span>
                <div className="table-responsive">
                  <table className="table table-dark align-middle m-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                      <tr style={{ color: '#64748b', borderBottom: '1px solid #1f2937' }}>
                        <th className="py-2 border-0 bg-transparent fs-8 text-uppercase tracking-wider">Item Image</th>
                        <th className="py-2 border-0 bg-transparent fs-8 text-uppercase tracking-wider">Name</th>
                        <th className="py-2 border-0 bg-transparent fs-8 text-uppercase tracking-wider text-center">Qty</th>
                        <th className="py-2 border-0 bg-transparent fs-8 text-uppercase tracking-wider text-end">Price</th>
                        <th className="py-2 border-0 bg-transparent fs-8 text-uppercase tracking-wider text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item) => (
                        <tr key={item.productId} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td className="py-2 border-0 bg-transparent">
                            <img 
                              src={item.imageUrl || '/Hamperly.png'} 
                              alt={item.productName} 
                              className="rounded object-fit-cover shadow-sm bg-secondary"
                              style={{ width: '40px', height: '40px' }}
                              onError={(e) => { e.target.src = '/Hamperly.png'; }}
                            />
                          </td>
                          <td className="py-2 border-0 bg-transparent fw-semibold text-white">{item.productName}</td>
                          <td className="py-2 border-0 bg-transparent text-center">{item.quantity}</td>
                          <td className="py-2 border-0 bg-transparent text-end">₹{item.pricePerUnit?.toFixed(2)}</td>
                          <td className="py-2 border-0 bg-transparent text-end fw-bold text-white">₹{item.totalPrice?.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border-0">
                        <td colSpan="4" className="py-3 border-0 bg-transparent text-end fw-semibold text-secondary">Grand Total:</td>
                        <td className="py-3 border-0 bg-transparent text-end fw-bold text-warning" style={{ fontSize: '1.1rem' }}>₹{selectedOrder.totalAmount?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top p-3" style={{ borderColor: '#1f2937' }}>
                <button type="button" className="btn btn-warning text-dark border-0 fw-semibold px-4" onClick={() => setIsDetailsOpen(false)} style={{ backgroundColor: '#fbbf24', borderRadius: '8px' }}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input-status:focus {
          border-color: #fbbf24 !important;
          box-shadow: none !important;
        }
        .w-4.5 { width: 1.125rem; }
        .h-4.5 { height: 1.125rem; }
        .bg-success-subtle {
          background-color: rgba(34, 197, 94, 0.1) !important;
        }
        .bg-warning-subtle {
          background-color: rgba(234, 179, 8, 0.1) !important;
        }
        .bg-danger-subtle {
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Orders;

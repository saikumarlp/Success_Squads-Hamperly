import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { ToastContainer } from '../components/Toast';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600";

const formatRupee = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const renderStars = (rating = 4.8) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  for (let i = 1; i <= 5; i++) {
    if (i <= floorRating) {
      stars.push(
        <svg key={i} width="14" height="14" fill="#D4AF37" viewBox="0 0 24 24" className="me-0.5">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} width="14" height="14" fill="#e0e0e0" viewBox="0 0 24 24" className="me-0.5">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    }
  }
  return stars;
};

const Wishlist = () => {
  const { addToCart, removeFromWishlist } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAdding, setModalAdding] = useState(false);
  const [cartAddingId, setCartAddingId] = useState(null);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      setItems(response.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      addToast("Failed to retrieve wishlist items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const handleRemove = async (e, productId, productName) => {
    e.stopPropagation();
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.id !== productId));
      addToast(`Removed "${productName}" from Wishlist`);
    } catch (err) {
      console.error(err);
      addToast("Failed to remove item.");
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      addToast(`"${product.name}" is currently out of stock.`);
      return;
    }
    setCartAddingId(product.id);
    try {
      await addToCart(product.id, 1);
      addToast(`Added "${product.name}" to cart.`);
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.id);
      setItems(prev => prev.filter(item => item.id !== product.id));
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to add item to cart.");
    } finally {
      setCartAddingId(null);
    }
  };

  const handleModalAddToCart = async (product) => {
    if (product.stock <= 0) {
      addToast(`"${product.name}" is currently out of stock.`);
      return;
    }
    setModalAdding(true);
    try {
      await addToCart(product.id, 1);
      addToast(`Added "${product.name}" to cart.`);
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.id);
      setItems(prev => prev.filter(item => item.id !== product.id));
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to add item to cart.");
    } finally {
      setModalAdding(false);
    }
  };

  return (
    <div className="container py-5 flex-grow-1 d-flex flex-column">
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      <div className="mb-4 text-start">
        <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#D4AF37' }}>
          Your Favorites
        </span>
        <h3 className="mb-0 text-dark fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginTop: '4px' }}>
          My Wishlist
        </h3>
      </div>

      <div className="mb-4" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }}></div>

      {loading ? (
        <div className="py-5 text-center my-auto">
          <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
            <span className="visually-hidden">Loading wishlist...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 my-auto text-muted d-flex flex-column align-items-center">
          <span style={{ fontSize: '3rem' }}>❤️</span>
          <h4 className="mt-3 fw-bold text-dark" style={{ fontFamily: "'Playfair Display', serif" }}>Your Wishlist is Empty</h4>
          <p className="text-muted max-w-md mx-auto" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
            Explore our curated collections of luxury gift hampers and save your favorite selections for later.
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="btn btn-gold px-4 py-2.5 mt-3 text-uppercase fw-bold"
            style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', letterSpacing: '1px', fontSize: '0.8rem' }}
          >
            Shop Collections
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {items.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock < 15;
            const stockStatusText = isOutOfStock ? "Out of Stock" : (isLowStock ? `Only ${product.stock} left!` : "In Stock");
            const badge = isOutOfStock ? "Out of Stock" : (isLowStock ? "Limited" : null);

            return (
              <div key={product.id} className="col">
                <div className="card luxury-card border-0">
                  {badge && (
                    <div className="luxury-badge">
                      {badge}
                    </div>
                  )}

                  <div className="luxury-card-img-wrapper" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
                    <img 
                      src={product.imageUrl || DEFAULT_IMAGE} 
                      alt={product.name} 
                      className="luxury-card-img" 
                      onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      loading="lazy"
                    />
                  </div>

                  <div className="card-body px-3 py-4 d-flex flex-column flex-grow-1">
                    <div className="luxury-category">{product.categoryName}</div>
                    <h4 className="luxury-title" title={product.name} style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
                      {product.name}
                    </h4>
                    <p className="luxury-desc text-muted">
                      {product.description && product.description.length > 100 
                        ? product.description.substring(0, 97) + "..." 
                        : product.description}
                    </p>

                    <div className="price-container mt-auto">
                      <span className="current-price">{formatRupee(product.price || 0)}</span>
                    </div>

                    <div className="rating-container">
                      <span className="stars d-inline-flex">
                        {renderStars(4.8)}
                      </span>
                      <span className="fw-semibold text-secondary">(35 reviews)</span>
                    </div>

                    <div className={`stock-status ${isLowStock ? 'stock-low' : 'stock-in'}`}>
                      <span className="me-1">●</span> {stockStatusText}
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-2">
                      <button 
                        type="button"
                        className="btn btn-action-view flex-grow-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Product
                      </button>

                      <button 
                        type="button"
                        className="btn btn-action-icon text-danger"
                        onClick={(e) => handleRemove(e, product.id, product.name)}
                        title="Remove from Wishlist"
                        aria-label="Remove from Wishlist"
                      >
                        <svg width="18" height="18" fill="#dc3545" stroke="#dc3545" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <button 
                        type="button"
                        className="btn btn-action-icon"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={cartAddingId === product.id || isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        aria-label="Add to Cart"
                      >
                        {cartAddingId === product.id ? (
                          <span className="spinner-border spinner-border-sm text-gold" role="status" style={{ width: '14px', height: '14px', borderColor: '#D4AF37', borderRightColor: 'transparent' }}></span>
                        ) : (
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reusable Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleModalAddToCart}
          onWishlistToggle={handleModalWishlistToggle}
          inWishlist={modalInWishlist}
          addingToCart={modalAdding}
        />
      )}
    </div>
  );
};

export default Wishlist;

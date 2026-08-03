import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';

/**
 * Loading Skeleton Card component with pulsing animation
 */
const ProductSkeleton = () => (
  <div className="card skeleton-card border-0 skeleton-pulse">
    <div className="skeleton-img"></div>
    <div className="skeleton-body">
      <div className="skeleton-text skeleton-category"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-desc"></div>
      <div className="skeleton-text skeleton-price"></div>
      <div className="skeleton-text skeleton-rating"></div>
      <div className="skeleton-text skeleton-badge-stock"></div>
      <div className="skeleton-btn-row">
        <div className="skeleton-text skeleton-btn-main"></div>
        <div className="skeleton-text skeleton-btn-icon"></div>
        <div className="skeleton-text skeleton-btn-icon"></div>
      </div>
    </div>
  </div>
);

/**
 * Premium Empty State component
 */
const EmptyState = () => (
  <div className="premium-empty-state">
    <div className="premium-empty-state-icon" aria-hidden="true">✨</div>
    <h3 className="premium-empty-state-title">No Collections Found</h3>
    <p className="premium-empty-state-text">
      Our handcrafted signature luxury gift hampers are currently being prepared. 
      Please visit again soon to explore our exclusive new offerings.
    </p>
  </div>
);

/**
 * Reusable Featured Products Catalog Section
 */
const FeaturedProducts = ({ onAction }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal Details State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAdding, setModalAdding] = useState(false);
  const { addToCart } = useAuth();

  const handleModalAddToCart = async (product) => {
    if (product.stock <= 0) {
      onAction(`"${product.name}" is currently out of stock.`);
      return;
    }
    setModalAdding(true);
    try {
      await addToCart(product.id, 1);
      onAction(`"${product.name}" has been added to your cart.`);
    } catch (err) {
      console.error(err);
      onAction(err.message || "Failed to add item to cart.");
    } finally {
      setModalAdding(false);
    }
  };

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/categories');
        setCategories(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to fetch collection categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load Products when active tab changes
  useEffect(() => {
    if (selectedCategoryId === null) return;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await api.get(`/products?categoryId=${selectedCategoryId}`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error loading products:", err);
        onAction("Failed to load products for the selected category.");
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategoryId]);

  return (
    <div className="mb-5">
      {/* Section Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          Curated Collections
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          Curated Luxury Hampers
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
        <p className="text-muted leading-relaxed" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover our premium handcrafted gift collections by category.
        </p>
      </div>

      {/* Category Selection Tabs */}
      {!loading && categories.length > 0 && (
        <div className="d-flex justify-content-center mb-5 overflow-auto pb-2 gap-2 gap-md-3">
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;
            const displayName = category.categoryName
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className="btn px-4 py-2.5 text-uppercase fw-semibold"
                style={{
                  borderRadius: '0',
                  fontSize: '0.82rem',
                  letterSpacing: '1.5px',
                  backgroundColor: isActive ? '#D4AF37' : 'transparent',
                  color: isActive ? '#fff' : '#444',
                  borderColor: '#D4AF37',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      )}

      {/* Conditional Rendering State (Skeleton -> Empty/Error -> Grid) */}
      {loading || productsLoading ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 justify-content-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col d-flex">
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : error || products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 justify-content-center">
            {products.map((product) => (
              <div key={product.id} className="col d-flex">
                <ProductCard 
                  product={product} 
                  onAction={onAction} 
                  onViewDetails={setSelectedProduct} 
                />
              </div>
            ))}
          </div>

          {/* Catalog Button */}
          <div className="text-center mt-5">
            <button 
              type="button"
              className="btn btn-gold px-5 py-3 text-uppercase fw-bold text-white"
              style={{ 
                backgroundColor: '#D4AF37',
                borderColor: '#D4AF37', 
                borderRadius: '0',
                letterSpacing: '2px',
                fontSize: '0.85rem'
              }}
              onClick={() => onAction("All products catalog is now live in categories!")}
            >
              Browse Category Selections
            </button>
          </div>
        </>
      )}
      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Hamper Details</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSelectedProduct(null)}
                aria-label="Close details"
              ></button>
            </div>
            <div className="details-modal-body">
              <div className="details-grid">
                {/* Left Column: Image */}
                <div className="details-img-wrapper">
                  <img 
                    src={selectedProduct.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"} 
                    alt={selectedProduct.name} 
                    className="details-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>

                {/* Right Column: Info details */}
                <div className="details-info">
                  <span className="details-category">{selectedProduct.categoryName || 'Signature Hamper'}</span>
                  <h3 className="details-title">{selectedProduct.name}</h3>
                  <p className="details-desc">{selectedProduct.description || 'Indulge in our beautifully curated selection of premium ingredients, hand-wrapped with silk ribbons and custom greetings for the ultimate luxury gift hamper experience.'}</p>
                  
                  <div className="details-price-row">
                    <span className="details-price">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProduct.price || 0)}
                    </span>
                    <span className="details-price-original">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((selectedProduct.price || 0) * 1.25)}
                    </span>
                    <span className="details-badge-discount">20% OFF</span>
                  </div>

                  <div className={`details-stock-status fw-semibold ${selectedProduct.stock <= 0 ? 'text-danger' : (selectedProduct.stock < 15 ? 'text-warning' : 'text-success')}`}>
                    <span className="me-1.5">●</span>
                    {selectedProduct.stock <= 0 ? "Out of Stock" : (selectedProduct.stock < 15 ? `Limited Stock: Only ${selectedProduct.stock} left!` : "In Stock - Hand-wrapped to order")}
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-3 mt-auto pt-3">
                    <button
                      type="button"
                      className="btn btn-gold flex-grow-1 py-3 text-white text-uppercase fw-bold"
                      style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', letterSpacing: '1.5px', fontSize: '0.8rem' }}
                      onClick={() => handleModalAddToCart(selectedProduct)}
                      disabled={modalAdding || selectedProduct.stock <= 0}
                    >
                      {modalAdding ? (
                        <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                      ) : selectedProduct.stock <= 0 ? (
                        "Out of Stock"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-gold px-3.5"
                      style={{ borderColor: '#D4AF37', color: '#D4AF37', borderRadius: '0' }}
                      onClick={() => onAction(`"Wishlist" for "${selectedProduct.name}" will be available soon.`)}
                      title="Add to Wishlist"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;

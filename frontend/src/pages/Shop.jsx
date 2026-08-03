import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from '../components/Toast';

const ProductSkeleton = () => (
  <div className="card skeleton-card border-0 skeleton-pulse">
    <div className="skeleton-img"></div>
    <div className="skeleton-body">
      <div className="skeleton-text skeleton-category"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-desc"></div>
      <div className="skeleton-text skeleton-price"></div>
      <div className="skeleton-text skeleton-rating"></div>
      <div className="skeleton-btn-row">
        <div className="skeleton-text skeleton-btn-main"></div>
      </div>
    </div>
  </div>
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoryId');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryParam || 'all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (selectedCategoryId === 'all') {
      searchParams.delete('categoryId');
    } else {
      searchParams.set('categoryId', selectedCategoryId);
    }
    setSearchParams(searchParams);
  }, [selectedCategoryId]);

  useEffect(() => {
    const currentParam = searchParams.get('categoryId') || 'all';
    if (currentParam !== selectedCategoryId) {
      setSelectedCategoryId(currentParam);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [toasts, setToasts] = useState([]);

  // Modal Details State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAdding, setModalAdding] = useState(false);
  const { addToCart } = useAuth();

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleModalAddToCart = async (product) => {
    if (product.stock <= 0) {
      addToast(`"${product.name}" is currently out of stock.`);
      return;
    }
    setModalAdding(true);
    try {
      await addToCart(product.id, 1);
      addToast(`"${product.name}" has been added to your cart.`);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to add item to cart.");
    } finally {
      setModalAdding(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/products/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        if (selectedCategoryId !== 'all') {
          url += `?categoryId=${selectedCategoryId}`;
        }
        const response = await api.get(url);
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
        addToast("Failed to retrieve products from database.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategoryId]);

  // Apply frontend search and sort
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'lowToHigh') {
      return a.price - b.price;
    }
    if (sortBy === 'highToLow') {
      return b.price - a.price;
    }
    return 0; // default (database order)
  });

  return (
    <div className="container py-5 flex-grow-1">
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          Exclusive Hampers
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          Luxury Gift Catalog
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
      </div>

      {/* Filters & Search Row */}
      <div className="row g-3 mb-5 align-items-center justify-content-between">
        {/* Search */}
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control py-2.5"
            placeholder="Search hampers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '0', borderColor: '#ccc' }}
          />
        </div>

        {/* Categories Tab list */}
        <div className="col-12 col-md-5 d-flex gap-2 overflow-auto pb-1">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`btn btn-sm px-3.5 py-2 text-uppercase fw-semibold ${selectedCategoryId === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
            style={{ borderRadius: '0', fontSize: '0.72rem', letterSpacing: '1px' }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`btn btn-sm px-3.5 py-2 text-uppercase fw-semibold ${selectedCategoryId === category.id ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '0', fontSize: '0.72rem', letterSpacing: '1px', whiteSpace: 'nowrap' }}
            >
              {category.categoryName.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="col-12 col-md-3">
          <select
            className="form-select py-2.5"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ borderRadius: '0', borderColor: '#ccc' }}
          >
            <option value="default">Sort by: Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Display Grid */}
      {loading ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 justify-content-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col d-flex">
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h4>No products found matching the criteria.</h4>
          <p>Please refine your filter or search query.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 justify-content-center">
          {sortedProducts.map((product) => (
            <div key={product.id} className="col d-flex">
              <ProductCard 
                product={product} 
                onAction={addToast} 
                onViewDetails={setSelectedProduct} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Details Modal Overlay */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Hamper Details</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSelectedProduct(null)}
              ></button>
            </div>
            <div className="details-modal-body">
              <div className="details-grid">
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
                <div className="details-info">
                  <span className="details-category">{selectedProduct.categoryName || 'Signature Hamper'}</span>
                  <h3 className="details-title">{selectedProduct.name}</h3>

                  {/* Reviews Section */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="text-gold" style={{ display: 'inline-flex', color: '#D4AF37' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-0.5">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </span>
                    <span className="fw-semibold text-muted small" style={{ fontSize: '0.8rem' }}>(4.8 rating | 35 premium reviews)</span>
                  </div>

                  <p className="details-desc">{selectedProduct.description}</p>
                  
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

                  {/* Specifications Section */}
                  <div className="mt-4 pt-3 border-top mb-4">
                    <span className="d-block text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>Specifications</span>
                    <ul className="list-unstyled small text-muted mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.82rem' }}>
                      <li>• <strong>Gift Style:</strong> Hand-wrapped Signature Luxury Trunk</li>
                      <li>• <strong>Stock Status:</strong> Ready for custom shipping</li>
                      <li>• <strong>Presentation:</strong> Elegant gold-inlaid finish with silk ribbons</li>
                    </ul>
                  </div>

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

export default Shop;

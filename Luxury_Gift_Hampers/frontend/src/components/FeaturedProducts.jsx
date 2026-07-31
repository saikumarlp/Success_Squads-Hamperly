import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';

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
                <ProductCard product={product} onAction={onAction} />
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
    </div>
  );
};

export default FeaturedProducts;

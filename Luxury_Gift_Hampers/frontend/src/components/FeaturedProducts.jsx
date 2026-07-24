import React, { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../services/productService';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to fetch featured collection.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
          Featured Luxury Hampers
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
        <p className="text-muted leading-relaxed" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover our premium handcrafted gift collections.
        </p>
      </div>

      {/* Conditional Rendering State (Skeleton -> Empty/Error -> Grid) */}
      {loading ? (
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
              className="btn btn-outline-gold px-5 py-3 text-uppercase fw-bold text-secondary"
              disabled
              style={{ 
                borderColor: '#D4AF37', 
                borderRadius: '8px',
                letterSpacing: '2px',
                fontSize: '0.85rem',
                opacity: 0.55,
                cursor: 'not-allowed',
                backgroundColor: 'transparent'
              }}
              title="All products catalog coming soon"
            >
              View All Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;

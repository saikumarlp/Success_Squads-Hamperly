import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Reliable fallback luxury hamper image if Unsplash links ever fail
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600";

/**
 * Helper to render rating stars using vector SVGs
 */
const renderStars = (rating) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const gradientId = `half-grad-${Math.random().toString(36).substr(2, 9)}`;

  for (let i = 1; i <= 5; i++) {
    if (i <= floorRating) {
      stars.push(
        <svg key={i} width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="me-0.5">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    } else if (i === floorRating + 1 && (hasHalf || rating % 1 > 0.75)) {
      if (rating % 1 > 0.75) {
        stars.push(
          <svg key={i} width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="me-0.5">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="me-0.5" style={{ display: 'inline-block' }}>
            <defs>
              <linearGradient id={gradientId}>
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
            <path fill={`url(#${gradientId})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        );
      }
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

/**
 * Format helper for Indian Rupee prices
 */
const formatRupee = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Reusable Product Card Component for E-Commerce Grid
 */
const ProductCard = ({ product, onAction, onViewDetails }) => {
  const {
    id,
    name,
    description,
    price,
    stock,
    categoryName,
    imageUrl
  } = product;

  const { addToCart } = useAuth();
  const [adding, setAdding] = useState(false);

  // Local state to handle image fallback gracefully on errors
  const [imgSrc, setImgSrc] = useState(imageUrl || DEFAULT_IMAGE);

  // Set default values for visual presentation
  const rating = 4.8;
  const reviewCount = 35;
  const currentPrice = price || 0;
  const originalPrice = price ? price * 1.25 : 0;
  const discountPercentage = 20;
  
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock < 15;
  const stockStatusText = isOutOfStock ? "Out of Stock" : (isLowStock ? `Only ${stock} left!` : "In Stock");
  const badge = isOutOfStock ? "Out of Stock" : (isLowStock ? "Limited" : null);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      onAction(`"View Details" for "${name}" will be available soon.`);
    }
  };

  const handleAction = (e, actionName) => {
    e.stopPropagation();
    onAction(`"${actionName}" for "${name}" will be available soon.`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      onAction(`"${name}" is currently out of stock.`);
      return;
    }
    setAdding(true);
    try {
      await addToCart(id, 1);
      onAction(`"${name}" has been added to your cart.`);
    } catch (err) {
      console.error(err);
      onAction(err.message || "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  // Helper to replace the last space with a non-breaking space (\u00a0)
  // to prevent leaving a single word on its own line (widow)
  const formatTitle = (titleText) => {
    if (!titleText) return '';
    const trimmed = titleText.trim();
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    if (lastSpaceIndex === -1) return trimmed;
    return trimmed.substring(0, lastSpaceIndex) + '\u00a0' + trimmed.substring(lastSpaceIndex + 1);
  };

  // Do not restrict title via hardcoded JS limit so CSS line-clamping can work natively on all sizes
  const processedName = formatTitle(name);

  // Shorten description to a clean preview (approx 120 characters) for the card preview
  const truncatedDescription = description && description.length > 120
    ? description.substring(0, 117) + "..."
    : description;

  return (
    <div className="card luxury-card border-0">
      {/* Product Category Badge */}
      {badge && (
        <div className="luxury-badge">
          {badge}
        </div>
      )}

      {/* Product Image wrapper */}
      <div className="luxury-card-img-wrapper">
        <img 
          src={imgSrc} 
          alt={name} 
          className="luxury-card-img" 
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Product Details Body */}
      <div className="card-body px-3 py-4 d-flex flex-column flex-grow-1">
        {/* Category */}
        <div className="luxury-category">{categoryName}</div>

        {/* Product Title */}
        <h4 className="luxury-title" title={name}>{processedName}</h4>

        {/* Short Description */}
        <p className="luxury-desc text-muted">{truncatedDescription}</p>

        {/* Price Tag Row with Indian Rupee (₹) Symbols */}
        <div className="price-container mt-auto">
          <span className="current-price">{formatRupee(currentPrice)}</span>
          {originalPrice > currentPrice && (
            <>
              <span className="original-price">{formatRupee(originalPrice)}</span>
              {discountPercentage > 0 && (
                <span className="discount-tag">{discountPercentage}% OFF</span>
              )}
            </>
          )}
        </div>

        {/* Review Stars & Star Counts */}
        <div className="rating-container">
          <span className="stars d-inline-flex" aria-label={`Rating: ${rating} out of 5`}>
            {renderStars(rating)}
          </span>
          <span className="fw-semibold text-secondary">({reviewCount} reviews)</span>
        </div>

        {/* Stock Alert State */}
        <div className={`stock-status ${isLowStock ? 'stock-low' : 'stock-in'}`}>
          <span className="me-1">●</span> {stockStatusText}
        </div>

        {/* Interactive Buttons */}
        <div className="d-flex align-items-center gap-2 mt-2">
          <button 
            type="button"
            className="btn btn-action-view"
            onClick={handleViewDetails}
            style={{ letterSpacing: '0.5px' }}
          >
            View Details
          </button>
          
          {/* Wishlist Button */}
          <button 
            type="button"
            className="btn btn-action-icon"
            onClick={(e) => handleAction(e, 'Add to Wishlist')}
            title="Add to Wishlist"
            aria-label="Add to Wishlist"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Add to Cart Button */}
          <button 
            type="button"
            className="btn btn-action-icon"
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
            aria-label="Add to Cart"
          >
            {adding ? (
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
  );
};

export default ProductCard;

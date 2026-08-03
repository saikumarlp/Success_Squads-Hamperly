import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const categoryImages = {
  wedding_hampers: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
  corporate_hampers: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
  birthday_hampers: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600",
  anniversary_hampers: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600"
};

const categoryDescriptions = {
  wedding_hampers: "Celebrate love and newlywed bliss with our handcrafted gourmet selections, elegant keepsakes, and personalized couple gifts.",
  corporate_hampers: "Impress clients, employees, and business partners with premium leather combos, eco-friendly kits, and organic snacks.",
  birthday_hampers: "Make birthdays extra special with sweet surprises, flower pairings, personalized items, and celebratory truffles.",
  anniversary_hampers: "Mark special milestones with vintage wines, premium dark chocolates, scented soy candles, and romantic spa collections."
};

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/products/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to load categories for collections page", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCollectionClick = (categoryId) => {
    navigate(`/shop?categoryId=${categoryId}`);
  };

  return (
    <div className="container py-5 flex-grow-1">
      {/* Header */}
      <div className="text-center mb-5">
        <span 
          className="d-block text-uppercase mb-2 text-muted fw-bold"
          style={{ fontSize: '0.8rem', letterSpacing: '3px', color: '#D4AF37' }}
        >
          Signature Ranges
        </span>
        <h2 
          className="mb-3 text-dark fw-bold" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '2.5rem'
          }}
        >
          Our Curated Collections
        </h2>
        <div className="mx-auto my-3" style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37' }}></div>
        <p className="text-muted leading-relaxed" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our exclusive, handcrafted luxury gift baskets prepared with meticulous attention to detail.
        </p>
      </div>

      {loading ? (
        <div className="py-5 text-center">
          <div className="spinner-border text-gold" role="status" style={{ color: '#D4AF37' }}>
            <span className="visually-hidden">Loading collections...</span>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h4>No collections currently available.</h4>
          <p>Please check back soon for our curated updates.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
          {categories.map((category) => {
            const cleanName = category.categoryName.replace('_', ' ');
            const bgImage = categoryImages[category.categoryName] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600";
            const description = categoryDescriptions[category.categoryName] || "Indulge in our beautifully curated selection of premium ingredients, hand-wrapped with silk ribbons and custom greetings.";

            return (
              <div key={category.id} className="col d-flex">
                <div 
                  className="card border-0 shadow-sm overflow-hidden w-100 position-relative cursor-pointer collection-premium-card"
                  style={{ 
                    borderRadius: '12px', 
                    minHeight: '350px',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease'
                  }}
                  onClick={() => handleCollectionClick(category.id)}
                >
                  <div className="card-body d-flex flex-column justify-content-end p-4 p-md-5 text-white">
                    <span 
                      className="text-uppercase mb-2 fw-bold text-gold"
                      style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#D4AF37' }}
                    >
                      Premium Collection
                    </span>
                    <h3 
                      className="card-title fw-bold text-capitalize mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}
                    >
                      {cleanName}
                    </h3>
                    <p 
                      className="card-text text-white-50"
                      style={{ fontSize: '0.95rem', maxWidth: '450px', lineHeight: '1.6' }}
                    >
                      {description}
                    </p>
                    <div className="mt-3">
                      <span 
                        className="btn btn-sm btn-gold text-white text-uppercase fw-bold px-4 py-2"
                        style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', borderRadius: '0', fontSize: '0.75rem', letterSpacing: '1px' }}
                      >
                        Explore Range &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Collections;

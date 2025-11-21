import React from 'react';
import { Link } from 'react-router-dom';
import './ListingCard.css';

// This is the placeholder image URL your backend will use if no image is uploaded
const DEFAULT_PLACEHOLDER_IMAGE = "http://127.0.0.1:8000/media/placeholder.png";

function ListingCard({ listing }) {
  const { id, title, price_per_unit, unit, location, image } = listing;

  // Use the uploaded image, or a placeholder if it's null/empty
  const imageUrl = image ? image : DEFAULT_PLACEHOLDER_IMAGE;

  return (
    // Wrap the card in a Link to its detail page
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-image-wrapper">
        <img 
          src={imageUrl} 
          alt={title} 
          className="listing-image" 
          onError={(e) => { 
            // In case the image URL is broken, fall back to the placeholder
            e.target.onerror = null; 
            e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className="listing-content">
        <h3 className="listing-title">{title}</h3>
        <p className="listing-price">
          RM {parseFloat(price_per_unit).toFixed(2)} 
          <span className="listing-price-unit"> / {unit}</span>
        </p>
        <p className="listing-info">
          {/* Simple location pin icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {location}
        </p>
      </div>
    </Link>
  );
}

export default ListingCard;
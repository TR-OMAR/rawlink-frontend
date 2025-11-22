import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/api'; // Import BASE_URL
import localPlaceholder from '../assets/placeholder.webp';
import './ListingCard.css';

function ListingCard({ listing }) {
  const { id, title, price_per_unit, unit, location, image } = listing;

  // 1. Construct the Image URL dynamically
  // If image exists, use it. If not, use the backend placeholder.
  const getImageUrl = (img) => {
      if (!img) return localPlaceholder;
      
      // If backend gives a full URL (e.g., Cloudinary/S3), use it
      if (img.startsWith('http')) return img;
      
      // Otherwise, append BASE_URL
      return `${BASE_URL}${img}`;
  };

  const imageUrl = getImageUrl(image);

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-image-wrapper">
        <img 
          src={imageUrl} 
          alt={title} 
          className="listing-image" 
          // 3. If the real image fails (404), fall back to local placeholder
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = localPlaceholder; 
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
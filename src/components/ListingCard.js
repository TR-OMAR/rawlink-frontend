import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { getCountryName } from '../utils/countries'; // <--- Import Helper
import localPlaceholder from '../assets/placeholder.webp'; // (Ensure extension matches your file)
import './ListingCard.css';

function ListingCard({ listing }) {
  const { id, title, price_per_unit, unit, location, city, country, image } = listing;

  const getImageUrl = (img) => {
      if (!img) return localPlaceholder;
      if (img.startsWith('http')) return img;
      return `${BASE_URL}${img}`;
  };

  const imageUrl = getImageUrl(image);

  // LOGIC CHANGE: Display City, Country Name
  const displayLocation = () => {
      const countryName = getCountryName(country);
      if (city && countryName) return `${city}, ${countryName}`;
      if (countryName) return countryName;
      return location; // Fallback to old location field if data missing
  };

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-image-wrapper">
        <img 
          src={imageUrl} 
          alt={title} 
          className="listing-image" 
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
          {/* Map Pin Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {/* NEW: Use the City, Country function */}
          {displayLocation()}
        </p>
      </div>
    </Link>
  );
}

export default ListingCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { getCountryName } from '../utils/countries';
import localPlaceholder from '../assets/placeholder.webp'; // fallback image
import './ListingCard.css';

function ListingCard({ listing }) {
  const { id, title, price_per_unit, unit, location, city, country, image } = listing;

  // -------------------- Image URL Logic --------------------
  const getImageUrl = (img) => {
    if (!img) return localPlaceholder;         // fallback
    if (img.startsWith('http')) return img;    // full URL
    return `${BASE_URL}${img}`;                // relative path from API
  };

  const imageUrl = getImageUrl(image);

  // -------------------- Location Display Logic --------------------
  const displayLocation = () => {
    const countryName = getCountryName(country);

    if (city && countryName) return `${city}, ${countryName}`;  // ideal case
    if (countryName) return countryName;                        // only country available
    return location || "Unknown Location";                      // fallback for old data
  };

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      {/* -------------------- Image -------------------- */}
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

      {/* -------------------- Content -------------------- */}
      <div className="listing-content">
        <h3 className="listing-title">{title}</h3>
        <p className="listing-price">
          RM {parseFloat(price_per_unit).toFixed(2)} 
          <span className="listing-price-unit"> / {unit}</span>
        </p>
        <p className="listing-info">
          {/* Location Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {displayLocation()}
        </p>
      </div>
    </Link>
  );
}

export default ListingCard;

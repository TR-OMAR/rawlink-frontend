import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { COUNTRIES } from '../utils/countries';
import './MarketplacePage.css';

// Fetch listings with optional filters
const fetchListings = async ({ queryKey }) => {
  const [, filters] = queryKey;
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.country) params.append('country', filters.country);
  if (filters.city) params.append('city', filters.city);
  if (filters.sort) params.append('ordering', filters.sort);

  const { data } = await api.get(`/listings/?${params.toString()}`);
  return data;
};

function MarketplacePage() {
  // --- Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');
  const [sortOrder, setSortOrder] = useState('-created_at');

  // --- Debounce search and city inputs ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCity(city), 500);
    return () => clearTimeout(timer);
  }, [city]);

  // --- Fetch listings ---
  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['listings', { search: debouncedSearch, category, country, city: debouncedCity, sort: sortOrder }],
    queryFn: fetchListings,
    keepPreviousData: true,
  });

  // --- Filter & sort options ---
  const categories = useMemo(() => [
    { value: '', label: 'All Categories' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'e-waste', label: 'E-Waste' },
    { value: 'glass', label: 'Glass' },
  ], []);

  const sortOptions = useMemo(() => [
    { value: '-created_at', label: 'Newest' },
    { value: 'price_per_unit', label: 'Price: Low to High' },
    { value: '-price_per_unit', label: 'Price: High to Low' },
  ], []);

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setCountry('');
    setCity('');
    setSortOrder('-created_at');
  };

  return (
    <div className="marketplace-container">
      {/* --- Header --- */}
      <header className="marketplace-header">
        <h1>Marketplace</h1>
        <p>Browse sustainable materials across Asia</p>
      </header>

      {/* --- Filters --- */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <div className="dropdowns-wrapper">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)} className="filter-select">
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>

        <div className="dropdowns-wrapper">
          <input
            type="text"
            placeholder="Filter by City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="filter-input"
            style={{ maxWidth: 200 }}
          />

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          {(searchTerm || category || country || city) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* --- Listings --- */}
      {isLoading ? (
        <div className="loading-text">Loading listings...</div>
      ) : isError ? (
        <div className="error-text">Something went wrong.</div>
      ) : listings?.length > 0 ? (
        <div className="listings-grid">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="no-listings-container">
          <p className="no-listings-text">No listings match your criteria.</p>
          <button onClick={clearFilters} className="clear-filters-btn">View All Items</button>
        </div>
      )}
    </div>
  );
}

export default MarketplacePage;

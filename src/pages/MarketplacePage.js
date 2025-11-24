import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { COUNTRIES } from '../utils/countries'; 
import './MarketplacePage.css';

const fetchListings = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.country) params.append('country', filters.country);
  if (filters.city) params.append('city', filters.city);
  if (filters.sort) params.append('ordering', filters.sort);

  console.log("Fetching URL:", `/listings/?${params.toString()}`); // Debugging

  const { data } = await api.get(`/listings/?${params.toString()}`);
  return data;
};

function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');
  const [selectedSort, setSelectedSort] = useState('-created_at');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCity(cityFilter), 500);
    return () => clearTimeout(timer);
  }, [cityFilter]);

  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['listings', { 
        search: debouncedSearch, 
        category: selectedCategory, 
        country: selectedCountry, 
        city: debouncedCity,
        sort: selectedSort 
    }],
    queryFn: fetchListings,
    keepPreviousData: true, 
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'e-waste', label: 'E-Waste' },
    { value: 'glass', label: 'Glass' },
  ];
  
  const sortOptions = [
    { value: '-created_at', label: 'Newest' },
    { value: 'price_per_unit', label: 'Price: Low to High' },
    { value: '-price_per_unit', label: 'Price: High to Low' },
  ];

  const handleClearFilters = () => {
      setSearchTerm('');
      setSelectedCategory('');
      setSelectedCountry('');
      setCityFilter('');
      setSelectedSort('-created_at');
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>Marketplace</h1>
        <p>Browse sustainable materials across Asia</p>
      </header>
      
      <div className="filters-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search materials..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="filter-input" 
          />
        </div>

        <div className="dropdowns-wrapper">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="filter-select">
                <option value="">All Countries</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
        </div>

         <div className="dropdowns-wrapper">
            <input 
                type="text" 
                placeholder="Filter by City" 
                value={cityFilter} 
                onChange={(e) => setCityFilter(e.target.value)} 
                className="filter-input"
                style={{maxWidth: '200px'}}
            />

            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="filter-select">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            {(selectedCategory || selectedCountry || cityFilter || searchTerm) && (
                <button onClick={handleClearFilters} className="clear-filters-btn">
                    Clear Filters
                </button>
            )}
        </div>
      </div>

      {isLoading ? <div className="loading-text">Loading listings...</div> : 
       isError ? <div className="error-text">Something went wrong.</div> :
       listings?.length > 0 ? (
        <div className="listings-grid">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="no-listings-container">
            <p className="no-listings-text">No listings match your criteria.</p>
            <button onClick={handleClearFilters} className="clear-filters-btn">View All Items</button>
        </div>
      )}
    </div>
  );
}

export default MarketplacePage;
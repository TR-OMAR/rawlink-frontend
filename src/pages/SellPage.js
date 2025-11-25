import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SellPage.css';

// Function to send listing creation request
const createListing = async (formData) => {
  const { data } = await api.post('/listings/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// List of countries for selection
const COUNTRIES = [
  { code: '', name: 'All Countries' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'IN', name: 'India' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'LA', name: 'Laos' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'BN', name: 'Brunei' },
];

function SellPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plastic');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const [country, setCountry] = useState('MY');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mutation to create a listing
  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (newListing) => {
      queryClient.invalidateQueries(['listings']); // Refresh listings
      setMessage({ text: 'Listing created successfully!', type: 'success' });
      navigate(`/listing/${newListing.id}`); // Redirect to new listing
    },
    onError: () => {
      setMessage({ text: 'Failed to create listing. Please try again.', type: 'error' });
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return; // Ensure user is logged in

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('unit', unit);
    formData.append('price_per_unit', pricePerUnit);

    // Append location details
    formData.append('country', country);
    formData.append('city', city);
    formData.append('postal_code', postalCode);
    formData.append('location', `${address}, ${city}, ${postalCode}`);

    if (image) formData.append('image', image);

    mutation.mutate(formData);
  };

  return (
    <div className="sell-page-container">
      {/* Page Header */}
      <h2>Sell Your Recyclables</h2>
      <p className="form-subtitle">
        Fill in the details below to create your listing and reach buyers quickly.
      </p>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Listing Form */}
      <form onSubmit={handleSubmit} className="sell-form">

        {/* Title Input */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g. 500kg HDPE Plastic"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category Selection */}
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="plastic">Plastic</option>
            <option value="metal">Metal</option>
            <option value="paper">Paper</option>
            <option value="e-waste">E-waste</option>
            <option value="glass">Glass</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="form-group-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Amount"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="tons">tons</option>
            </select>
          </div>
        </div>

        {/* Price per Unit */}
        <div className="form-group">
          <label>Price per Unit (RM)</label>
          <input
            type="number"
            placeholder="e.g. 2.50"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            required
          />
        </div>

        {/* Location Details */}
        <h4>Location Details</h4>
        <div className="form-group-row">
          <div className="form-group">
            <label>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              placeholder="e.g. Kuala Lumpur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              placeholder="e.g. 50450"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              placeholder="e.g. Jalan Ampang"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Provide details about your materials..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="sell-button" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}

export default SellPage;

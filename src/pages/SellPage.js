import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SellPage.css';

const createListing = async (formData) => {
  const { data } = await api.post('/listings/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const countries = [
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
    { code: 'BN', name: 'Brunei' }
];


function SellPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plastic');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  
  // New State Variables
  const [country, setCountry] = useState('MY');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState(''); // Keeping 'location' as full address

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (newListing) => {
      queryClient.invalidateQueries(['listings']);
      setMessage({ text: 'Listing created successfully!', type: 'message-success' });
      navigate(`/listing/${newListing.id}`);
    },
    onError: (error) => {
      console.error('Error:', error);
      setMessage({ text: 'Failed to create listing.', type: 'message-error' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('unit', unit);
    formData.append('price_per_unit', pricePerUnit);
    
    // Append new fields
    formData.append('country', country);
    formData.append('city', city);
    formData.append('postal_code', postalCode);
    // Concatenate for backward compatibility or display
    formData.append('location', `${address}, ${city}, ${postalCode}`); 

    if (image) formData.append('image', image);

    mutation.mutate(formData);
  };

  return (
    <div className="sell-page-container">
      <h2>Sell Your Recyclables</h2>
      <form onSubmit={handleSubmit} className="sell-form">
        {/* ... Title, Desc, Category ... */}
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. 500kg HDPE Plastic" />
        </div>
        
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

        <div className="form-group-row">
            <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                </select>
            </div>
        </div>
        
        <div className="form-group">
            <label>Price per Unit (RM)</label>
            <input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} required />
        </div>

        {/* --- Location Details --- */}
        <div className="form-group-row">
            <div className="form-group">
                <label>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Kuala Lumpur" />
            </div>
        </div>

        <div className="form-group-row">
             <div className="form-group">
                <label>Postal Code</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="e.g. 50450" />
            </div>
             <div className="form-group">
                <label>Street Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="e.g. Jalan Ampang" />
            </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button type="submit" className="sell-button" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}

export default SellPage;
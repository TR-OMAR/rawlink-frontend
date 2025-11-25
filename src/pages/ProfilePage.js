import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import './ProfilePage.css'; // Make sure this exists

// --- API calls ---
const fetchProfile = async () => {
  const { data } = await api.get('/profiles/me/');
  return data;
};

const updateProfile = async (profileData) => {
  const { data } = await api.put('/profiles/me/', profileData);
  return data;
};

// --- Profile Page Component ---
function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  // Populate form fields when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  // Mutation to update profile
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    },
    onError: () => {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, phone, location });
  };

  if (isLoading || !user) return <div className="profile-container">Loading...</div>;

  // Safe display variables
  const displayName = name || user.username || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayEmail = user.email || '';

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Header Section */}
        <div className="profile-header-section">
          <div className="profile-avatar-big">{displayInitial}</div>
          <div className="profile-identity">
            <h2>{displayName}</h2>
            <span className="role-tag">{user.role}</span>
            <p className="email-text">{displayEmail}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <h3>Edit Profile</h3>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <button type="submit" className="save-btn" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save Changes'}
          </button>

          {message.text && (
            <div className={`msg-box ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { BASE_URL } from '../services/api'; 
import { getCountryName } from '../utils/countries';
import { useAuth } from '../context/AuthContext';
import './ListingDetailPage.css';

const fetchListingById = async ({ queryKey }) => {
  const [key, id] = queryKey;
  const { data } = await api.get(`/listings/${id}/`);
  return data;
};

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: fetchListingById,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/orders/', {
        listing_id: listing.id,
        quantity_bought: listing.quantity,
        payment_method: paymentMethod,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
      queryClient.invalidateQueries(['orders']);
      navigate('/orders');
    },
    onError: (error) => {
      const msg = error.response?.data?.detail || 'Failed to create order.';
      alert(msg);
      setShowModal(false);
    },
  });

  const handleBuyClick = () => {
    if (!user) {
      alert("Please log in to buy.");
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const confirmOrder = () => {
    createOrderMutation.mutate();
  };

  const handleChat = () => {
    if (!user) {
      alert("Please log in to chat.");
      navigate('/login');
      return;
    }
    navigate('/chat', { 
        state: { 
            startChatWith: listing.vendor_id,
            listingContext: { id: listing.id, title: listing.title }
        } 
    });
  };

  if (isLoading) return <div className="loading-text">Loading...</div>;
  if (isError) return <div className="error-text">Error loading listing.</div>;

  const getImageUrl = (img) => {
    if (!img) return `${BASE_URL}/media/placeholder.png`;
    if (img.startsWith('http')) return img;
    return `${BASE_URL}${img}`;
  };

  const imageUrl = getImageUrl(listing.image);
  const isOwner = user && String(user.id) === String(listing.vendor_id);
  const totalPrice = (parseFloat(listing.price_per_unit) * parseFloat(listing.quantity)).toFixed(2);

  return (
    <div className="listing-detail-container">
      <div className="listing-detail-layout">
        <div className="listing-image-gallery">
          <img 
            src={imageUrl} 
            alt={listing.title} 
            className="listing-detail-image" 
            onError={(e)=>{e.target.src=`${BASE_URL}/media/placeholder.png`}}
          />
        </div>

        <div className="listing-detail-info">
          <h1>{listing.title}</h1>
          <p className="listing-detail-price">
            RM {parseFloat(listing.price_per_unit).toFixed(2)}<span> / {listing.unit}</span>
          </p>

          <div className="listing-meta-grid">
            <div className="meta-item">
                <span className="meta-item-label">Category</span>
                <span className="meta-item-value">{listing.category}</span>
            </div>
            <div className="meta-item">
                <span className="meta-item-label">Available</span>
                <span className="meta-item-value">{listing.quantity} {listing.unit}</span>
            </div>
            
            {/* --- UPDATED LOCATION DISPLAY --- */}
            {/* Shows separate fields for Country, City, and specific Location */}
            
            <div className="meta-item">
                <span className="meta-item-label">Country</span>
                <span className="meta-item-value">
                    {getCountryName(listing.country) || 'Not specified'}
                </span>
            </div>

            <div className="meta-item">
                <span className="meta-item-label">City</span>
                <span className="meta-item-value">
                    {listing.city || 'Not specified'}
                </span>
            </div>

            {/* Full Address / Specific Location */}
            <div className="meta-item" style={{gridColumn: 'span 2'}}>
                <span className="meta-item-label">Full Address / Location</span>
                <span className="meta-item-value">
                    {listing.location || 'Not specified'}
                </span>
            </div>
            {/* -------------------------------- */}

            <div className="meta-item">
                <span className="meta-item-label">Vendor</span>
                <span className="meta-item-value">{listing.vendor}</span>
            </div>
          </div>

          {isOwner ? (
            <div className="owner-badge">You listed this item.</div>
          ) : (
            <div className="buy-button-container">
              <button className="chat-button" onClick={handleChat}>Chat with Vendor</button>
              <button 
                className="buy-button"
                onClick={handleBuyClick}
                disabled={listing.status !== 'available' || listing.quantity <= 0}
              >
                {listing.status !== 'available' ? 'Sold Out' : 'Buy Now'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="listing-description">
        <h3>Description</h3>
        <p>{listing.description || 'No description.'}</p>
      </div>

      {/* Modal remains unchanged... */}
      {showModal && (
        <div className="modal-overlay">
            <div className="modal-content checkout-modal">
                <div className="modal-header">
                    <h3>Checkout</h3>
                    <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
                </div>
                
                <div className="checkout-body">
                    <div className="form-group">
                        <label className="section-label">Item</label>
                        <div className="checkout-item-title">{listing.title}</div>
                    </div>

                    <div className="form-group">
                        <label className="section-label">Quantity (Fixed)</label>
                        <div className="fixed-qty-display">
                            {listing.quantity} {listing.unit}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="section-label">Payment Method</label>
                        <div className="radio-group">
                            <label className={`radio-label ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                                <div className="radio-info">
                                    <input type="radio" value="wallet" checked={paymentMethod === 'wallet'} onChange={(e)=>setPaymentMethod(e.target.value)} />
                                    <span className="radio-title">RawLink Wallet</span>
                                </div>
                                <span className="radio-icon">💳</span>
                            </label>
                            <label className={`radio-label ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <div className="radio-info">
                                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={(e)=>setPaymentMethod(e.target.value)} />
                                    <span className="radio-title">Cash</span>
                                </div>
                                <span className="radio-icon">💵</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="checkout-footer">
                    <div className="total-display">
                        <span>Total to Pay:</span>
                        <span className="total-price">RM {totalPrice}</span>
                    </div>
                    <button className="btn-confirm-order" onClick={confirmOrder} disabled={createOrderMutation.isLoading}>
                        {createOrderMutation.isLoading ? 'Processing...' : 'Confirm Purchase'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetailPage;
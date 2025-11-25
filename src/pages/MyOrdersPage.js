import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyOrdersPage.css';

// Fetch all orders
const fetchOrders = async () => {
  const { data } = await api.get('/orders/');
  return data;
};

// Update order status
const updateOrderStatus = async ({ id, status }) => {
  const { data } = await api.post(`/orders/${id}/update_status/`, { status });
  return data;
};

function MyOrdersPage() {
  const [viewRole, setViewRole] = useState('buyer'); // 'buyer' or 'seller'
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  // Mutation for updating status
  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => queryClient.invalidateQueries(['orders']),
    onError: (err) => alert(err.response?.data?.detail || "Failed to update status."),
  });

  // Handle status change with confirmation
  const handleStatusUpdate = (id, newStatus) => {
    const actionText = newStatus === 'shipped' ? 'Mark as Sold' : 'Confirm Receipt';
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      statusMutation.mutate({ id, status: newStatus });
    }
  };

  // Filter orders based on role
  const filteredOrders = useMemo(() => {
    if (!orders || !user) return [];
    if (viewRole === 'buyer') {
      return orders.filter(o => String(o.buyer.id) === String(user.id));
    } else {
      return orders.filter(o => String(o.vendor.id) === String(user.id));
    }
  }, [orders, viewRole, user]);

  // Render list of orders
  const renderOrderList = () => {
    if (isLoading) return <div className="loading-text">Loading orders...</div>;
    if (isError) return <div className="error-text">Failed to load orders.</div>;

    if (filteredOrders.length === 0) {
      return (
        <div className="empty-state">
          <p>You have no {viewRole === 'buyer' ? 'purchases' : 'sales'} yet.</p>
        </div>
      );
    }

    return (
      <div className="order-list">
        {filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            currentUser={user}
            viewRole={viewRole}
            onUpdateStatus={handleStatusUpdate}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="orders-container">
      <header className="orders-header">
        <h2>My Orders</h2>
      </header>

      {/* Role Tabs */}
      <div className="role-tabs">
        <button
          className={`role-tab ${viewRole === 'buyer' ? 'active' : ''}`}
          onClick={() => setViewRole('buyer')}
        >
          📥 My Purchases
        </button>
        <button
          className={`role-tab ${viewRole === 'seller' ? 'active' : ''}`}
          onClick={() => setViewRole('seller')}
        >
          📤 My Sales
        </button>
      </div>

      {/* Order List */}
      <div className="order-list-container">{renderOrderList()}</div>
    </div>
  );
}

// --- Individual Order Card Component ---
const OrderCard = ({ order, currentUser, viewRole, onUpdateStatus }) => {
  const isSeller = String(currentUser.id) === String(order.vendor.id);
  const isBuyer = String(currentUser.id) === String(order.buyer.id);

  // Get image URL safely
  const getImageUrl = (img) => {
    if (!img) return `${BASE_URL}/media/placeholder.png`;
    return img.startsWith('http') ? img : `${BASE_URL}${img}`;
  };
  const imageUrl = getImageUrl(order.listing?.image);

  return (
    <div className="order-card">
      <div className="order-header">
        <span className={`status-badge status-${order.status}`}>{order.status}</span>
        <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
      </div>

      <div className="order-body">
        <img
          src={imageUrl}
          alt="Item"
          className="order-card-image"
          onError={(e) => (e.target.src = `${BASE_URL}/media/placeholder.png`)}
        />
        <div className="order-card-info">
          <h3>{order.listing_title}</h3>
          <p>
            Qty: {order.quantity_bought} | Total: <span className="price">RM {parseFloat(order.total_price).toFixed(2)}</span>
          </p>
          <p className="participant-info">
            {viewRole === 'buyer' ? `Sold by: ${order.vendor.username}` : `Bought by: ${order.buyer.username}`}
          </p>
        </div>
      </div>

      <div className="order-actions">
        {isSeller && order.status === 'confirmed' && (
          <button className="btn-action btn-ship" onClick={() => onUpdateStatus(order.id, 'shipped')}>
            Mark as Sold
          </button>
        )}
        {isBuyer && order.status === 'shipped' && (
          <button className="btn-action btn-receive" onClick={() => onUpdateStatus(order.id, 'completed')}>
            Confirm Receipt
          </button>
        )}
        {order.status === 'completed' && <span className="completed-text">Order Completed ✅</span>}
      </div>
    </div>
  );
};

export default MyOrdersPage;

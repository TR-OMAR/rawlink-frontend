import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './HomePage.css';

// REMOVED: import heroBg from '../assets/hero-bg.png'; 

const Dashboard = ({ user }) => {
  const greetingName = (user.displayName || user.username || 'User').split(' ')[0];

  return (
    <div className="dashboard-wrapper">
      <div className="hero-banner">
        <div className="hero-content">
            <h1>Hello, {greetingName}! 👋</h1>
            <p>Welcome back to RawLink. Your hub for sustainable trading.</p>
        </div>
        <div className="hero-stats">
            <div className="stat-item">
                <span className="stat-val">12</span>
                <span className="stat-label">Active Listings</span>
            </div>
            <div className="stat-item">
                <span className="stat-val">RM 450</span>
                <span className="stat-label">Wallet</span>
            </div>
        </div>
      </div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="dashboard-grid">
        <Link to="/sell" className="dashboard-card card-green">
            <div className="card-icon">♻️</div>
            <h3>Sell Waste</h3>
            <p>List new materials</p>
        </Link>
        <Link to="/marketplace" className="dashboard-card card-blue">
            <div className="card-icon">🛒</div>
            <h3>Marketplace</h3>
            <p>Find materials</p>
        </Link>
        <Link to="/orders" className="dashboard-card card-purple">
            <div className="card-icon">📦</div>
            <h3>My Orders</h3>
            <p>Track Purchases</p>
        </Link>
      </div>

      <h3 className="section-title" style={{marginTop: '40px'}}>Recent Activity</h3>
      <div className="recent-activity-placeholder">
          <p>No recent activity to show.</p>
      </div>
    </div>
  );
};

const WelcomePage = () => {
  return (
    <div className="landing-page">
        {/* Hero Section */}
        {/* FIX: Removed inline style that used local image.
            The CSS class .lp-hero in HomePage.css now handles the background image 
            using a reliable URL. This fixes the build error.
        */}
        <section className="lp-hero">
            <div className="lp-hero-content">
                <h1>Turn Waste into <span className="text-gradient">Value</span></h1>
                <p>The premier B2B marketplace connecting industrial waste producers with recyclers. Efficient, transparent, and sustainable.</p>
                <div className="lp-buttons">
                    <Link to="/register" className="btn-lp-primary">Start Trading Now</Link>
                    <Link to="/marketplace" className="btn-lp-secondary">View Marketplace</Link>
                </div>
            </div>
            <div className="lp-hero-image">
                {/* Placeholder for a nice illustration */}
            </div>
        </section>

        {/* How it Works */}
        <section className="lp-section">
            <h2>How RawLink Works</h2>
            <div className="steps-grid">
                <div className="step-card">
                    <div className="step-num">1</div>
                    <h3>List Materials</h3>
                    <p>Sellers post details about their recyclable waste.</p>
                </div>
                <div className="step-card">
                    <div className="step-num">2</div>
                    <h3>Connect & Deal</h3>
                    <p>Buyers find materials and negotiate securely via chat.</p>
                </div>
                <div className="step-card">
                    <div className="step-num">3</div>
                    <h3>Secure Payment</h3>
                    <p>Transactions are handled via secure wallet or COD.</p>
                </div>
            </div>
        </section>
    </div>
  );
};

function HomePage() {
  const { user } = useAuth(); 
  return user ? <Dashboard user={user} /> : <WelcomePage />;
}

export default HomePage;
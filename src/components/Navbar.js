import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Mock counters; 
  const messageCount = 2;
  const orderCount = 5;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Display first name or username
  const getNavName = () => {
    const name = user?.displayName || user?.username || 'User';
    return name.split(' ')[0];
  };

  // Avatar initial
  const getInitial = () => {
    const name = user?.displayName || user?.username || 'U';
    return String(name).charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* -------------------- LEFT: Logo -------------------- */}
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="RawLink Logo" className="nav-logo-img" />
          <span>RawLink</span>
        </Link>

        {/* -------------------- CENTER: Main Links -------------------- */}
        <div className={`nav-center ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-link-main">Home</Link>
          <Link to="/marketplace" className="nav-link-main">Marketplace</Link>
          <Link to="/about" className="nav-link-main">About Us</Link>
          <Link to="/sustainability" className="nav-link-main">Sustainability</Link>
          {user && <Link to="/sell" className="nav-link-main nav-sell-btn">SELL</Link>}
        </div>

        {/* -------------------- RIGHT: Icons & User -------------------- */}
        <div className="nav-right">
          {user ? (
            <>
              {/* Messages Icon */}
              <Link to="/chat" className="nav-icon-btn" title="Messages">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {messageCount > 0 && <span className="nav-badge">{messageCount}</span>}
              </Link>

              {/* Orders Icon */}
              <Link to="/orders" className="nav-icon-btn" title="My Orders">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                {orderCount > 0 && <span className="nav-badge">{orderCount}</span>}
              </Link>

              {/* User Dropdown */}
              <div className="user-menu" ref={dropdownRef}>
                <div className="user-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="nav-greeting">Hi, {getNavName()}</span>
                  <div className="nav-avatar">{getInitial()}</div>
                </div>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{user.displayName || user.username}</strong>
                      <span>{user.role || 'Member'}</span>
                    </div>
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/wallet" className="dropdown-item">Wallet</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="nav-link-main">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* -------------------- MOBILE MENU TOGGLE -------------------- */}
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

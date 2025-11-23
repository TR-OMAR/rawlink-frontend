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

  // Mock Counters (Replace with real data from context/API if available)
  const messageCount = 0; 
  const orderCount = 0;

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavName = () => {
      const name = user?.displayName || user?.username || 'User';
      return name.split(' ')[0];
  };

  const getInitial = () => {
      const name = user?.displayName || user?.username || 'U';
      return String(name).charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* 1. LEFT: Logo Image */}
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="RawLink Logo" className="nav-logo-img" />
          <span>RawLink</span>
        </Link>

        {/* 2. CENTER: Main Links (Hidden on Mobile) */}
        <div className={`nav-center ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-link-main">Home</Link>
          <Link to="/marketplace" className="nav-link-main">Marketplace</Link>
          <Link to="/about" className="nav-link-main">About Us</Link>
          <Link to="/sustainability" className="nav-link-main">Sustainability</Link>
          
          {user && (
            <Link to="/sell" className="nav-link-main nav-sell-btn">
              SELL
            </Link>
          )}
        </div>

        {/* 3. RIGHT: Icons & Profile */}
        <div className="nav-right">
          {user ? (
            <>
              {/* Message Icon */}
              <Link to="/chat" className="nav-icon-btn" title="Messages">
                <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {messageCount > 0 && <span className="nav-badge">{messageCount}</span>}
              </Link>

              {/* Orders Icon */}
              <Link to="/orders" className="nav-icon-btn" title="My Orders">
                <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
        
        {/* Mobile Toggle Button */}
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
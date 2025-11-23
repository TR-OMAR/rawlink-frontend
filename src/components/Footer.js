import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            <span className="brand-icon">🌱</span>
            <h3>RawLink</h3>
          </div>
          <p className="footer-desc">
            The leading B2B marketplace for sustainable waste trading in Asia. Connecting industries, reducing waste.
          </p>
          <div className="social-links">
             {/* Placeholders for social icons */}
             <span>🐦</span><span>📘</span><span>📸</span><span>💼</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-links">
            <li>📍 123 Eco Valley, Kuala Lumpur, Malaysia</li>
            <li>📧 support@rawlink.com</li>
            <li>📞 +60 3-1234 5678</li>
          </ul>
        </div>

        {/* Column 4: Payments */}
        <div className="footer-col">
          <h4>We Accept</h4>
          <div className="payment-methods">
            <span className="pay-badge">Wallet</span>
            <span className="pay-badge">Visa</span>
            <span className="pay-badge">Mastercard</span>
            <span className="pay-badge">FPX</span>
            <span className="pay-badge">COD</span>
          </div>
          <p className="secure-note">🔒 100% Secure Payments</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RawLink Technology. All rights reserved.</p>
        <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
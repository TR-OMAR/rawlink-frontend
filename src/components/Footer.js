import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">

        {/* -------------------- Column 1: Brand & Social -------------------- */}
        <div className="footer-col">
          <div className="footer-brand">
            <img src="/logo.svg" alt="RawLink Logo" className="brand-logo-img" />
            <h3>RawLink</h3>
          </div>
          <p className="footer-desc">
            The leading B2B marketplace for sustainable waste trading in Asia. Connecting industries, reducing waste.
          </p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X/Twitter" className="social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="social-icon" />
            </a>
          </div>
        </div>

        {/* -------------------- Column 2: Quick Links -------------------- */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
          </ul>
        </div>

        {/* -------------------- Column 3: Contact Info -------------------- */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-links">
            <li>📍 123 Eco Valley, Kuala Lumpur, Malaysia</li>
            <li>📧 support@rawlink.com</li>
            <li>📞 +60 3-1234 5678</li>
          </ul>
        </div>

        {/* -------------------- Column 4: Payment Methods -------------------- */}
        <div className="footer-col">
          <h4>We Accept</h4>
          <div className="payment-methods">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="pay-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="pay-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="pay-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="pay-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="pay-logo" style={{ height: '22px' }} />
          </div>
          <p className="secure-note">🔒 100% Secure Payments</p>
        </div>

      </div>

      {/* -------------------- Footer Bottom -------------------- */}
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

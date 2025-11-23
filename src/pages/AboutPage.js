import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Revolutionizing Waste Management in Asia</h1>
          <p>RawLink is more than a marketplace. We are a movement dedicated to closing the loop on industrial waste through technology and transparency.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-card">
            <div className="icon-box">🎯</div>
            <h2>Our Mission</h2>
            <p>To provide a seamless, transparent, and efficient digital platform that connects waste producers with recyclers, transforming waste liabilities into valuable assets.</p>
          </div>
          <div className="mission-card">
            <div className="icon-box">🌏</div>
            <h2>Our Vision</h2>
            <p>A world where "waste" is an obsolete concept, and every byproduct is recognized as a raw material for another industry, fostering a true Circular Economy.</p>
          </div>
        </div>
      </section>

      {/* Why RawLink? */}
      <section className="why-us-section">
        <div className="content-wrapper">
          <h2>Why Choose RawLink?</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Verified Vendors</h3>
              <p>We rigorously vet every seller to ensure the quality and legitimacy of materials listed on our platform.</p>
            </div>
            <div className="feature-item">
              <h3>Secure Transactions</h3>
              <p>Our integrated wallet and escrow-like payment systems ensure that your funds are safe until the deal is done.</p>
            </div>
            <div className="feature-item">
              <h3>Traceability</h3>
              <p>Track the journey of your materials from listing to delivery, ensuring compliance with environmental regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet the Team</h2>
        <p className="team-subtitle">The minds behind the platform.</p>
        <div className="team-grid">
          {/* Add your own team members here */}
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>Omar</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>Sarah Lin</h3>
            <p>Head of Operations</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍🔬</div>
            <h3>Dr. Ali</h3>
            <p>Sustainability Advisor</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
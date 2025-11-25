import React from 'react';
import './SustainabilityPage.css';

const SustainabilityPage = () => {
  return (
    <div className="sustainability-container">

      {/* Page Header */}
      <header className="sus-header">
        <h1>Our Planet, Our Responsibility</h1>
        <p>
          At RawLink, we track the environmental impact of every transaction to ensure a sustainable future.
        </p>
      </header>

      {/* Environmental Impact Statistics */}
      <section className="impact-stats">
        <div className="stat-box green">
          <span className="stat-number">15,400 kg</span>
          <span className="stat-desc">Waste Diverted from Landfills</span>
        </div>
        <div className="stat-box blue">
          <span className="stat-number">320 tons</span>
          <span className="stat-desc">CO2 Emissions Prevented</span>
        </div>
        <div className="stat-box yellow">
          <span className="stat-number">145</span>
          <span className="stat-desc">Businesses Gone Green</span>
        </div>
      </section>

      {/* Educational Section: Circular Economy */}
      <section className="sus-content">
        <div className="sus-text">
          <h2>Embracing the Circular Economy</h2>
          <p>
            The traditional "Take-Make-Dispose" approach is harming our planet. RawLink promotes the <strong>Circular Economy</strong>, keeping materials in use for as long as possible.
          </p>
          <p>
            By extending the lifecycle of materials, we save energy, reduce pollution, and protect our natural resources for future generations.
          </p>
          <ul className="sus-list">
            <li><strong>Reduce:</strong> Minimize waste generation from the start.</li>
            <li><strong>Reuse:</strong> Give new life to industrial byproducts.</li>
            <li><strong>Recycle:</strong> Transform used materials into new products.</li>
          </ul>
        </div>

        {/* Infographic or Visual Section */}
        <div className="sus-image">
          <div className="infographic-placeholder">
            ♻️
            <p>Visualizing Sustainability</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="sus-cta">
        <h2>Be Part of the Green Revolution</h2>
        <p>
          Every kilogram you buy, sell, or list on RawLink contributes to a cleaner, healthier planet. Let's make a difference together.
        </p>
      </section>

    </div>
  );
};

export default SustainabilityPage;

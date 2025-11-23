import React from 'react';
import './SustainabilityPage.css';

const SustainabilityPage = () => {
  return (
    <div className="sustainability-container">
      <header className="sus-header">
        <h1>Our Planet, Our Responsibility</h1>
        <p>Tracking the environmental impact of every transaction on RawLink.</p>
      </header>

      {/* Impact Stats */}
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

      {/* Educational Section */}
      <section className="sus-content">
        <div className="sus-text">
          <h2>The Circular Economy Approach</h2>
          <p>
            The traditional "Take-Make-Dispose" model is destroying our planet. At RawLink, we champion the <strong>Circular Economy</strong>.
          </p>
          <p>
            By keeping materials in use, we reduce the need for extracting new raw resources. This saves energy, reduces pollution, and conserves our natural environment.
          </p>
          <ul className="sus-list">
            <li><strong>Reduce:</strong> Minimizing waste generation at the source.</li>
            <li><strong>Reuse:</strong> Finding new purposes for industrial byproducts.</li>
            <li><strong>Recycle:</strong> Processing materials to create new products.</li>
          </ul>
        </div>
        <div className="sus-image">
           {/* You can replace this with an infographic later */}
           <div className="infographic-placeholder">
             ♻️ 
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="sus-cta">
        <h2>Join the Green Revolution</h2>
        <p>Every kilogram of material you list or buy contributes to a cleaner Earth.</p>
      </section>
    </div>
  );
};

export default SustainabilityPage;
import React from 'react';
import './SideContent.css';

const SideContent: React.FC = () => {
  return (
    <div className="side-content">
      <div className="side-header">
        <h2>Enterprise SMS Solutions</h2>
        <p>Connect with your customers instantly through our reliable SMS platform</p>
      </div>
      
      <div className="features-list">
        <div className="feature-item">
          <div className="feature-icon">📱</div>
          <div className="feature-text">
            <h4>Global Reach</h4>
            <p>Send SMS to 200+ countries with 99.9% delivery rate</p>
          </div>
        </div>
        
        <div className="feature-item">
          <div className="feature-icon">⚡</div>
          <div className="feature-text">
            <h4>Lightning Fast</h4>
            <p>Instant delivery with our premium carrier network</p>
          </div>
        </div>
        
        <div className="feature-item">
          <div className="feature-icon">🔒</div>
          <div className="feature-text">
            <h4>Secure & Compliant</h4>
            <p>Enterprise-grade security with GDPR compliance</p>
          </div>
        </div>
        
        <div className="feature-item">
          <div className="feature-icon">📊</div>
          <div className="feature-text">
            <h4>Real-time Analytics</h4>
            <p>Track delivery, engagement, and campaign performance</p>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">10M+</div>
          <div className="stat-label">Messages Sent</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Enterprise Clients</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
      </div>
    </div>
  );
};

export default SideContent;
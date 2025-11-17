import React from 'react';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <div className="logo">
        <div className="logo-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#059669"/>
            <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="20" r="15" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-name">Qode</span>
          <span className="logo-tagline">SMS Platform</span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
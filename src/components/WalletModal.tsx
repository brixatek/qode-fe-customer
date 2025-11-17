import React from 'react';
import './WalletModal.css';

interface WalletModalProps {
  show: boolean;
  onClose: () => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  onCreateWallet: () => void;
  creating: boolean;
}

const WalletModal: React.FC<WalletModalProps> = ({
  show,
  onClose,
  selectedCurrency,
  setSelectedCurrency,
  onCreateWallet,
  creating
}) => {
  if (!show) return null;

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2>Create Wallet</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="wallet-form">
          <div className="form-group">
            <label>Choose Currency</label>
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="currency-select"
            >
              <option value="NGN">₦ Nigerian Naira (NGN)</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
              <option value="GBP">£ British Pound (GBP)</option>
            </select>
          </div>
          
          <div className="wallet-features">
            <div className="feature">✓ Secure encryption</div>
            <div className="feature">✓ Real-time tracking</div>
            <div className="feature">✓ Instant SMS delivery</div>
          </div>
        </div>
        
        <div className="wallet-modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="create-btn" 
            onClick={onCreateWallet}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
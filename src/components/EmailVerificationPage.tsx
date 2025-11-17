import React, { useState, useEffect } from 'react';
import './EmailVerification.css';

const API_BASE_URL = 'https://onboarding.zephapay.com/api/v1';

const EmailVerificationPage: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/email-verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: email || ''
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully!');
      } else {
        setStatus('error');
        setMessage('Verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">Q</div>
            <h1>Qode</h1>
          </div>
        </div>

        {status === 'verifying' && (
          <div className="verification-content">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verification-content success">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <button 
              onClick={() => window.location.href = '/?login=true'}
              className="btn-primary"
            >
              Continue to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="verification-content error">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-secondary"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
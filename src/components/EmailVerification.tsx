import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api.ts';
import './EmailVerification.css';

const EmailVerification: React.FC = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const emailParam = urlParams.get('email');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      verifyEmail(tokenParam, emailParam);
    }
  }, []);

  const verifyEmail = async (verificationToken: string, userEmail: string) => {
    setStatus('verifying');
    try {
      await customerService.verifyEmail({ token: verificationToken, email: userEmail });
      setStatus('success');
      setMessage('Your email has been successfully verified! You can now log in to your account.');
    } catch (error) {
      setStatus('error');
      setMessage('Email verification failed. The link may be expired or invalid.');
    }
  };

  const resendVerification = async () => {
    if (!email) return;
    
    try {
      await customerService.resendVerification(email);
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        {status === 'verifying' && (
          <div className="verification-content">
            <div className="spinner"></div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verification-content success">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <button className="btn-primary" onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="verification-content error">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            {email && (
              <button className="btn-secondary" onClick={resendVerification}>
                Resend Verification Email
              </button>
            )}
          </div>
        )}

        {status === 'idle' && (
          <div className="verification-content">
            <h2>Email Verification</h2>
            <p>Please check your email for a verification link, or click the verification link you received.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
import React, { useState, useEffect } from 'react';
import { LoginRequest } from '../types/api';
import { customerService, tokenManager } from '../services/api.ts';
import './LoginForm.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await customerService.login(formData);
      const { accessToken, refreshToken } = response.data.data;
      
      if (accessToken && refreshToken) {
        tokenManager.setTokens(accessToken, refreshToken);
        onLoginSuccess();
      } else {
        setError('Login successful but tokens not received. Please try again.');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modern">
      {/* Background Elements */}
      <div className="login-bg-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div 
          className="element-card card-welcome" 
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        >
          <div className="card-icon">👋</div>
          <div className="card-text">Welcome Back</div>
        </div>
        <div 
          className="element-card card-secure" 
          style={{ transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.025}px)` }}
        >
          <div className="card-icon">🔒</div>
          <div className="card-text">Secure Login</div>
        </div>
      </div>

      <div className="login-container-modern">
        <div className="login-card-modern">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-modern">
              <div className="logo-icon-modern">
                <div className="logo-gradient">Q</div>
                <div className="logo-pulse"></div>
              </div>
              <span className="logo-text-modern">Qode</span>
            </div>
          </div>

          {/* Header */}
          <div className="login-header-modern">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account and continue your SMS journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form-modern">
            <div className="form-group-modern">
              <label className="form-label-modern">Email Address</label>
              <div className="input-container-modern">

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-modern"
                  placeholder="Enter your email"
                  required
                />
                <div className="input-glow"></div>
              </div>
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern">Password</label>
              <div className="input-container-modern">

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-modern"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-modern"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <div className="input-glow"></div>
              </div>
            </div>

            {error && (
              <div className="error-modern">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-login-modern" disabled={loading}>
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              {!loading && <div className="btn-shine"></div>}
              {loading && <div className="btn-loading"></div>}
            </button>
          </form>

          {/* Signup Link */}
          <div className="signup-link">
            <span>Don't have an account? </span>
            <button 
              type="button" 
              className="btn-signup-link" 
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default LoginForm;
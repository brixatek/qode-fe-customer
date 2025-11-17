import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStat, setCurrentStat] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const stats = [
    { number: '99.9%', label: 'Delivery Rate', color: '#FF6B6B', icon: '🚀' },
    { number: '25K+', label: 'Happy Customers', color: '#4ECDC4', icon: '❤️' },
    { number: '100M+', label: 'Messages Sent', color: '#45B7D1', icon: '📱' },
    { number: '180+', label: 'Countries', color: '#96CEB4', icon: '🌍' }
  ];

  const features = [
    { icon: '🚀', title: 'Lightning Fast', desc: 'Send SMS messages instantly with our global network and 99.9% delivery guarantee.', gradient: 'from-pink-500 to-rose-500' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Track campaign performance, delivery rates, and customer engagement in real-time.', gradient: 'from-blue-500 to-cyan-500' },
    { icon: '🔒', title: 'Bank-Level Security', desc: 'Enterprise-grade security with full GDPR compliance and data protection.', gradient: 'from-green-500 to-emerald-500' },
    { icon: '🎯', title: 'Precision Targeting', desc: 'Segment your audience and send personalized messages for better engagement.', gradient: 'from-purple-500 to-violet-500' },
    { icon: '⚡', title: 'Seamless API', desc: 'Integrate effortlessly with your existing systems using our powerful REST API.', gradient: 'from-yellow-500 to-orange-500' },
    { icon: '💬', title: 'Two-way Chat', desc: 'Enable conversations with customers through bidirectional SMS communication.', gradient: 'from-indigo-500 to-blue-500' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Marketing Director', company: 'TechCorp', text: 'Qode SMS transformed our customer engagement. 300% increase in response rates!', avatar: '👩‍💼' },
    { name: 'Michael Chen', role: 'CEO', company: 'StartupXYZ', text: 'The best SMS platform we\'ve used. Simple, powerful, and incredibly reliable.', avatar: '👨‍💻' },
    { name: 'Emily Davis', role: 'Growth Manager', company: 'E-commerce Plus', text: 'Our conversion rates doubled within the first month. Absolutely game-changing!', avatar: '👩‍🚀' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="landing-page" onMouseMove={handleMouseMove}>
      {/* Floating Header */}
      <header className="floating-header">
        <div className="container">
          <div className="logo-modern">
            <div className="logo-icon-modern">
              <div className="logo-gradient">Q</div>
              <div className="logo-pulse"></div>
            </div>
            <span className="logo-text-modern">Qode</span>
          </div>
          <nav className="nav-modern">
            <a href="#features" className="nav-item">Features</a>
            <a href="#testimonials" className="nav-item">Reviews</a>
            <a href="#pricing" className="nav-item">Pricing</a>
          </nav>
          <div className="auth-modern">
            <button 
              onClick={() => window.location.href = '/?login=true'}
              className="btn-ghost"
            >
              Sign In
            </button>
            <button 
              onClick={() => window.location.href = '/?register=true'}
              className="btn-gradient"
            >
              <span>Start Free</span>
              <div className="btn-shine"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-modern">
        <div className="hero-bg-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content-modern">
            <div className="hero-text-modern">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span>Trusted by 25,000+ businesses worldwide</span>
              </div>
              <h1 className="hero-title">
                Transform Your
                <span className="title-highlight"> Customer Communication</span>
                <br />with Smart SMS
              </h1>
              <p className="hero-description">
                Send personalized messages that convert. Track performance in real-time. 
                Scale your business with the most reliable SMS platform on the planet.
              </p>
              <div className="hero-actions">
                <button 
                  onClick={() => window.location.href = '/?register=true'}
                  className="btn-hero-primary"
                >
                  <span>Start Free Trial</span>
                  <div className="btn-particles"></div>
                </button>
                <button className="btn-hero-secondary">
                  <span className="play-icon">▶</span>
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="hero-stats-modern">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`stat-modern ${currentStat === index ? 'active' : ''}`}
                    style={{ '--stat-color': stat.color } as React.CSSProperties}
                  >
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <span className="stat-number-modern">{stat.number}</span>
                      <span className="stat-label-modern">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual-modern">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="message-bubble message-1">
                    <span>🎉 Welcome to Qode!</span>
                  </div>
                  <div className="message-bubble message-2">
                    <span>Your order is confirmed ✅</span>
                  </div>
                  <div className="message-bubble message-3">
                    <span>20% off your next purchase!</span>
                  </div>
                </div>
                <div className="phone-glow"></div>
              </div>
              <div className="floating-elements">
                <div className="element-card card-analytics" style={{ transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.02}px)` }}>
                  <div className="card-header">📈 Analytics</div>
                  <div className="card-metric">+127%</div>
                </div>
                <div className="element-card card-delivery" style={{ transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.03}px)` }}>
                  <div className="card-header">🚀 Delivery</div>
                  <div className="card-metric">99.9%</div>
                </div>
                <div className="element-card card-engagement" style={{ transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.02}px)` }}>
                  <div className="card-header">💬 Engagement</div>
                  <div className="card-metric">85%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">
              <span>🚀 Features</span>
            </div>
            <h2 className="section-title">Everything you need to <span className="text-gradient">dominate</span> SMS marketing</h2>
            <p className="section-description">Powerful tools designed for modern businesses that want to scale fast</p>
          </div>
          <div className="features-grid-modern">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card-modern ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="feature-card-inner">
                  <div className="feature-icon-container">
                    <div className={`feature-icon-bg bg-gradient-to-r ${feature.gradient}`}></div>
                    <span className="feature-icon-modern">{feature.icon}</span>
                  </div>
                  <h3 className="feature-title-modern">{feature.title}</h3>
                  <p className="feature-desc-modern">{feature.desc}</p>
                  <div className="feature-arrow">→</div>
                </div>
                <div className="feature-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">
              <span>💬 Testimonials</span>
            </div>
            <h2 className="section-title">Loved by <span className="text-gradient">thousands</span> of businesses</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern">
        <div className="cta-bg-pattern"></div>
        <div className="container">
          <div className="cta-content-modern">
            <div className="cta-visual">
              <div className="success-metrics">
                <div className="metric-item">
                  <span className="metric-icon">📈</span>
                  <span className="metric-text">300% ROI Average</span>
                </div>
                <div className="metric-item">
                  <span className="metric-icon">⚡</span>
                  <span className="metric-text">5min Setup</span>
                </div>
                <div className="metric-item">
                  <span className="metric-icon">🎯</span>
                  <span className="metric-text">99.9% Delivery</span>
                </div>
              </div>
            </div>
            <div className="cta-text-content">
              <h2 className="cta-title">
                Ready to <span className="text-gradient">10x</span> your customer engagement?
              </h2>
              <p className="cta-description">
                Join 25,000+ businesses already crushing it with Qode SMS. 
                Start your free trial today - no credit card required.
              </p>
              <div className="cta-actions-modern">
                <button 
                  onClick={() => window.location.href = '/?register=true'}
                  className="btn-cta-primary"
                >
                  <span>Start Free Trial</span>
                  <div className="btn-rocket">🚀</div>
                </button>
                <div className="cta-guarantee">
                  <span className="guarantee-icon">✅</span>
                  <span>14-day free trial • No setup fees • Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-content-modern">
            <div className="footer-brand-modern">
              <div className="logo-modern">
                <div className="logo-icon-modern">
                  <div className="logo-gradient">Q</div>
                </div>
                <span className="logo-text-modern">Qode</span>
              </div>
              <p className="footer-tagline">The future of customer communication is here</p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📸</a>
              </div>
            </div>
            <div className="footer-links-modern">
              <div className="link-group-modern">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#api">API Docs</a>
                <a href="#integrations">Integrations</a>
              </div>
              <div className="link-group-modern">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
                <a href="#blog">Blog</a>
              </div>
              <div className="link-group-modern">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#status">Status</a>
                <a href="#security">Security</a>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-modern">
            <p>&copy; 2024 Qode. All rights reserved. Made with ❤️ for amazing businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
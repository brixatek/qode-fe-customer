import React, { useState } from 'react';
import LandingPage from './components/LandingPage.tsx';
import OnboardingForm from './components/OnboardingForm.tsx';
import LoginForm from './components/LoginForm.tsx';
import Dashboard from './components/Dashboard.tsx';
import EmailVerificationPage from './components/EmailVerificationPage.tsx';
// import AdminApp from './components/AdminApp.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { tokenManager } from './services/api.ts';
import './App.css';

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('login') === 'true';
  });
  const [showRegister, setShowRegister] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('register') === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return tokenManager.isAuthenticated();
  });
  
  // Check if this is email verification route
  const isEmailVerificationRoute = window.location.pathname === '/email-verification';
  
  // Admin functionality temporarily disabled
  // const isAdminRoute = window.location.pathname.startsWith('/admin') || window.location.search.includes('admin=true');
  
  // if (isAdminRoute) {
  //   return (
  //     <ErrorBoundary>
  //       <AdminApp />
  //     </ErrorBoundary>
  //   );
  // }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowRegister(false);
    // Clean URL by removing query parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (isEmailVerificationRoute) {
    return (
      <ErrorBoundary>
        <EmailVerificationPage />
      </ErrorBoundary>
    );
  }

  if (isLoggedIn) {
    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }

  // Show landing page if no specific route is requested
  if (!showLogin && !showRegister) {
    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {showLogin ? (
          <LoginForm 
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
              window.history.replaceState({}, document.title, '/?register=true');
            }} 
            onLoginSuccess={handleLoginSuccess}
          />
        ) : showRegister ? (
          <OnboardingForm />
        ) : (
          <LandingPage />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
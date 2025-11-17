import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './components/AdminApp';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('admin-root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AdminApp />
    </ErrorBoundary>
  </React.StrictMode>
);
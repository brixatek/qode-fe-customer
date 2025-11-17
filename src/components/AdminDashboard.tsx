import React from 'react';
import SenderIdList from './SenderIdList';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} style={{ padding: '10px 20px' }}>
          Logout
        </button>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Customers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Pending Reviews</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <SenderIdList />
      </div>
    </div>
  );
};

export default AdminDashboard;
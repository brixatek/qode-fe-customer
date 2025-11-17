import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary mock login
    onLoginSuccess();
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
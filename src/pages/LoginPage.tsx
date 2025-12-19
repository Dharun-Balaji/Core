import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <Layout size={32} color="white" />
          </div>
          <h1>Welcome to Core</h1>
          <p>Enter your email to access your workspace</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

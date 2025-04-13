// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { login } from '../services/api';

const LoginPage = ({ onLogin, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(formData.username, formData.password);
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Get user profile and update parent component
      onLogin(response.data);
      setCurrentPage('home');
    } catch (error) {
      setError('Invalid username or password. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <main>
      <section>
        <h2>Login</h2>
        {error && <div className="form-message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <a href="#" onClick={() => setCurrentPage('register')}>
            Register here
          </a>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
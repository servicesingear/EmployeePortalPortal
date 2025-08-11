import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [loginState, setLoginState] = useState({
    loading: false,
    message: '',
    isSuccess: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginState({ loading: true, message: '', isSuccess: false });

    // Simple validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setLoginState({
        loading: false,
        message: 'Please enter both username and password',
        isSuccess: false
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        role: formData.role
      }));

      // Show success message
      setLoginState({
        loading: false,
        message: 'Login successful! Redirecting...',
        isSuccess: true
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Status message */}
        {loginState.message && (
          <div className={`alert ${loginState.isSuccess ? 'alert-success' : 'alert-error'}`}>
            {loginState.message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={loginState.loading}
        >
          {loginState.loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

// Simple Icons
const AppleIcon = () => <svg height="20px" width="20px" viewBox="0 0 100 125"><path d="M84.046,60.2c-0.342,14.536-11.666,24.32-23.869,24.516c-1.127,0.02-2.276-0.02-3.444-0.02c-3.136,0-6.23,0.92-8.911,2.68c-2.83,1.86-5.321,4.24-8.211,4.24c-2.81,0-5.061-2.2-7.85-4.16c-2.93-2.06-5.8-3.04-8.8-3.04c-12.26,0-21.2-10.08-21.5-24.2c-0.04-2.18,0.36-4.38,1.18-6.54c2.18-5.64,6.54-9.76,11.6-12.2c5.34-2.58,10.74-3.48,15.94-3.48c3.22,0,6.38,0.78,9.36,2.3c2.7,1.38,5.1,3.22,8.02,3.22c2.78,0,5.16-1.92,7.96-3.3c3.24-1.6,6.6-2.66,10.36-2.66c6.04,0,11.52,2.4,15.18,7.02c-1.64,0.98-3.2,2.16-4.64,3.52c-4.66,4.38-7.38,10.12-7.14,16.5C83.106,56.74,83.746,58.48,84.046,60.2z M72.246,24.8c3.64-4.2,6.02-9.66,6.32-15.8c-6.14,0.3-11.96,3.46-15.96,7.7c-3.56,3.74-6.18,9.22-6.38,15.2C60.246,37.94,65.986,34.28,72.246,24.8z"/></svg>;
const FacebookIcon = () => <svg height="20px" width="20px" viewBox="0 0 100 125"><path d="M90,15.001C90,11.134,86.866,8,82.999,8H17.001C13.134,8,10,11.134,10,15.001v69.998C10,88.866,13.134,92,17.001,92H50V61.671H40.211v-9.11h9.789V45.24c0-9.711,5.929-14.997,14.588-14.997c4.145,0,7.712,0.309,8.751,0.446v8.14h-4.814c-4.712,0-5.624,2.24-5.624,5.525v7.217h9.03l-1.176,9.11H58.625V92h24.374c3.867,0,7.001-3.134,7.001-7.001V15.001z"/></svg>;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/'); // <--- REDIRECT TO HOMEPAGE
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials.');
      }
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">RawLink</div>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}
        
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="social-divider">or</div>
      <div className="social-buttons-container">
        <button className="social-button">
          <svg viewBox="0 0 48 48" width="20px" height="20px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.8 2.38 30.43 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.28 6.42C12.94 13.57 18.06 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.87c-.57 2.82-2.28 5.22-4.8 6.82l8.03 6.19C45.31 36.62 48 31.02 48 24c0-.66-.05-1.3-.15-1.94z"></path><path fill="#FBBC05" d="M10.84 28.64c-.28-.82-.44-1.69-.44-2.64s.16-1.82.44-2.64l-8.28-6.42C.96 18.25 0 21.01 0 24s.96 5.75 2.56 8.22l8.28-6.58z"></path><path fill="#34A853" d="M24 48c6.43 0 11.8-2.13 15.73-5.71l-8.03-6.19c-2.15 1.45-4.94 2.3-8.1 2.3-5.94 0-11.06-4.07-12.84-9.59l-8.28 6.42C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
          Sign in with Google
        </button>
        <button className="social-button">
            <AppleIcon /> Sign in with Apple
        </button>
        <button className="social-button">
            <FacebookIcon /> Sign in with Facebook
        </button>
      </div>

      <Link to="/register" className="auth-link">Don't have an account? Register</Link>
    </div>
  );
}

export default LoginPage;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await register(email, username, password, role);
      navigate('/'); // <--- REDIRECT TO HOMEPAGE
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const messages = Object.values(errorData).flat();
        setError(messages.join(' '));
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">RawLink</div>
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>I am a:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer (I want to buy materials)</option>
            <option value="vendor">Vendor (I want to sell materials)</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
      
      <div className="social-divider">or</div>
      <div className="social-buttons-container">
        <button className="social-button">
            <svg viewBox="0 0 48 48" width="20px" height="20px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.8 2.38 30.43 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.28 6.42C12.94 13.57 18.06 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.87c-.57 2.82-2.28 5.22-4.8 6.82l8.03 6.19C45.31 36.62 48 31.02 48 24c0-.66-.05-1.3-.15-1.94z"></path><path fill="#FBBC05" d="M10.84 28.64c-.28-.82-.44-1.69-.44-2.64s.16-1.82.44-2.64l-8.28-6.42C.96 18.25 0 21.01 0 24s.96 5.75 2.56 8.22l8.28-6.58z"></path><path fill="#34A853" d="M24 48c6.43 0 11.8-2.13 15.73-5.71l-8.03-6.19c-2.15 1.45-4.94 2.3-8.1 2.3-5.94 0-11.06-4.07-12.84-9.59l-8.28 6.42C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
            Sign up with Google
        </button>
      </div>
      <Link to="/login" className="auth-link">Already have an account? Login</Link>
    </div>
  );
}

export default RegisterPage;
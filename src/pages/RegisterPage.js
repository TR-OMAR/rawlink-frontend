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
      navigate('/'); // Redirect to homepage
    } catch (err) {
      if (err.response?.data) {
        const messages = Object.values(err.response.data).flat();
        setError(messages.join(' '));
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo">RawLink</div>

      <h2>Create Your Account</h2>
      <p className="auth-subtitle">Sign up to buy or sell sustainable materials</p>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>I am a:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer – I want to buy materials</option>
            <option value="vendor">Vendor – I want to sell materials</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      {/* Social Signup */}
      <div className="social-divider">or</div>
      <div className="social-buttons-container">
        <button className="social-button">
          <span className="social-logo">RawLink</span> Sign up with RawLink
        </button>
      </div>

      {/* Login Link */}
      <p className="auth-link-text">
        Already have an account? <Link to="/login" className="auth-link">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;

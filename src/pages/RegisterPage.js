import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

// Import the same social logos you use on the Login page
import googleLogo from '../assets/google.png';
import appleLogo from '../assets/apple.png';
import facebookLogo from '../assets/facebook.png';

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
      navigate('/'); // Redirect to homepage on success
    } catch (err) {
      // Try to display helpful error info from API if available
      if (err?.response?.data) {
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

  // Demo-only social handler: no real OAuth configured in this demo project
  const handleSocialDemo = (provider) => {
    alert(`${provider} sign-up is a demo. No OAuth flow is configured in this project.`);
  };

  return (
    <div className="auth-container">
      {/* Brand */}
      <div className="auth-logo">RawLink</div>

      <h2>Create Your Account</h2>
      <p className="auth-subtitle">Sign up to buy or sell sustainable materials</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {error && <p className="auth-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-role">I am a</label>
          <select
            id="register-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="buyer">Buyer — I want to buy materials</option>
            <option value="vendor">Vendor — I want to sell materials</option>
          </select>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      {/* Social signup (demo) */}
      <div className="social-divider">or</div>

      <div className="social-buttons-container">
        <button
          type="button"
          className="social-button social-google"
          onClick={() => handleSocialDemo('Google')}
        >
          <img src={googleLogo} alt="Google logo" className="social-logo" />
          <span className="social-text">Sign up with Google</span>
        </button>

        <button
          type="button"
          className="social-button social-apple"
          onClick={() => handleSocialDemo('Apple')}
        >
          <img src={appleLogo} alt="Apple logo" className="social-logo" />
          <span className="social-text">Sign up with Apple</span>
        </button>

        <button
          type="button"
          className="social-button social-facebook"
          onClick={() => handleSocialDemo('Facebook')}
        >
          <img src={facebookLogo} alt="Facebook logo" className="social-logo" />
          <span className="social-text">Sign up with Facebook</span>
        </button>
      </div>

      {/* Link to login */}
      <p className="auth-link-text">
        Already have an account? <Link to="/login" className="auth-link">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

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
      navigate('/'); // redirect to homepage on success
    } catch (err) {
      const apiDetail = err?.response?.data?.detail;
      setError(apiDetail || 'Login failed. Please check your credentials.');
      console.error(err);
    }

    setLoading(false);
  };

  // Demo-only social handler: show a friendly message (no OAuth)
  const handleSocialDemo = (provider) => {
    alert(`${provider} sign-in is a demo in this project. No real OAuth flow is configured.`);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">RawLink</div>
      <h2>Login to Your Account</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="social-divider">or</div>

      <div className="social-buttons-container">
        <button
          type="button"
          className="social-button social-google"
          onClick={() => handleSocialDemo('Google')}
        >
          <img src="../assets/google.png" alt="Google" className="social-logo" />
          <span className="social-text">Sign in with Google</span>
        </button>

        <button
          type="button"
          className="social-button social-apple"
          onClick={() => handleSocialDemo('Apple')}
        >
          <img src="../assets/apple.png" alt="Apple" className="social-logo" />
          <span className="social-text">Sign in with Apple</span>
        </button>

        <button
          type="button"
          className="social-button social-facebook"
          onClick={() => handleSocialDemo('Facebook')}
        >
          <img src="../assets/facebook.png" alt="Facebook" className="social-logo" />
          <span className="social-text">Sign in with Facebook</span>
        </button>
      </div>

      <Link to="/register" className="auth-link">Don't have an account? Register</Link>
    </div>
  );
}

export default LoginPage;

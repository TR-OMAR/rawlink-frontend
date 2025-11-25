import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// --- Pages ---
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import SellPage from './pages/SellPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import SustainabilityPage from './pages/SustainabilityPage';

// --- Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * Redirects to login if user is not logged in.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show a loader while auth state is resolving

  if (!user) return <Navigate to="/login" replace />; // Redirect to login if unauthenticated

  return children;
};

/**
 * AppRoutes
 * Defines all routes for the application.
 * Separates public, auth, and protected routes for clarity.
 */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Main content area: flex: 1 ensures footer stays at bottom */}
      <div className="container-fluid" style={{ flex: '1', paddingBottom: '40px' }}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />

          {/* --- Authentication Routes --- */}
          {/* Redirect logged-in users away from login/register pages */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          {/* --- Protected Routes (Require Login) --- */}
          <Route
            path="/sell"
            element={<ProtectedRoute><SellPage /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>}
          />
          <Route
            path="/wallet"
            element={<ProtectedRoute><WalletPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/chat"
            element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
          />

          {/* --- Catch-All Route --- */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

/**
 * App
 * Wraps the entire application with AuthProvider for global authentication state.
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

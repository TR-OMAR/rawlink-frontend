import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import SellPage from './pages/SellPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/**
 * Protects routes that require login.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Main Content Area - flex: 1 pushes footer down */}
      <div className="container-fluid" style={{ flex: '1', paddingBottom: '40px' }}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />

          {/* --- Auth Routes (Redirect to Home if already logged in) --- */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          {/* --- Protected Routes --- */}
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

          {/* --- Catch-all --- */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
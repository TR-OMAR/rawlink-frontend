import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

// --- Initialize React Query client ---
// Provides caching, background fetching, and more for API requests
const queryClient = new QueryClient();

// --- Create root element for React 18 ---
const root = ReactDOM.createRoot(document.getElementById('root'));

// --- Render the application ---
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing throughout the app */}
    <BrowserRouter>
      {/* QueryClientProvider enables React Query for data fetching and caching */}
      <QueryClientProvider client={queryClient}>
        {/* Main App component */}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

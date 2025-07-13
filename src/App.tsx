import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import { ROUTES } from './utils/constants';

// Lazy load pages for better performance
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage'));
const StatsPage = React.lazy(() => import('./pages/StatsPage'));
const TrackingPage = React.lazy(() => import('./pages/TrackingPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router basename="/job-tracker">
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route
                path={ROUTES.APPLICATIONS}
                element={
                  <ProtectedRoute>
                    <Header />
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64">
                      <div className="loading-spinner"></div>
                    </div>}>
                      <ApplicationsPage />
                    </React.Suspense>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path={ROUTES.STATS}
                element={
                  <ProtectedRoute>
                    <Header />
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64">
                      <div className="loading-spinner"></div>
                    </div>}>
                      <StatsPage />
                    </React.Suspense>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path={ROUTES.TRACKING}
                element={
                  <ProtectedRoute>
                    <Header />
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64">
                      <div className="loading-spinner"></div>
                    </div>}>
                      <TrackingPage />
                    </React.Suspense>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <Header />
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64">
                      <div className="loading-spinner"></div>
                    </div>}>
                      <SettingsPage />
                    </React.Suspense>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect root to applications */}
              <Route path="/" element={<Navigate to={ROUTES.APPLICATIONS} replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to={ROUTES.APPLICATIONS} replace />} />
            </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
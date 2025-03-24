import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import './App.css';
import SimpleDashboard from './features/dashboard/SimpleDashboard';
import ChatPanel from './features/ai/ChatPanel';
import SimpleContentCalendar from './components/calendar/SimpleContentCalendar';
import EnhancementPanel from './features/ai/EnhancementPanel';
import UserProfile from './components/UserProfile';
import LoginPage from './components/LoginPage';
import AnalyticsDashboard from './features/analytics/AnalyticsDashboard';
import { isAuthenticated, logout } from './services/authService';

// Define a custom event for authentication changes
export const AUTH_CHANGE_EVENT = 'vibe-pilot-auth-change';

// Create a utility to dispatch auth events
export const dispatchAuthEvent = (authenticated: boolean) => {
  console.log("Dispatching auth event:", authenticated);
  const event = new CustomEvent(AUTH_CHANGE_EVENT, { detail: { authenticated } });
  window.dispatchEvent(event);
};

// Auth protected route component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuth = isAuthenticated();
  console.log("ProtectedRoute - isAuthenticated:", isAuth);
  if (!isAuth) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  console.log("Authenticated, rendering protected element");
  return element;
};

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  
  // Update auth state when it changes
  useEffect(() => {
    // Check authentication on mount
    const auth = isAuthenticated();
    console.log("App useEffect - isAuthenticated:", auth);
    setAuthenticated(auth);
    
    // Set up event listener for storage changes (for logout in other tabs)
    const handleStorageChange = () => {
      const newAuthState = isAuthenticated();
      console.log("Storage change detected - isAuthenticated:", newAuthState);
      setAuthenticated(newAuthState);
    };
    
    // Listen for custom auth events
    const handleAuthChange = (event: CustomEvent) => {
      const newAuthState = event.detail.authenticated;
      console.log("Auth change event detected:", newAuthState);
      setAuthenticated(newAuthState);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };
  
  return (
    <Router>
      <div className="App">
        {authenticated && (
          <nav className="app-nav">
            <div className="nav-left">
              <h1 className="app-title">VibePilot</h1>
              <div className="nav-links">
                <Link to="/" style={{ color: 'var(--text-accent)' }}>Dashboard</Link>
                <Link to="/calendar" style={{ color: 'var(--text-accent)' }}>Calendar</Link>
                <Link to="/analytics" style={{ color: 'var(--text-accent)' }}>Analytics</Link>
                <Link to="/ai-assistant" style={{ color: 'var(--text-accent)' }}>AI Assistant</Link>
              </div>
            </div>
            <div className="nav-right">
              <Link to="/profile" style={{ color: 'var(--text-accent)', marginRight: '16px' }}>Profile</Link>
              <Button onClick={handleLogout} themeColor="primary" fillMode="flat">
                Logout
              </Button>
            </div>
          </nav>
        )}

        <Routes>
          <Route 
            path="/login" 
            element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} 
          />
          <Route 
            path="/" 
            element={<ProtectedRoute element={<SimpleDashboard />} />} 
          />
          <Route 
            path="/calendar" 
            element={<ProtectedRoute element={<SimpleContentCalendar />} />} 
          />
          <Route 
            path="/analytics" 
            element={<ProtectedRoute element={<AnalyticsDashboard />} />} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute element={<UserProfile />} />} 
          />
          <Route 
            path="/ai-assistant" 
            element={<ProtectedRoute element={
              <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                <EnhancementPanel />
                <ChatPanel />
              </div>
            } />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import SimplePostManagement from './features/posts/SimplePostManagement';
import SimpleContentCalendar from './components/calendar/SimpleContentCalendar';
import SimpleDashboard from './features/dashboard/SimpleDashboard';
import AIAssistantPage from './features/ai/AIAssistantPage';
import AnalyticsDashboard from './features/analytics/AnalyticsDashboard';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { AuthProvider } from './context/AuthContext';

// Import CSS files
import './App.css';
import './styles/animations.css';
import './styles/theme.css';

// Create a client
const queryClient = new QueryClient();

// Note: Kendo UI License is activated via the CLI tool
// The license file (telerik-license.txt) is in the project root
// The license is activated by running: npx kendo-ui-license activate

// AnimatedContent wrapper component
const AnimatedContent = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="app" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              color: 'var(--text-primary)',
              minHeight: '100vh'
            }}>
              <header className="app-header" style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div className="logo animate-fadeIn">VibePilot</div>
                <nav className="animate-fadeIn" style={{ color: 'var(--text-secondary)' }}>
                  <Link to="/" style={{ color: 'var(--text-accent)' }}>Dashboard</Link>
                  <Link to="/posts" style={{ color: 'var(--text-accent)' }}>Posts</Link>
                  <Link to="/calendar" style={{ color: 'var(--text-accent)' }}>Calendar</Link>
                  <Link to="/analytics" style={{ color: 'var(--text-accent)' }}>Analytics</Link>
                  <Link to="/ai-assistant" style={{ color: 'var(--text-accent)' }}>AI Assistant</Link>
                </nav>
                <div className="theme-toggle-container">
                  <ThemeToggle />
                </div>
              </header>
              
              <main className="app-content" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={
                      <AnimatedContent>
                        <SimpleDashboard />
                      </AnimatedContent>
                    } />
                    <Route path="/posts" element={
                      <AnimatedContent>
                        <SimplePostManagement />
                      </AnimatedContent>
                    } />
                    <Route path="/calendar" element={
                      <AnimatedContent>
                        <SimpleContentCalendar />
                      </AnimatedContent>
                    } />
                    <Route path="/ai-assistant" element={
                      <AnimatedContent>
                        <AIAssistantPage />
                      </AnimatedContent>
                    } />
                    <Route path="/analytics" element={
                      <AnimatedContent>
                        <AnalyticsDashboard />
                      </AnimatedContent>
                    } />
                  </Routes>
                </ErrorBoundary>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../services/authService';

// Simple form component
const DebugLoginForm = ({ onSubmit, initialEmail, initialPassword }: any) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Remember me
        </label>
      </div>
      
      <button
        type="submit"
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#3182CE', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Sign In
      </button>
    </form>
  );
};

const DebugLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState({ isAuthenticated: false });
  
  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };
  
  // Check authentication status on mount and every second
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthState({ isAuthenticated: auth });
      
      if (auth) {
        addLog('Currently authenticated: YES');
      } else {
        addLog('Currently authenticated: NO');
      }
    };
    
    checkAuth();
    const interval = setInterval(checkAuth, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogin = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    addLog(`Attempting login with email: ${credentials.email}, rememberMe: ${credentials.rememberMe}`);
    
    try {
      addLog('Calling login function...');
      const response = await login(credentials);
      addLog(`Login response: ${JSON.stringify(response)}`);
      
      if (response.success) {
        addLog('Login successful!');
        addLog('Checking localStorage...');
        
        const localStorageToken = localStorage.getItem('vibepilot_auth_token');
        addLog(`localStorage token: ${localStorageToken ? 'PRESENT' : 'MISSING'}`);
        
        addLog('Checking sessionStorage...');
        const sessionStorageToken = sessionStorage.getItem('vibepilot_auth_token');
        addLog(`sessionStorage token: ${sessionStorageToken ? 'PRESENT' : 'MISSING'}`);
        
        addLog('Checking isAuthenticated() function...');
        const authenticated = isAuthenticated();
        addLog(`isAuthenticated() returns: ${authenticated}`);
        
        if (authenticated) {
          addLog('Authentication verified! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          addLog('ERROR: Login successful but isAuthenticated() is false!');
          setError('Authentication inconsistency detected');
        }
      } else {
        addLog(`Login failed: ${response.error}`);
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error during login: ${errorMessage}`);
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ marginBottom: '24px' }}>VibePilot Login Debugger</h1>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '16px' }}>Login Form</h2>
          
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#FFF5F5',
              color: '#E53E3E',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#EBF8FF',
            color: '#3182CE',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <p><strong>Current Auth Status:</strong> {authState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
            <p style={{ marginTop: '8px' }}><strong>Demo credentials:</strong> demo@vibepilot.com / demo1234</p>
          </div>
          
          <DebugLoginForm 
            onSubmit={handleLogin}
            initialEmail="demo@vibepilot.com"
            initialPassword="demo1234"
          />
        </div>
        
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <h2 style={{ marginBottom: '16px' }}>Debug Logs</h2>
          
          <div style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            backgroundColor: '#1A202C',
            color: '#A0AEC0',
            padding: '16px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {logs.length === 0 ? 'No logs yet' : logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                {log}
              </div>
            ))}
            
            {isLoading && (
              <div style={{ color: '#38B2AC' }}>
                Processing...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugLoginPage; 
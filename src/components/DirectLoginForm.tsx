import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { dispatchAuthEvent } from '../App';

const DirectLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@vibepilot.com');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    console.log("Direct login attempt with:", { email, password, rememberMe });
    
    try {
      const response = await login({ email, password, rememberMe });
      console.log("Direct login response:", response);
      
      if (response.success) {
        console.log("Login successful, navigating to dashboard");
        dispatchAuthEvent(true);
        navigate('/');
      } else {
        console.error("Login failed:", response.error);
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          color: '#d9534f', 
          margin: '0 0 16px 0',
          padding: '12px 16px',
          backgroundColor: 'rgba(217, 83, 79, 0.1)',
          borderRadius: '6px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="k-icon k-i-warning" style={{ fontSize: '18px' }}></span>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: '12px 16px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--input-bg)',
              fontSize: '15px',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.boxShadow = '0 0 0 3px rgba(56, 128, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{ 
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--text-primary)'
            }}>
              Password
            </label>
            <a 
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ 
                color: 'var(--primary-color)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: '12px 16px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--input-bg)',
              fontSize: '15px',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.boxShadow = '0 0 0 3px rgba(56, 128, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              marginRight: '10px',
              borderRadius: '4px',
              border: rememberMe 
                ? '1px solid var(--primary-color)'
                : '1px solid var(--border-color)',
              backgroundColor: rememberMe 
                ? 'var(--primary-color)' 
                : 'transparent',
              transition: 'all 0.2s'
            }}>
              {rememberMe && (
                <span className="k-icon k-i-check" style={{ 
                  color: 'white', 
                  fontSize: '12px'
                }}></span>
              )}
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <span style={{ 
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              Remember me
            </span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '14px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'default' : 'pointer',
            width: '100%',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 12px rgba(56, 128, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#2d6cd5';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
            }
          }}
        >
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></span>
              Signing in...
            </div>
          ) : 'Sign In'}
        </button>
      </form>
      
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DirectLoginForm; 
import React, { useEffect } from 'react';
import DirectLoginForm from './DirectLoginForm';

const LoginPage: React.FC = () => {
  // Add pulse animation styles to the head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Value proposition items
  const valueProps = [
    'Create engaging content with AI assistance in seconds',
    'Schedule posts across multiple platforms from one dashboard',
    'Analyze performance with advanced analytics and insights',
    'Optimize your social media strategy with real-time data'
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Left Branding Column */}
      <div
        style={{ 
          flex: '3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '40px 60px',
          background: 'linear-gradient(-45deg, #3880FF, #4B55E8, #8257E6, #00D1B2)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 1,
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 1,
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8V32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20Z" stroke="white" strokeWidth="3"/>
                  <path d="M20 4C20 2.89543 20.8954 2 22 2H22C23.1046 2 24 2.89543 24 4V8C24 9.10457 23.1046 10 22 10H22C20.8954 10 20 9.10457 20 8V4Z" fill="white"/>
                  <path d="M20 32C20 30.8954 20.8954 30 22 30H22C23.1046 30 24 30.8954 24 32V36C24 37.1046 23.1046 38 22 38H22C20.8954 38 20 37.1046 20 36V32Z" fill="white"/>
                  <path d="M4 20C2.89543 20 2 19.1046 2 18V18C2 16.8954 2.89543 16 4 16H8C9.10457 16 10 16.8954 10 18V18C10 19.1046 9.10457 20 8 20H4Z" fill="white"/>
                  <path d="M32 20C30.8954 20 30 19.1046 30 18V18C30 16.8954 30.8954 16 32 16H36C37.1046 16 38 16.8954 38 18V18C38 19.1046 37.1046 20 36 20H32Z" fill="white"/>
                </svg>
              </div>
              <span style={{ letterSpacing: '0.5px' }}>VibePilot</span>
            </div>
          </div>
          
          <h2 
            style={{ 
              fontSize: '28px', 
              fontWeight: 600, 
              marginBottom: '32px',
              lineHeight: '1.4',
              opacity: 0.95,
              maxWidth: '90%'
            }}
          >
            The intelligent social media command center for today's digital creators
          </h2>
          
          <div style={{ marginBottom: '40px' }}>
            {valueProps.map((prop, index) => (
              <div 
                key={index}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px',
                  marginBottom: '18px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <span className="k-icon k-i-check"></span>
                </span>
                <span style={{ fontSize: '18px', lineHeight: '1.5' }}>{prop}</span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '48px',
            padding: '20px 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '90%'
          }}>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontStyle: 'italic',
            }}>
              "VibePilot transformed our social media strategy. We've seen a 42% increase in engagement and saved 15 hours per week on content creation."
            </div>
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>SJ</div>
              <div>
                <div style={{ fontWeight: '600' }}>Sarah Johnson</div>
                <div style={{ fontSize: '14px', opacity: '0.8' }}>Marketing Director, Innovatech</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div 
        style={{ 
          flex: '2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div style={{ 
          width: '100%',
          maxWidth: '450px',
          padding: '32px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            marginBottom: '24px',
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            Welcome back!
          </h2>

          {/* Demo credentials notice */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'rgba(56, 128, 255, 0.08)',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(56, 128, 255, 0.2)'
          }}>
            <span className="k-icon k-i-info" style={{ flexShrink: 0, fontSize: '18px' }}></span>
            <span>Demo credentials are pre-filled. Click "Sign In" to explore the full platform.</span>
          </div>

          {/* Direct login form */}
          <DirectLoginForm />
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          © 2023 VibePilot. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
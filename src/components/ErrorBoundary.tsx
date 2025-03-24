import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { 
    hasError: false, 
    error: null, 
    errorInfo: null 
  };
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }
  
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: 'var(--error-color)', 
          color: 'white', 
          margin: '10px', 
          borderRadius: '4px',
          boxShadow: '0 4px 8px var(--shadow-color)',
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but an error occurred in this component.</p>
          <details style={{ 
            whiteSpace: 'pre-wrap', 
            marginTop: '20px',
            background: 'rgba(0,0,0,0.1)',
            padding: '10px',
            borderRadius: '4px'
          }}>
            <summary>Show error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary; 
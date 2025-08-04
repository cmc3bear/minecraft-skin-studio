/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    // Log to performance monitoring
    if (typeof window !== 'undefined' && (window as any).performanceMonitor) {
      (window as any).performanceMonitor.logError(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff4444',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          color: '#d32f2f',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
            😅 Oops! Something went wrong
          </h2>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
            We're sorry, but something unexpected happened. Don't worry - your work is safe!
          </p>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            🔄 Refresh Page
          </button>
          
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ↩️ Try Again
          </button>

          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '15px', fontSize: '12px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                🔧 Debug Info (Development Only)
              </summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontSize: '11px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTab?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sovereign View Error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="card card-gold-border"
          style={{
            maxWidth: '560px',
            margin: '40px auto',
            padding: '36px 28px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              margin: '0 auto 16px auto',
            }}
          >
            <AlertTriangle size={26} />
          </div>

          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '8px',
            }}
          >
            Module Telemetry Interrupted
          </h3>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              marginBottom: '20px',
            }}
          >
            A view runtime exception was safely intercepted. You can reload this view or return to your overview dashboard.
          </p>

          {this.state.error?.message && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '20px',
                textAlign: 'left',
                overflowX: 'auto',
              }}
            >
              {this.state.error.message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={this.handleReset}>
              <RotateCcw size={15} /> Retry Module
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
                if (this.props.onReset) this.props.onReset();
              }}
            >
              <Home size={15} /> Return to Overview
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-panel p-10 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-h2 font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-body text-muted-foreground">
              An unexpected error occurred. Try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 text-left text-xs bg-secondary/50 rounded-xl p-4 overflow-auto text-red-500 max-h-40">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6"
            >
              Try again
            </button>
            <a href="/" className="btn-secondary px-6">
              Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

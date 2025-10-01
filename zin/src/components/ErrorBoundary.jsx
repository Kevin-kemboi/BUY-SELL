import React from 'react';
import { Button } from './ui/button';
import { RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Store the error info for potential display
    this.setState({ errorInfo });
    
    // Only log detailed errors in development/debug
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optional: reload the page or component
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      // You can customize this fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 rounded-lg bg-dark-4/50 mx-auto max-w-2xl mt-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-2" />
          <h2 className="text-2xl font-semibold text-center">Oops! Something went wrong</h2>
          <p className="text-zinc-400 text-sm mb-4 text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>
          
          <div className="flex gap-3 mt-2">
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
            
            <Link to="/">
              <Button
                variant="default"
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          {/* Show error details in development only */}
          {import.meta.env.DEV && this.state.errorInfo && (
            <details className="mt-4 border border-zinc-700/50 p-3 rounded-md w-full max-w-lg">
              <summary className="text-sm text-zinc-400 cursor-pointer">Technical Details</summary>
              <pre className="mt-2 text-xs text-zinc-500 overflow-auto p-2 bg-dark-2 rounded max-h-[200px]">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorLogger } from '../utils/ErrorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ErrorLogger.log(error, {
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Er ging iets mis</h2>
          <details>
            <summary>Technical Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>Probeer Opnieuw</button>
          <button onClick={() => this.setState({ hasError: false })}>Ga Verder</button>
        </div>
      );
    }

    return this.props.children;
  }
}
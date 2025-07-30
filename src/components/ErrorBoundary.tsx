import { Component } from ‘react’;
import type { ErrorInfo, ReactNode } from ‘react’;
import { withTranslation, WithTranslation } from ‘react-i18next’;
import { ErrorLogger } from ‘../utils/ErrorLogger’;

interface Props extends WithTranslation {
children: ReactNode;
}

interface State {
hasError: boolean;
error: Error | null;
}

class ErrorBoundaryComponent extends Component<Props, State> {
public state: State = {
hasError: false,
error: null
};

public static getDerivedStateFromError(error: Error): State {
return { hasError: true, error };
}

public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
console.error(‘ErrorBoundary caught an error:’, error, errorInfo);

// Use your advanced ErrorLogger with rich context
ErrorLogger.log(error, { 
ErrorLogger.log(error, { 
  componentStack: errorInfo.componentStack,
  userAgent: navigator.userAgent,
  url: window.location.href,
  source: 'ErrorBoundary',
  severity: 'high',
  userId: 'anonymous',
  sessionId: Math.random().toString(36).substr(2, 9)
});

}

public render() {
const { t } = this.props;
if (this.state.hasError) {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <h2>{t('errors.somethingWentWrong')}</h2>
        <p>{t('errors.unexpectedErrorDescription')}</p>
        
        <details className="error-details">
          <summary>{t('errors.errorDetails')}</summary>
          <pre>{this.state.error?.toString()}</pre>
        </details>
        
        <div className="button-group">
          <button 
            className="btn btn-primary"
            onClick={() => {
              ErrorLogger.logAction('error_boundary_refresh', {
                errorName: this.state.error?.name,
                errorMessage: this.state.error?.message
              });
              window.location.reload();
            }}
          >
            {t('errors.refreshPage')}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              ErrorLogger.logAction('error_boundary_retry', {
                errorName: this.state.error?.name,
                errorMessage: this.state.error?.message
              });
              this.setState({ hasError: false, error: null });
            }}
          >
            {t('errors.tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}

return this.props.children;
```

}
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent);

// Error boundary component to catch and display React errors

import { Component, ErrorInfo, ReactNode } from 'react';
import { t } from '../i18n';
import type { Language } from '../types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Get language from localStorage (same logic as LanguageContext)
      const storedLanguage = localStorage.getItem('find-the-flag-language') as Language | null;
      const language: Language = storedLanguage || 'en';

      return (
        <div className="error-boundary">
          <h1 className="error-boundary__title">{t('error.title', language)}</h1>
          <p className="error-boundary__message">{t('error.message', language)}</p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="error-boundary__details">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="error-boundary__button"
            type="button"
            aria-label={t('error.reloadButton', language)}
          >
            {t('error.reloadButton', language)}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 m-4 rounded-2xl bg-red-50/50 border border-red-100 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
          <h2 className="text-sm font-bold text-red-900 mb-1">Failed to load component</h2>
          <p className="text-xs text-red-700 max-w-md">
            An unexpected error occurred. This could be due to parser drift or a temporary network issue. Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

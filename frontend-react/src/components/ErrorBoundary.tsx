import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, any render-time throw unmounts the whole tree and the user sees
 * a blank page with no way out. Keeps the failure visible and recoverable.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
              <p className="text-xs text-slate-500">The clinical view could not be rendered.</p>
            </div>
          </div>

          <pre className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 overflow-x-auto whitespace-pre-wrap">
            {error.message}
          </pre>

          <div className="mt-5 flex items-center justify-end space-x-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }
}

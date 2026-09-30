import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('💥 Uncaught UI Error in ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleResetToHome = () => {
    try {
      localStorage.setItem('weldor_active_view', 'public-home');
    } catch (e) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleGoToAdmin = () => {
    try {
      localStorage.setItem('weldor_active_view', 'crm-dashboard');
    } catch (e) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Platform View Recovered</h2>
                <p className="text-xs text-slate-400 font-mono">Automatic Diagnostic & Fallback Shield</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A temporary rendering exception was safely caught. The application state has been preserved and you can instantly return to the homepage or administrative command center.
            </p>

            {this.state.error && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-mono text-[11px] overflow-x-auto max-h-36">
                <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
                {this.state.error.stack && (
                  <p className="text-[10px] text-slate-500 mt-1 whitespace-pre-wrap">{this.state.error.stack.split('\n').slice(0, 3).join('\n')}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleResetToHome}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>

              <button
                onClick={this.handleGoToAdmin}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-600 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <span>Open Admin Portal</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold mb-4 text-[#C6FF00]">
              ¡Ups! Algo salió mal
            </h1>
            <p className="text-gray-300 mb-6">
              Ha ocurrido un error inesperado. No te preocupes, nuestros desarrolladores ya están trabajando en solucionarlo.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-[#C6FF00] text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Volver al inicio
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-[#C6FF00] mb-2">
                  Detalles del error (solo desarrollo)
                </summary>
                <pre className="bg-gray-800 p-4 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
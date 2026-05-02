import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="glass rounded-2xl p-10 max-w-lg w-full text-center animate-fade-in">
            {/* Glitch icon */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto">
                <span className="text-4xl">⚠️</span>
              </div>
              <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping" />
            </div>

            <h2 className="font-display text-4xl text-gradient mb-2">SOMETHING BROKE</h2>
            <p className="text-white/50 text-sm mb-6 font-mono">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            {this.props.showDetails && this.state.errorInfo && (
              <details className="text-left mb-6">
                <summary className="text-white/40 text-xs cursor-pointer hover:text-white/60 mb-2">
                  Technical details
                </summary>
                <pre className="bg-dark-700 rounded-lg p-4 text-xs text-white/50 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="brand-gradient text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-dark-600 text-white/70 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-dark-500 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for simple use
export function withErrorBoundary(Component, fallbackProps = {}) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...fallbackProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

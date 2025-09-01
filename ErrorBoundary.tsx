'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { monitoringService } from '@/lib/monitoring'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId?: string
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    const errorId = monitoringService.logError({
      category: 'ui',
      message: error.message,
      stack: error.stack,
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
    })

    this.setState({
      error,
      errorInfo,
      errorId
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined })
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString()
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      alert('Error details copied to clipboard!')
    } else {
      console.log('Error details:', errorDetails)
      alert('Error details logged to console')
    }
  }

  public render() {
    if (this.state.hasError) {
      // Return custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                🔥 Forge Malfunction Detected! ⚒️
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Our fitness forge encountered an unexpected issue. Don't worry - your progress is safe!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              {this.state.errorId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Error ID:</strong>{' '}
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">
                      {this.state.errorId}
                    </code>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Share this ID with support if you need assistance.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Technical Details:</h3>
                  <p className="text-sm text-red-700 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Recovery Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What you can do:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={this.handleRetry}
                    className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </Button>
                  
                  <Button 
                    onClick={this.handleReload}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reload Page</span>
                  </Button>
                  
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Go Home</span>
                  </Button>
                  
                  <Button 
                    onClick={this.copyErrorDetails}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Bug className="h-4 w-4" />
                    <span>Copy Error Details</span>
                  </Button>
                </div>
              </div>

              {/* Helpful Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Fixes:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Check your internet connection</li>
                  <li>• Try using a different browser</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>

              {/* Support Contact */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team at{' '}
                  <a 
                    href="mailto:support@fitforge.com" 
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    support@fitforge.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for reporting errors manually
export function useErrorHandler() {
  return (error: Error, category: 'ui' | 'api' | 'performance' = 'ui', metadata?: Record<string, any>) => {
    const errorId = monitoringService.logError({
      category,
      message: error.message,
      stack: error.stack,
      metadata: {
        ...metadata,
        reportedManually: true,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
    })

    console.error(`Error reported (${errorId}):`, error)
    return errorId
  }
}

// Specialized error boundaries for different sections
export function WorkoutErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Workout System Error</h3>
            <p className="text-gray-600 text-sm mb-4">
              The workout system encountered an issue. Your progress is saved.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart Workout System
            </Button>
          </CardContent>
        </Card>
      }
      onError={(error, errorInfo) => {
        monitoringService.logError({
          category: 'workout',
          message: error.message,
          stack: error.stack,
          metadata: {
            componentStack: errorInfo.componentStack,
            section: 'workout'
          }
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function ForgeErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">3D Forge Error</h3>
            <p className="text-gray-600 text-sm mb-4">
              The 3D forge system encountered a rendering issue.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart Forge
            </Button>
          </CardContent>
        </Card>
      }
      onError={(error, errorInfo) => {
        monitoringService.logError({
          category: 'ui',
          message: error.message,
          stack: error.stack,
          metadata: {
            componentStack: errorInfo.componentStack,
            section: '3d_forge',
            webgl: typeof WebGL2RenderingContext !== 'undefined'
          }
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

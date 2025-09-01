// Production monitoring and error tracking system
import { authService, type User } from './auth'

export interface ErrorEvent {
  id: string
  userId?: string
  timestamp: Date
  level: 'error' | 'warning' | 'info' | 'debug'
  category: 'authentication' | 'workout' | 'api' | 'ui' | 'performance' | 'payment'
  message: string
  stack?: string
  metadata?: Record<string, any>
  userAgent?: string
  url?: string
  resolved: boolean
}

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  timestamp: Date
  category: 'api' | 'ui' | 'database' | 'external'
  metadata?: Record<string, any>
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  timestamp: Date
  details?: Record<string, any>
}

class MonitoringService {
  private errors: Map<string, ErrorEvent> = new Map()
  private metrics: PerformanceMetric[] = []
  private healthChecks: Map<string, HealthCheck> = new Map()
  private alertThresholds = {
    errorRate: 0.05, // 5% error rate threshold
    responseTime: 2000, // 2 second response time threshold
    memoryUsage: 0.85 // 85% memory usage threshold
  }

  // Error tracking
  logError(error: {
    userId?: string
    category: ErrorEvent['category']
    message: string
    stack?: string
    metadata?: Record<string, any>
    level?: ErrorEvent['level']
  }) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const errorEvent: ErrorEvent = {
      id: errorId,
      userId: error.userId,
      timestamp: new Date(),
      level: error.level || 'error',
      category: error.category,
      message: error.message,
      stack: error.stack,
      metadata: error.metadata,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      resolved: false
    }

    this.errors.set(errorId, errorEvent)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${errorEvent.category}] ${errorEvent.message}`, errorEvent)
    }

    // In production, send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorEvent)
    }

    // Check if alert should be triggered
    this.checkAlertThresholds()

    return errorId
  }

  // Performance monitoring
  trackPerformance(metric: {
    name: string
    value: number
    category: PerformanceMetric['category']
    metadata?: Record<string, any>
  }) {
    const performanceMetric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: metric.name,
      value: metric.value,
      timestamp: new Date(),
      category: metric.category,
      metadata: metric.metadata
    }

    this.metrics.push(performanceMetric)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Check performance thresholds
    if (metric.value > this.alertThresholds.responseTime && metric.category === 'api') {
      this.logError({
        category: 'performance',
        message: `Slow API response: ${metric.name} took ${metric.value}ms`,
        level: 'warning',
        metadata: { metric }
      })
    }

    return performanceMetric.id
  }

  // Health checks
  async performHealthCheck(service: string): Promise<HealthCheck> {
    const startTime = Date.now()
    let status: HealthCheck['status'] = 'healthy'
    const details: Record<string, any> = {}

    try {
      switch (service) {
        case 'auth':
          // Check auth service
          await authService.getUserById('demo-user-1')
          details.users = Array.from((authService as any).users.size || 0)
          break
          
        case 'database':
          // In production, check database connection
          details.connectionPool = 'available'
          details.queryTime = Math.random() * 100
          break
          
        case 'external_apis':
          // Check external API dependencies
          const response = await fetch('https://httpbin.org/status/200', { 
            signal: AbortSignal.timeout(5000) 
          })
          if (!response.ok) status = 'degraded'
          break
          
        case 'memory':
          // Check memory usage (Node.js specific)
          if (typeof process !== 'undefined' && process.memoryUsage) {
            const memUsage = process.memoryUsage()
            const usagePercent = memUsage.heapUsed / memUsage.heapTotal
            details.memoryUsage = {
              heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
              heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
              usagePercent: Math.round(usagePercent * 100)
            }
            if (usagePercent > this.alertThresholds.memoryUsage) {
              status = 'degraded'
            }
          }
          break
          
        default:
          status = 'healthy'
      }
    } catch (error) {
      status = 'unhealthy'
      details.error = error instanceof Error ? error.message : 'Unknown error'
    }

    const responseTime = Date.now() - startTime
    
    const healthCheck: HealthCheck = {
      service,
      status,
      responseTime,
      timestamp: new Date(),
      details
    }

    this.healthChecks.set(service, healthCheck)
    
    return healthCheck
  }

  // Get system health overview
  async getSystemHealth(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: HealthCheck[]
    errors: {
      recent: number
      rate: number
      critical: number
    }
    performance: {
      avgApiResponseTime: number
      peakMemoryUsage: number
    }
  }> {
    // Perform health checks for all services
    const services = ['auth', 'database', 'external_apis', 'memory']
    const healthChecks = await Promise.all(
      services.map(service => this.performHealthCheck(service))
    )

    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (healthChecks.some(check => check.status === 'unhealthy')) {
      overall = 'unhealthy'
    } else if (healthChecks.some(check => check.status === 'degraded')) {
      overall = 'degraded'
    }

    // Error analysis
    const recentErrors = Array.from(this.errors.values())
      .filter(error => error.timestamp > new Date(Date.now() - 60 * 60 * 1000)) // Last hour
    const criticalErrors = recentErrors.filter(error => error.level === 'error')
    const errorRate = recentErrors.length / 100 // Simplified error rate

    // Performance analysis
    const recentMetrics = this.metrics.filter(metric => 
      metric.timestamp > new Date(Date.now() - 60 * 60 * 1000) && 
      metric.category === 'api'
    )
    const avgApiResponseTime = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, metric) => sum + metric.value, 0) / recentMetrics.length 
      : 0

    const memoryMetrics = this.metrics.filter(metric => metric.name.includes('memory'))
    const peakMemoryUsage = memoryMetrics.length > 0
      ? Math.max(...memoryMetrics.map(m => m.value))
      : 0

    return {
      overall,
      services: healthChecks,
      errors: {
        recent: recentErrors.length,
        rate: errorRate,
        critical: criticalErrors.length
      },
      performance: {
        avgApiResponseTime,
        peakMemoryUsage
      }
    }
  }

  // Get error analytics
  getErrorAnalytics(timeframe: 'hour' | 'day' | 'week' = 'day') {
    const timeMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[timeframe]

    const cutoff = new Date(Date.now() - timeMs)
    const recentErrors = Array.from(this.errors.values())
      .filter(error => error.timestamp > cutoff)

    // Group by category
    const byCategory = recentErrors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group by level
    const byLevel = recentErrors.reduce((acc, error) => {
      acc[error.level] = (acc[error.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top error messages
    const topErrors = recentErrors
      .reduce((acc, error) => {
        const key = error.message.substring(0, 100) // Truncate long messages
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const sortedTopErrors = Object.entries(topErrors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }))

    return {
      total: recentErrors.length,
      byCategory,
      byLevel,
      topErrors: sortedTopErrors,
      timeline: this.generateErrorTimeline(recentErrors, timeframe)
    }
  }

  private generateErrorTimeline(errors: ErrorEvent[], timeframe: string) {
    const bucketSize = {
      hour: 5 * 60 * 1000, // 5 minutes
      day: 60 * 60 * 1000, // 1 hour
      week: 24 * 60 * 60 * 1000 // 1 day
    }[timeframe]

    const buckets: Record<string, number> = {}
    const now = Date.now()

    errors.forEach(error => {
      const bucketKey = Math.floor(error.timestamp.getTime() / bucketSize) * bucketSize
      const bucketDate = new Date(bucketKey).toISOString()
      buckets[bucketDate] = (buckets[bucketDate] || 0) + 1
    })

    return Object.entries(buckets)
      .map(([timestamp, count]) => ({ timestamp, count }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }

  // User activity tracking
  trackUserActivity(userId: string, activity: {
    type: 'login' | 'workout_start' | 'workout_complete' | 'purchase' | 'achievement'
    metadata?: Record<string, any>
  }) {
    this.trackPerformance({
      name: `user_activity_${activity.type}`,
      value: 1,
      category: 'ui',
      metadata: {
        userId,
        activityType: activity.type,
        ...activity.metadata
      }
    })
  }

  // API performance decorator
  withPerformanceTracking<T>(
    name: string, 
    category: PerformanceMetric['category'] = 'api'
  ) {
    return async (fn: () => Promise<T>): Promise<T> => {
      const startTime = Date.now()
      try {
        const result = await fn()
        const duration = Date.now() - startTime
        
        this.trackPerformance({
          name,
          value: duration,
          category,
          metadata: { success: true }
        })
        
        return result
      } catch (error) {
        const duration = Date.now() - startTime
        
        this.trackPerformance({
          name,
          value: duration,
          category,
          metadata: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        })

        this.logError({
          category: category as ErrorEvent['category'],
          message: `${name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          stack: error instanceof Error ? error.stack : undefined,
          metadata: { duration }
        })
        
        throw error
      }
    }
  }

  private checkAlertThresholds() {
    // Simplified alerting logic
    const recentErrors = Array.from(this.errors.values())
      .filter(error => error.timestamp > new Date(Date.now() - 5 * 60 * 1000)) // Last 5 minutes

    if (recentErrors.length > 10) {
      console.warn('High error rate detected:', recentErrors.length, 'errors in 5 minutes')
      // In production, send alert to monitoring service
    }
  }

  private async sendToMonitoringService(error: ErrorEvent) {
    // In production, send to services like Sentry, DataDog, or custom monitoring
    // For now, we'll just log it
    try {
      // Example: await fetch('/api/monitoring/errors', { method: 'POST', body: JSON.stringify(error) })
      console.log('Would send error to monitoring service:', error.id)
    } catch (err) {
      console.error('Failed to send error to monitoring service:', err)
    }
  }

  // Clean up old data
  cleanup() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    // Clean up old errors
    for (const [id, error] of this.errors.entries()) {
      if (error.timestamp < oneWeekAgo) {
        this.errors.delete(id)
      }
    }

    // Clean up old metrics
    this.metrics = this.metrics.filter(metric => metric.timestamp > oneWeekAgo)
  }

  // Export data for analysis
  exportData(type: 'errors' | 'metrics' | 'health') {
    switch (type) {
      case 'errors':
        return Array.from(this.errors.values())
      case 'metrics':
        return this.metrics
      case 'health':
        return Array.from(this.healthChecks.values())
    }
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService()

// Utility functions for React components
export const useErrorHandler = () => {
  return (error: Error, category: ErrorEvent['category'], metadata?: Record<string, any>) => {
    monitoringService.logError({
      category,
      message: error.message,
      stack: error.stack,
      metadata
    })
  }
}

// Performance monitoring hook for React components
export const usePerformanceMonitor = (componentName: string) => {
  return {
    trackRender: (renderTime: number) => {
      monitoringService.trackPerformance({
        name: `component_render_${componentName}`,
        value: renderTime,
        category: 'ui'
      })
    },
    trackInteraction: (interactionType: string, duration: number) => {
      monitoringService.trackPerformance({
        name: `component_interaction_${componentName}_${interactionType}`,
        value: duration,
        category: 'ui'
      })
    }
  }
}

// Automatic cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    monitoringService.cleanup()
  }, 60 * 60 * 1000) // 1 hour
}

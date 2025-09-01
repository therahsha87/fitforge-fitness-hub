import { NextRequest, NextResponse } from 'next/server'
import { monitoringService } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Get system health
    const health = await monitoringService.getSystemHealth()
    
    const responseTime = Date.now() - startTime

    // Return health status with appropriate HTTP status code
    const httpStatus = health.overall === 'healthy' ? 200 : 
                      health.overall === 'degraded' ? 503 : 
                      503

    return NextResponse.json({
      status: health.overall,
      timestamp: new Date().toISOString(),
      responseTime,
      services: health.services.map(service => ({
        name: service.service,
        status: service.status,
        responseTime: service.responseTime,
        lastCheck: service.timestamp,
        details: service.details
      })),
      metrics: {
        errors: health.errors,
        performance: health.performance
      },
      uptime: process.uptime ? Math.floor(process.uptime()) : null
    }, { status: httpStatus })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

// Simple liveness probe
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

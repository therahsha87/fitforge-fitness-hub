import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { monitoringService } from '@/lib/monitoring'
import { z } from 'zod'

const errorReportSchema = z.object({
  category: z.enum(['authentication', 'workout', 'api', 'ui', 'performance', 'payment']),
  message: z.string().min(1).max(1000),
  level: z.enum(['error', 'warning', 'info', 'debug']).optional(),
  stack: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  url: z.string().optional()
})

const errorQuerySchema = z.object({
  timeframe: z.enum(['hour', 'day', 'week']).optional().default('day'),
  category: z.enum(['authentication', 'workout', 'api', 'ui', 'performance', 'payment']).optional(),
  level: z.enum(['error', 'warning', 'info', 'debug']).optional(),
  limit: z.coerce.number().min(1).max(1000).optional().default(50)
})

// POST - Report an error
export async function POST(request: NextRequest) {
  try {
    // Authentication is optional for error reporting to catch auth errors
    const user = await authenticateRequest(request).catch(() => null)
    
    const body = await request.json()
    const errorData = errorReportSchema.parse(body)
    
    const errorId = monitoringService.logError({
      userId: user?.id,
      category: errorData.category,
      message: errorData.message,
      level: errorData.level,
      stack: errorData.stack,
      metadata: {
        ...errorData.metadata,
        reportedViaAPI: true,
        clientUserAgent: errorData.userAgent,
        clientUrl: errorData.url
      }
    })

    return NextResponse.json({
      success: true,
      errorId,
      message: 'Error reported successfully'
    })

  } catch (error) {
    console.error('Error reporting failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    // Don't fail error reporting due to errors in error reporting!
    return NextResponse.json({
      success: false,
      error: 'Failed to report error'
    }, { status: 500 })
  }
}

// GET - Retrieve error analytics (admin only in production)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // In production, add admin role check
    // if (!user.roles?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const query = errorQuerySchema.parse({
      timeframe: searchParams.get('timeframe'),
      category: searchParams.get('category'),
      level: searchParams.get('level'),
      limit: searchParams.get('limit')
    })

    const analytics = monitoringService.getErrorAnalytics(query.timeframe)

    // Filter by category and level if specified
    let filteredErrors = monitoringService.exportData('errors')
    
    if (query.category) {
      filteredErrors = filteredErrors.filter(error => error.category === query.category)
    }
    
    if (query.level) {
      filteredErrors = filteredErrors.filter(error => error.level === query.level)
    }

    // Sort by timestamp (newest first) and limit
    const recentErrors = filteredErrors
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, query.limit)
      .map(error => ({
        id: error.id,
        timestamp: error.timestamp,
        category: error.category,
        level: error.level,
        message: error.message,
        userId: error.userId,
        metadata: error.metadata,
        resolved: error.resolved
      }))

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        filters: query
      },
      recentErrors,
      metadata: {
        totalErrors: filteredErrors.length,
        timeframe: query.timeframe,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error analytics retrieval failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to retrieve error analytics' },
      { status: 500 }
    )
  }
}

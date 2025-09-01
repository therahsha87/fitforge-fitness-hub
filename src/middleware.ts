import { NextRequest, NextResponse } from 'next/server'
import { monitoringService } from '@/lib/monitoring'

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

// Rate limiting configurations for different endpoints
const rateLimits: Record<string, RateLimitConfig> = {
  '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 registrations per hour
  '/api/workouts/complete': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 workouts per minute
  '/api/store/purchase': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 purchases per minute
  '/api/monitoring/errors': { windowMs: 60 * 1000, maxRequests: 100 }, // 100 error reports per minute
  'default': { windowMs: 60 * 1000, maxRequests: 60 } // 60 requests per minute default
}

function getRateLimitKey(request: NextRequest): string {
  // In production, consider using user ID for authenticated requests
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}_${userAgent.substring(0, 50)}`
}

function checkRateLimit(request: NextRequest): { allowed: boolean; resetTime?: number } {
  const pathname = request.nextUrl.pathname
  const key = getRateLimitKey(request)
  
  // Find matching rate limit config
  let config = rateLimits.default
  for (const [path, pathConfig] of Object.entries(rateLimits)) {
    if (path !== 'default' && pathname.startsWith(path)) {
      config = pathConfig
      break
    }
  }

  const now = Date.now()
  const rateLimitKey = `${key}_${pathname}`
  const existing = rateLimitStore.get(rateLimitKey)

  if (!existing || now > existing.resetTime) {
    // Reset or create new window
    const resetTime = now + config.windowMs
    rateLimitStore.set(rateLimitKey, { count: 1, resetTime })
    return { allowed: true, resetTime }
  }

  if (existing.count >= config.maxRequests) {
    return { allowed: false, resetTime: existing.resetTime }
  }

  // Increment counter
  existing.count++
  rateLimitStore.set(rateLimitKey, existing)
  return { allowed: true, resetTime: existing.resetTime }
}

function getClientInfo(request: NextRequest) {
  return {
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
    country: request.headers.get('cf-ipcountry') || 'unknown', // Cloudflare header
    city: request.headers.get('cf-ipcity') || 'unknown' // Cloudflare header
  }
}

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and images
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/static/') ||
      pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2)$/)) {
    return NextResponse.next()
  }

  // Security headers
  const response = NextResponse.next()
  
  // Basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HSTS for HTTPS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // CSP for additional security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Three.js needs eval
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  // API routes security and rate limiting
  if (pathname.startsWith('/api/')) {
    const clientInfo = getClientInfo(request)
    
    // Rate limiting
    const rateLimit = checkRateLimit(request)
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime! - Date.now()) / 1000)
      
      monitoringService.logError({
        category: 'api',
        message: 'Rate limit exceeded',
        level: 'warning',
        metadata: {
          pathname,
          clientInfo,
          retryAfter
        }
      })

      return NextResponse.json(
        { 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimits[pathname]?.maxRequests.toString() || '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime!.toString()
          }
        }
      )
    }

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', rateLimits[pathname]?.maxRequests.toString() || '60')
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime!.toString())

    // Request validation for API routes
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      const contentType = request.headers.get('content-type')
      
      // Ensure JSON endpoints receive proper content type
      if (pathname.startsWith('/api/') && 
          !pathname.includes('/monitoring/') &&
          (!contentType || !contentType.includes('application/json'))) {
        
        return NextResponse.json(
          { error: 'Content-Type must be application/json' },
          { status: 400 }
        )
      }
    }

    // Block suspicious requests
    const userAgent = request.headers.get('user-agent') || ''
    const suspiciousPatterns = ['sqlmap', 'nmap', 'nikto', 'masscan', 'zgrab']
    
    if (suspiciousPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      monitoringService.logError({
        category: 'api',
        message: 'Suspicious request blocked',
        level: 'warning',
        metadata: {
          pathname,
          userAgent,
          clientInfo
        }
      })

      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Track API performance
    const responseTime = Date.now() - startTime
    monitoringService.trackPerformance({
      name: `middleware_${pathname.replace(/\/api\//, '').replace(/\//g, '_')}`,
      value: responseTime,
      category: 'api',
      metadata: {
        method: request.method,
        pathname,
        clientInfo: {
          ip: clientInfo.ip,
          country: clientInfo.country
        }
      }
    })
  }

  // CORS handling for API routes
  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    })
  }

  // Add CORS headers for API responses
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Clean up old rate limit entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000) // Clean up every 5 minutes
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

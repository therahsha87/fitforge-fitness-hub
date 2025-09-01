import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fitnessProfile: z.object({
    height: z.number().min(100).max(300).optional(),
    weight: z.number().min(30).max(300).optional(),
    goals: z.array(z.string()).optional(),
    experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    preferences: z.object({
      workoutTypes: z.array(z.string()).optional(),
      equipment: z.array(z.string()).optional(),
      timeAvailable: z.number().min(15).max(180).optional()
    }).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Create user
    const user = await authService.createUser(validatedData)
    
    // Auto-login after registration
    const session = await authService.login(validatedData.email, validatedData.password)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Registration succeeded but login failed' },
        { status: 500 }
      )
    }

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        level: session.user.level,
        xp: session.user.xp,
        subscription: session.user.subscription,
        stats: session.user.stats,
        fitnessProfile: session.user.fitnessProfile
      },
      message: 'Welcome to FitForge! Your fitness journey begins now! 🔥'
    })

    // Set auth cookie
    response.cookies.set('fitforge_auth', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

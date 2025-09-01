import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Attempt login
    const session = await authService.login(validatedData.email, validatedData.password)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
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
      }
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
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

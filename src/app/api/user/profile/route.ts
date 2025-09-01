import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, authService } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
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

// GET current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        subscription: user.subscription,
        stats: user.stats,
        fitnessProfile: user.fitnessProfile,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)
    
    const updatedUser = await authService.updateUserProfile(user.id, validatedData.fitnessProfile || {})
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        level: updatedUser.level,
        xp: updatedUser.xp,
        subscription: updatedUser.subscription,
        stats: updatedUser.stats,
        fitnessProfile: updatedUser.fitnessProfile
      },
      message: 'Profile updated successfully! 💪'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

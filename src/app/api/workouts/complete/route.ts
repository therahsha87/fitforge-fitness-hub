import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, authService } from '@/lib/auth'
import { realtimeService } from '@/lib/realtime'
import { z } from 'zod'

const completeWorkoutSchema = z.object({
  workoutType: z.enum(['strength', 'cardio', 'flexibility', 'hiit']),
  duration: z.number().min(1).max(300), // 1-300 minutes
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number().min(1).optional(),
    reps: z.number().min(1).optional(),
    weight: z.number().min(0).optional(),
    duration: z.number().min(1).optional() // duration in seconds
  })),
  caloriesBurned: z.number().min(1).max(2000),
  intensityLevel: z.enum(['low', 'moderate', 'high', 'extreme']),
  notes: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const workoutData = completeWorkoutSchema.parse(body)
    
    // Calculate XP based on workout intensity and duration
    const baseXP = workoutData.duration * 2 // 2 XP per minute
    const intensityMultiplier = {
      low: 1,
      moderate: 1.2,
      high: 1.5,
      extreme: 2.0
    }[workoutData.intensityLevel]
    
    const workoutXP = Math.floor(baseXP * intensityMultiplier)
    
    // Calculate material rewards based on workout type
    const materialRewards: Record<string, number> = {}
    switch (workoutData.workoutType) {
      case 'strength':
        materialRewards['strength_essence'] = Math.floor(workoutData.duration / 10) + 1
        materialRewards['protein_crystal'] = Math.floor(workoutData.caloriesBurned / 100)
        break
      case 'cardio':
        materialRewards['cardio_energy'] = Math.floor(workoutData.duration / 8) + 1
        materialRewards['recovery_aura'] = Math.floor(workoutData.caloriesBurned / 150)
        break
      case 'flexibility':
        materialRewards['flexibility_flow'] = Math.floor(workoutData.duration / 12) + 1
        materialRewards['recovery_aura'] = Math.floor(workoutData.duration / 15)
        break
      case 'hiit':
        materialRewards['strength_essence'] = Math.floor(workoutData.duration / 15)
        materialRewards['cardio_energy'] = Math.floor(workoutData.duration / 12)
        materialRewards['motivation_spark'] = workoutData.intensityLevel === 'extreme' ? 1 : 0
        break
    }

    // Rare material chance (5% base, increases with intensity)
    const rareChance = {
      low: 0.05,
      moderate: 0.08,
      high: 0.12,
      extreme: 0.20
    }[workoutData.intensityLevel]

    if (Math.random() < rareChance) {
      materialRewards['motivation_spark'] = (materialRewards['motivation_spark'] || 0) + 1
    }

    // Legendary material chance for extreme workouts (2%)
    if (workoutData.intensityLevel === 'extreme' && Math.random() < 0.02) {
      materialRewards['discipline_core'] = (materialRewards['discipline_core'] || 0) + 1
    }

    // Update user stats
    const statUpdates = {
      workoutsCompleted: user.stats.workoutsCompleted + 1,
      totalCaloriesBurned: user.stats.totalCaloriesBurned + workoutData.caloriesBurned,
      materialsCollected: {
        ...user.stats.materialsCollected,
        ...Object.fromEntries(
          Object.entries(materialRewards).map(([material, amount]) => [
            material,
            (user.stats.materialsCollected[material] || 0) + amount
          ])
        )
      }
    }

    // Check for streak continuation (simplified logic)
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    // In production, you'd track last workout date properly
    if (Math.random() > 0.3) { // 70% chance to continue streak
      statUpdates.streakDays = user.stats.streakDays + 1
    }

    const updatedUser = await authService.updateUserStats(user.id, statUpdates)
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update workout stats' },
        { status: 500 }
      )
    }

    // Create workout session for realtime tracking
    const workoutSession = realtimeService.startWorkoutSession(user.id, workoutData.workoutType)
    const completedSession = realtimeService.completeWorkoutSession(
      workoutSession.id,
      workoutData.exercises,
      workoutData.caloriesBurned
    )

    // Check for streak milestones
    if (statUpdates.streakDays > user.stats.streakDays) {
      realtimeService.createStreakMilestone(user.id, statUpdates.streakDays)
    }

    // Calculate achievements earned this workout
    const achievements: string[] = []
    
    // First workout achievement
    if (user.stats.workoutsCompleted === 0) {
      achievements.push('first_workout')
    }
    
    // Calorie milestones
    if (workoutData.caloriesBurned >= 500 && !user.stats.achievementsUnlocked.includes('calorie_crusher')) {
      achievements.push('calorie_crusher')
    }
    
    // Workout count milestones
    const workoutMilestones = [5, 10, 25, 50, 100, 250, 500]
    const newWorkoutCount = user.stats.workoutsCompleted + 1
    if (workoutMilestones.includes(newWorkoutCount)) {
      achievements.push(`workout_milestone_${newWorkoutCount}`)
    }
    
    // Streak achievements
    const streakMilestones = [7, 14, 30, 60, 100]
    if (streakMilestones.includes(statUpdates.streakDays)) {
      achievements.push(`streak_milestone_${statUpdates.streakDays}`)
    }

    // Calculate level progression
    const oldLevel = user.level
    const newLevel = updatedUser.level
    const leveledUp = newLevel > oldLevel

    return NextResponse.json({
      success: true,
      workout: {
        ...workoutData,
        xpEarned: workoutXP,
        materialsEarned: materialRewards,
        achievements,
        sessionId: completedSession?.id
      },
      user: {
        id: updatedUser.id,
        level: updatedUser.level,
        xp: updatedUser.xp,
        stats: updatedUser.stats
      },
      rewards: {
        xp: workoutXP,
        materials: materialRewards,
        achievements,
        levelUp: leveledUp ? {
          oldLevel,
          newLevel,
          bonusRewards: {
            materials: {
              'motivation_spark': 1,
              'strength_essence': 2,
              'cardio_energy': 2
            }
          }
        } : null
      },
      message: `Amazing workout! You earned ${workoutXP} XP and forged some epic materials! 🔥💪`
    })
  } catch (error) {
    console.error('Complete workout error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to complete workout' },
      { status: 500 }
    )
  }
}

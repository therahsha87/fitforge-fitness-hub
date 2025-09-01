import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, authService } from '@/lib/auth'
import { realtimeService } from '@/lib/realtime'
import { z } from 'zod'

const analyticsQuerySchema = z.object({
  timeframe: z.enum(['week', 'month', 'quarter', 'year']).optional().default('month'),
  metrics: z.array(z.enum(['workouts', 'calories', 'materials', 'achievements', 'social'])).optional()
})

interface WorkoutAnalytics {
  date: string
  workouts: number
  calories: number
  duration: number
  intensity: number
  type: Record<string, number>
}

interface MaterialAnalytics {
  material: string
  collected: number
  used: number
  net: number
  trend: 'up' | 'down' | 'stable'
}

interface SocialAnalytics {
  challengesParticipated: number
  challengesWon: number
  leaderboardPosition: number
  streakDays: number
  friendsActive: number
}

// In production, this would query from a time-series database
class AnalyticsService {
  private generateWorkoutTrend(userId: string, days: number): WorkoutAnalytics[] {
    const analytics: WorkoutAnalytics[] = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Simulate workout data with some realistic patterns
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isMonday = dayOfWeek === 1
      
      let workouts = 0
      let calories = 0
      let duration = 0
      const typeDistribution: Record<string, number> = {}
      
      // Simulate workout frequency based on day patterns
      const workoutProbability = isWeekend ? 0.4 : isMonday ? 0.8 : 0.6
      
      if (Math.random() < workoutProbability) {
        workouts = Math.random() < 0.3 ? 2 : 1 // 30% chance of 2 workouts
        calories = 200 + Math.floor(Math.random() * 400)
        duration = 30 + Math.floor(Math.random() * 60)
        
        // Workout type distribution
        const workoutTypes = ['strength', 'cardio', 'flexibility', 'hiit']
        const primaryType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)]
        typeDistribution[primaryType] = workouts
      }
      
      analytics.push({
        date: date.toISOString().split('T')[0],
        workouts,
        calories,
        duration,
        intensity: workouts > 0 ? Math.floor(Math.random() * 4) + 1 : 0, // 1-4 intensity
        type: typeDistribution
      })
    }
    
    return analytics
  }

  private generateMaterialTrend(userId: string): MaterialAnalytics[] {
    const materials = [
      'strength_essence',
      'cardio_energy',
      'flexibility_flow',
      'protein_crystal',
      'recovery_aura',
      'motivation_spark',
      'discipline_core'
    ]
    
    return materials.map(material => {
      const collected = Math.floor(Math.random() * 50) + 10
      const used = Math.floor(Math.random() * collected)
      const net = collected - used
      
      // Simple trend calculation
      const previousNet = Math.floor(Math.random() * 30)
      const trend = net > previousNet + 5 ? 'up' : net < previousNet - 5 ? 'down' : 'stable'
      
      return {
        material,
        collected,
        used,
        net,
        trend: trend as 'up' | 'down' | 'stable'
      }
    })
  }

  private calculateInsights(workoutTrend: WorkoutAnalytics[], user: any): any {
    const insights = []
    
    // Workout frequency insight
    const recentWorkouts = workoutTrend.slice(-7).reduce((sum, day) => sum + day.workouts, 0)
    const avgWorkouts = recentWorkouts / 7
    
    if (avgWorkouts >= 1) {
      insights.push({
        type: 'success',
        title: 'Consistent Training',
        message: `You're averaging ${avgWorkouts.toFixed(1)} workouts per day this week! 🔥`,
        icon: 'trending_up'
      })
    } else if (avgWorkouts < 0.5) {
      insights.push({
        type: 'warning',
        title: 'Training Opportunity',
        message: 'Your workout frequency has decreased. Time to heat up that forge again! ⚒️',
        icon: 'trending_down'
      })
    }

    // Best workout day insight
    const dayPerformance = workoutTrend.reduce((acc, day) => {
      const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'long' })
      if (!acc[dayName]) acc[dayName] = { workouts: 0, calories: 0, count: 0 }
      acc[dayName].workouts += day.workouts
      acc[dayName].calories += day.calories
      acc[dayName].count += 1
      return acc
    }, {} as Record<string, { workouts: number; calories: number; count: number }>)

    const bestDay = Object.entries(dayPerformance)
      .map(([day, stats]) => ({
        day,
        avgWorkouts: stats.workouts / stats.count,
        avgCalories: stats.calories / stats.count
      }))
      .sort((a, b) => b.avgWorkouts - a.avgWorkouts)[0]

    if (bestDay) {
      insights.push({
        type: 'info',
        title: `${bestDay.day} Power Day`,
        message: `${bestDay.day}s are your strongest! You average ${bestDay.avgWorkouts.toFixed(1)} workouts and ${Math.floor(bestDay.avgCalories)} calories burned.`,
        icon: 'calendar'
      })
    }

    // Calorie burn insight
    const totalCalories = workoutTrend.reduce((sum, day) => sum + day.calories, 0)
    const avgDailyCalories = totalCalories / workoutTrend.length
    
    if (avgDailyCalories >= 300) {
      insights.push({
        type: 'success',
        title: 'Calorie Crushing Machine',
        message: `You're burning an average of ${Math.floor(avgDailyCalories)} calories per day! 💪`,
        icon: 'fire'
      })
    }

    // Workout variety insight
    const allTypes = workoutTrend.reduce((acc, day) => {
      Object.keys(day.type).forEach(type => {
        acc.add(type)
      })
      return acc
    }, new Set<string>())

    if (allTypes.size >= 3) {
      insights.push({
        type: 'success',
        title: 'Workout Variety Master',
        message: `You're training ${allTypes.size} different workout types. Great balance! 🏆`,
        icon: 'variety'
      })
    }

    return insights
  }

  async getUserAnalytics(userId: string, timeframe: string) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'quarter' ? 90 : 365
    
    // Get user data
    const user = await authService.getUserById(userId)
    if (!user) throw new Error('User not found')

    // Generate analytics data
    const workoutTrend = this.generateWorkoutTrend(userId, days)
    const materialTrend = this.generateMaterialTrend(userId)
    const insights = this.calculateInsights(workoutTrend, user)

    // Calculate summary statistics
    const totalWorkouts = workoutTrend.reduce((sum, day) => sum + day.workouts, 0)
    const totalCalories = workoutTrend.reduce((sum, day) => sum + day.calories, 0)
    const totalDuration = workoutTrend.reduce((sum, day) => sum + day.duration, 0)
    const avgIntensity = workoutTrend.reduce((sum, day) => sum + day.intensity, 0) / workoutTrend.length

    // Workout type breakdown
    const typeBreakdown = workoutTrend.reduce((acc, day) => {
      Object.entries(day.type).forEach(([type, count]) => {
        acc[type] = (acc[type] || 0) + count
      })
      return acc
    }, {} as Record<string, number>)

    // Get social stats
    const leaderboard = await authService.getLeaderboard(100)
    const userPosition = leaderboard.find(entry => entry.user.id === userId)
    const activeChallenges = realtimeService.getActiveChallenges()
    
    const socialStats: SocialAnalytics = {
      challengesParticipated: activeChallenges.filter(c => c.participants.includes(userId)).length,
      challengesWon: 0, // Would calculate from completed challenges
      leaderboardPosition: userPosition?.rank || 0,
      streakDays: user.stats.streakDays,
      friendsActive: Math.floor(Math.random() * 20) + 5 // Simulated
    }

    // Performance comparison
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (days * 2))
    const previousTrend = this.generateWorkoutTrend(userId, days)
    const previousTotal = previousTrend.reduce((sum, day) => sum + day.workouts, 0)
    
    const workoutChange = totalWorkouts - previousTotal
    const workoutChangePercent = previousTotal > 0 ? ((workoutChange / previousTotal) * 100) : 0

    return {
      summary: {
        totalWorkouts,
        totalCalories,
        totalDuration: Math.floor(totalDuration),
        avgIntensity: Math.round(avgIntensity * 10) / 10,
        workoutFrequency: Math.round((totalWorkouts / days) * 10) / 10,
        caloriesPerWorkout: totalWorkouts > 0 ? Math.floor(totalCalories / totalWorkouts) : 0,
        changes: {
          workouts: {
            absolute: workoutChange,
            percentage: Math.round(workoutChangePercent * 10) / 10,
            trend: workoutChange > 0 ? 'up' : workoutChange < 0 ? 'down' : 'stable'
          }
        }
      },
      trends: {
        workouts: workoutTrend,
        materials: materialTrend,
        social: socialStats
      },
      breakdowns: {
        workoutTypes: Object.entries(typeBreakdown).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalWorkouts) * 100)
        })),
        intensityDistribution: [
          { level: 'Low', count: workoutTrend.filter(d => d.intensity === 1).length },
          { level: 'Moderate', count: workoutTrend.filter(d => d.intensity === 2).length },
          { level: 'High', count: workoutTrend.filter(d => d.intensity === 3).length },
          { level: 'Extreme', count: workoutTrend.filter(d => d.intensity === 4).length }
        ]
      },
      insights,
      goals: {
        weekly: {
          target: 5,
          current: workoutTrend.slice(-7).reduce((sum, day) => sum + day.workouts, 0),
          completion: Math.min(100, (workoutTrend.slice(-7).reduce((sum, day) => sum + day.workouts, 0) / 5) * 100)
        },
        monthly: {
          target: 20,
          current: totalWorkouts,
          completion: Math.min(100, (totalWorkouts / 20) * 100)
        }
      }
    }
  }
}

const analyticsService = new AnalyticsService()

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = analyticsQuerySchema.parse({
      timeframe: searchParams.get('timeframe'),
      metrics: searchParams.get('metrics')?.split(',')
    })

    const analytics = await analyticsService.getUserAnalytics(user.id, query.timeframe)

    // Filter metrics if specified
    if (query.metrics && query.metrics.length > 0) {
      const filteredAnalytics: any = {
        summary: analytics.summary,
        trends: {},
        breakdowns: analytics.breakdowns,
        insights: analytics.insights,
        goals: analytics.goals
      }

      query.metrics.forEach(metric => {
        if (analytics.trends[metric]) {
          filteredAnalytics.trends[metric] = analytics.trends[metric]
        }
      })

      return NextResponse.json({
        success: true,
        analytics: filteredAnalytics,
        metadata: {
          userId: user.id,
          timeframe: query.timeframe,
          generatedAt: new Date().toISOString(),
          metricsIncluded: query.metrics
        }
      })
    }

    return NextResponse.json({
      success: true,
      analytics,
      metadata: {
        userId: user.id,
        timeframe: query.timeframe,
        generatedAt: new Date().toISOString(),
        metricsIncluded: 'all'
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}

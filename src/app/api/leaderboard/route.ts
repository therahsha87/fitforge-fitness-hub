import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, authService } from '@/lib/auth'
import { realtimeService } from '@/lib/realtime'
import { z } from 'zod'

const leaderboardQuerySchema = z.object({
  type: z.enum(['level', 'workouts', 'calories', 'streak']).optional().default('level'),
  timeframe: z.enum(['all', 'month', 'week']).optional().default('all'),
  limit: z.coerce.number().min(1).max(100).optional().default(50)
})

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
    const query = leaderboardQuerySchema.parse({
      type: searchParams.get('type'),
      timeframe: searchParams.get('timeframe'),
      limit: searchParams.get('limit')
    })

    // Get base leaderboard
    const leaderboard = await authService.getLeaderboard(query.limit)

    // Apply sorting based on type
    let sortedLeaderboard
    switch (query.type) {
      case 'workouts':
        sortedLeaderboard = leaderboard.sort((a, b) => 
          b.user.stats.workoutsCompleted - a.user.stats.workoutsCompleted
        )
        break
      case 'calories':
        sortedLeaderboard = leaderboard.sort((a, b) => 
          b.user.stats.totalCaloriesBurned - a.user.stats.totalCaloriesBurned
        )
        break
      case 'streak':
        sortedLeaderboard = leaderboard.sort((a, b) => 
          b.user.stats.streakDays - a.user.stats.streakDays
        )
        break
      default: // level
        sortedLeaderboard = leaderboard
        break
    }

    // Re-assign ranks after sorting
    sortedLeaderboard = sortedLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }))

    // Find current user's position
    const userPosition = sortedLeaderboard.find(entry => entry.user.id === user.id)
    const userRank = userPosition?.rank || null

    // Get additional stats
    const totalUsers = leaderboard.length
    const topPercentile = userRank ? Math.round((userRank / totalUsers) * 100) : null

    // Get active challenges
    const activeChallenges = realtimeService.getActiveChallenges()

    // Get online users count
    const onlineUsersCount = realtimeService.getOnlineUsers().length

    return NextResponse.json({
      success: true,
      leaderboard: sortedLeaderboard.map(entry => ({
        rank: entry.rank,
        user: {
          id: entry.user.id,
          username: entry.user.username,
          level: entry.user.level,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user.username}`,
          stats: {
            workoutsCompleted: entry.user.stats.workoutsCompleted,
            totalCaloriesBurned: entry.user.stats.totalCaloriesBurned,
            streakDays: entry.user.stats.streakDays,
            achievementsUnlocked: entry.user.stats.achievementsUnlocked.length
          },
          badges: getUserBadges(entry.user.stats, entry.user.level)
        }
      })),
      userStats: {
        rank: userRank,
        percentile: topPercentile,
        isInTop10: userRank ? userRank <= 10 : false,
        isInTop100: userRank ? userRank <= 100 : false
      },
      metadata: {
        type: query.type,
        timeframe: query.timeframe,
        totalUsers,
        onlineUsers: onlineUsersCount,
        lastUpdated: new Date().toISOString()
      },
      activeChallenges: activeChallenges.map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        participants: challenge.participants.length,
        endDate: challenge.endDate,
        userParticipating: challenge.participants.includes(user.id),
        topParticipants: challenge.leaderboard
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(entry => ({
            userId: entry.userId,
            score: entry.score,
            completed: !!entry.completedAt
          }))
      }))
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

// Helper function to get user badges based on stats
function getUserBadges(stats: any, level: number): string[] {
    const badges: string[] = []

    // Level badges
    if (level >= 50) badges.push('legend')
    else if (level >= 25) badges.push('master')
    else if (level >= 10) badges.push('expert')
    else if (level >= 5) badges.push('novice')

    // Workout badges
    if (stats.workoutsCompleted >= 500) badges.push('workout_machine')
    else if (stats.workoutsCompleted >= 100) badges.push('workout_warrior')
    else if (stats.workoutsCompleted >= 50) badges.push('workout_hero')

    // Streak badges
    if (stats.streakDays >= 365) badges.push('yearly_streaker')
    else if (stats.streakDays >= 100) badges.push('century_streaker')
    else if (stats.streakDays >= 30) badges.push('monthly_streaker')

    // Calorie badges
    if (stats.totalCaloriesBurned >= 100000) badges.push('calorie_incinerator')
    else if (stats.totalCaloriesBurned >= 50000) badges.push('calorie_crusher')
    else if (stats.totalCaloriesBurned >= 10000) badges.push('calorie_burner')

    // Achievement badges
    if (stats.achievementsUnlocked >= 50) badges.push('achievement_hunter')
    else if (stats.achievementsUnlocked >= 25) badges.push('achievement_collector')

    return badges
}

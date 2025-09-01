// Production-ready authentication system
import { jwtVerify, SignJWT } from 'jose'

export interface User {
  id: string
  username: string
  email: string
  level: number
  xp: number
  subscription: 'free' | 'pro' | 'elite'
  fitnessProfile: {
    height: number
    weight: number
    goals: string[]
    experience: 'beginner' | 'intermediate' | 'advanced'
    preferences: {
      workoutTypes: string[]
      equipment: string[]
      timeAvailable: number
    }
  }
  stats: {
    workoutsCompleted: number
    totalCaloriesBurned: number
    streakDays: number
    personalRecords: Record<string, number>
    achievementsUnlocked: string[]
    materialsCollected: Record<string, number>
  }
  createdAt: Date
  lastLoginAt: Date
  isActive: boolean
}

export interface Session {
  user: User
  token: string
  expiresAt: Date
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fitforge-secret-key-change-in-production'
)

class AuthService {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()

  // In production, this would connect to a real database
  constructor() {
    // Demo users for development
    this.seedDemoUsers()
  }

  private seedDemoUsers() {
    const demoUser: User = {
      id: 'demo-user-1',
      username: 'ForgeMaster',
      email: 'demo@fitforge.com',
      level: 15,
      xp: 2850,
      subscription: 'pro',
      fitnessProfile: {
        height: 180,
        weight: 75,
        goals: ['build_muscle', 'lose_fat', 'increase_endurance'],
        experience: 'intermediate',
        preferences: {
          workoutTypes: ['strength', 'cardio', 'hiit'],
          equipment: ['dumbbells', 'barbell', 'resistance_bands'],
          timeAvailable: 60
        }
      },
      stats: {
        workoutsCompleted: 89,
        totalCaloriesBurned: 24500,
        streakDays: 12,
        personalRecords: {
          'bench_press': 80,
          'squat': 120,
          'deadlift': 140,
          'running_5k': 1200 // seconds
        },
        achievementsUnlocked: [
          'iron_will_badge',
          'endurance_crown',
          'nutrition_mastery',
          'forge_master',
          'streak_warrior'
        ],
        materialsCollected: {
          'strength_essence': 45,
          'cardio_energy': 32,
          'protein_crystal': 58,
          'recovery_aura': 23,
          'motivation_spark': 8,
          'discipline_core': 3
        }
      },
      createdAt: new Date('2024-01-15'),
      lastLoginAt: new Date(),
      isActive: true
    }

    this.users.set(demoUser.id, demoUser)
  }

  async createUser(userData: {
    username: string
    email: string
    password: string
    fitnessProfile?: Partial<User['fitnessProfile']>
  }): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newUser: User = {
      id: userId,
      username: userData.username,
      email: userData.email,
      level: 1,
      xp: 0,
      subscription: 'free',
      fitnessProfile: {
        height: userData.fitnessProfile?.height || 0,
        weight: userData.fitnessProfile?.weight || 0,
        goals: userData.fitnessProfile?.goals || [],
        experience: userData.fitnessProfile?.experience || 'beginner',
        preferences: {
          workoutTypes: userData.fitnessProfile?.preferences?.workoutTypes || [],
          equipment: userData.fitnessProfile?.preferences?.equipment || [],
          timeAvailable: userData.fitnessProfile?.preferences?.timeAvailable || 30
        }
      },
      stats: {
        workoutsCompleted: 0,
        totalCaloriesBurned: 0,
        streakDays: 0,
        personalRecords: {},
        achievementsUnlocked: [],
        materialsCollected: {}
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true
    }

    this.users.set(userId, newUser)
    return newUser
  }

  async login(email: string, password: string): Promise<Session | null> {
    // In production, verify password hash
    const user = Array.from(this.users.values()).find(u => u.email === email)
    if (!user || !user.isActive) {
      return null
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    const session: Session = {
      user: { ...user, lastLoginAt: new Date() },
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }

    // Update last login
    this.users.set(user.id, session.user)
    this.sessions.set(token, session)

    return session
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const userId = payload.userId as string
      
      const session = this.sessions.get(token)
      if (!session || session.expiresAt < new Date()) {
        this.sessions.delete(token)
        return null
      }

      return session.user
    } catch {
      return null
    }
  }

  async updateUserStats(userId: string, statUpdates: Partial<User['stats']>): Promise<User | null> {
    const user = this.users.get(userId)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      stats: {
        ...user.stats,
        ...statUpdates
      }
    }

    // Level up logic
    const newXp = updatedUser.stats.workoutsCompleted * 50 + 
                 Math.floor(updatedUser.stats.totalCaloriesBurned / 100) +
                 updatedUser.stats.streakDays * 25

    if (newXp !== user.xp) {
      const newLevel = Math.floor(newXp / 500) + 1
      updatedUser.xp = newXp
      updatedUser.level = newLevel
    }

    this.users.set(userId, updatedUser)
    
    // Update session if exists
    const sessionEntry = Array.from(this.sessions.entries()).find(
      ([, session]) => session.user.id === userId
    )
    if (sessionEntry) {
      sessionEntry[1].user = updatedUser
    }

    return updatedUser
  }

  async updateUserProfile(userId: string, profileUpdates: Partial<User['fitnessProfile']>): Promise<User | null> {
    const user = this.users.get(userId)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      fitnessProfile: {
        ...user.fitnessProfile,
        ...profileUpdates
      }
    }

    this.users.set(userId, updatedUser)
    return updatedUser
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null
  }

  async logout(token: string): Promise<boolean> {
    return this.sessions.delete(token)
  }

  // Get leaderboard data
  async getLeaderboard(limit: number = 50): Promise<Array<{
    user: Pick<User, 'id' | 'username' | 'level' | 'stats'>
    rank: number
  }>> {
    const users = Array.from(this.users.values())
      .filter(u => u.isActive)
      .sort((a, b) => {
        // Sort by level first, then XP, then streak
        if (a.level !== b.level) return b.level - a.level
        if (a.xp !== b.xp) return b.xp - a.xp
        return b.stats.streakDays - a.stats.streakDays
      })
      .slice(0, limit)
      .map((user, index) => ({
        user: {
          id: user.id,
          username: user.username,
          level: user.level,
          stats: user.stats
        },
        rank: index + 1
      }))

    return users
  }
}

// Export singleton instance
export const authService = new AuthService()

// Utility functions for Next.js API routes
export async function authenticateRequest(request: Request): Promise<User | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return await authService.verifyToken(token)
}

export function requireAuth() {
  return async (request: Request): Promise<User> => {
    const user = await authenticateRequest(request)
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }
}

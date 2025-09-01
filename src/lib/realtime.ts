// Real-time WebSocket integration for FitForge
import { EventEmitter } from 'events'

export interface RealtimeEvent {
  type: 'workout_completed' | 'achievement_unlocked' | 'leaderboard_update' | 'challenge_created' | 'user_joined' | 'streak_milestone'
  userId: string
  data: any
  timestamp: Date
}

export interface WorkoutSession {
  id: string
  userId: string
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit'
  startTime: Date
  endTime?: Date
  exercises: Array<{
    name: string
    sets: number
    reps: number
    weight?: number
    duration?: number
  }>
  caloriesBurned: number
  status: 'active' | 'completed' | 'paused'
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'individual' | 'group' | 'community'
  startDate: Date
  endDate: Date
  participants: string[]
  rewards: {
    xp: number
    materials: Record<string, number>
    badges: string[]
  }
  requirements: {
    workoutCount?: number
    calorieGoal?: number
    streakDays?: number
    specificExercises?: string[]
  }
  leaderboard: Array<{
    userId: string
    score: number
    completedAt?: Date
  }>
}

class RealtimeService extends EventEmitter {
  private connections: Map<string, WebSocket> = new Map()
  private activeSessions: Map<string, WorkoutSession> = new Map()
  private activeChallenges: Map<string, Challenge> = new Map()
  private userPresence: Map<string, Date> = new Map()

  constructor() {
    super()
    this.seedDemoChallenges()
  }

  private seedDemoChallenges() {
    const weeklyChallenge: Challenge = {
      id: 'weekly_forge_challenge_1',
      title: 'Forge Master Weekly Challenge',
      description: 'Complete 5 workouts this week to earn the Forge Master badge!',
      type: 'community',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: ['demo-user-1', 'user-2', 'user-3', 'user-4'],
      rewards: {
        xp: 500,
        materials: {
          'motivation_spark': 3,
          'discipline_core': 1
        },
        badges: ['forge_master_weekly']
      },
      requirements: {
        workoutCount: 5,
        calorieGoal: 2000
      },
      leaderboard: [
        { userId: 'demo-user-1', score: 4, completedAt: undefined },
        { userId: 'user-2', score: 3, completedAt: undefined },
        { userId: 'user-3', score: 2, completedAt: undefined },
        { userId: 'user-4', score: 1, completedAt: undefined }
      ]
    }

    const enduranceChallenge: Challenge = {
      id: 'endurance_gauntlet_1',
      title: 'Endurance Gauntlet',
      description: 'Burn 1500 calories through cardio exercises in 5 days!',
      type: 'individual',
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: ['demo-user-1'],
      rewards: {
        xp: 750,
        materials: {
          'cardio_energy': 10,
          'recovery_aura': 5
        },
        badges: ['endurance_champion']
      },
      requirements: {
        calorieGoal: 1500,
        specificExercises: ['running', 'cycling', 'rowing']
      },
      leaderboard: [
        { userId: 'demo-user-1', score: 850, completedAt: undefined }
      ]
    }

    this.activeChallenges.set(weeklyChallenge.id, weeklyChallenge)
    this.activeChallenges.set(enduranceChallenge.id, enduranceChallenge)
  }

  // Connection management
  addConnection(userId: string, ws: WebSocket) {
    this.connections.set(userId, ws)
    this.userPresence.set(userId, new Date())

    ws.on('close', () => {
      this.connections.delete(userId)
      this.userPresence.delete(userId)
      this.broadcastEvent({
        type: 'user_joined',
        userId,
        data: { action: 'left', timestamp: new Date() },
        timestamp: new Date()
      })
    })

    // Notify others that user joined
    this.broadcastEvent({
      type: 'user_joined',
      userId,
      data: { action: 'joined', timestamp: new Date() },
      timestamp: new Date()
    })
  }

  // Workout session management
  startWorkoutSession(userId: string, workoutType: WorkoutSession['type']): WorkoutSession {
    const session: WorkoutSession = {
      id: `session_${Date.now()}_${userId}`,
      userId,
      type: workoutType,
      startTime: new Date(),
      exercises: [],
      caloriesBurned: 0,
      status: 'active'
    }

    this.activeSessions.set(session.id, session)
    
    this.broadcastEvent({
      type: 'workout_completed',
      userId,
      data: { action: 'started', session },
      timestamp: new Date()
    })

    return session
  }

  completeWorkoutSession(sessionId: string, exercises: WorkoutSession['exercises'], caloriesBurned: number): WorkoutSession | null {
    const session = this.activeSessions.get(sessionId)
    if (!session) return null

    const completedSession: WorkoutSession = {
      ...session,
      endTime: new Date(),
      exercises,
      caloriesBurned,
      status: 'completed'
    }

    this.activeSessions.set(sessionId, completedSession)

    // Update challenges
    this.updateChallengeProgress(session.userId, {
      workoutCompleted: true,
      caloriesBurned,
      exerciseTypes: exercises.map(e => e.name)
    })

    this.broadcastEvent({
      type: 'workout_completed',
      userId: session.userId,
      data: { 
        action: 'completed', 
        session: completedSession,
        achievements: this.checkAchievements(session.userId, completedSession)
      },
      timestamp: new Date()
    })

    return completedSession
  }

  // Challenge management
  createChallenge(challenge: Omit<Challenge, 'id' | 'leaderboard'>): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leaderboard: challenge.participants.map(userId => ({
        userId,
        score: 0
      }))
    }

    this.activeChallenges.set(newChallenge.id, newChallenge)

    this.broadcastEvent({
      type: 'challenge_created',
      userId: 'system',
      data: { challenge: newChallenge },
      timestamp: new Date()
    })

    return newChallenge
  }

  joinChallenge(challengeId: string, userId: string): boolean {
    const challenge = this.activeChallenges.get(challengeId)
    if (!challenge || challenge.participants.includes(userId)) {
      return false
    }

    challenge.participants.push(userId)
    challenge.leaderboard.push({
      userId,
      score: 0
    })

    this.activeChallenges.set(challengeId, challenge)

    this.broadcastEvent({
      type: 'challenge_created',
      userId,
      data: { action: 'joined', challenge },
      timestamp: new Date()
    })

    return true
  }

  private updateChallengeProgress(userId: string, progress: {
    workoutCompleted?: boolean
    caloriesBurned?: number
    exerciseTypes?: string[]
  }) {
    for (const [challengeId, challenge] of this.activeChallenges.entries()) {
      if (!challenge.participants.includes(userId)) continue

      const userEntry = challenge.leaderboard.find(entry => entry.userId === userId)
      if (!userEntry) continue

      let scoreIncrease = 0

      if (progress.workoutCompleted && challenge.requirements.workoutCount) {
        scoreIncrease += 1
      }

      if (progress.caloriesBurned && challenge.requirements.calorieGoal) {
        scoreIncrease += progress.caloriesBurned
      }

      if (progress.exerciseTypes && challenge.requirements.specificExercises) {
        const matchingExercises = progress.exerciseTypes.filter(type =>
          challenge.requirements.specificExercises?.includes(type)
        )
        scoreIncrease += matchingExercises.length * 10
      }

      if (scoreIncrease > 0) {
        userEntry.score += scoreIncrease

        // Check if challenge is completed
        if (this.isChallengeCompleted(challenge, userEntry)) {
          userEntry.completedAt = new Date()
        }

        this.activeChallenges.set(challengeId, challenge)

        this.broadcastEvent({
          type: 'leaderboard_update',
          userId,
          data: {
            challengeId,
            challenge,
            userUpdate: { userId, scoreIncrease, newScore: userEntry.score }
          },
          timestamp: new Date()
        })
      }
    }
  }

  private isChallengeCompleted(challenge: Challenge, userEntry: { userId: string, score: number }): boolean {
    const req = challenge.requirements
    
    if (req.workoutCount && userEntry.score >= req.workoutCount) return true
    if (req.calorieGoal && userEntry.score >= req.calorieGoal) return true
    if (req.streakDays && userEntry.score >= req.streakDays) return true
    
    return false
  }

  private checkAchievements(userId: string, session: WorkoutSession): string[] {
    const achievements: string[] = []

    // Check for various achievements based on workout data
    if (session.caloriesBurned >= 500) {
      achievements.push('calorie_crusher')
    }

    if (session.exercises.length >= 10) {
      achievements.push('exercise_variety_master')
    }

    const totalWeight = session.exercises.reduce((sum, ex) => sum + (ex.weight || 0) * ex.sets * ex.reps, 0)
    if (totalWeight >= 5000) {
      achievements.push('iron_mover')
    }

    // Emit achievement events
    achievements.forEach(achievement => {
      this.broadcastEvent({
        type: 'achievement_unlocked',
        userId,
        data: { achievement, session },
        timestamp: new Date()
      })
    })

    return achievements
  }

  // Get real-time stats
  getActiveChallenges(): Challenge[] {
    return Array.from(this.activeChallenges.values())
      .filter(challenge => challenge.endDate > new Date())
  }

  getActiveWorkoutSessions(): WorkoutSession[] {
    return Array.from(this.activeSessions.values())
      .filter(session => session.status === 'active')
  }

  getOnlineUsers(): string[] {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    
    return Array.from(this.userPresence.entries())
      .filter(([, lastSeen]) => lastSeen > fiveMinutesAgo)
      .map(([userId]) => userId)
  }

  // Event broadcasting
  private broadcastEvent(event: RealtimeEvent) {
    const eventData = JSON.stringify(event)
    
    // Send to all connected users
    for (const [userId, ws] of this.connections.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(eventData)
        } catch (error) {
          console.error(`Failed to send event to user ${userId}:`, error)
          // Remove broken connection
          this.connections.delete(userId)
          this.userPresence.delete(userId)
        }
      }
    }

    // Emit for local listeners
    this.emit('realtimeEvent', event)
  }

  // Send event to specific user
  sendToUser(userId: string, event: RealtimeEvent) {
    const ws = this.connections.get(userId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(event))
      } catch (error) {
        console.error(`Failed to send event to user ${userId}:`, error)
      }
    }
  }

  // Community features
  createStreakMilestone(userId: string, streakDays: number) {
    const milestones = [7, 14, 30, 60, 100, 365]
    if (milestones.includes(streakDays)) {
      this.broadcastEvent({
        type: 'streak_milestone',
        userId,
        data: { 
          streakDays,
          milestone: `${streakDays}_day_streak`,
          celebration: true
        },
        timestamp: new Date()
      })
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService()

// WebSocket client utilities for frontend
export class RealtimeClient extends EventEmitter {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private userId: string

  constructor(userId: string) {
    super()
    this.userId = userId
  }

  connect() {
    try {
      // In production, use proper WebSocket URL
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/api/realtime`
        : `ws://localhost:3000/api/realtime`

      this.ws = new WebSocket(`${wsUrl}?userId=${this.userId}`)

      this.ws.onopen = () => {
        console.log('FitForge realtime connected')
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const realtimeEvent: RealtimeEvent = JSON.parse(event.data)
          this.emit('event', realtimeEvent)
          this.emit(realtimeEvent.type, realtimeEvent)
        } catch (error) {
          console.error('Failed to parse realtime event:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('FitForge realtime disconnected')
        this.emit('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('FitForge realtime error:', error)
        this.emit('error', error)
      }

    } catch (error) {
      console.error('Failed to connect to FitForge realtime:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)
      
      setTimeout(() => {
        console.log(`Attempting to reconnect to FitForge realtime (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, delay)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  sendEvent(event: Omit<RealtimeEvent, 'userId' | 'timestamp'>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullEvent: RealtimeEvent = {
        ...event,
        userId: this.userId,
        timestamp: new Date()
      }
      this.ws.send(JSON.stringify(fullEvent))
    }
  }
}

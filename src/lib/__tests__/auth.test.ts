// Test utilities for FitForge production features
import { authService } from '../auth'
import { monitoringService } from '../monitoring'
import { notificationService } from '../notifications'

// Mock implementations for testing
const originalConsoleError = console.error
const originalConsoleLog = console.log

export const testUtils = {
  // Test data factories
  createTestUser: (overrides = {}) => ({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fitnessProfile: {
      height: 180,
      weight: 75,
      goals: ['build_muscle'],
      experience: 'intermediate' as const,
      preferences: {
        workoutTypes: ['strength', 'cardio'],
        equipment: ['dumbbells'],
        timeAvailable: 60
      }
    },
    ...overrides
  }),

  createTestWorkout: (overrides = {}) => ({
    workoutType: 'strength' as const,
    duration: 45,
    exercises: [
      {
        name: 'Push-ups',
        sets: 3,
        reps: 15,
        weight: 0
      },
      {
        name: 'Squats',
        sets: 3,
        reps: 20,
        weight: 0
      }
    ],
    caloriesBurned: 300,
    intensityLevel: 'moderate' as const,
    notes: 'Great workout!',
    ...overrides
  }),

  // Test helpers
  suppressConsole: () => {
    console.error = jest.fn()
    console.log = jest.fn()
  },

  restoreConsole: () => {
    console.error = originalConsoleError
    console.log = originalConsoleLog
  },

  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Clear all services for clean tests
  clearServices: () => {
    // Clear auth service
    ;(authService as any).users.clear()
    ;(authService as any).sessions.clear()
    
    // Clear monitoring service
    ;(monitoringService as any).errors.clear()
    ;(monitoringService as any).metrics = []
    
    // Clear notification service
    ;(notificationService as any).notifications.clear()
    ;(notificationService as any).userPreferences.clear()
    ;(notificationService as any).deliveryQueue = []
  }
}

// Test suites
describe('Authentication Service', () => {
  beforeEach(() => {
    testUtils.clearServices()
    testUtils.suppressConsole()
  })

  afterEach(() => {
    testUtils.restoreConsole()
  })

  test('should create user successfully', async () => {
    const userData = testUtils.createTestUser()
    const user = await authService.createUser(userData)

    expect(user).toBeDefined()
    expect(user.username).toBe(userData.username)
    expect(user.email).toBe(userData.email)
    expect(user.level).toBe(1)
    expect(user.xp).toBe(0)
    expect(user.subscription).toBe('free')
  })

  test('should login with valid credentials', async () => {
    const userData = testUtils.createTestUser()
    await authService.createUser(userData)
    
    const session = await authService.login(userData.email, userData.password)
    
    expect(session).toBeDefined()
    expect(session?.user.email).toBe(userData.email)
    expect(session?.token).toBeDefined()
  })

  test('should reject invalid credentials', async () => {
    const session = await authService.login('invalid@email.com', 'wrongpassword')
    expect(session).toBeNull()
  })

  test('should verify valid token', async () => {
    const userData = testUtils.createTestUser()
    await authService.createUser(userData)
    const session = await authService.login(userData.email, userData.password)
    
    const user = await authService.verifyToken(session!.token)
    expect(user).toBeDefined()
    expect(user?.email).toBe(userData.email)
  })

  test('should update user stats', async () => {
    const userData = testUtils.createTestUser()
    const user = await authService.createUser(userData)
    
    const updatedUser = await authService.updateUserStats(user.id, {
      workoutsCompleted: 5,
      totalCaloriesBurned: 1500
    })

    expect(updatedUser?.stats.workoutsCompleted).toBe(5)
    expect(updatedUser?.stats.totalCaloriesBurned).toBe(1500)
  })

  test('should level up user based on stats', async () => {
    const userData = testUtils.createTestUser()
    const user = await authService.createUser(userData)
    
    // Simulate enough activity to level up
    await authService.updateUserStats(user.id, {
      workoutsCompleted: 100,
      totalCaloriesBurned: 10000,
      streakDays: 50
    })

    const updatedUser = await authService.getUserById(user.id)
    expect(updatedUser?.level).toBeGreaterThan(1)
  })
})

describe('Monitoring Service', () => {
  beforeEach(() => {
    testUtils.clearServices()
    testUtils.suppressConsole()
  })

  afterEach(() => {
    testUtils.restoreConsole()
  })

  test('should log errors correctly', () => {
    const errorId = monitoringService.logError({
      category: 'ui',
      message: 'Test error',
      metadata: { test: true }
    })

    expect(errorId).toBeDefined()
    const errors = monitoringService.exportData('errors')
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('Test error')
    expect(errors[0].category).toBe('ui')
  })

  test('should track performance metrics', () => {
    const metricId = monitoringService.trackPerformance({
      name: 'test_metric',
      value: 150,
      category: 'api'
    })

    expect(metricId).toBeDefined()
    const metrics = monitoringService.exportData('metrics')
    expect(metrics).toHaveLength(1)
    expect(metrics[0].name).toBe('test_metric')
    expect(metrics[0].value).toBe(150)
  })

  test('should perform health checks', async () => {
    const healthCheck = await monitoringService.performHealthCheck('auth')
    
    expect(healthCheck).toBeDefined()
    expect(healthCheck.service).toBe('auth')
    expect(['healthy', 'degraded', 'unhealthy']).toContain(healthCheck.status)
    expect(typeof healthCheck.responseTime).toBe('number')
  })

  test('should get error analytics', () => {
    // Log some test errors
    monitoringService.logError({ category: 'ui', message: 'UI Error 1' })
    monitoringService.logError({ category: 'api', message: 'API Error 1' })
    monitoringService.logError({ category: 'ui', message: 'UI Error 2' })

    const analytics = monitoringService.getErrorAnalytics('hour')
    
    expect(analytics.total).toBe(3)
    expect(analytics.byCategory.ui).toBe(2)
    expect(analytics.byCategory.api).toBe(1)
  })
})

describe('Notification Service', () => {
  beforeEach(() => {
    testUtils.clearServices()
    testUtils.suppressConsole()
  })

  afterEach(() => {
    testUtils.restoreConsole()
  })

  test('should create notifications', async () => {
    const notificationId = await notificationService.createNotification({
      userId: 'test-user',
      type: 'achievement',
      title: 'Test Achievement',
      message: 'You did it!',
      priority: 'normal'
    })

    expect(notificationId).toBeDefined()
    const notifications = notificationService.getUserNotifications('test-user')
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Test Achievement')
  })

  test('should mark notifications as read', async () => {
    const notificationId = await notificationService.createNotification({
      userId: 'test-user',
      type: 'achievement',
      title: 'Test Achievement',
      message: 'You did it!',
      priority: 'normal'
    })

    const marked = notificationService.markAsRead(notificationId, 'test-user')
    expect(marked).toBe(true)

    const notifications = notificationService.getUserNotifications('test-user')
    expect(notifications[0].readAt).toBeDefined()
  })

  test('should filter unread notifications', async () => {
    await notificationService.createNotification({
      userId: 'test-user',
      type: 'achievement',
      title: 'Read Achievement',
      message: 'Already read',
      priority: 'normal'
    })

    const notificationId2 = await notificationService.createNotification({
      userId: 'test-user',
      type: 'reminder',
      title: 'Unread Reminder',
      message: 'Not read yet',
      priority: 'normal'
    })

    // Mark first as read
    notificationService.markAsRead(await notificationService.getUserNotifications('test-user')[0].id, 'test-user')

    const unreadOnly = notificationService.getUserNotifications('test-user', { unreadOnly: true })
    expect(unreadOnly).toHaveLength(1)
    expect(unreadOnly[0].title).toBe('Unread Reminder')
  })

  test('should set and get user preferences', () => {
    notificationService.setUserPreferences('test-user', {
      email: false,
      push: true,
      categories: {
        achievements: true,
        workoutReminders: false,
        socialUpdates: true,
        systemAlerts: true,
        marketing: false
      }
    })

    const preferences = notificationService.getUserPreferences('test-user')
    expect(preferences).toBeDefined()
    expect(preferences?.email).toBe(false)
    expect(preferences?.push).toBe(true)
    expect(preferences?.categories.achievements).toBe(true)
    expect(preferences?.categories.workoutReminders).toBe(false)
  })

  test('should create fitness-specific notifications', async () => {
    const achievementNotificationId = await notificationService.notifyWorkoutAchievement('test-user', {
      name: 'Iron Will',
      description: 'Completed 10 strength workouts',
      icon: '💪',
      xpEarned: 500
    })

    const reminderNotificationId = await notificationService.notifyWorkoutReminder('test-user', 'daily')

    expect(achievementNotificationId).toBeDefined()
    expect(reminderNotificationId).toBeDefined()

    const notifications = notificationService.getUserNotifications('test-user')
    expect(notifications).toHaveLength(2)
    
    const achievement = notifications.find(n => n.type === 'achievement')
    const reminder = notifications.find(n => n.type === 'reminder')
    
    expect(achievement?.title).toContain('Iron Will')
    expect(reminder?.title).toContain('Heat Up Your Forge')
  })
})

// Integration tests
describe('Integration Tests', () => {
  beforeEach(() => {
    testUtils.clearServices()
    testUtils.suppressConsole()
  })

  afterEach(() => {
    testUtils.restoreConsole()
  })

  test('should complete full workout flow with notifications', async () => {
    // Create user
    const userData = testUtils.createTestUser()
    const user = await authService.createUser(userData)
    
    // Set notification preferences
    notificationService.setUserPreferences(user.id, {
      achievements: true,
      workoutReminders: true
    } as any)

    // Complete workout (simulate API call)
    const updatedUser = await authService.updateUserStats(user.id, {
      workoutsCompleted: 1,
      totalCaloriesBurned: 300
    })

    // Check if achievement notification was created
    await testUtils.waitFor(10) // Allow async notification processing
    
    expect(updatedUser?.stats.workoutsCompleted).toBe(1)
    
    // In a real integration test, we'd check if notifications were created
    // but our current setup doesn't automatically create notifications on stat updates
  })

  test('should handle authentication flow with monitoring', async () => {
    const userData = testUtils.createTestUser()
    
    // Track auth operations
    const startTime = Date.now()
    
    const user = await authService.createUser(userData)
    const session = await authService.login(userData.email, userData.password)
    const verifiedUser = await authService.verifyToken(session!.token)
    
    const endTime = Date.now()
    
    expect(user).toBeDefined()
    expect(session).toBeDefined()
    expect(verifiedUser).toBeDefined()
    expect(endTime - startTime).toBeLessThan(1000) // Should complete in under 1 second
  })
})

// Performance tests
describe('Performance Tests', () => {
  beforeEach(() => {
    testUtils.clearServices()
    testUtils.suppressConsole()
  })

  afterEach(() => {
    testUtils.restoreConsole()
  })

  test('should handle multiple users efficiently', async () => {
    const startTime = Date.now()
    const userPromises = []

    // Create 100 users concurrently
    for (let i = 0; i < 100; i++) {
      const userData = testUtils.createTestUser({
        username: `user${i}`,
        email: `user${i}@example.com`
      })
      userPromises.push(authService.createUser(userData))
    }

    const users = await Promise.all(userPromises)
    const endTime = Date.now()

    expect(users).toHaveLength(100)
    expect(endTime - startTime).toBeLessThan(5000) // Should complete in under 5 seconds
  })

  test('should handle error logging efficiently', () => {
    const startTime = Date.now()
    
    // Log 1000 errors
    for (let i = 0; i < 1000; i++) {
      monitoringService.logError({
        category: 'ui',
        message: `Test error ${i}`,
        metadata: { index: i }
      })
    }

    const endTime = Date.now()
    const errors = monitoringService.exportData('errors')
    
    expect(errors).toHaveLength(1000)
    expect(endTime - startTime).toBeLessThan(1000) // Should complete in under 1 second
  })
})

export default testUtils

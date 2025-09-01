// Production notification system for FitForge
import { realtimeService } from './realtime'
import { monitoringService } from './monitoring'

export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'reminder' | 'social' | 'system' | 'marketing'
  title: string
  message: string
  icon?: string
  actionUrl?: string
  actionText?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  createdAt: Date
  readAt?: Date
  deliveredAt?: Date
  scheduledFor?: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  email: boolean
  push: boolean
  inApp: boolean
  categories: {
    achievements: boolean
    workoutReminders: boolean
    socialUpdates: boolean
    systemAlerts: boolean
    marketing: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string   // HH:MM format
  }
  frequency: {
    digest: 'never' | 'daily' | 'weekly'
    maxPerDay: number
  }
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map()
  private userPreferences: Map<string, NotificationPreferences> = new Map()
  private deliveryQueue: Notification[] = []

  constructor() {
    // Process delivery queue every 30 seconds
    setInterval(() => this.processDeliveryQueue(), 30000)
    
    // Clean up old notifications daily
    setInterval(() => this.cleanupOldNotifications(), 24 * 60 * 60 * 1000)

    // Set default preferences for demo user
    this.setDefaultPreferences()
  }

  private setDefaultPreferences() {
    this.userPreferences.set('demo-user-1', {
      userId: 'demo-user-1',
      email: true,
      push: true,
      inApp: true,
      categories: {
        achievements: true,
        workoutReminders: true,
        socialUpdates: true,
        systemAlerts: true,
        marketing: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      },
      frequency: {
        digest: 'daily',
        maxPerDay: 10
      }
    })
  }

  // Create and send notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullNotification: Notification = {
      ...notification,
      id: notificationId,
      createdAt: new Date()
    }

    this.notifications.set(notificationId, fullNotification)

    // Add to delivery queue if not scheduled for future
    if (!notification.scheduledFor || notification.scheduledFor <= new Date()) {
      this.deliveryQueue.push(fullNotification)
    }

    monitoringService.trackPerformance({
      name: 'notification_created',
      value: 1,
      category: 'api',
      metadata: {
        type: notification.type,
        priority: notification.priority,
        userId: notification.userId
      }
    })

    return notificationId
  }

  // Get user notifications
  getUserNotifications(userId: string, options: {
    unreadOnly?: boolean
    limit?: number
    type?: Notification['type']
  } = {}): Notification[] {
    const userNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId)

    let filtered = userNotifications

    if (options.unreadOnly) {
      filtered = filtered.filter(n => !n.readAt)
    }

    if (options.type) {
      filtered = filtered.filter(n => n.type === options.type)
    }

    // Sort by priority and creation time
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
    filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    return options.limit ? filtered.slice(0, options.limit) : filtered
  }

  // Mark notification as read
  markAsRead(notificationId: string, userId: string): boolean {
    const notification = this.notifications.get(notificationId)
    
    if (!notification || notification.userId !== userId) {
      return false
    }

    notification.readAt = new Date()
    this.notifications.set(notificationId, notification)

    return true
  }

  // Mark all notifications as read for user
  markAllAsRead(userId: string): number {
    let count = 0
    
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId && !notification.readAt) {
        notification.readAt = new Date()
        this.notifications.set(id, notification)
        count++
      }
    }

    return count
  }

  // Set user notification preferences
  setUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const current = this.userPreferences.get(userId) || {
      userId,
      email: true,
      push: true,
      inApp: true,
      categories: {
        achievements: true,
        workoutReminders: true,
        socialUpdates: true,
        systemAlerts: true,
        marketing: false
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00'
      },
      frequency: {
        digest: 'never',
        maxPerDay: 10
      }
    }

    const updated = {
      ...current,
      ...preferences,
      categories: {
        ...current.categories,
        ...preferences.categories
      },
      quietHours: {
        ...current.quietHours,
        ...preferences.quietHours
      },
      frequency: {
        ...current.frequency,
        ...preferences.frequency
      }
    }

    this.userPreferences.set(userId, updated)
  }

  // Get user preferences
  getUserPreferences(userId: string): NotificationPreferences | null {
    return this.userPreferences.get(userId) || null
  }

  // Process delivery queue
  private async processDeliveryQueue(): Promise<void> {
    const now = new Date()
    const toDeliver = this.deliveryQueue.filter(notification => {
      // Check if scheduled time has arrived
      if (notification.scheduledFor && notification.scheduledFor > now) {
        return false
      }
      
      // Check if expired
      if (notification.expiresAt && notification.expiresAt <= now) {
        return false
      }

      return !notification.deliveredAt
    })

    for (const notification of toDeliver) {
      await this.deliverNotification(notification)
    }

    // Remove delivered notifications from queue
    this.deliveryQueue = this.deliveryQueue.filter(n => !n.deliveredAt)
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    const preferences = this.getUserPreferences(notification.userId)
    
    if (!preferences) {
      // Skip if no preferences (user might have opted out)
      notification.deliveredAt = new Date()
      this.notifications.set(notification.id, notification)
      return
    }

    // Check if user wants this category of notification
    const categoryMap = {
      achievement: preferences.categories.achievements,
      reminder: preferences.categories.workoutReminders,
      social: preferences.categories.socialUpdates,
      system: preferences.categories.systemAlerts,
      marketing: preferences.categories.marketing
    }

    if (!categoryMap[notification.type]) {
      notification.deliveredAt = new Date()
      this.notifications.set(notification.id, notification)
      return
    }

    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      // Reschedule for after quiet hours
      const nextDelivery = this.getNextDeliveryTime(preferences)
      notification.scheduledFor = nextDelivery
      this.notifications.set(notification.id, notification)
      return
    }

    // Check daily limits
    if (!this.checkDailyLimit(notification.userId, preferences)) {
      // Reschedule for tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0) // 9 AM tomorrow
      notification.scheduledFor = tomorrow
      this.notifications.set(notification.id, notification)
      return
    }

    try {
      // Deliver via different channels
      const deliveryPromises: Promise<boolean>[] = []

      if (preferences.inApp) {
        deliveryPromises.push(this.deliverInApp(notification))
      }

      if (preferences.push) {
        deliveryPromises.push(this.deliverPush(notification))
      }

      if (preferences.email) {
        deliveryPromises.push(this.deliverEmail(notification))
      }

      // Wait for all delivery attempts
      const results = await Promise.allSettled(deliveryPromises)
      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length

      if (successful > 0) {
        notification.deliveredAt = new Date()
        this.notifications.set(notification.id, notification)

        monitoringService.trackPerformance({
          name: 'notification_delivered',
          value: 1,
          category: 'api',
          metadata: {
            type: notification.type,
            channels: successful,
            userId: notification.userId
          }
        })
      } else {
        // All delivery methods failed
        monitoringService.logError({
          category: 'api',
          message: 'Failed to deliver notification',
          metadata: { notificationId: notification.id, userId: notification.userId }
        })
      }

    } catch (error) {
      monitoringService.logError({
        category: 'api',
        message: 'Notification delivery error',
        stack: error instanceof Error ? error.stack : undefined,
        metadata: { notificationId: notification.id }
      })
    }
  }

  private async deliverInApp(notification: Notification): Promise<boolean> {
    try {
      // Send via realtime service for immediate in-app display
      realtimeService.sendToUser(notification.userId, {
        type: 'achievement_unlocked', // Reusing existing event type
        userId: notification.userId,
        data: {
          notification: {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            icon: notification.icon,
            actionUrl: notification.actionUrl,
            actionText: notification.actionText,
            priority: notification.priority
          }
        },
        timestamp: new Date()
      })

      return true
    } catch (error) {
      console.error('In-app notification delivery failed:', error)
      return false
    }
  }

  private async deliverPush(notification: Notification): Promise<boolean> {
    try {
      // In production, integrate with push notification service (FCM, APNS, etc.)
      console.log('Push notification would be sent:', {
        to: notification.userId,
        title: notification.title,
        body: notification.message,
        icon: notification.icon,
        data: {
          actionUrl: notification.actionUrl,
          notificationId: notification.id
        }
      })
      
      return true
    } catch (error) {
      console.error('Push notification delivery failed:', error)
      return false
    }
  }

  private async deliverEmail(notification: Notification): Promise<boolean> {
    try {
      // In production, integrate with email service (SendGrid, SES, etc.)
      console.log('Email notification would be sent:', {
        to: notification.userId,
        subject: notification.title,
        body: notification.message,
        actionUrl: notification.actionUrl,
        type: notification.type
      })
      
      return true
    } catch (error) {
      console.error('Email notification delivery failed:', error)
      return false
    }
  }

  private isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours.enabled) return false

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number)
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    if (startTime <= endTime) {
      // Same day quiet hours (e.g., 14:00 - 18:00)
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Overnight quiet hours (e.g., 22:00 - 07:00)
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  private getNextDeliveryTime(preferences: NotificationPreferences): Date {
    const now = new Date()
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number)
    
    const nextDelivery = new Date(now)
    nextDelivery.setHours(endHour, endMin, 0, 0)

    // If end time is tomorrow (overnight quiet hours)
    if (nextDelivery <= now) {
      nextDelivery.setDate(nextDelivery.getDate() + 1)
    }

    return nextDelivery
  }

  private checkDailyLimit(userId: string, preferences: NotificationPreferences): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayNotifications = Array.from(this.notifications.values())
      .filter(n => 
        n.userId === userId && 
        n.deliveredAt && 
        n.deliveredAt >= today
      )

    return todayNotifications.length < preferences.frequency.maxPerDay
  }

  private cleanupOldNotifications(): void {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days

    let removed = 0
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.createdAt < cutoff || 
          (notification.expiresAt && notification.expiresAt < new Date())) {
        this.notifications.delete(id)
        removed++
      }
    }

    if (removed > 0) {
      monitoringService.trackPerformance({
        name: 'notifications_cleanup',
        value: removed,
        category: 'api',
        metadata: { removedCount: removed, totalRemaining: this.notifications.size }
      })
    }
  }

  // Fitness-specific notification helpers
  async notifyWorkoutAchievement(userId: string, achievement: {
    name: string
    description: string
    icon: string
    xpEarned: number
  }): Promise<string> {
    return this.createNotification({
      userId,
      type: 'achievement',
      title: `🏆 Achievement Unlocked: ${achievement.name}!`,
      message: `${achievement.description} You earned ${achievement.xpEarned} XP!`,
      icon: achievement.icon,
      priority: 'high',
      actionUrl: '/dashboard',
      actionText: 'View Progress',
      metadata: { achievement }
    })
  }

  async notifyWorkoutReminder(userId: string, reminderType: 'daily' | 'streak_risk' | 'goal_progress'): Promise<string> {
    const messages = {
      daily: {
        title: '🔥 Time to Heat Up Your Forge!',
        message: 'Your fitness forge is cooling down! Time for today\'s workout to keep the fire burning!'
      },
      streak_risk: {
        title: '⚡ Streak Alert!',
        message: 'Don\'t let your epic streak die out! Complete a quick workout to keep the momentum going!'
      },
      goal_progress: {
        title: '🎯 Goal Check-In',
        message: 'You\'re making great progress! A workout today will get you even closer to your goals!'
      }
    }

    const message = messages[reminderType]

    return this.createNotification({
      userId,
      type: 'reminder',
      title: message.title,
      message: message.message,
      icon: '💪',
      priority: 'normal',
      actionUrl: '/workouts',
      actionText: 'Start Workout',
      metadata: { reminderType }
    })
  }

  async notifyLeaderboardUpdate(userId: string, update: {
    newRank: number
    change: number
    category: string
  }): Promise<string> {
    const direction = update.change > 0 ? 'climbed' : 'dropped'
    const emoji = update.change > 0 ? '📈' : '📉'

    return this.createNotification({
      userId,
      type: 'social',
      title: `${emoji} Leaderboard Update!`,
      message: `You've ${direction} to rank #${update.newRank} in ${update.category}! ${update.change > 0 ? 'Keep it up!' : 'Time to reclaim your position!'}`,
      icon: '🏆',
      priority: 'normal',
      actionUrl: '/social',
      actionText: 'View Leaderboard',
      metadata: { leaderboardUpdate: update }
    })
  }

  // Get notification statistics
  getNotificationStats(userId?: string) {
    const notifications = userId 
      ? Array.from(this.notifications.values()).filter(n => n.userId === userId)
      : Array.from(this.notifications.values())

    const total = notifications.length
    const unread = notifications.filter(n => !n.readAt).length
    const delivered = notifications.filter(n => n.deliveredAt).length
    const pending = this.deliveryQueue.filter(n => !userId || n.userId === userId).length

    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byPriority = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      unread,
      delivered,
      pending,
      deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
      breakdowns: {
        byType,
        byPriority
      }
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// React hook for notifications
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = () => {
      const userNotifications = notificationService.getUserNotifications(userId, { limit: 20 })
      setNotifications(userNotifications)
      setUnreadCount(userNotifications.filter(n => !n.readAt).length)
    }

    fetchNotifications()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [userId])

  const markAsRead = (notificationId: string) => {
    if (notificationService.markAsRead(notificationId, userId)) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, readAt: new Date() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = () => {
    const count = notificationService.markAllAsRead(userId)
    if (count > 0) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, readAt: n.readAt || new Date() }))
      )
      setUnreadCount(0)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react'

// Production caching system for performance optimization
import { monitoringService } from './monitoring'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
  onEvict?: (key: string, entry: CacheEntry<any>) => void
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize ?? 1000,
      onEvict: options.onEvict ?? (() => {})
    }

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const actualTtl = ttl ?? this.options.ttl
    
    // Evict oldest entries if at max capacity
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: actualTtl,
      hits: 0
    }

    this.cache.set(key, entry)

    monitoringService.trackPerformance({
      name: 'cache_set',
      value: 1,
      category: 'database',
      metadata: { key, ttl: actualTtl, cacheSize: this.cache.size }
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    
    if (!entry) {
      monitoringService.trackPerformance({
        name: 'cache_miss',
        value: 1,
        category: 'database',
        metadata: { key }
      })
      return null
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.options.onEvict(key, entry)
      
      monitoringService.trackPerformance({
        name: 'cache_expired',
        value: 1,
        category: 'database',
        metadata: { key, age: Date.now() - entry.timestamp }
      })
      
      return null
    }

    // Update hit count
    entry.hits++
    
    monitoringService.trackPerformance({
      name: 'cache_hit',
      value: 1,
      category: 'database',
      metadata: { key, hits: entry.hits }
    })

    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.options.onEvict(key, entry)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.options.onEvict(key, entry)
    }
    return this.cache.delete(key)
  }

  clear(): void {
    for (const [key, entry] of this.cache.entries()) {
      this.options.onEvict(key, entry)
    }
    this.cache.clear()
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTimestamp = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!
      this.cache.delete(oldestKey)
      this.options.onEvict(oldestKey, entry)
      
      monitoringService.trackPerformance({
        name: 'cache_eviction',
        value: 1,
        category: 'database',
        metadata: { key: oldestKey, age: Date.now() - entry.timestamp }
      })
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const expired: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expired.push(key)
      }
    }

    for (const key of expired) {
      const entry = this.cache.get(key)!
      this.cache.delete(key)
      this.options.onEvict(key, entry)
    }

    if (expired.length > 0) {
      monitoringService.trackPerformance({
        name: 'cache_cleanup',
        value: expired.length,
        category: 'database',
        metadata: { expiredCount: expired.length, totalSize: this.cache.size }
      })
    }
  }

  getStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.values())
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalHits: entries.reduce((sum, entry) => sum + entry.hits, 0),
      avgAge: entries.length > 0 
        ? entries.reduce((sum, entry) => sum + (now - entry.timestamp), 0) / entries.length 
        : 0,
      expiredCount: entries.filter(entry => now - entry.timestamp > entry.ttl).length
    }
  }
}

// Specialized caches for different data types
export const userCache = new CacheService({ 
  ttl: 10 * 60 * 1000, // 10 minutes for user data
  maxSize: 500,
  onEvict: (key, entry) => {
    console.log(`User cache evicted: ${key} (${entry.hits} hits)`)
  }
})

export const workoutCache = new CacheService({
  ttl: 5 * 60 * 1000, // 5 minutes for workout data
  maxSize: 1000,
  onEvict: (key, entry) => {
    console.log(`Workout cache evicted: ${key} (${entry.hits} hits)`)
  }
})

export const leaderboardCache = new CacheService({
  ttl: 2 * 60 * 1000, // 2 minutes for leaderboard (needs to be fresh)
  maxSize: 100,
  onEvict: (key, entry) => {
    console.log(`Leaderboard cache evicted: ${key} (${entry.hits} hits)`)
  }
})

export const analyticsCache = new CacheService({
  ttl: 15 * 60 * 1000, // 15 minutes for analytics
  maxSize: 200,
  onEvict: (key, entry) => {
    console.log(`Analytics cache evicted: ${key} (${entry.hits} hits)`)
  }
})

// Cache decorator for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: CacheService,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  const generateKey = keyGenerator || ((...args) => JSON.stringify(args))

  return (async (...args: Parameters<T>) => {
    const key = `${fn.name}_${generateKey(...args)}`
    
    // Try to get from cache first
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }

    // Execute function and cache result
    try {
      const result = await fn(...args)
      cache.set(key, result, ttl)
      return result
    } catch (error) {
      // Don't cache errors, just re-throw
      throw error
    }
  }) as T
}

// React hook for caching
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cache: CacheService = userCache,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try cache first
        const cached = cache.get<T>(key)
        if (cached !== null && mounted) {
          setData(cached)
          setLoading(false)
          return
        }

        // Fetch fresh data
        const result = await fetcher()
        if (mounted) {
          setData(result)
          cache.set(key, result)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [key, ...dependencies])

  const invalidate = () => {
    cache.delete(key)
  }

  const refresh = async () => {
    cache.delete(key)
    setLoading(true)
    try {
      const result = await fetcher()
      setData(result)
      cache.set(key, result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    invalidate,
    refresh
  }
}

// Fitness-specific cache utilities
export const fitnessCache = {
  // User profile with fitness data
  getUserProfile: cached(
    async (userId: string) => {
      // This would be replaced with actual API call
      const response = await fetch(`/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      return await response.json()
    },
    userCache,
    (userId) => `profile_${userId}`
  ),

  // Workout library
  getWorkoutLibrary: cached(
    async (filters?: { type?: string; difficulty?: string }) => {
      const params = new URLSearchParams(filters as Record<string, string>)
      const response = await fetch(`/api/workouts/library?${params}`)
      return await response.json()
    },
    workoutCache,
    (filters) => `workouts_${JSON.stringify(filters || {})}`
  ),

  // Leaderboard data
  getLeaderboard: cached(
    async (type: string = 'level', timeframe: string = 'all') => {
      const response = await fetch(`/api/leaderboard?type=${type}&timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      return await response.json()
    },
    leaderboardCache,
    (type, timeframe) => `leaderboard_${type}_${timeframe}`,
    2 * 60 * 1000 // 2 minutes for leaderboard freshness
  ),

  // Analytics data
  getAnalytics: cached(
    async (timeframe: string = 'month') => {
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      return await response.json()
    },
    analyticsCache,
    (timeframe) => `analytics_${timeframe}`
  ),

  // Store products
  getStoreProducts: cached(
    async (category?: string) => {
      const params = category ? `?category=${category}` : ''
      const response = await fetch(`/api/store/products${params}`)
      return await response.json()
    },
    userCache, // Using userCache for store products
    (category) => `store_${category || 'all'}`,
    10 * 60 * 1000 // 10 minutes for product data
  )
}

// Helper to get auth token (would be implemented based on your auth system)
function getAuthToken(): string {
  // This would get the token from localStorage, cookies, or context
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fitforge_token') || ''
  }
  return ''
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react'

// Cache statistics for monitoring
export function getCacheStats() {
  return {
    user: userCache.getStats(),
    workout: workoutCache.getStats(),
    leaderboard: leaderboardCache.getStats(),
    analytics: analyticsCache.getStats()
  }
}

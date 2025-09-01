// Production configuration management for FitForge
interface DatabaseConfig {
  host: string
  port: number
  name: string
  user: string
  password: string
  ssl: boolean
  poolSize: number
}

interface RedisConfig {
  host: string
  port: number
  password?: string
  db: number
  keyPrefix: string
}

interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: string
  bcryptRounds: number
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
}

interface MonitoringConfig {
  errorReporting: {
    enabled: boolean
    service: 'sentry' | 'custom'
    dsn?: string
  }
  analytics: {
    enabled: boolean
    service: 'posthog' | 'custom'
    apiKey?: string
  }
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug'
    destination: 'console' | 'file' | 'external'
    maxFileSize?: string
    maxFiles?: number
  }
}

interface EmailConfig {
  provider: 'sendgrid' | 'ses' | 'smtp'
  apiKey?: string
  smtpHost?: string
  smtpPort?: number
  from: {
    name: string
    email: string
  }
  templates: {
    welcome: string
    passwordReset: string
    workoutReminder: string
    achievement: string
  }
}

interface PushNotificationConfig {
  firebase: {
    serverKey: string
    projectId: string
  }
  apple: {
    keyId: string
    teamId: string
    bundleId: string
    keyPath: string
  }
}

interface PaymentConfig {
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
  }
  paypal: {
    clientId: string
    clientSecret: string
    environment: 'sandbox' | 'production'
  }
}

interface StorageConfig {
  provider: 's3' | 'gcs' | 'local'
  s3?: {
    bucketName: string
    region: string
    accessKeyId: string
    secretAccessKey: string
  }
  gcs?: {
    bucketName: string
    projectId: string
    keyFilePath: string
  }
  local?: {
    uploadPath: string
    maxFileSize: number
  }
}

interface FitnessConfig {
  workouts: {
    maxDurationMinutes: number
    minDurationMinutes: number
    caloriesPerMinuteBase: number
    xpMultipliers: {
      beginner: number
      intermediate: number
      advanced: number
    }
  }
  achievements: {
    enabled: boolean
    xpRewards: {
      bronze: number
      silver: number
      gold: number
      platinum: number
    }
  }
  leaderboard: {
    refreshIntervalSeconds: number
    maxEntries: number
    cacheExpiryMinutes: number
  }
  challenges: {
    maxParticipants: number
    minDurationDays: number
    maxDurationDays: number
    xpBonusMultiplier: number
  }
}

export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'production' | 'staging'
    port: number
    host: string
    basePath: string
    cors: {
      origins: string[]
      credentials: boolean
    }
  }
  database: DatabaseConfig
  redis: RedisConfig
  auth: AuthConfig
  monitoring: MonitoringConfig
  email: EmailConfig
  pushNotifications: PushNotificationConfig
  payments: PaymentConfig
  storage: StorageConfig
  fitness: FitnessConfig
  features: {
    realtime: boolean
    analytics: boolean
    notifications: boolean
    payments: boolean
    socialFeatures: boolean
    aiCoach: boolean
    threeJsForge: boolean
  }
}

// Environment variable helpers
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (!value && defaultValue === undefined) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value || defaultValue!
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key]
  if (!value) {
    if (defaultValue === undefined) {
      throw new Error(`Required environment variable ${key} is not set`)
    }
    return defaultValue
  }
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${value}`)
  }
  return parsed
}

function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key]
  if (!value) {
    if (defaultValue === undefined) {
      throw new Error(`Required environment variable ${key} is not set`)
    }
    return defaultValue
  }
  return value.toLowerCase() === 'true'
}

// Load configuration based on environment
function loadConfig(): AppConfig {
  const environment = getEnvVar('NODE_ENV', 'development') as 'development' | 'production' | 'staging'
  
  // Base configuration
  const config: AppConfig = {
    app: {
      name: getEnvVar('APP_NAME', 'FitForge Fitness Hub'),
      version: getEnvVar('APP_VERSION', '1.0.0'),
      environment,
      port: getEnvNumber('PORT', 3000),
      host: getEnvVar('HOST', '0.0.0.0'),
      basePath: getEnvVar('BASE_PATH', ''),
      cors: {
        origins: getEnvVar('CORS_ORIGINS', '*').split(','),
        credentials: getEnvBoolean('CORS_CREDENTIALS', true)
      }
    },

    database: {
      host: getEnvVar('DATABASE_HOST', 'localhost'),
      port: getEnvNumber('DATABASE_PORT', 5432),
      name: getEnvVar('DATABASE_NAME', 'fitforge'),
      user: getEnvVar('DATABASE_USER', 'fitforge'),
      password: getEnvVar('DATABASE_PASSWORD', 'password'),
      ssl: getEnvBoolean('DATABASE_SSL', environment === 'production'),
      poolSize: getEnvNumber('DATABASE_POOL_SIZE', 20)
    },

    redis: {
      host: getEnvVar('REDIS_HOST', 'localhost'),
      port: getEnvNumber('REDIS_PORT', 6379),
      password: getEnvVar('REDIS_PASSWORD', undefined),
      db: getEnvNumber('REDIS_DB', 0),
      keyPrefix: getEnvVar('REDIS_KEY_PREFIX', 'fitforge:')
    },

    auth: {
      jwtSecret: getEnvVar('JWT_SECRET', 'change-me-in-production'),
      jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
      bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
      sessionTimeout: getEnvNumber('SESSION_TIMEOUT', 24 * 60 * 60 * 1000), // 24 hours
      maxLoginAttempts: getEnvNumber('MAX_LOGIN_ATTEMPTS', 5),
      lockoutDuration: getEnvNumber('LOCKOUT_DURATION', 15 * 60 * 1000) // 15 minutes
    },

    monitoring: {
      errorReporting: {
        enabled: getEnvBoolean('ERROR_REPORTING_ENABLED', environment === 'production'),
        service: getEnvVar('ERROR_REPORTING_SERVICE', 'custom') as 'sentry' | 'custom',
        dsn: getEnvVar('SENTRY_DSN', undefined)
      },
      analytics: {
        enabled: getEnvBoolean('ANALYTICS_ENABLED', environment === 'production'),
        service: getEnvVar('ANALYTICS_SERVICE', 'custom') as 'posthog' | 'custom',
        apiKey: getEnvVar('ANALYTICS_API_KEY', undefined)
      },
      logging: {
        level: getEnvVar('LOG_LEVEL', environment === 'production' ? 'info' : 'debug') as any,
        destination: getEnvVar('LOG_DESTINATION', 'console') as any,
        maxFileSize: getEnvVar('LOG_MAX_FILE_SIZE', '10MB'),
        maxFiles: getEnvNumber('LOG_MAX_FILES', 5)
      }
    },

    email: {
      provider: getEnvVar('EMAIL_PROVIDER', 'smtp') as 'sendgrid' | 'ses' | 'smtp',
      apiKey: getEnvVar('EMAIL_API_KEY', undefined),
      smtpHost: getEnvVar('SMTP_HOST', 'localhost'),
      smtpPort: getEnvNumber('SMTP_PORT', 587),
      from: {
        name: getEnvVar('EMAIL_FROM_NAME', 'FitForge Team'),
        email: getEnvVar('EMAIL_FROM_ADDRESS', 'noreply@fitforge.com')
      },
      templates: {
        welcome: getEnvVar('EMAIL_TEMPLATE_WELCOME', 'welcome'),
        passwordReset: getEnvVar('EMAIL_TEMPLATE_PASSWORD_RESET', 'password-reset'),
        workoutReminder: getEnvVar('EMAIL_TEMPLATE_WORKOUT_REMINDER', 'workout-reminder'),
        achievement: getEnvVar('EMAIL_TEMPLATE_ACHIEVEMENT', 'achievement')
      }
    },

    pushNotifications: {
      firebase: {
        serverKey: getEnvVar('FIREBASE_SERVER_KEY', ''),
        projectId: getEnvVar('FIREBASE_PROJECT_ID', '')
      },
      apple: {
        keyId: getEnvVar('APPLE_PUSH_KEY_ID', ''),
        teamId: getEnvVar('APPLE_PUSH_TEAM_ID', ''),
        bundleId: getEnvVar('APPLE_PUSH_BUNDLE_ID', ''),
        keyPath: getEnvVar('APPLE_PUSH_KEY_PATH', '')
      }
    },

    payments: {
      stripe: {
        publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY', ''),
        secretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
        webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', '')
      },
      paypal: {
        clientId: getEnvVar('PAYPAL_CLIENT_ID', ''),
        clientSecret: getEnvVar('PAYPAL_CLIENT_SECRET', ''),
        environment: getEnvVar('PAYPAL_ENVIRONMENT', 'sandbox') as 'sandbox' | 'production'
      }
    },

    storage: {
      provider: getEnvVar('STORAGE_PROVIDER', 'local') as 's3' | 'gcs' | 'local',
      s3: {
        bucketName: getEnvVar('S3_BUCKET_NAME', ''),
        region: getEnvVar('S3_REGION', 'us-east-1'),
        accessKeyId: getEnvVar('S3_ACCESS_KEY_ID', ''),
        secretAccessKey: getEnvVar('S3_SECRET_ACCESS_KEY', '')
      },
      gcs: {
        bucketName: getEnvVar('GCS_BUCKET_NAME', ''),
        projectId: getEnvVar('GCS_PROJECT_ID', ''),
        keyFilePath: getEnvVar('GCS_KEY_FILE_PATH', '')
      },
      local: {
        uploadPath: getEnvVar('LOCAL_UPLOAD_PATH', './uploads'),
        maxFileSize: getEnvNumber('LOCAL_MAX_FILE_SIZE', 10 * 1024 * 1024) // 10MB
      }
    },

    fitness: {
      workouts: {
        maxDurationMinutes: getEnvNumber('WORKOUT_MAX_DURATION', 300), // 5 hours
        minDurationMinutes: getEnvNumber('WORKOUT_MIN_DURATION', 1),
        caloriesPerMinuteBase: getEnvNumber('CALORIES_PER_MINUTE_BASE', 5),
        xpMultipliers: {
          beginner: getEnvNumber('XP_MULTIPLIER_BEGINNER', 1.0),
          intermediate: getEnvNumber('XP_MULTIPLIER_INTERMEDIATE', 1.2),
          advanced: getEnvNumber('XP_MULTIPLIER_ADVANCED', 1.5)
        }
      },
      achievements: {
        enabled: getEnvBoolean('ACHIEVEMENTS_ENABLED', true),
        xpRewards: {
          bronze: getEnvNumber('XP_REWARD_BRONZE', 50),
          silver: getEnvNumber('XP_REWARD_SILVER', 150),
          gold: getEnvNumber('XP_REWARD_GOLD', 300),
          platinum: getEnvNumber('XP_REWARD_PLATINUM', 500)
        }
      },
      leaderboard: {
        refreshIntervalSeconds: getEnvNumber('LEADERBOARD_REFRESH_INTERVAL', 60),
        maxEntries: getEnvNumber('LEADERBOARD_MAX_ENTRIES', 100),
        cacheExpiryMinutes: getEnvNumber('LEADERBOARD_CACHE_EXPIRY', 5)
      },
      challenges: {
        maxParticipants: getEnvNumber('CHALLENGE_MAX_PARTICIPANTS', 1000),
        minDurationDays: getEnvNumber('CHALLENGE_MIN_DURATION', 1),
        maxDurationDays: getEnvNumber('CHALLENGE_MAX_DURATION', 365),
        xpBonusMultiplier: getEnvNumber('CHALLENGE_XP_BONUS_MULTIPLIER', 1.5)
      }
    },

    features: {
      realtime: getEnvBoolean('FEATURE_REALTIME', true),
      analytics: getEnvBoolean('FEATURE_ANALYTICS', true),
      notifications: getEnvBoolean('FEATURE_NOTIFICATIONS', true),
      payments: getEnvBoolean('FEATURE_PAYMENTS', true),
      socialFeatures: getEnvBoolean('FEATURE_SOCIAL', true),
      aiCoach: getEnvBoolean('FEATURE_AI_COACH', true),
      threeJsForge: getEnvBoolean('FEATURE_3D_FORGE', true)
    }
  }

  // Environment-specific overrides
  if (environment === 'development') {
    config.monitoring.errorReporting.enabled = false
    config.monitoring.analytics.enabled = false
    config.monitoring.logging.level = 'debug'
    config.database.ssl = false
  }

  if (environment === 'production') {
    // Production security settings
    if (config.auth.jwtSecret === 'change-me-in-production') {
      throw new Error('JWT_SECRET must be set in production')
    }
    
    config.monitoring.logging.level = 'info'
    config.database.ssl = true
    
    // Ensure critical services have proper configuration
    if (config.features.payments && !config.payments.stripe.secretKey) {
      console.warn('Payment features enabled but Stripe not configured')
    }
    
    if (config.features.notifications && !config.email.apiKey && config.email.provider !== 'smtp') {
      console.warn('Notifications enabled but email service not configured')
    }
  }

  return config
}

// Validate configuration
function validateConfig(config: AppConfig) {
  const errors: string[] = []

  // Validate required fields
  if (!config.app.name) errors.push('App name is required')
  if (!config.database.host) errors.push('Database host is required')
  if (!config.database.name) errors.push('Database name is required')

  // Validate ports
  if (config.app.port < 1 || config.app.port > 65535) {
    errors.push('App port must be between 1 and 65535')
  }

  // Validate email configuration if notifications are enabled
  if (config.features.notifications) {
    if (!config.email.from.email) errors.push('Email from address is required when notifications are enabled')
    
    if (config.email.provider === 'smtp' && !config.email.smtpHost) {
      errors.push('SMTP host is required when using SMTP email provider')
    }
  }

  // Validate payment configuration if payments are enabled
  if (config.features.payments) {
    if (!config.payments.stripe.secretKey && !config.payments.paypal.clientSecret) {
      errors.push('At least one payment provider must be configured when payments are enabled')
    }
  }

  // Validate storage configuration
  if (config.storage.provider === 's3' && !config.storage.s3?.bucketName) {
    errors.push('S3 bucket name is required when using S3 storage')
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
}

// Load and validate configuration
const config = loadConfig()
validateConfig(config)

export default config

// Export individual config sections for convenience
export const {
  app: appConfig,
  database: databaseConfig,
  redis: redisConfig,
  auth: authConfig,
  monitoring: monitoringConfig,
  email: emailConfig,
  pushNotifications: pushNotificationConfig,
  payments: paymentConfig,
  storage: storageConfig,
  fitness: fitnessConfig
} = config

// Helper functions
export function isProduction(): boolean {
  return config.app.environment === 'production'
}

export function isDevelopment(): boolean {
  return config.app.environment === 'development'
}

export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return config.features[feature]
}

// Configuration change detection (useful for hot reloading in development)
export function getConfigChecksum(): string {
  return Buffer.from(JSON.stringify(config)).toString('base64').slice(0, 16)
}

console.log(`🔥 FitForge ${config.app.name} v${config.app.version} loaded in ${config.app.environment} mode`)
if (config.app.environment === 'development') {
  console.log('📋 Configuration:', {
    database: config.database.host,
    redis: config.redis.host,
    features: Object.entries(config.features).filter(([, enabled]) => enabled).map(([name]) => name),
    port: config.app.port
  })
}

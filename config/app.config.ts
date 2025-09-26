import { z } from 'zod'

// Configuration schema for validation
const AppConfigSchema = z.object({
  cache: z.object({
    ttl: z.number().min(1000).default(24 * 60 * 60 * 1000), // 24 hours default
    maxSize: z.number().min(10).default(1000) // Max cache entries
  }),
  api: z.object({
    limits: z.object({
      maxReviews: z.number().min(10).max(500).default(100),
      iosReviews: z.number().min(5).max(250).default(50),
      androidReviews: z.number().min(5).max(250).default(50)
    }),
    scraping: z.object({
      country: z.string().length(2).default('us'), // ISO 2-letter country code
      timeout: z.number().min(5000).max(30000).default(15000), // 15 seconds
      retries: z.number().min(0).max(5).default(2)
    }),
    rateLimit: z.object({
      windowMs: z.number().min(60000).default(15 * 60 * 1000), // 15 minutes
      maxRequests: z.number().min(1).default(100)
    })
  }),
  features: z.object({
    enableSentimentAnalysis: z.boolean().default(true),
    enableCaching: z.boolean().default(true),
    enableRateLimit: z.boolean().default(true),
    debugMode: z.boolean().default(false)
  })
})

// Default configuration
const defaultConfig = {
  cache: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 1000
  },
  api: {
    limits: {
      maxReviews: 100,
      iosReviews: 50,
      androidReviews: 50
    },
    scraping: {
      country: 'us',
      timeout: 15000,
      retries: 2
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  },
  features: {
    enableSentimentAnalysis: true,
    enableCaching: true,
    enableRateLimit: true,
    debugMode: false
  }
}

// Environment variable mappings
function loadConfigFromEnv() {
  return {
    cache: {
      ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : defaultConfig.cache.ttl,
      maxSize: process.env.CACHE_MAX_SIZE ? parseInt(process.env.CACHE_MAX_SIZE) : defaultConfig.cache.maxSize
    },
    api: {
      limits: {
        maxReviews: process.env.API_MAX_REVIEWS ? parseInt(process.env.API_MAX_REVIEWS) : defaultConfig.api.limits.maxReviews,
        iosReviews: process.env.API_IOS_REVIEWS ? parseInt(process.env.API_IOS_REVIEWS) : defaultConfig.api.limits.iosReviews,
        androidReviews: process.env.API_ANDROID_REVIEWS ? parseInt(process.env.API_ANDROID_REVIEWS) : defaultConfig.api.limits.androidReviews
      },
      scraping: {
        country: process.env.API_COUNTRY || defaultConfig.api.scraping.country,
        timeout: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : defaultConfig.api.scraping.timeout,
        retries: process.env.API_RETRIES ? parseInt(process.env.API_RETRIES) : defaultConfig.api.scraping.retries
      },
      rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : defaultConfig.api.rateLimit.windowMs,
        maxRequests: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : defaultConfig.api.rateLimit.maxRequests
      }
    },
    features: {
      enableSentimentAnalysis: process.env.ENABLE_SENTIMENT !== 'false',
      enableCaching: process.env.ENABLE_CACHING !== 'false',
      enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
      debugMode: process.env.DEBUG_MODE === 'true'
    }
  }
}

// Load and validate configuration
function createAppConfig() {
  const envConfig = loadConfigFromEnv()
  const result = AppConfigSchema.safeParse(envConfig)
  
  if (!result.success) {
    console.error('Invalid configuration:', result.error.errors)
    console.log('Using default configuration...')
    return AppConfigSchema.parse(defaultConfig)
  }
  
  return result.data
}

export const appConfig = createAppConfig()

// Type export for TypeScript
export type AppConfig = z.infer<typeof AppConfigSchema>

// Helper functions
export function getCountryList() {
  return [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
    { code: 'br', name: 'Brazil' },
    { code: 'in', name: 'India' },
    { code: 'cn', name: 'China' }
  ]
}

export function validateCountryCode(country: string): boolean {
  return getCountryList().some(c => c.code === country.toLowerCase())
}

// Configuration change detection
let configChangeCallbacks: Array<(config: AppConfig) => void> = []

export function onConfigChange(callback: (config: AppConfig) => void) {
  configChangeCallbacks.push(callback)
}

export function updateConfig(newConfig: Partial<AppConfig>) {
  const updatedConfig = { ...appConfig, ...newConfig }
  const result = AppConfigSchema.safeParse(updatedConfig)
  
  if (result.success) {
    Object.assign(appConfig, result.data)
    configChangeCallbacks.forEach(callback => callback(appConfig))
    return true
  } else {
    console.error('Invalid configuration update:', result.error.errors)
    return false
  }
}

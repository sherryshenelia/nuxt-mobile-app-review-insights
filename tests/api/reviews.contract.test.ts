import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { z } from 'zod'

// API Response Schema Definitions
const AppInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().min(0).max(5).optional(),
  ratingCount: z.number().optional(),
  icon: z.string().optional(),
  developer: z.string().optional(),
  price: z.string().optional()
})

const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  date: z.string(),
  title: z.string(),
  content: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  source: z.enum(['ios', 'android'])
})

const SummarySchema = z.object({
  ios: z.number().min(0),
  android: z.number().min(0),
  sentimentDistribution: z.object({
    positive: z.number().min(0),
    neutral: z.number().min(0),
    negative: z.number().min(0)
  }),
  ratingDistribution: z.object({
    5: z.number().min(0),
    4: z.number().min(0),
    3: z.number().min(0),
    2: z.number().min(0),
    1: z.number().min(0)
  })
})

const ApiResponseSchema = z.object({
  appInfo: z.object({
    foundApps: z.object({
      ios: AppInfoSchema.optional(),
      android: AppInfoSchema.optional()
    })
  }),
  reviews: z.array(ReviewSchema).max(100), // Max 100 reviews as per current config
  summary: SummarySchema
})

// Test server URL
const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000'

describe('Reviews API Contract Tests', () => {
  beforeAll(async () => {
    // Ensure test server is running
    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'test' })
      })
      if (!response.ok) {
        throw new Error('Test server not available')
      }
    } catch (error) {
      console.warn('Test server might not be running:', error)
    }
  })

  describe('Request Validation', () => {
    it('should reject requests without appName', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      expect(response.status).toBe(400)
    })

    it('should reject requests with invalid appName type', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 123 })
      })
      
      expect(response.status).toBe(400)
    })

    it('should reject requests with empty appName', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: '' })
      })
      
      expect(response.status).toBe(400)
    })
  })

  describe('Response Contract', () => {
    it('should return valid response structure for valid app', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')

      const data = await response.json()
      
      // Validate against schema
      const result = ApiResponseSchema.safeParse(data)
      if (!result.success) {
        console.error('Schema validation errors:', result.error.errors)
      }
      expect(result.success).toBe(true)
    })

    it('should return consistent review count limits', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      const data = await response.json()
      
      // Should not exceed 100 reviews total
      expect(data.reviews.length).toBeLessThanOrEqual(100)
      
      // Summary counts should match actual review counts
      const iosCount = data.reviews.filter((r: any) => r.source === 'ios').length
      const androidCount = data.reviews.filter((r: any) => r.source === 'android').length
      
      expect(data.summary.ios).toBe(iosCount)
      expect(data.summary.android).toBe(androidCount)
    })

    it('should return valid sentiment distribution', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      const data = await response.json()
      
      // Count sentiments manually
      const sentimentCounts = data.reviews.reduce((acc: any, review: any) => {
        acc[review.sentiment]++
        return acc
      }, { positive: 0, neutral: 0, negative: 0 })
      
      expect(data.summary.sentimentDistribution).toEqual(sentimentCounts)
    })

    it('should return valid rating distribution', async () => {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      const data = await response.json()
      
      // Count ratings manually
      const ratingCounts = data.reviews.reduce((acc: any, review: any) => {
        acc[review.rating]++
        return acc
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
      
      expect(data.summary.ratingDistribution).toEqual(ratingCounts)
    })
  })

  describe('Performance Contract', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now()
      
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(5000) // Should be under 5 seconds
    }, 10000) // 10 second timeout

    it('should handle cache hits efficiently', async () => {
      // First request (cache miss)
      await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'TestCachePerf' })
      })

      // Second request (cache hit) - should be much faster
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'TestCachePerf' })
      })
      const endTime = Date.now()
      
      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(500) // Cache hit should be under 500ms
    })
  })
})

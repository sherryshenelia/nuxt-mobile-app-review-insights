import { describe, it, expect, beforeEach } from 'vitest'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('Mock API Tests', () => {
  describe('Successful API Responses', () => {
    it('should return Instagram data when searching for Instagram', async () => {
      // ARRANGE
      const requestData = { appName: 'Instagram' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(200)
      expect(data.appInfo.foundApps.ios.name).toBe('Instagram')
      expect(data.appInfo.foundApps.android.name).toBe('Instagram')
      expect(data.reviews).toHaveLength(5)
      expect(data.summary.sentimentDistribution.positive).toBe(2)
      expect(data.summary.sentimentDistribution.negative).toBe(2)
      expect(data.summary.sentimentDistribution.neutral).toBe(1)
    })

    it('should return TikTok data when searching for TikTok', async () => {
      // ARRANGE
      const requestData = { appName: 'TikTok' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(200)
      expect(data.appInfo.foundApps.ios.name).toBe('TikTok')
      expect(data.appInfo.foundApps.ios.rating).toBe(4.5)
      expect(data.appInfo.foundApps.android.rating).toBe(4.2)
      expect(data.reviews).toHaveLength(2)
      expect(data.summary.sentimentDistribution.positive).toBe(2)
    })

    it('should return generic data for unknown apps', async () => {
      // ARRANGE
      const requestData = { appName: 'UnknownApp' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(200)
      expect(data.appInfo.foundApps.ios.name).toBe('UnknownApp')
      expect(data.appInfo.foundApps.ios.rating).toBe(3.5)
      expect(data.appInfo.foundApps.android.rating).toBe(3.3)
    })
  })

  describe('Error Scenarios', () => {
    it('should return 404 for non-existent app', async () => {
      // ARRANGE
      const requestData = { appName: 'NonExistentApp' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(404)
      expect(data.error).toBe('App not found')
      expect(data.message).toBe('Could not find the specified app in the app stores')
    })

    it('should return 500 for server errors', async () => {
      // ARRANGE
      const requestData = { appName: 'ErrorApp' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('Performance Testing', () => {
    it('should handle slow responses', async () => {
      // ARRANGE
      const requestData = { appName: 'SlowApp' }
      const startTime = Date.now()

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const endTime = Date.now()
      const duration = endTime - startTime

      // ASSERT
      expect(response.status).toBe(200)
      expect(duration).toBeGreaterThan(3000) // Should take at least 3 seconds
    }, 10000) // 10 second timeout for this test
  })

  describe('Dynamic Mock Overrides', () => {
    it('should allow overriding mock responses for specific tests', async () => {
      // ARRANGE - Override the mock for this specific test
      server.use(
        http.post('/api/reviews', () => {
          return HttpResponse.json({
            appInfo: {
              foundApps: {
                ios: { name: 'TestApp', rating: 5.0 },
                android: { name: 'TestApp', rating: 4.9 }
              }
            },
            reviews: [],
            summary: {
              ios: 0,
              android: 0,
              sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
              ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            }
          })
        })
      )

      const requestData = { appName: 'AnyApp' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT
      expect(response.status).toBe(200)
      expect(data.appInfo.foundApps.ios.name).toBe('TestApp')
      expect(data.appInfo.foundApps.ios.rating).toBe(5.0)
      expect(data.reviews).toHaveLength(0)
    })
  })

  describe('Request Validation', () => {
    it('should validate request body structure', async () => {
      // Test different request scenarios
      const testCases = [
        { body: { appName: 'Instagram' }, expected: 200 },
        { body: { appName: '' }, expected: 200 }, // Empty string should still work
        { body: {}, expected: 200 }, // Missing appName should work (returns generic)
      ]

      for (const testCase of testCases) {
        // ACT
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.body)
        })

        // ASSERT
        expect(response.status).toBe(testCase.expected)
      }
    })
  })

  describe('Response Structure Validation', () => {
    it('should return consistent response structure', async () => {
      // ARRANGE
      const requestData = { appName: 'Instagram' }

      // ACT
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()

      // ASSERT - Check structure
      expect(data).toHaveProperty('appInfo')
      expect(data).toHaveProperty('reviews')
      expect(data).toHaveProperty('summary')
      
      expect(data.appInfo).toHaveProperty('foundApps')
      expect(data.appInfo.foundApps).toHaveProperty('ios')
      expect(data.appInfo.foundApps).toHaveProperty('android')
      
      expect(data.summary).toHaveProperty('sentimentDistribution')
      expect(data.summary).toHaveProperty('ratingDistribution')
      
      // Check review structure
      if (data.reviews.length > 0) {
        const review = data.reviews[0]
        expect(review).toHaveProperty('rating')
        expect(review).toHaveProperty('date')
        expect(review).toHaveProperty('title')
        expect(review).toHaveProperty('content')
        expect(review).toHaveProperty('sentiment')
        expect(review).toHaveProperty('source')
        
        expect(['positive', 'neutral', 'negative']).toContain(review.sentiment)
        expect(['ios', 'android']).toContain(review.source)
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      }
    })
  })
})

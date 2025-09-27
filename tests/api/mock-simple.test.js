import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock data
const mockInstagramResponse = {
  appInfo: {
    foundApps: {
      ios: { name: "Instagram", rating: 4.1 },
      android: { name: "Instagram", rating: 3.9 }
    }
  },
  reviews: [
    {
      rating: 5,
      title: "Love this app!",
      content: "Instagram is amazing for sharing photos!",
      sentiment: "positive",
      source: "ios",
      date: "2024-01-15"
    }
  ],
  summary: {
    ios: 1,
    android: 0,
    sentimentDistribution: { positive: 1, neutral: 0, negative: 0 },
    ratingDistribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 }
  }
}

// Mock handlers
const handlers = [
  http.post('/api/reviews', async ({ request }) => {
    const body = await request.json()
    const appName = body.appName?.toLowerCase()

    if (appName === 'instagram') {
      return HttpResponse.json(mockInstagramResponse)
    }
    
    if (appName === 'errorapp') {
      return HttpResponse.json(
        { error: "App not found", message: "Could not find app" },
        { status: 404 }
      )
    }

    // Default response
    return HttpResponse.json({
      ...mockInstagramResponse,
      appInfo: {
        foundApps: {
          ios: { name: body.appName, rating: 3.5 },
          android: { name: body.appName, rating: 3.3 }
        }
      }
    })
  })
]

// Setup mock server
const server = setupServer(...handlers)

describe('Mock API Tests (Simple)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

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
    expect(data.reviews).toHaveLength(1)
    expect(data.reviews[0].sentiment).toBe('positive')
    expect(data.summary.sentimentDistribution.positive).toBe(1)
  })

  it('should return error for ErrorApp', async () => {
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
    expect(response.status).toBe(404)
    expect(data.error).toBe('App not found')
    expect(data.message).toBe('Could not find app')
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

  it('should validate response structure', async () => {
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
  })

  it('should allow dynamic mock overrides', async () => {
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

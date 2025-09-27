import { http, HttpResponse } from 'msw'
import { mockInstagramResponse, mockTikTokResponse, mockErrorResponse } from './data'

export const handlers = [
  // Mock successful API responses
  http.post('/api/reviews', async ({ request }) => {
    const body = await request.json() as { appName: string }
    const appName = body.appName?.toLowerCase()

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))

    switch (appName) {
      case 'instagram':
        return HttpResponse.json(mockInstagramResponse)
      
      case 'tiktok':
        return HttpResponse.json(mockTikTokResponse)
      
      case 'nonexistentapp':
        return HttpResponse.json(mockErrorResponse, { status: 404 })
      
      case 'slowapp':
        // Simulate slow response
        await new Promise(resolve => setTimeout(resolve, 3000))
        return HttpResponse.json(mockInstagramResponse)
      
      case 'errorapp':
        return HttpResponse.json(
          { error: "Internal server error", message: "Something went wrong" },
          { status: 500 }
        )
      
      default:
        // Return a generic response for unknown apps
        return HttpResponse.json({
          ...mockInstagramResponse,
          appInfo: {
            foundApps: {
              ios: {
                ...mockInstagramResponse.appInfo.foundApps.ios,
                name: body.appName,
                rating: 3.5
              },
              android: {
                ...mockInstagramResponse.appInfo.foundApps.android,
                name: body.appName,
                rating: 3.3
              }
            }
          }
        })
    }
  }),

  // Mock other endpoints if needed
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: Date.now() })
  })
]

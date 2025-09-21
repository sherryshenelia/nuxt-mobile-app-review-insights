import gplay from 'google-play-scraper'
import store from 'app-store-scraper'
import Sentiment from 'sentiment'

// Simple in-memory cache with TTL
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

interface ReviewData {
  rating: number
  date: string
  title: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  source: 'ios' | 'android'
}

interface AppSearchResult {
  ios?: {
    id: string
    name: string
    rating?: number
    ratingCount?: number
    icon?: string
    developer?: string
    price?: string
  }
  android?: {
    id: string
    name: string
    rating?: number
    ratingCount?: number
    icon?: string
    developer?: string
    price?: string
  }
}

const sentiment = new Sentiment()

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const result = sentiment.analyze(text)
  if (result.score > 1) return 'positive'
  if (result.score < -1) return 'negative'
  return 'neutral'
}

async function findAppIds(appName: string): Promise<AppSearchResult> {
  const result: AppSearchResult = {}
  
  try {
    // Search iOS App Store
    const iosResults = await store.search({
      term: appName,
      num: 5,
      country: 'us'
    })
    
    if (iosResults && iosResults.length > 0) {
      // Find the best match (exact name match or first result)
      const exactMatch = iosResults.find(app => 
        app.title.toLowerCase().includes(appName.toLowerCase()) ||
        appName.toLowerCase().includes(app.title.toLowerCase())
      )
      const selectedApp = exactMatch || iosResults[0]
      
      // Get detailed app info
      try {
        const appDetails = await store.app({ id: selectedApp.id.toString() })
        result.ios = {
          id: selectedApp.id.toString(),
          name: selectedApp.title,
          rating: appDetails.score,
          ratingCount: appDetails.reviews,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.price || 'Free'
        }
      } catch (detailError) {
        result.ios = {
          id: selectedApp.id.toString(),
          name: selectedApp.title,
          rating: selectedApp.score,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.price || 'Free'
        }
      }
    }
  } catch (error) {
    console.warn('iOS search failed:', error)
  }
  
  try {
    // Search Google Play Store
    const androidResults = await gplay.search({
      term: appName,
      num: 5,
      country: 'us',
      lang: 'en'
    })
    
    if (androidResults && androidResults.length > 0) {
      // Find the best match
      const exactMatch = androidResults.find(app => 
        app.title.toLowerCase().includes(appName.toLowerCase()) ||
        appName.toLowerCase().includes(app.title.toLowerCase())
      )
      const selectedApp = exactMatch || androidResults[0]
      
      // Get detailed app info
      try {
        const appDetails = await gplay.app({ appId: selectedApp.appId })
        result.android = {
          id: selectedApp.appId,
          name: selectedApp.title,
          rating: appDetails.score,
          ratingCount: appDetails.reviews,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.priceText || 'Free'
        }
      } catch (detailError) {
        result.android = {
          id: selectedApp.appId,
          name: selectedApp.title,
          rating: selectedApp.score,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.priceText || 'Free'
        }
      }
    }
  } catch (error) {
    console.warn('Android search failed:', error)
  }
  
  return result
}

async function fetchIOSReviews(appId: string, limit: number = 50): Promise<ReviewData[]> {
  try {
    const reviews = await store.reviews({
      id: appId,
      sort: store.sort.RECENT,
      page: 1,
      country: 'us'
    })
    
    return reviews.slice(0, limit).map(review => ({
      rating: review.score,
      date: review.date,
      title: review.title || '',
      content: review.text || '',
      sentiment: analyzeSentiment(review.text || ''),
      source: 'ios' as const
    }))
  } catch (error) {
    console.error('Failed to fetch iOS reviews:', error)
    return []
  }
}

async function fetchAndroidReviews(appId: string, limit: number = 50): Promise<ReviewData[]> {
  try {
    const reviews = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: limit,
      country: 'us',
      lang: 'en'
    })
    
    return reviews.data.map(review => ({
      rating: review.score,
      date: review.date,
      title: review.title || '',
      content: review.text || '',
      sentiment: analyzeSentiment(review.text || ''),
      source: 'android' as const
    }))
  } catch (error) {
    console.error('Failed to fetch Android reviews:', error)
    return []
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { appName } = body
    
    if (!appName || typeof appName !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'App name is required'
      })
    }
    
    const trimmedAppName = appName.trim()
    const cacheKey = `reviews_${trimmedAppName.toLowerCase().replace(/\s+/g, '_')}`
    
    // Check cache first
    const cachedResult = getCachedData(cacheKey)
    if (cachedResult) {
      console.log('Returning cached data for:', trimmedAppName)
      return cachedResult
    }
    
    // Find app IDs for both platforms
    const appIds = await findAppIds(trimmedAppName)
    
    if (!appIds.ios && !appIds.android) {
      throw createError({
        statusCode: 404,
        statusMessage: `No apps found for "${appName}"`
      })
    }
    
    // Fetch reviews from both platforms
    const reviewPromises: Promise<ReviewData[]>[] = []
    
    if (appIds.ios) {
      reviewPromises.push(fetchIOSReviews(appIds.ios.id))
    }
    
    if (appIds.android) {
      reviewPromises.push(fetchAndroidReviews(appIds.android.id))
    }
    
    const reviewResults = await Promise.all(reviewPromises)
    const allReviews = reviewResults.flat()
    
    // Sort by date (most recent first)
    allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Limit to ~100 total reviews
    const limitedReviews = allReviews.slice(0, 100)
    
    const result = {
      success: true,
      appInfo: {
        searchTerm: trimmedAppName,
        foundApps: appIds
      },
      reviews: limitedReviews,
      totalReviews: limitedReviews.length,
      summary: {
        ios: limitedReviews.filter(r => r.source === 'ios').length,
        android: limitedReviews.filter(r => r.source === 'android').length,
        sentimentDistribution: {
          positive: limitedReviews.filter(r => r.sentiment === 'positive').length,
          neutral: limitedReviews.filter(r => r.sentiment === 'neutral').length,
          negative: limitedReviews.filter(r => r.sentiment === 'negative').length
        },
        ratingDistribution: {
          5: limitedReviews.filter(r => r.rating === 5).length,
          4: limitedReviews.filter(r => r.rating === 4).length,
          3: limitedReviews.filter(r => r.rating === 3).length,
          2: limitedReviews.filter(r => r.rating === 2).length,
          1: limitedReviews.filter(r => r.rating === 1).length
        }
      }
    }
    
    // Cache the result
    setCachedData(cacheKey, result)
    console.log('Cached new data for:', trimmedAppName)
    
    return result
  } catch (error: any) {
    console.error('API Error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch reviews'
    })
  }
})

import gplay from 'google-play-scraper'
import store from 'app-store-scraper'
import Sentiment from 'sentiment'
import { appConfig } from '../../config/app.config'

// Simple in-memory cache with TTL
const cache = new Map()
const CACHE_TTL = appConfig.cache.ttl

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

function analyzeSentiment(text: string, rating?: number): 'positive' | 'neutral' | 'negative' {
  // Simplified logic: primarily use star rating for consistent results
  if (rating) {
    if (rating >= 4) return 'positive'    // 4-5 stars = positive (green)
    if (rating <= 2) return 'negative'    // 1-2 stars = negative (red)
    return 'neutral'                      // 3 stars = neutral (yellow)
  }
  
  // Fallback to text analysis only if no rating
  if (!text || text.length < 3) return 'neutral'
  
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
      country: appConfig.api.scraping.country
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
      country: appConfig.api.scraping.country,
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
      country: appConfig.api.scraping.country
    })
    
    return reviews.slice(0, limit).map(review => ({
      rating: review.score,
      date: review.updated || review.date || new Date().toISOString(),
      title: review.title || '',
      content: review.text || '',
      sentiment: analyzeSentiment(review.text || '', review.score),
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
      country: appConfig.api.scraping.country,
      lang: 'en'
    })
    
    return reviews.data.map(review => ({
      rating: review.score,
      date: review.date || new Date().toISOString(),
      title: review.title || '',
      content: review.text || '',
      sentiment: analyzeSentiment(review.text || '', review.score),
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
    
    // Fetch reviews from both platforms (reduced limit for better performance)
    const reviewPromises: Promise<ReviewData[]>[] = []
    
    if (appIds.ios) {
      reviewPromises.push(fetchIOSReviews(appIds.ios.id, appConfig.api.limits.iosReviews))
    }
    
    if (appIds.android) {
      reviewPromises.push(fetchAndroidReviews(appIds.android.id, appConfig.api.limits.androidReviews))
    }
    
    const reviewResults = await Promise.all(reviewPromises)
    const allReviews = reviewResults.flat()
    
    // Sort by date (most recent first)
    allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Limit total reviews based on configuration
    const limitedReviews = allReviews.slice(0, appConfig.api.limits.maxReviews)
    
    // Calculate summary statistics in a single pass (much faster)
    const summary = {
      ios: 0,
      android: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
    
    // Single loop instead of multiple filters
    limitedReviews.forEach(review => {
      // Count platform
      if (review.source === 'ios') summary.ios++
      else summary.android++
      
      // Count sentiment
      summary.sentimentDistribution[review.sentiment]++
      
      // Count rating
      summary.ratingDistribution[review.rating]++
    })
    
    const result = {
      success: true,
      appInfo: {
        searchTerm: trimmedAppName,
        foundApps: appIds
      },
      reviews: limitedReviews,
      totalReviews: limitedReviews.length,
      summary
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

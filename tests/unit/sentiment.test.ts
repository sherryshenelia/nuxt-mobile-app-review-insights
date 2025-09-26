import { describe, it, expect } from 'vitest'

// Sentiment analysis function for testing
function analyzeSentiment(text: string, rating?: number): 'positive' | 'neutral' | 'negative' {
  if (rating) {
    if (rating >= 4) return 'positive'    // 4-5 stars = positive (green)
    if (rating <= 2) return 'negative'    // 1-2 stars = negative (red)
    return 'neutral'                      // 3 stars = neutral (yellow)
  }
  
  if (!text || text.length < 3) return 'neutral'
  
  // Simplified sentiment analysis for testing
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best']
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible']
  
  const lowerText = text.toLowerCase()
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

describe('Sentiment Analysis', () => {
  describe('Rating-based sentiment', () => {
    it('should return positive for 4-5 star ratings', () => {
      expect(analyzeSentiment('Any text', 4)).toBe('positive')
      expect(analyzeSentiment('Any text', 5)).toBe('positive')
    })

    it('should return negative for 1-2 star ratings', () => {
      expect(analyzeSentiment('Any text', 1)).toBe('negative')
      expect(analyzeSentiment('Any text', 2)).toBe('negative')
    })

    it('should return neutral for 3 star ratings', () => {
      expect(analyzeSentiment('Any text', 3)).toBe('neutral')
    })
  })

  describe('Text-based sentiment (when no rating)', () => {
    it('should return positive for positive text', () => {
      expect(analyzeSentiment('This app is great and amazing!')).toBe('positive')
      expect(analyzeSentiment('I love this excellent app')).toBe('positive')
    })

    it('should return negative for negative text', () => {
      expect(analyzeSentiment('This app is terrible and awful')).toBe('negative')
      expect(analyzeSentiment('I hate this horrible app')).toBe('negative')
    })

    it('should return neutral for neutral or short text', () => {
      expect(analyzeSentiment('This app is okay')).toBe('neutral')
      expect(analyzeSentiment('Hi')).toBe('neutral')
      expect(analyzeSentiment('')).toBe('neutral')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty or undefined text', () => {
      expect(analyzeSentiment('', 4)).toBe('positive')
      expect(analyzeSentiment('', 2)).toBe('negative')
      expect(analyzeSentiment('', 3)).toBe('neutral')
    })

    it('should prioritize rating over text sentiment', () => {
      expect(analyzeSentiment('This is terrible', 5)).toBe('positive')
      expect(analyzeSentiment('This is amazing', 1)).toBe('negative')
    })
  })
})

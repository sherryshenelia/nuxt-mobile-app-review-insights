import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the dashboard component (simplified version for testing)
const MockDashboard = {
  template: `
    <div class="dashboard">
      <div class="search-section">
        <input 
          v-model="searchQuery" 
          @keyup.enter="searchApp"
          placeholder="Enter app name..."
          data-testid="search-input"
        />
        <button @click="searchApp" data-testid="search-button">
          Search
        </button>
      </div>
      
      <div v-if="loading" data-testid="loading">Loading...</div>
      
      <div v-if="error" data-testid="error" class="error">
        {{ error }}
      </div>
      
      <div v-if="data" data-testid="results" class="results">
        <div data-testid="app-name-ios">{{ data.appInfo.foundApps.ios.name }}</div>
        <div data-testid="app-rating-ios">{{ data.appInfo.foundApps.ios.rating }}</div>
        <div data-testid="app-name-android">{{ data.appInfo.foundApps.android.name }}</div>
        <div data-testid="app-rating-android">{{ data.appInfo.foundApps.android.rating }}</div>
        <div data-testid="review-count">{{ data.reviews.length }}</div>
        <div data-testid="positive-sentiment">{{ data.summary.sentimentDistribution.positive }}</div>
      </div>
    </div>
  `,
  data() {
    return {
      searchQuery: '',
      data: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async searchApp() {
      if (!this.searchQuery.trim()) return
      
      this.loading = true
      this.error = null
      this.data = null
      
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: this.searchQuery })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch data')
        }
        
        this.data = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}

describe('Dashboard Component with Mock API', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MockDashboard)
  })

  describe('Successful Searches', () => {
    it('should display Instagram data when searching for Instagram', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('Instagram')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      
      // Wait for API call to complete
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="results"]').exists()).toBe(true)
      
      expect(wrapper.find('[data-testid="app-name-ios"]').text()).toBe('Instagram')
      expect(wrapper.find('[data-testid="app-rating-ios"]').text()).toBe('4.1')
      expect(wrapper.find('[data-testid="app-name-android"]').text()).toBe('Instagram')
      expect(wrapper.find('[data-testid="app-rating-android"]').text()).toBe('3.9')
      expect(wrapper.find('[data-testid="review-count"]').text()).toBe('5')
      expect(wrapper.find('[data-testid="positive-sentiment"]').text()).toBe('2')
    })

    it('should display TikTok data when searching for TikTok', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('TikTok')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      
      // Wait for API call
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="app-name-ios"]').text()).toBe('TikTok')
      expect(wrapper.find('[data-testid="app-rating-ios"]').text()).toBe('4.5')
      expect(wrapper.find('[data-testid="review-count"]').text()).toBe('2')
      expect(wrapper.find('[data-testid="positive-sentiment"]').text()).toBe('2')
    })

    it('should allow search via Enter key', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('Instagram')

      // ACT
      await wrapper.find('[data-testid="search-input"]').trigger('keyup.enter')
      
      // Wait for API call
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="results"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="app-name-ios"]').text()).toBe('Instagram')
    })
  })

  describe('Error Handling', () => {
    it('should display error message for non-existent app', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('NonExistentApp')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      
      // Wait for API call
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="error"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="results"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="error"]').text()).toContain('Could not find the specified app')
    })

    it('should display error message for server errors', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('ErrorApp')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      
      // Wait for API call
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="error"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="error"]').text()).toContain('Something went wrong')
    })

    it('should not search with empty query', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="results"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
    })
  })

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      // ARRANGE
      await wrapper.find('[data-testid="search-input"]').setValue('Instagram')

      // ACT
      const searchPromise = wrapper.find('[data-testid="search-button"]').trigger('click')
      await wrapper.vm.$nextTick()

      // ASSERT - Should show loading immediately
      expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="results"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)

      // Wait for completion
      await searchPromise
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT - Loading should be gone
      expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
    })
  })

  describe('Dynamic Mock Scenarios', () => {
    it('should handle custom mock responses', async () => {
      // ARRANGE - Override mock for this test
      server.use(
        http.post('/api/reviews', () => {
          return HttpResponse.json({
            appInfo: {
              foundApps: {
                ios: { name: 'CustomApp', rating: 4.8 },
                android: { name: 'CustomApp', rating: 4.7 }
              }
            },
            reviews: [{ rating: 5, title: 'Amazing!', content: 'Best app ever!', sentiment: 'positive', source: 'ios', date: '2024-01-01' }],
            summary: {
              sentimentDistribution: { positive: 1, neutral: 0, negative: 0 },
              ratingDistribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 }
            }
          })
        })
      )

      await wrapper.find('[data-testid="search-input"]').setValue('CustomApp')

      // ACT
      await wrapper.find('[data-testid="search-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      // ASSERT
      expect(wrapper.find('[data-testid="app-name-ios"]').text()).toBe('CustomApp')
      expect(wrapper.find('[data-testid="app-rating-ios"]').text()).toBe('4.8')
      expect(wrapper.find('[data-testid="review-count"]').text()).toBe('1')
    })
  })
})

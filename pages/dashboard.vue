<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <span>←</span>
              <span class="font-medium">Back to Search</span>
            </NuxtLink>
            <div class="h-6 w-px bg-gray-300"></div>
            <h1 class="text-xl font-bold text-gray-900">
              {{ (appInfo?.searchTerm || 'App') + ' Mobile App Store Review Dashboard' }}
            </h1>
          </div>
          
          <div v-if="appInfo?.foundApps" class="flex items-center space-x-2 text-sm text-gray-600">
            <span>📱</span>
            <span>
              {{ appInfo.foundApps.ios ? 'iOS' : '' }}
              {{ appInfo.foundApps.ios && appInfo.foundApps.android ? ' & ' : '' }}
              {{ appInfo.foundApps.android ? 'Android' : '' }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="text-4xl mb-4">🔄</div>
          <p class="text-gray-600">Analyzing app reviews...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-lg mx-auto text-center">
        <div class="text-4xl mb-4">⚠️</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Failed to Load Reviews</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <NuxtLink to="/" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Try Another App
        </NuxtLink>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="reviewData" class="space-y-8">
        <!-- App Info Card -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center space-x-4">
            <!-- App Icon -->
            <div v-if="primaryAppInfo?.icon" class="flex-shrink-0">
              <img :src="primaryAppInfo.icon" :alt="primaryAppInfo.name" class="w-20 h-20 rounded-xl shadow-md">
            </div>
            <div v-else class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
              <span class="text-3xl">📱</span>
            </div>
            
            <!-- App Details -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ primaryAppInfo?.name || appInfo?.searchTerm }}</h2>
              <p v-if="primaryAppInfo?.developer" class="text-gray-600 mb-2">by {{ primaryAppInfo.developer }}</p>
              
              <!-- Ratings -->
              <div class="space-y-3">
                <!-- iOS Rating -->
                <div v-if="appInfo?.foundApps?.ios?.rating" class="flex items-center space-x-3">
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-medium text-blue-600 w-12">iOS</span>
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" :class="i <= Math.round(appInfo.foundApps.ios.rating) ? 'text-yellow-400' : 'text-gray-300'">⭐</span>
                    </div>
                    <span class="font-semibold text-lg">{{ appInfo.foundApps.ios.rating.toFixed(1) }}</span>
                    <span v-if="appInfo.foundApps.ios.ratingCount" class="text-gray-500 text-sm">({{ formatNumber(appInfo.foundApps.ios.ratingCount) }})</span>
                  </div>
                </div>
                
                <!-- Android Rating -->
                <div v-if="appInfo?.foundApps?.android?.rating" class="flex items-center space-x-3">
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-medium text-green-600 w-12">Android</span>
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" :class="i <= Math.round(appInfo.foundApps.android.rating) ? 'text-yellow-400' : 'text-gray-300'">⭐</span>
                    </div>
                    <span class="font-semibold text-lg">{{ appInfo.foundApps.android.rating.toFixed(1) }}</span>
                    <span v-if="appInfo.foundApps.android.ratingCount" class="text-gray-500 text-sm">({{ formatNumber(appInfo.foundApps.android.ratingCount) }})</span>
                  </div>
                </div>
                
                <!-- Price -->
                <div v-if="primaryAppInfo?.price" class="flex items-center">
                  <span class="text-green-600 font-medium">{{ primaryAppInfo.price }}</span>
                </div>
              </div>
            </div>
            
            <!-- Platform Badges -->
            <div class="flex flex-col space-y-2">
              <span v-if="appInfo?.foundApps?.ios" class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full text-center">
                iOS App Store
              </span>
              <span v-if="appInfo?.foundApps?.android" class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full text-center">
                Google Play
              </span>
            </div>
          </div>
        </div>

        <!-- Compact Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-center">
            <div class="text-lg mb-1">📄</div>
            <div class="text-lg font-bold text-gray-900">{{ reviewData.totalReviews }}</div>
            <div class="text-xs text-gray-600">Reviews</div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-center">
            <div class="text-lg mb-1">⭐</div>
            <div class="text-lg font-bold text-gray-900">{{ averageRating }}</div>
            <div class="text-xs text-gray-600">Avg Rating</div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-center">
            <div class="text-lg mb-1">💚</div>
            <div class="text-lg font-bold text-gray-900">{{ sentimentPercentage.positive }}%</div>
            <div class="text-xs text-gray-600">Positive</div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-center">
            <div class="text-lg mb-1">📱</div>
            <div class="text-lg font-bold text-gray-900">{{ platformSplit }}</div>
            <div class="text-xs text-gray-600">iOS/Android</div>
          </div>
        </div>

        <!-- Compact Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <!-- Rating Distribution -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 class="text-md font-semibold text-gray-900 mb-3">Rating Distribution</h3>
            <div class="space-y-2">
              <div v-for="(count, rating) in reviewData.summary.ratingDistribution" :key="rating" class="flex items-center">
                <span class="w-8 text-xs font-medium">{{ rating }}⭐</span>
                <div class="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: (count / reviewData.totalReviews * 100) + '%' }"
                  ></div>
                </div>
                <span class="w-8 text-xs text-gray-600">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- Sentiment Analysis -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 class="text-md font-semibold text-gray-900 mb-3">Sentiment Analysis</h3>
            <div class="grid grid-cols-3 gap-2">
              <div class="text-center">
                <div class="text-xl mb-1">😊</div>
                <div class="text-md font-bold text-green-600">{{ reviewData.summary.sentimentDistribution.positive }}</div>
                <div class="text-xs text-gray-600">Positive</div>
              </div>
              <div class="text-center">
                <div class="text-xl mb-1">😐</div>
                <div class="text-md font-bold text-yellow-600">{{ reviewData.summary.sentimentDistribution.neutral }}</div>
                <div class="text-xs text-gray-600">Neutral</div>
              </div>
              <div class="text-center">
                <div class="text-xl mb-1">😞</div>
                <div class="text-md font-bold text-red-600">{{ reviewData.summary.sentimentDistribution.negative }}</div>
                <div class="text-xs text-gray-600">Negative</div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Reviews (Scrollable) -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center justify-between">
              <span>All Reviews</span>
              <span class="text-sm font-normal text-gray-500">({{ reviewsCount }} total)</span>
            </h3>
          </div>
          <div class="max-h-screen overflow-y-auto">
            <div class="p-4 space-y-3">
              <div
                v-for="(review, index) in allReviews"
                :key="index"
                class="border-l-4 pl-3 py-3 hover:bg-gray-50 transition-colors"
                :class="{
                  'border-green-400': review.sentiment === 'positive',
                  'border-yellow-400': review.sentiment === 'neutral', 
                  'border-red-400': review.sentiment === 'negative'
                }"
              >
                <!-- Review Header -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" class="text-sm">⭐</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ review.rating }}/5</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span class="text-xs text-gray-500">{{ formatDate(review.date) }}</span>
                    <span
                      :class="[
                        'px-1.5 py-0.5 text-xs rounded-full font-medium',
                        review.source === 'ios' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      ]"
                    >
                      {{ review.source === 'ios' ? 'iOS' : 'Android' }}
                    </span>
                  </div>
                </div>
                
                <!-- Review Title -->
                <h4 v-if="review.title" class="font-medium text-gray-900 mb-1 text-sm line-clamp-1">
                  {{ review.title }}
                </h4>
                
                <!-- Review Content -->
                <p class="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {{ review.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const loading = ref(true)
const error = ref('')
const reviewData = ref(null)

// Memoized computed properties to reduce re-calculations
const appInfo = computed(() => reviewData.value?.appInfo)
const allReviews = computed(() => reviewData.value?.reviews || [])
const reviewsCount = computed(() => allReviews.value.length)

// Get primary app info (prefer iOS, fallback to Android)
const primaryAppInfo = computed(() => {
  if (!appInfo.value?.foundApps) return null
  return appInfo.value.foundApps.ios || appInfo.value.foundApps.android
})

const averageRating = computed(() => {
  if (!reviewData.value?.reviews.length) return '0.0'
  const sum = reviewData.value.reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviewData.value.reviews.length).toFixed(1)
})

const sentimentPercentage = computed(() => {
  if (!reviewData.value?.summary) return { positive: 0, neutral: 0, negative: 0 }
  
  const total = reviewData.value.totalReviews
  const { positive, neutral, negative } = reviewData.value.summary.sentimentDistribution
  
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100)
  }
})

const platformSplit = computed(() => {
  if (!reviewData.value?.summary) return '0/0'
  const { ios, android } = reviewData.value.summary
  return `${ios}/${android}`
})

// Utility Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Load data on mount
onMounted(async () => {
  const appName = route.query.app
  
  if (!appName) {
    error.value = 'No app specified'
    loading.value = false
    return
  }
  
  try {
    const data = await $fetch('/api/reviews', {
      method: 'POST',
      body: { appName }
    })
    
    reviewData.value = data
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    error.value = err.data?.statusMessage || err.data?.message || err.message || 'Failed to load app reviews. Please try again.'
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: `${route.query.app || 'App'} - Review Insights Dashboard`,
  meta: [
    {
      name: 'description',
      content: `Comprehensive review analysis and insights for ${route.query.app || 'mobile app'}`
    }
  ]
})
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Mobile App Review Insights Dashboard
          </h1>
          <p class="text-xl text-gray-600">
            Get comprehensive analytics and sentiment analysis from iOS App Store and Google Play reviews
          </p>
        </div>

        <!-- Search Form -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-lg mx-auto">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="appName" class="block text-sm font-medium text-gray-700 mb-2">
                App Name
              </label>
              <input
                id="appName"
                v-model="appName"
                type="text"
                placeholder="e.g., The North Face, Instagram, WhatsApp"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                :disabled="loading"
              />
              <p class="text-sm text-gray-500 mt-2">
                Enter the name of any mobile app to analyze its reviews
              </p>
            </div>

            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full flex items-center justify-center space-x-2"
              :disabled="loading || !appName.trim()"
            >
              <span v-if="loading">🔄</span>
              <span v-else>🔍</span>
              <span>{{ loading ? 'Analyzing Reviews...' : 'Get Insights' }}</span>
            </button>
          </form>

          <!-- Error Display -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center space-x-2">
              <span class="text-red-600">⚠️</span>
              <p class="text-red-800 font-medium">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-16 grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📊</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rating Analytics</h3>
            <p class="text-gray-600">Visualize rating distributions and trends over time</p>
          </div>

          <div class="text-center">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">❤️</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sentiment Analysis</h3>
            <p class="text-gray-600">Understand user sentiment with AI-powered analysis</p>
          </div>

          <div class="text-center">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📱</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Cross-Platform</h3>
            <p class="text-gray-600">Analyze reviews from both iOS App Store and Google Play</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const appName = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!appName.value.trim()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        appName: appName.value.trim()
      }
    })
    
    // Navigate to dashboard with the results
    await navigateTo({
      path: '/dashboard',
      query: {
        app: appName.value.trim()
      }
    })
    
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    error.value = err.data?.statusMessage || err.data?.message || err.message || 'Failed to fetch app reviews. Please try again.'
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Mobile App Review Insights - Analyze App Store Reviews',
  meta: [
    {
      name: 'description',
      content: 'Get comprehensive analytics and sentiment analysis from iOS App Store and Google Play reviews for any mobile app.'
    }
  ]
})
</script>
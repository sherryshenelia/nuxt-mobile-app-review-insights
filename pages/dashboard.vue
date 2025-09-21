<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <Icon name="heroicons:arrow-left" class="w-5 h-5" />
              <span class="font-medium">Back to Search</span>
            </NuxtLink>
            <div class="h-6 w-px bg-gray-300"></div>
            <h1 class="text-xl font-bold text-gray-900">
              {{ appInfo?.searchTerm || 'App Insights' }}
            </h1>
          </div>
          
          <div v-if="appInfo?.foundApps" class="flex items-center space-x-2 text-sm text-gray-600">
            <Icon name="heroicons:device-phone-mobile" class="w-4 h-4" />
            <span>
              {{ appInfo.foundApps.ios ? 'iOS' : '' }}
              {{ appInfo.foundApps.ios && appInfo.foundApps.android ? ' & ' : '' }}
              {{ appInfo.foundApps.android ? 'Android' : '' }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p class="text-gray-600">Analyzing app reviews...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card max-w-lg mx-auto text-center">
        <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Failed to Load Reviews</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <NuxtLink to="/" class="btn-primary">
          Try Another App
        </NuxtLink>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="reviewData" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card text-center">
            <Icon name="heroicons:document-text" class="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">{{ reviewData.totalReviews }}</div>
            <div class="text-sm text-gray-600">Total Reviews</div>
          </div>

          <div class="card text-center">
            <Icon name="heroicons:star" class="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">{{ averageRating }}</div>
            <div class="text-sm text-gray-600">Average Rating</div>
          </div>

          <div class="card text-center">
            <Icon name="heroicons:heart" class="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">{{ sentimentPercentage.positive }}%</div>
            <div class="text-sm text-gray-600">Positive Sentiment</div>
          </div>

          <div class="card text-center">
            <Icon name="heroicons:device-phone-mobile" class="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">{{ platformSplit }}</div>
            <div class="text-sm text-gray-600">iOS/Android Split</div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Rating Distribution Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div class="h-64">
              <Bar
                v-if="ratingChartData"
                :data="ratingChartData"
                :options="chartOptions"
              />
            </div>
          </div>

          <!-- Sentiment Analysis Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
            <div class="h-64">
              <Doughnut
                v-if="sentimentChartData"
                :data="sentimentChartData"
                :options="doughnutOptions"
              />
            </div>
          </div>
        </div>

        <!-- Ratings Trend -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ratings Trend Over Time</h3>
          <div class="h-64">
            <Line
              v-if="trendChartData"
              :data="trendChartData"
              :options="lineChartOptions"
            />
          </div>
        </div>

        <!-- Recent Reviews -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Reviews</h3>
          <div class="space-y-4">
            <div
              v-for="(review, index) in recentReviews"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      name="heroicons:star"
                      :class="[
                        'w-4 h-4',
                        i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      ]"
                    />
                  </div>
                  <span class="text-sm text-gray-600">
                    {{ formatDate(review.date) }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      review.source === 'ios' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ review.source === 'ios' ? 'iOS' : 'Android' }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ review.sentiment }}
                  </span>
                </div>
              </div>
              
              <h4 v-if="review.title" class="font-medium text-gray-900 mb-2">
                {{ review.title }}
              </h4>
              
              <p class="text-gray-700 text-sm leading-relaxed">
                {{ review.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
)

interface ReviewData {
  rating: number
  date: string
  title: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  source: 'ios' | 'android'
}

interface ApiResponse {
  success: boolean
  appInfo: {
    searchTerm: string
    foundApps: {
      ios?: { id: string; name: string }
      android?: { id: string; name: string }
    }
  }
  reviews: ReviewData[]
  totalReviews: number
  summary: {
    ios: number
    android: number
    sentimentDistribution: {
      positive: number
      neutral: number
      negative: number
    }
    ratingDistribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
}

const route = useRoute()
const loading = ref(true)
const error = ref('')
const reviewData = ref<ApiResponse | null>(null)

const appInfo = computed(() => reviewData.value?.appInfo)
const recentReviews = computed(() => reviewData.value?.reviews.slice(0, 5) || [])

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

// Chart Data
const ratingChartData = computed(() => {
  if (!reviewData.value?.summary.ratingDistribution) return null
  
  const distribution = reviewData.value.summary.ratingDistribution
  
  return {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: [distribution[1], distribution[2], distribution[3], distribution[4], distribution[5]],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(34, 197, 94, 0.9)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(107, 114, 128)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }
    ]
  }
})

const sentimentChartData = computed(() => {
  if (!reviewData.value?.summary.sentimentDistribution) return null
  
  const { positive, neutral, negative } = reviewData.value.summary.sentimentDistribution
  
  return {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [positive, neutral, negative],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(107, 114, 128)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }
})

const trendChartData = computed(() => {
  if (!reviewData.value?.reviews) return null
  
  // Group reviews by date and calculate average rating
  const reviewsByDate = reviewData.value.reviews.reduce((acc, review) => {
    const date = new Date(review.date).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { ratings: [], count: 0 }
    }
    acc[date].ratings.push(review.rating)
    acc[date].count++
    return acc
  }, {} as Record<string, { ratings: number[]; count: number }>)
  
  const sortedDates = Object.keys(reviewsByDate).sort()
  const last30Days = sortedDates.slice(-30)
  
  const labels = last30Days.map(date => new Date(date).toLocaleDateString())
  const data = last30Days.map(date => {
    const ratings = reviewsByDate[date].ratings
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  })
  
  return {
    labels,
    datasets: [
      {
        label: 'Average Rating',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1
      }
    }
  }
}

// Utility Functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load data on mount
onMounted(async () => {
  const appName = route.query.app as string
  
  if (!appName) {
    error.value = 'No app specified'
    loading.value = false
    return
  }
  
  try {
    const data = await $fetch<ApiResponse>('/api/reviews', {
      method: 'POST',
      body: { appName }
    })
    
    reviewData.value = data
  } catch (err: any) {
    console.error('Failed to fetch reviews:', err)
    error.value = err.data?.message || 'Failed to load app reviews'
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

// Mock data for testing
export const mockInstagramResponse = {
  appInfo: {
    foundApps: {
      ios: {
        id: "389801252",
        name: "Instagram",
        rating: 4.1,
        ratingCount: 2500000,
        icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/2c/4c/5c/2c4c5c5c-2c4c-5c2c-4c5c-2c4c5c2c4c5c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
        developer: "Instagram, Inc.",
        price: "Free"
      },
      android: {
        id: "com.instagram.android",
        name: "Instagram",
        rating: 3.9,
        ratingCount: 50000000,
        icon: "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fIGn30iqbE0wdPYJ0pw",
        developer: "Instagram",
        price: "Free"
      }
    }
  },
  reviews: [
    {
      rating: 5,
      date: "2024-01-15",
      title: "Love this app!",
      content: "Instagram is amazing for sharing photos and connecting with friends. The stories feature is fantastic!",
      sentiment: "positive" as const,
      source: "ios" as const
    },
    {
      rating: 2,
      date: "2024-01-14",
      title: "Too many ads",
      content: "The app has become too cluttered with advertisements. It's hard to see actual content from friends.",
      sentiment: "negative" as const,
      source: "android" as const
    },
    {
      rating: 3,
      date: "2024-01-13",
      title: "Decent but could be better",
      content: "It's okay for what it does, but the algorithm changes make it less enjoyable than before.",
      sentiment: "neutral" as const,
      source: "ios" as const
    },
    {
      rating: 4,
      date: "2024-01-12",
      title: "Good for business",
      content: "Great platform for promoting my business. The insights and analytics are helpful.",
      sentiment: "positive" as const,
      source: "android" as const
    },
    {
      rating: 1,
      date: "2024-01-11",
      title: "Constant crashes",
      content: "The app keeps crashing on my device. Very frustrating experience.",
      sentiment: "negative" as const,
      source: "ios" as const
    }
  ],
  summary: {
    ios: 3,
    android: 2,
    sentimentDistribution: {
      positive: 2,
      neutral: 1,
      negative: 2
    },
    ratingDistribution: {
      5: 1,
      4: 1,
      3: 1,
      2: 1,
      1: 1
    }
  }
}

export const mockTikTokResponse = {
  appInfo: {
    foundApps: {
      ios: {
        id: "835599320",
        name: "TikTok",
        rating: 4.5,
        ratingCount: 1800000,
        icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/c7/87/9a/c7879a9a-c787-9ac7-879a-c7879ac7879a/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
        developer: "TikTok Ltd.",
        price: "Free"
      },
      android: {
        id: "com.zhiliaoapp.musically",
        name: "TikTok",
        rating: 4.2,
        ratingCount: 100000000,
        icon: "https://play-lh.googleusercontent.com/z5jL7GwkSyUx8mJKNYlvhQzJqJJsJq8QJqJsJqJsJqJsJqJsJqJsJqJsJqJsJqJs",
        developer: "TikTok Pte. Ltd.",
        price: "Free"
      }
    }
  },
  reviews: [
    {
      rating: 5,
      date: "2024-01-15",
      title: "Addictive and fun!",
      content: "I can spend hours scrolling through TikTok. The algorithm is spot on!",
      sentiment: "positive" as const,
      source: "ios" as const
    },
    {
      rating: 4,
      date: "2024-01-14",
      title: "Great for creators",
      content: "Amazing platform for content creators. Easy to use editing tools.",
      sentiment: "positive" as const,
      source: "android" as const
    }
  ],
  summary: {
    ios: 1,
    android: 1,
    sentimentDistribution: {
      positive: 2,
      neutral: 0,
      negative: 0
    },
    ratingDistribution: {
      5: 1,
      4: 1,
      3: 0,
      2: 0,
      1: 0
    }
  }
}

export const mockErrorResponse = {
  error: "App not found",
  message: "Could not find the specified app in the app stores"
}

# 📱 Mobile App Review Insights

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

A comprehensive web application built with **Nuxt 3** that analyzes mobile app reviews from both iOS App Store and Google Play Store. Get instant insights into user sentiment, rating distributions, and trends to understand how users perceive any mobile application.

## ✨ Features

- 🔍 **Cross-Platform Analysis** - Fetch reviews from both iOS App Store and Google Play Store
- 📊 **Interactive Charts** - Visualize rating distributions and trends over time using Chart.js
- 🎯 **Sentiment Analysis** - AI-powered sentiment classification (positive, neutral, negative)
- 📱 **Responsive Design** - Beautiful, modern UI built with Tailwind CSS
- ⚡ **Real-time Data** - Get the most recent ~100 reviews for comprehensive analysis
- 🔄 **Automatic App Discovery** - Smart app name resolution for both platforms

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + [Vue Chart.js](https://vue-chartjs.org/)
- **Icons**: [Nuxt Icon](https://github.com/nuxt-modules/icon) with Heroicons
- **Data Sources**: 
  - [google-play-scraper](https://github.com/facundoolano/google-play-scraper) - Android reviews
  - [app-store-scraper](https://github.com/facundoolano/app-store-scraper) - iOS reviews
- **AI Analysis**: [sentiment](https://github.com/thisandagain/sentiment) - Natural language sentiment analysis
- **Deployment**: [Netlify](https://netlify.com) with automatic CI/CD

## 🏗️ Architecture

```
📦 nuxt-mobile-app-review-insights/
├── 📁 assets/css/          # Global styles and Tailwind config
├── 📁 pages/               # File-based routing
│   ├── index.vue          # Landing page with search form
│   └── dashboard.vue      # Analytics dashboard
├── 📁 server/api/         # Server-side API endpoints
│   └── reviews.post.ts    # Review fetching and analysis logic
├── 📁 public/             # Static assets
├── 🔧 nuxt.config.ts      # Nuxt configuration
├── 🔧 netlify.toml        # Netlify deployment config
└── 📄 .env.example        # Environment variables template
```

## 🚀 Local Development

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sherryshenelia/nuxt-mobile-app-review-insights.git
   cd nuxt-mobile-app-review-insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # The default configuration should work for local development
   # No API keys required for basic functionality
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Testing the Application

1. Enter an app name (e.g., "Instagram", "WhatsApp", "The North Face")
2. Click "Get Insights" 
3. View the analytics dashboard with:
   - Rating distribution charts
   - Sentiment analysis
   - Recent reviews
   - Trend analysis

## 🌍 Environment Configuration

### Required Variables

The application works out-of-the-box with no API keys required. However, you can enhance it with additional services:

```bash
# Basic Configuration (included)
NUXT_PUBLIC_API_BASE=/api
NUXT_PUBLIC_APP_NAME="Mobile App Review Insights"

# Optional Enhancements
# APP_STORE_API_KEY=your_app_store_api_key
# GOOGLE_PLAY_API_KEY=your_google_play_api_key
# OPENAI_API_KEY=your_openai_key_for_advanced_sentiment
```

### Production Environment

For production deployment, ensure these variables are set in your deployment platform:

- `NODE_ENV=production`
- Any additional API keys for enhanced features

## 🚀 Deployment

### Netlify Deployment (Recommended)

This project is configured for seamless Netlify deployment with automatic CI/CD:

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .output/public
   Node version: 20
   ```

3. **Environment Variables**
   Add any required environment variables in Netlify's dashboard

4. **Deploy**
   - Netlify will automatically build and deploy
   - Every push to `main` triggers a new deployment
   - Pull requests get deploy previews

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy the .output/public directory to your hosting provider
```

## 📊 API Endpoints

### POST `/api/reviews`

Fetch and analyze reviews for a mobile app.

**Request Body:**
```json
{
  "appName": "Instagram"
}
```

**Response:**
```json
{
  "success": true,
  "appInfo": {
    "searchTerm": "Instagram",
    "foundApps": {
      "ios": { "id": "389801252", "name": "Instagram" },
      "android": { "id": "com.instagram.android", "name": "Instagram" }
    }
  },
  "reviews": [
    {
      "rating": 5,
      "date": "2024-01-15T10:30:00Z",
      "title": "Great app!",
      "content": "Love using this app daily...",
      "sentiment": "positive",
      "source": "ios"
    }
  ],
  "totalReviews": 100,
  "summary": {
    "ios": 50,
    "android": 50,
    "sentimentDistribution": {
      "positive": 60,
      "neutral": 25,
      "negative": 15
    },
    "ratingDistribution": {
      "1": 5, "2": 10, "3": 15, "4": 25, "5": 45
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Nuxt 3](https://nuxt.com/) for the amazing framework
- [facundoolano](https://github.com/facundoolano) for the excellent scraper libraries
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/sherryshenelia/nuxt-mobile-app-review-insights/issues) page
2. Create a new issue with detailed information
3. Join the discussion in our [GitHub Discussions](https://github.com/sherryshenelia/nuxt-mobile-app-review-insights/discussions)

---

**Made with ❤️ and Nuxt 3**
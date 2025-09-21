# Mobile App Review Insights Dashboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/nuxt-mobile-app-review-insights/deploys)

A comprehensive web application that analyzes mobile app reviews from both iOS App Store and Google Play Store, providing detailed insights including sentiment analysis, rating distributions, and review analytics.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/sherryshenelia/nuxt-mobile-app-review-insights.git
cd nuxt-mobile-app-review-insights
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

## 📋 What It Does

- **🔍 Search**: Enter any mobile app name (Instagram, WhatsApp, TikTok)
- **📊 Analyze**: Get 100 most recent reviews from iOS & Android
- **🎯 Insights**: Sentiment analysis, rating distributions, platform comparisons
- **⚡ Fast**: 5-minute API caching, responsive design

## 🛠️ Tech Stack

- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **APIs**: App Store & Google Play scrapers + Sentiment analysis
- **Hosting**: Netlify (Serverless functions + CDN)
- **DevOps**: GitHub → Netlify CI/CD

## 📖 Complete Documentation

For detailed technical documentation including:
- **Business Requirements & System Architecture**
- **API Design & Nuxt-Specific Features**  
- **Development Workflow & Testing Strategy**
- **DevOps Setup & Troubleshooting Guide**

👉 **[Read PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

## 🏗️ Project Structure

```
├── pages/
│   ├── index.vue           # Landing page with search
│   └── dashboard.vue       # Analytics dashboard  
├── server/api/
│   └── reviews.post.ts     # Main API endpoint
├── nuxt.config.ts          # Nuxt configuration
├── netlify.toml            # Deployment config
└── PROJECT_DOCUMENTATION.md # Complete technical docs
```

## 🌐 Live Demo

**Production**: [https://imaginative-meerkat-f44fa3.netlify.app](https://imaginative-meerkat-f44fa3.netlify.app)

## 🧪 Testing

```bash
# Test API directly
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"appName":"Instagram"}'

# Build for production
npm run build
npm run preview
```

## 🚀 Deployment

Automatic deployment via Netlify:
- **Push to main** → **Auto build & deploy**
- **Pull requests** → **Preview deployments**
- **Serverless functions** → **API routes as Netlify Functions**

## 📊 API Example

```bash
# POST /api/reviews
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"appName":"Instagram"}'
```

**Response includes**:
- App metadata (ratings, icons, developer info)
- 100 most recent reviews from both platforms
- Sentiment analysis and rating distributions
- Platform-specific statistics

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push and create Pull Request

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/sherryshenelia/nuxt-mobile-app-review-insights/issues)
- 📚 **Docs**: [Complete Documentation](./PROJECT_DOCUMENTATION.md)
- 🔗 **Live Demo**: [imaginative-meerkat-f44fa3.netlify.app](https://imaginative-meerkat-f44fa3.netlify.app)

---

**New Developer?** Start with [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete onboarding guide.
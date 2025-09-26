# Testing & Configuration Guide

## 🧪 Unit Testing

### Framework: Vitest
We use **Vitest** for unit testing because it's:
- ⚡ **Fast** - Built on Vite for lightning-fast test execution
- 🔧 **TypeScript native** - First-class TypeScript support
- 🧩 **Jest compatible** - Familiar API if you know Jest
- 📊 **Built-in coverage** - Code coverage without extra setup

### Running Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage

# Run with UI (browser-based test runner)
npm run test:ui

# Run only API contract tests
npm run test:contract
```

### Test Structure

```
tests/
├── unit/                   # Unit tests for individual functions
│   └── sentiment.test.ts   # Sentiment analysis logic tests
├── api/                    # API contract tests
│   └── reviews.contract.test.ts
└── integration/            # Integration tests (future)
```

### Writing Unit Tests

```typescript
// tests/unit/example.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '~/utils/myFunction'

describe('MyFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
})
```

## 📋 API Contract Testing

### Purpose
API contract tests ensure:
- **Request validation** - Proper error handling for invalid inputs
- **Response structure** - Consistent API response format
- **Data integrity** - Correct calculations and relationships
- **Performance** - Response times within acceptable limits

### Schema Validation
We use **Zod** for runtime schema validation:

```typescript
const ApiResponseSchema = z.object({
  appInfo: z.object({
    foundApps: z.object({
      ios: AppInfoSchema.optional(),
      android: AppInfoSchema.optional()
    })
  }),
  reviews: z.array(ReviewSchema).max(100),
  summary: SummarySchema
})
```

### Contract Test Examples

```typescript
// Request validation
it('should reject requests without appName', async () => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({}) // Missing appName
  })
  expect(response.status).toBe(400)
})

// Response validation
it('should return valid response structure', async () => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ appName: 'Instagram' })
  })
  
  const data = await response.json()
  const result = ApiResponseSchema.safeParse(data)
  expect(result.success).toBe(true)
})
```

## ⚙️ Configuration System

### Dynamic Configuration
The app uses a flexible configuration system that supports:
- **Environment variables** for deployment-specific settings
- **Default values** for development
- **Runtime validation** using Zod schemas
- **Type safety** with TypeScript

### Configuration Structure

```typescript
{
  cache: {
    ttl: 24 * 60 * 60 * 1000,    // Cache duration (24 hours)
    maxSize: 1000                 // Max cache entries
  },
  api: {
    limits: {
      maxReviews: 100,            // Total reviews to return
      iosReviews: 50,             // iOS reviews to fetch
      androidReviews: 50          // Android reviews to fetch
    },
    scraping: {
      country: 'us',              // App store country
      timeout: 15000,             // API timeout (15 seconds)
      retries: 2                  // Retry attempts
    }
  },
  features: {
    enableSentimentAnalysis: true,
    enableCaching: true,
    enableRateLimit: true,
    debugMode: false
  }
}
```

### Environment Variables

Copy `env.example` to `.env` and customize:

```bash
# Cache Configuration
CACHE_TTL=86400000              # 24 hours in milliseconds
CACHE_MAX_SIZE=1000

# API Limits
API_MAX_REVIEWS=100
API_IOS_REVIEWS=50
API_ANDROID_REVIEWS=50

# Scraping Configuration
API_COUNTRY=us                  # us, gb, ca, au, de, fr, jp, etc.
API_TIMEOUT=15000
API_RETRIES=2

# Feature Flags
ENABLE_SENTIMENT=true
ENABLE_CACHING=true
DEBUG_MODE=false
```

### Supported Countries

| Code | Country |
|------|---------|
| `us` | United States |
| `gb` | United Kingdom |
| `ca` | Canada |
| `au` | Australia |
| `de` | Germany |
| `fr` | France |
| `jp` | Japan |
| `br` | Brazil |
| `in` | India |
| `cn` | China |

### Using Configuration in Code

```typescript
import { appConfig } from '~/config/app.config'

// Use configuration values
const reviews = allReviews.slice(0, appConfig.api.limits.maxReviews)
const cacheExpiry = Date.now() + appConfig.cache.ttl

// Runtime configuration updates
updateConfig({
  api: {
    limits: {
      maxReviews: 150
    }
  }
})
```

### Configuration Validation

The system automatically validates configuration on startup:

```typescript
// Invalid configuration will log errors and use defaults
const result = AppConfigSchema.safeParse(envConfig)
if (!result.success) {
  console.error('Invalid configuration:', result.error.errors)
  return AppConfigSchema.parse(defaultConfig)
}
```

## 🚀 Best Practices

### Testing
1. **Test behavior, not implementation** - Focus on what functions do, not how
2. **Use descriptive test names** - `should return positive for 4-5 star ratings`
3. **Test edge cases** - Empty strings, null values, boundary conditions
4. **Mock external dependencies** - Don't call real APIs in unit tests
5. **Keep tests fast** - Unit tests should run in milliseconds

### Configuration
1. **Use environment variables** for deployment-specific settings
2. **Provide sensible defaults** for development
3. **Validate configuration** at startup to catch issues early
4. **Document all options** in `env.example`
5. **Use feature flags** for gradual rollouts

### API Design
1. **Validate all inputs** - Never trust client data
2. **Use consistent response formats** - Same structure for all endpoints
3. **Include proper HTTP status codes** - 400 for validation, 500 for errors
4. **Add request/response logging** in debug mode
5. **Implement rate limiting** to prevent abuse

## 📊 Coverage Goals

- **Unit Tests**: >90% coverage for utility functions
- **API Tests**: 100% coverage for all endpoints
- **Integration Tests**: Critical user flows
- **Performance Tests**: Response time thresholds

## 🔧 Development Workflow

1. **Write tests first** (TDD approach)
2. **Run tests locally** before committing
3. **Use configuration** instead of hardcoded values
4. **Update tests** when changing APIs
5. **Monitor test performance** and optimize slow tests

This setup provides a robust foundation for maintaining code quality and flexibility as the application grows! 🎯

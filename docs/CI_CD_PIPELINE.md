# 🚀 CI/CD Pipeline Documentation

## 📋 **Pipeline Overview**

Our CI/CD pipeline follows a **multi-stage testing strategy** that balances speed, reliability, and thorough validation:

```
🚀 Stage 1: Fast Feedback (Every Commit)
   ├── Unit Tests with Static Data
   ├── Mock API Tests  
   └── Code Coverage

🔍 Stage 2: Integration (PR/Merge)
   ├── API Contract Tests
   ├── Component Integration
   └── Schema Validation

🎯 Stage 3: Release Validation (Pre-deployment)
   ├── End-to-End Tests
   ├── Performance Testing
   └── Real API Integration

🌟 Stage 4: Production Deployment
   └── Automated Deployment

🚨 Stage 5: Post-deployment
   └── Smoke Tests & Monitoring
```

## 🏗️ **Pipeline Architecture**

### **Why This Multi-Stage Approach?**

| Stage | Speed | Coverage | When | Purpose |
|-------|-------|----------|------|---------|
| **Static Data Tests** | ⚡ ~30s | Unit Logic | Every commit | Fast feedback |
| **Mock API Tests** | 🚀 ~1min | Integration | Every commit | API contract |
| **Contract Tests** | ⏱️ ~2min | Real API | PR/Merge | Validation |
| **E2E Tests** | 🐌 ~5min | Full system | Pre-release | Confidence |
| **Smoke Tests** | ⚡ ~30s | Critical paths | Post-deploy | Health check |

## 📁 **File Structure**

```
.github/workflows/
└── ci.yml                    # Main CI/CD pipeline

tests/
├── fixtures/
│   └── contracts/            # API contract definitions
├── integration/              # Integration tests
├── api/                      # API tests (mock & real)
└── components/               # Component tests

scripts/
├── generate-contract.js      # Generate contracts from live API
└── validate-deployment.js    # Post-deployment validation
```

## 🧪 **Testing Strategy Details**

### **1. Static Data Tests (Stage 1)**
```bash
npm run test:run      # Unit tests with JSON fixtures
npm run test:mock     # Mock API tests
```

**What they test:**
- ✅ Business logic functions
- ✅ Component rendering
- ✅ Data processing
- ✅ Error handling

**Benefits:**
- ⚡ **Fast**: 30 seconds
- 🔒 **Reliable**: No external dependencies
- 💰 **Free**: No API costs

### **2. Contract Tests (Stage 2)**
```bash
npm run test:contract     # API contract validation
npm run test:integration  # Live API tests
```

**What they test:**
- ✅ API request/response structure
- ✅ Schema validation
- ✅ Contract evolution detection
- ✅ Performance requirements

**Benefits:**
- 🎯 **Catches breaking changes**
- 📋 **Documents API expectations**
- 🔍 **Validates real integration**

### **3. End-to-End Tests (Stage 3)**
```bash
npm run validate:deployment
```

**What they test:**
- ✅ Full user workflows
- ✅ Multiple app support
- ✅ Performance under load
- ✅ Error scenarios

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Required for CI/CD
NETLIFY_AUTH_TOKEN=your-token
NETLIFY_SITE_ID=your-site-id
SLACK_WEBHOOK=your-webhook-url

# Optional configurations
CACHE_TTL=86400000           # 24 hours
API_COUNTRY=us               # App store country
NODE_VERSION=18              # Node.js version
```

### **GitHub Secrets Setup**
1. Go to your repo → Settings → Secrets and Variables → Actions
2. Add these secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - `SLACK_WEBHOOK` (optional)

## 📊 **Contract Management**

### **Generating Contracts**
```bash
# Generate contract from live API
npm run contract:generate Instagram

# Generate for specific app
node scripts/generate-contract.js "TikTok" ./custom-path.json
```

### **Contract Structure**
```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T00:00:00Z",
  "request": { /* Request format */ },
  "response": { /* Expected response */ },
  "schema": { /* JSON Schema for validation */ },
  "metadata": { /* Generation info */ }
}
```

### **Contract Evolution**
When API changes are detected:

1. **Automatic Detection**: Tests log contract violations
2. **Manual Review**: Developers review changes
3. **Contract Update**: Update contract files
4. **Version Bump**: Increment contract version

## 🚀 **Deployment Process**

### **Automatic Deployment**
```yaml
# Triggers on main branch push
on:
  push:
    branches: [ main ]
```

### **Manual Deployment**
```bash
# Deploy to staging
npx netlify-cli deploy --build --context=staging

# Deploy to production
npx netlify-cli deploy --build --prod
```

### **Rollback Process**
```bash
# Rollback to previous version
npx netlify-cli sites:list
npx netlify-cli api rollbackSiteDeploy --siteId=your-site-id
```

## 📈 **Monitoring & Alerts**

### **Slack Notifications**
- 🎉 **Success**: Deployment completed
- 🚨 **Failure**: Tests failed, deployment blocked
- ⚠️ **Warning**: Performance degradation detected

### **Health Checks**
```bash
# Validate deployment health
npm run validate:deployment https://your-site.netlify.app
```

**Checks performed:**
- Homepage accessibility
- API functionality  
- Response times < 5s
- Error handling
- Multiple app support

## 🛠️ **Local Development**

### **Running Tests Locally**
```bash
# Quick feedback loop
npm run test:mock

# Full test suite
npm run test:run
npm run test:integration

# Generate coverage
npm run test:coverage
```

### **Contract Testing**
```bash
# Start local server
npm run dev

# Generate contract from local API
npm run contract:generate

# Validate against contract
npm run test:integration
```

## 🎯 **Best Practices**

### **1. Test Pyramid**
```
        🔺 E2E Tests (Few, Slow, High Confidence)
       🔺🔺 Integration Tests (Some, Medium Speed)
    🔺🔺🔺🔺 Unit Tests (Many, Fast, Low Cost)
```

### **2. Contract-First Development**
1. **Define contract** (expected API structure)
2. **Write tests** against contract
3. **Implement feature** to pass tests
4. **Validate** against real API

### **3. Fail Fast Principle**
- **Unit tests fail** → Block commit
- **Integration tests fail** → Block merge
- **E2E tests fail** → Block deployment
- **Smoke tests fail** → Alert team

### **4. Performance Budgets**
- API responses: < 5 seconds
- Homepage load: < 3 seconds
- Test suite: < 10 minutes total

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Tests Pass Locally, Fail in CI**
```bash
# Check environment differences
echo $NODE_VERSION
echo $CI

# Run tests with CI environment
CI=true npm run test:run
```

**2. Contract Validation Fails**
```bash
# Regenerate contract
npm run contract:generate

# Compare with expected
diff tests/fixtures/contracts/instagram-contract.json new-contract.json
```

**3. Deployment Fails**
```bash
# Check build logs
npx netlify-cli logs

# Validate locally
npm run build
npm run preview
```

**4. Performance Issues**
```bash
# Profile API performance
time curl -X POST localhost:3000/api/reviews -d '{"appName":"Instagram"}'

# Check cache status
curl -I localhost:3000/api/reviews
```

## 📚 **Additional Resources**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deploy Documentation](https://docs.netlify.com/site-deploys/create-deploys/)
- [Vitest Testing Guide](https://vitest.dev/guide/)
- [JSON Schema Validation](https://ajv.js.org/)

## 🎉 **Success Metrics**

Track these metrics to measure pipeline effectiveness:

- **Deployment Frequency**: How often you deploy
- **Lead Time**: Commit to production time
- **Mean Time to Recovery**: How fast you fix issues
- **Change Failure Rate**: Percentage of deployments causing issues

**Target Goals:**
- 🎯 Deploy multiple times per day
- ⚡ < 10 minutes commit to deployment
- 🚀 < 1 hour mean time to recovery
- 📈 < 5% change failure rate

Your pipeline is now **production-ready** and follows industry best practices! 🚀

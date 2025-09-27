# Mock API Testing Guide

## 🎭 **What is Mock API Testing?**

Mock API testing allows you to test your frontend components and API integration **without making real API calls**. Instead, you create "fake" API responses that behave exactly like the real API.

### **Why Use Mock API Testing?**

- ⚡ **Fast** - No network calls, tests run instantly
- 🔒 **Reliable** - No dependency on external services
- 🎯 **Controlled** - Test specific scenarios (errors, edge cases)
- 💰 **Cost-effective** - No API rate limits or costs
- 🧪 **Isolated** - Tests don't affect real data

## 🏗️ **Our Mock Setup**

### **Tools Used:**
- **MSW (Mock Service Worker)** - Intercepts HTTP requests
- **Vitest** - Test runner
- **Vue Test Utils** - Vue component testing
- **JSdom** - Browser environment simulation

### **File Structure:**
```
tests/
├── mocks/
│   ├── data.ts          # Mock response data
│   ├── handlers.ts      # API route handlers
│   └── server.ts        # MSW server setup
├── api/
│   └── mock-api.test.ts # API endpoint tests
├── components/
│   └── dashboard-mock.test.ts # Component tests
└── setup.ts             # Global test configuration
```

## 📊 **Mock Data Examples**

### **Instagram Mock Response:**
```javascript
{
  appInfo: {
    foundApps: {
      ios: { name: "Instagram", rating: 4.1 },
      android: { name: "Instagram", rating: 3.9 }
    }
  },
  reviews: [
    {
      rating: 5,
      title: "Love this app!",
      content: "Instagram is amazing...",
      sentiment: "positive",
      source: "ios"
    }
  ],
  summary: {
    sentimentDistribution: { positive: 2, neutral: 1, negative: 2 }
  }
}
```

## 🧪 **Test Types**

### **1. API Endpoint Tests**
Tests the API responses directly:

```javascript
it('should return Instagram data', async () => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ appName: 'Instagram' })
  })
  
  const data = await response.json()
  expect(data.appInfo.foundApps.ios.name).toBe('Instagram')
})
```

### **2. Component Integration Tests**
Tests Vue components with mocked API:

```javascript
it('should display search results', async () => {
  const wrapper = mount(Dashboard)
  await wrapper.find('[data-testid="search-input"]').setValue('Instagram')
  await wrapper.find('[data-testid="search-button"]').trigger('click')
  
  expect(wrapper.find('[data-testid="app-name"]').text()).toBe('Instagram')
})
```

### **3. Error Scenario Tests**
Tests how your app handles failures:

```javascript
it('should display error for non-existent app', async () => {
  // Mock returns 404 for 'NonExistentApp'
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ appName: 'NonExistentApp' })
  })
  
  expect(response.status).toBe(404)
})
```

## 🎯 **Test Scenarios Covered**

### **✅ Success Cases:**
- Instagram search returns correct data
- TikTok search returns correct data  
- Unknown apps return generic data
- Search via Enter key works
- Loading states display correctly

### **❌ Error Cases:**
- Non-existent apps return 404
- Server errors return 500
- Empty search queries are handled
- Network timeouts are handled

### **⚡ Performance Cases:**
- Slow API responses (3+ seconds)
- Multiple concurrent requests
- Large response payloads

### **🔧 Dynamic Cases:**
- Override mock responses per test
- Custom app data for specific tests
- Different response structures

## 🚀 **Running Mock Tests**

```bash
# Install dependencies
npm install

# Run all mock tests
npm run test:mock

# Run API mock tests only
npm run test:contract

# Run component mock tests only  
npm run test:components

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 📝 **Writing Your Own Mock Tests**

### **Step 1: Add Mock Data**
```javascript
// tests/mocks/data.ts
export const mockNewAppResponse = {
  appInfo: { foundApps: { ios: { name: "NewApp" } } },
  reviews: [],
  summary: { sentimentDistribution: { positive: 0, neutral: 0, negative: 0 } }
}
```

### **Step 2: Add Handler**
```javascript
// tests/mocks/handlers.ts
case 'newapp':
  return HttpResponse.json(mockNewAppResponse)
```

### **Step 3: Write Test**
```javascript
it('should handle NewApp search', async () => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ appName: 'NewApp' })
  })
  
  expect(response.status).toBe(200)
  // Add your assertions...
})
```

## 🔍 **Advanced Mock Techniques**

### **Dynamic Response Override:**
```javascript
it('should handle custom scenario', async () => {
  // Override mock for this test only
  server.use(
    http.post('/api/reviews', () => {
      return HttpResponse.json({ custom: 'response' })
    })
  )
  
  // Test with custom response...
})
```

### **Simulating Network Delays:**
```javascript
// In handlers.ts
await new Promise(resolve => setTimeout(resolve, 3000)) // 3 second delay
return HttpResponse.json(mockData)
```

### **Request Validation:**
```javascript
http.post('/api/reviews', async ({ request }) => {
  const body = await request.json()
  
  if (!body.appName) {
    return HttpResponse.json({ error: 'Missing appName' }, { status: 400 })
  }
  
  return HttpResponse.json(mockData)
})
```

## 🎉 **Benefits for Your Project**

### **For Development:**
- Test edge cases without real API calls
- Develop offline or with unreliable internet
- Test error scenarios easily
- Faster development cycle

### **For CI/CD:**
- Tests run consistently in any environment
- No external dependencies
- Faster build times
- More reliable test results

### **For Team Collaboration:**
- Shared mock data ensures consistency
- Easy to reproduce bugs
- New team members can run tests immediately
- Documentation through test cases

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Tests timing out:**
   ```javascript
   // Increase timeout for slow tests
   it('slow test', async () => {
     // test code...
   }, 10000) // 10 second timeout
   ```

2. **Mock not working:**
   ```javascript
   // Ensure server is started in setup.ts
   beforeAll(() => server.listen())
   afterEach(() => server.resetHandlers())
   afterAll(() => server.close())
   ```

3. **Vue component not updating:**
   ```javascript
   // Wait for Vue reactivity
   await wrapper.vm.$nextTick()
   ```

## 🎯 **Best Practices**

1. **Keep mocks realistic** - Use real-world data structures
2. **Test both success and failure** - Don't just test happy paths
3. **Use data-testid attributes** - Make components testable
4. **Reset mocks between tests** - Avoid test pollution
5. **Document your mocks** - Help other developers understand

## 🚀 **Next Steps**

1. Run the mock tests: `npm run test:mock`
2. Examine the test output and coverage
3. Add tests for your specific use cases
4. Integrate into your CI/CD pipeline
5. Share with your team!

Mock API testing gives you **confidence** that your app works correctly in all scenarios, **speed** in development, and **reliability** in your test suite! 🎉

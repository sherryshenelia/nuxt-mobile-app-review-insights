#!/usr/bin/env node

/**
 * Post-deployment validation script
 * Usage: node scripts/validate-deployment.js [base-url]
 */

const fs = require('fs')
const path = require('path')

async function validateDeployment(baseUrl = 'http://localhost:3000') {
  console.log(`🔍 Validating deployment at ${baseUrl}...`)
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl,
    tests: [],
    summary: { passed: 0, failed: 0, total: 0 }
  }

  // Test cases
  const testCases = [
    {
      name: 'Homepage Accessibility',
      test: async () => {
        const response = await fetch(baseUrl)
        return {
          passed: response.ok,
          status: response.status,
          details: response.ok ? 'Homepage accessible' : `HTTP ${response.status}`
        }
      }
    },
    {
      name: 'API Health Check',
      test: async () => {
        const response = await fetch(`${baseUrl}/api/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: 'Instagram' })
        })
        
        const data = await response.json()
        const hasRequiredFields = data.appInfo && data.reviews && data.summary
        
        return {
          passed: response.ok && hasRequiredFields,
          status: response.status,
          details: hasRequiredFields ? 'API functional' : 'Missing required fields'
        }
      }
    },
    {
      name: 'API Performance',
      test: async () => {
        const startTime = Date.now()
        const response = await fetch(`${baseUrl}/api/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: 'TikTok' })
        })
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        return {
          passed: response.ok && responseTime < 5000,
          responseTime,
          details: `Response time: ${responseTime}ms (target: <5000ms)`
        }
      }
    },
    {
      name: 'Error Handling',
      test: async () => {
        const response = await fetch(`${baseUrl}/api/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: 'NonExistentApp12345' })
        })
        
        // Should handle gracefully (either 404 or 200 with empty results)
        const validStatuses = [200, 404]
        
        return {
          passed: validStatuses.includes(response.status),
          status: response.status,
          details: validStatuses.includes(response.status) ? 
            'Error handling working' : 
            `Unexpected status: ${response.status}`
        }
      }
    },
    {
      name: 'Multiple App Support',
      test: async () => {
        const apps = ['Instagram', 'TikTok', 'WhatsApp']
        const results = []
        
        for (const app of apps) {
          const response = await fetch(`${baseUrl}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appName: app })
          })
          
          results.push({
            app,
            status: response.status,
            ok: response.ok
          })
        }
        
        const successCount = results.filter(r => r.ok).length
        
        return {
          passed: successCount >= 2, // At least 2 apps should work
          details: `${successCount}/${apps.length} apps working`,
          results
        }
      }
    }
  ]

  // Run all tests
  for (const testCase of testCases) {
    console.log(`🧪 Running: ${testCase.name}`)
    
    try {
      const result = await testCase.test()
      
      const testResult = {
        name: testCase.name,
        passed: result.passed,
        details: result.details,
        ...result
      }
      
      results.tests.push(testResult)
      
      if (result.passed) {
        console.log(`  ✅ ${testCase.name}: ${result.details}`)
        results.summary.passed++
      } else {
        console.log(`  ❌ ${testCase.name}: ${result.details}`)
        results.summary.failed++
      }
    } catch (error) {
      console.log(`  ❌ ${testCase.name}: ${error.message}`)
      results.tests.push({
        name: testCase.name,
        passed: false,
        error: error.message,
        details: `Test failed: ${error.message}`
      })
      results.summary.failed++
    }
    
    results.summary.total++
  }

  // Generate report
  console.log(`\n📊 Validation Summary:`)
  console.log(`   ✅ Passed: ${results.summary.passed}`)
  console.log(`   ❌ Failed: ${results.summary.failed}`)
  console.log(`   📈 Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`)

  // Save detailed report
  const reportPath = path.join(__dirname, '../deployment-validation-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`\n📄 Detailed report saved: ${reportPath}`)

  // Exit with error code if any tests failed
  if (results.summary.failed > 0) {
    console.log(`\n🚨 Deployment validation failed! ${results.summary.failed} test(s) failing.`)
    process.exit(1)
  } else {
    console.log(`\n🎉 Deployment validation successful! All tests passed.`)
    process.exit(0)
  }
}

// CLI usage
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000'
  validateDeployment(baseUrl)
}

module.exports = { validateDeployment }

import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import instagramContract from '../fixtures/contracts/instagram-contract.json'

const ajv = new Ajv()

describe('API Contract Validation', () => {
  describe('Static Contract Validation', () => {
    it('should validate Instagram contract schema', () => {
      const schema = instagramContract.schema
      const data = instagramContract.response.body
      
      const validate = ajv.compile(schema)
      const valid = validate(data)
      
      if (!valid) {
        console.log('Validation errors:', validate.errors)
      }
      
      expect(valid).toBe(true)
    })
  })

  describe('Live API Contract Validation', () => {
    it('should validate real API response matches contract', async () => {
      // Skip in CI unless specifically testing integration
      if (process.env.CI && !process.env.RUN_INTEGRATION_TESTS) {
        console.log('Skipping live API test in CI')
        return
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      const schema = instagramContract.schema
      
      const validate = ajv.compile(schema)
      const valid = validate(data)
      
      if (!valid) {
        console.log('Contract violation detected!')
        console.log('Validation errors:', validate.errors)
        console.log('Response data:', JSON.stringify(data, null, 2))
      }
      
      expect(valid).toBe(true)
    }, 10000) // 10 second timeout for API calls
  })

  describe('Contract Evolution Detection', () => {
    it('should detect when API response differs from contract', async () => {
      // This test helps identify when the API contract has changed
      if (process.env.CI && !process.env.RUN_INTEGRATION_TESTS) {
        return
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      const actualData = await response.json()
      const expectedStructure = instagramContract.response.body

      // Check for new fields that aren't in our contract
      const checkForNewFields = (actual, expected, path = '') => {
        const issues = []
        
        if (typeof actual === 'object' && actual !== null) {
          for (const key in actual) {
            const currentPath = path ? `${path}.${key}` : key
            
            if (!(key in expected)) {
              issues.push(`New field detected: ${currentPath}`)
            } else if (typeof actual[key] === 'object' && actual[key] !== null) {
              issues.push(...checkForNewFields(actual[key], expected[key], currentPath))
            }
          }
        }
        
        return issues
      }

      const newFields = checkForNewFields(actualData, expectedStructure)
      
      if (newFields.length > 0) {
        console.log('⚠️  API Contract Evolution Detected:')
        newFields.forEach(field => console.log(`  - ${field}`))
        console.log('\n📝 Consider updating the contract file if these changes are intentional.')
      }

      // This test passes but logs warnings - it's informational
      expect(response.status).toBe(200)
    })
  })

  describe('Performance Contract', () => {
    it('should meet performance requirements', async () => {
      if (process.env.CI && !process.env.RUN_INTEGRATION_TESTS) {
        return
      }

      const startTime = Date.now()
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'Instagram' })
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(5000) // Should respond within 5 seconds
      
      console.log(`⚡ API Response time: ${responseTime}ms`)
    }, 10000)
  })

  describe('Error Contract Validation', () => {
    it('should validate error responses match contract', async () => {
      if (process.env.CI && !process.env.RUN_INTEGRATION_TESTS) {
        return
      }

      // Test with invalid app name to trigger error
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'NonExistentApp12345' })
      })

      // Should either return 404 or valid response with empty results
      expect([200, 404]).toContain(response.status)
      
      const data = await response.json()
      
      if (response.status === 404) {
        expect(data).toHaveProperty('error')
        expect(data).toHaveProperty('message')
      } else {
        // If 200, should still follow the contract
        expect(data).toHaveProperty('appInfo')
        expect(data).toHaveProperty('reviews')
        expect(data).toHaveProperty('summary')
      }
    })
  })
})

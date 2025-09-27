#!/usr/bin/env node

/**
 * Script to generate API contracts from live API responses
 * Usage: node scripts/generate-contract.js [app-name] [output-file]
 */

const fs = require('fs')
const path = require('path')

async function generateContract(appName = 'Instagram', outputFile) {
  console.log(`🔍 Generating contract for ${appName}...`)
  
  try {
    // Make request to local API
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appName })
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Generate contract structure
    const contract = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      appName: appName,
      request: {
        method: "POST",
        url: "/api/reviews",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          appName: appName
        }
      },
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      },
      metadata: {
        reviewCount: data.reviews?.length || 0,
        iosRating: data.appInfo?.foundApps?.ios?.rating || null,
        androidRating: data.appInfo?.foundApps?.android?.rating || null,
        generatedAt: new Date().toISOString(),
        generatedBy: "generate-contract.js"
      }
    }

    // Determine output file
    const defaultFile = path.join(
      __dirname, 
      '../tests/fixtures/contracts', 
      `${appName.toLowerCase().replace(/\s+/g, '-')}-contract.json`
    )
    const filePath = outputFile || defaultFile

    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write contract file
    fs.writeFileSync(filePath, JSON.stringify(contract, null, 2))
    
    console.log(`✅ Contract generated successfully:`)
    console.log(`   📁 File: ${filePath}`)
    console.log(`   📊 Reviews: ${contract.metadata.reviewCount}`)
    console.log(`   ⭐ iOS Rating: ${contract.metadata.iosRating}`)
    console.log(`   ⭐ Android Rating: ${contract.metadata.androidRating}`)
    
    return contract
  } catch (error) {
    console.error(`❌ Failed to generate contract:`, error.message)
    process.exit(1)
  }
}

// CLI usage
if (require.main === module) {
  const appName = process.argv[2] || 'Instagram'
  const outputFile = process.argv[3]
  
  generateContract(appName, outputFile)
}

module.exports = { generateContract }

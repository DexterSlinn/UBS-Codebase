// Test script to verify frontend API connectivity
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3006';

const testEndpoints = async () => {
  console.log('Testing API endpoints that frontend uses...');
  
  const endpoints = [
    '/api/stocks/active',
    '/api/crypto/top20', 
    '/api/market-overview',
    '/api/health'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting ${endpoint}...`);
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        
        // Check data structure
        if (endpoint === '/api/stocks/active' && data.stocks) {
          console.log(`   📊 Stocks data: ${data.stocks.length} items`);
        } else if (endpoint === '/api/crypto/top20' && data.cryptos) {
          console.log(`   💰 Crypto data: ${data.cryptos.length} items`);
        } else if (endpoint === '/api/market-overview' && data.articles) {
          console.log(`   📰 News data: ${data.articles.length} items`);
        } else if (endpoint === '/api/health') {
          console.log(`   ❤️  Health check: OK`);
        }
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Testing complete!');
};

testEndpoints();
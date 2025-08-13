// Test URL construction functions
const mockEnv = { DEV: false };

// Mock the API configuration
const getApiBaseUrl = () => {
  if (mockEnv.DEV) {
    return 'http://localhost:3006';
  }
  return 'https://traejwwqnnk2-ckk48rthi-dexters-projects-4216910d.vercel.app';
};

const getMarketApiBaseUrl = () => {
  if (mockEnv.DEV) {
    return 'http://localhost:3006';
  }
  return 'https://traejwwqnnk2-ckk48rthi-dexters-projects-4216910d.vercel.app';
};

const getStockApiBaseUrl = () => {
  if (mockEnv.DEV) {
    return 'http://localhost:3001';
  }
  return 'https://traejwwqnnk2-ckk48rthi-dexters-projects-4216910d.vercel.app';
};

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  MARKET_URL: getMarketApiBaseUrl(),
  STOCK_URL: getStockApiBaseUrl()
};

// Test the fixed URL construction functions
const buildApiUrl = (endpoint, baseUrl = API_CONFIG.BASE_URL) => {
  // Ensure there's always a slash between base URL and endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

const buildMarketUrl = (endpoint) => {
  // Ensure proper URL construction with slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_CONFIG.MARKET_URL}/api/${cleanEndpoint}`;
};

const buildStockUrl = (symbol) => {
  // Ensure proper URL construction with slashes
  return `${API_CONFIG.STOCK_URL}/api/stock/${symbol}`;
};

// Test cases
console.log('=== URL Construction Tests ===');
console.log('Base URL:', API_CONFIG.BASE_URL);
console.log('');

console.log('buildApiUrl tests:');
console.log('  stocks/active:', buildApiUrl('stocks/active'));
console.log('  /api/crypto/top20:', buildApiUrl('/api/crypto/top20'));
console.log('  api/market-overview:', buildApiUrl('api/market-overview'));
console.log('');

console.log('buildMarketUrl tests:');
console.log('  stocks/active:', buildMarketUrl('stocks/active'));
console.log('  /stocks/active:', buildMarketUrl('/stocks/active'));
console.log('');

console.log('buildStockUrl tests:');
console.log('  AAPL:', buildStockUrl('AAPL'));
console.log('  MSFT:', buildStockUrl('MSFT'));

// Check for malformed URLs
const testUrls = [
  buildApiUrl('stocks/active'),
  buildApiUrl('/api/crypto/top20'),
  buildMarketUrl('stocks/active'),
  buildStockUrl('AAPL')
];

console.log('');
console.log('=== Malformed URL Check ===');
let hasErrors = false;
testUrls.forEach((url, index) => {
  if (url.includes('vercel.appstocks') || url.includes('vercel.appapi') || url.includes('//api')) {
    console.log(`❌ ERROR: Malformed URL detected: ${url}`);
    hasErrors = true;
  } else {
    console.log(`✅ OK: ${url}`);
  }
});

if (!hasErrors) {
  console.log('\n🎉 All URL construction tests passed!');
} else {
  console.log('\n❌ URL construction has errors that need fixing.');
}
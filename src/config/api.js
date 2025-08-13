// API Configuration for different environments
export const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3006';
  }
  return 'https://your-backend-deployment-url.vercel.app';
};

const getProxyBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3006';
  }
  return import.meta.env.VITE_PROXY_BASE_URL || 'https://your-backend-deployment-url.vercel.app';
};

const getStockApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3006';
  }
  return import.meta.env.VITE_STOCK_API_BASE_URL || 'https://your-backend-deployment-url.vercel.app';
};

const getMarketApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3006';
  }
  return import.meta.env.VITE_MARKET_API_BASE_URL || 'https://your-backend-deployment-url.vercel.app';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  PROXY_URL: getProxyBaseUrl(),
  STOCK_URL: getStockApiBaseUrl(),
  MARKET_URL: getMarketApiBaseUrl(),
  ENDPOINTS: {
    CHAT: '/api/chat',
    DASHBOARD_CHAT: '/api/dashboard-chat',
    CRYPTO: '/api/crypto/top20',
    STOCKS_ACTIVE: '/api/stocks/active',
    MARKET_OVERVIEW: '/api/market-overview',
    PROXY: '/api/proxy',
    MCP: '/api/mcp',
    KNOWLEDGE_BASE: {
      SUGGESTIONS: '/api/knowledge-base/suggestions',
      SEARCH: '/api/knowledge-base/search',
      DOCUMENTS: '/api/knowledge-base/documents'
    },
    METRICS: '/api/metrics',
    HEALTH: '/api/health'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, baseUrl = API_CONFIG.BASE_URL) => {
  // Ensure there's always a slash between base URL and endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Helper function for stock API URLs
export const buildStockUrl = (symbol) => {
  // Ensure proper URL construction with slashes
  return `${API_CONFIG.STOCK_URL}/api/stock/${symbol}`;
};

// Helper function for proxy URLs
export const buildProxyUrl = (targetUrl) => {
  return `${API_CONFIG.PROXY_URL}${API_CONFIG.ENDPOINTS.PROXY}?url=${encodeURIComponent(targetUrl)}`;
};

// Helper function for market API URLs
export const buildMarketUrl = (endpoint) => {
  // Ensure proper URL construction with slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_CONFIG.MARKET_URL}/api/${cleanEndpoint}`;
};
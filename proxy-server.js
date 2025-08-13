import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = process.env.PROXY_PORT || 3004;

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Middleware to remove X-Frame-Options and Content-Security-Policy headers
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Content-Security-Policy');
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Proxy Server is running');
});

// Proxy middleware options
const proxyOptions = {
  target: 'http://localhost:3004', // Will be overridden in router
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  onProxyRes: (proxyRes, req, res) => {
    // Remove headers that prevent framing
    proxyRes.headers['x-frame-options'] = undefined;
    proxyRes.headers['content-security-policy'] = undefined;
    proxyRes.headers['frame-options'] = undefined;
    
    // Add headers that allow framing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
};

// Create the proxy middleware
const createProxyRouter = (target) => {
  return createProxyMiddleware({
    ...proxyOptions,
    target
  });
};

// UBS Switzerland URL fallback suggestions
const ubsFallbackUrls = {
  'investments': 'https://www.ubs.com/ch/en/services/investments.html',
  'funds': 'https://www.ubs.com/ch/en/assetmanagement/funds.html',
  'etfs': 'https://www.ubs.com/ch/en/assetmanagement/capabilities/etfs.html',
  'accounts': 'https://www.ubs.com/ch/en/private/accounts-and-cards.html',
  'banking': 'https://www.ubs.com/ch/en/private/banking.html',
  'sustainability': 'https://www.ubs.com/ch/en/microsites/sustainability.html',
  'about': 'https://www.ubs.com/ch/en/about-us.html',
  'careers': 'https://www.ubs.com/ch/en/careers.html',
  'private': 'https://www.ubs.com/ch/en/private.html',
  'wealth': 'https://www.ubs.com/ch/en/private/wealth-management.html'
};

// Function to suggest alternative UBS URLs
function suggestUbsAlternative(originalUrl) {
  const url = originalUrl.toLowerCase();
  
  for (const [keyword, fallbackUrl] of Object.entries(ubsFallbackUrls)) {
    if (url.includes(keyword)) {
      return fallbackUrl;
    }
  }
  
  // Default fallback to main UBS Switzerland page
  return 'https://www.ubs.com/ch/en.html';
}

// Proxy endpoint that accepts a target URL
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    console.log(`Proxying request to: ${targetUrl}`);
    
    // Validate URL format
    let validatedUrl;
    try {
      validatedUrl = new URL(targetUrl).toString();
      console.log(`Validated URL: ${validatedUrl}`);
    } catch (urlError) {
      console.error('URL validation error:', urlError.message);
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: urlError.message,
        url: targetUrl
      });
    }
    
    // Fetch the webpage content
    const response = await axios.get(validatedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000, // 15 second timeout
      maxRedirects: 5,
    });
    
    console.log(`Successfully fetched content from ${validatedUrl}, status: ${response.status}`);
    
    // Remove any headers that prevent framing
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Frame-Options');
    
    // Set headers to allow framing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    
    // Process the HTML to remove scripts that might cause infinite loops
    let html = response.data;
    
    // Add base tag to ensure relative URLs resolve correctly
    const baseUrl = new URL(validatedUrl);
    const baseTag = `<base href="${baseUrl.origin}${baseUrl.pathname}">`;
    html = html.replace('<head>', `<head>${baseTag}`);
    
    // Return the content
    res.send(html);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // If it's a UBS URL that failed, try to suggest an alternative
    if (targetUrl.includes('ubs.com/ch/en') && (error.response?.status === 404 || error.code === 'ENOTFOUND')) {
      const alternativeUrl = suggestUbsAlternative(targetUrl);
      console.log(`UBS URL failed, suggesting alternative: ${alternativeUrl}`);
      
      try {
        const fallbackResponse = await axios.get(alternativeUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          },
          timeout: 15000,
          maxRedirects: 5,
        });
        
        console.log(`Successfully fetched fallback content from ${alternativeUrl}`);
        
        // Remove any headers that prevent framing
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');
        res.removeHeader('Frame-Options');
        
        // Set headers to allow framing
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/html');
        
        // Process the HTML
        let html = fallbackResponse.data;
        
        // Add base tag and notification about the fallback
        const baseUrl = new URL(alternativeUrl);
        const baseTag = `<base href="${baseUrl.origin}${baseUrl.pathname}">`;
        const notificationBanner = `
          <div style="background: #f0f8ff; border: 1px solid #0066cc; padding: 10px; margin: 10px; border-radius: 5px; font-family: Arial, sans-serif;">
            <strong>Note:</strong> The requested page was not found. Showing related UBS Switzerland content instead.
            <br><small>Original URL: ${targetUrl}</small>
            <br><small>Showing: ${alternativeUrl}</small>
          </div>
        `;
        
        html = html.replace('<head>', `<head>${baseTag}`);
        html = html.replace('<body>', `<body>${notificationBanner}`);
        
        return res.send(html);
      } catch (fallbackError) {
        console.error('Fallback URL also failed:', fallbackError.message);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch content',
      message: error.message,
      url: targetUrl,
      suggestion: targetUrl.includes('ubs.com/ch/en') ? suggestUbsAlternative(targetUrl) : null
    });
  }
});

// API proxy routes - forward API requests to the main backend server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3006',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying API request: ${req.method} ${req.url} -> http://localhost:3006${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('API Proxy error:', err);
    res.status(500).json({ error: 'API proxy error', message: err.message });
  }
}));

// Dynamic proxy route for any URL
app.use('/proxy-page/*', (req, res, next) => {
  const path = req.path.replace('/proxy-page/', '');
  const targetUrl = Buffer.from(path, 'base64').toString('utf-8');
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'Invalid URL encoding' });
  }
  
  console.log(`Dynamic proxy to: ${targetUrl}`);
  const proxyRouter = createProxyRouter(targetUrl);
  proxyRouter(req, res, next);
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
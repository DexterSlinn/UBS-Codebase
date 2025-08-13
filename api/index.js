// Minimal Vercel serverless function
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple response
  res.status(200).json({ 
    message: 'UBS API Server is running on Vercel',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/api/chat', '/api/crypto/top20'],
    version: '1.0.0',
    platform: 'Vercel Serverless',
    method: req.method,
    url: req.url
  });
};
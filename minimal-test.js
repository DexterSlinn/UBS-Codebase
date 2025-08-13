import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3006;

// Basic middleware
app.use(cors());
app.use(express.json());

// Minimal health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested from:', req.ip);
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    port: port,
    environment: process.env.NODE_ENV || 'development',
    message: 'Minimal test server running'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint requested from:', req.ip);
  res.status(200).json({ 
    message: 'Minimal Railway test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port,
    host: '0.0.0.0',
    platform: process.platform,
    nodeVersion: process.version
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested from:', req.ip);
  res.status(200).json({ 
    message: 'Minimal UBS Test Server',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/test'],
    version: '1.0.0-minimal'
  });
});

// Start server
function startServer() {
  const serverStartTime = Date.now();
  
  console.log('🚀 Minimal Railway test server starting...');
  console.log('📍 Environment variables:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('  - PORT:', process.env.PORT || 'not set (using default)');
  console.log('  - Platform:', process.platform);
  console.log('  - Node version:', process.version);
  
  app.listen(port, '0.0.0.0', () => {
    const startupTime = Date.now() - serverStartTime;
    console.log(`🌐 Minimal server running on port ${port} (started in ${startupTime}ms)`);
    console.log(`📊 Health endpoint: /api/health`);
    console.log(`🧪 Test endpoint: /test`);
    console.log(`🏠 Root endpoint: /`);
  });
}

// Start server immediately
console.log('⚡ Starting minimal server...');
startServer();
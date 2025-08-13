# Deployment Guide

## Backend Connection Issue Fix

The frontend has been updated to use dynamic API URLs that work in both development and production environments.

### Changes Made

1. **Created API Configuration** (`src/config/api.js`)
   - Centralized API endpoint management
   - Dynamic URL generation based on environment
   - Support for multiple backend services

2. **Updated All Components**
   - Replaced hardcoded `localhost` URLs
   - Now uses environment-based configuration

### Environment Variables

#### For Local Development
- No additional setup required
- Will automatically use `localhost` URLs

#### For Production (Vercel)

You need to set the following environment variable in your Vercel dashboard:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

**Steps to set environment variables in Vercel:**

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your deployed backend URL (e.g., `https://your-backend.herokuapp.com`)
   - **Environment**: Production (or All)
5. Redeploy your application

### Backend Deployment

Your backend needs to be deployed separately. Popular options:

- **Heroku**: `https://your-app.herokuapp.com`
- **Railway**: `https://your-app.up.railway.app`
- **Render**: `https://your-app.onrender.com`
- **Custom VPS**: `https://api.yourdomain.com`

### API Endpoints

The frontend expects these endpoints on your backend:

- `/api/chat` - Chat functionality
- `/api/mcp` - MCP integration
- `/api/crypto/top20` - Cryptocurrency data
- `/api/market-overview` - Market data
- `/api/proxy` - Proxy functionality
- `/api/stock/{symbol}` - Stock data
- `/api/active-stocks` - Active stocks
- `/api/search` - Stock search

### Testing

After setting the environment variable and redeploying:

1. Check browser console for any API errors
2. Verify that API calls are going to your backend URL
3. Test all features that require backend connectivity

### Troubleshooting

- **Still seeing localhost URLs**: Clear browser cache and hard refresh
- **CORS errors**: Ensure your backend allows requests from your Vercel domain
- **404 errors**: Verify your backend is deployed and accessible
- **Environment variable not working**: Ensure it starts with `VITE_` prefix
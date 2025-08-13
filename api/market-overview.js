function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return fallback news data for market overview
    const fallbackNews = [
      {
        title: "Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty",
        description: "The Federal Reserve hints at possible interest rate reductions as inflation shows signs of cooling and economic growth moderates.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Reuters",
        time: "2 hours ago"
      },
      {
        title: "Tech Stocks Rally on AI Investment Surge",
        description: "Major technology companies see significant gains as artificial intelligence investments drive market optimism.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Bloomberg",
        time: "4 hours ago"
      },
      {
        title: "Energy Sector Volatility Continues Amid Global Supply Concerns",
        description: "Oil and gas prices fluctuate as geopolitical tensions and supply chain disruptions impact global energy markets.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Financial Times",
        time: "6 hours ago"
      },
      {
        title: "Banking Sector Shows Resilience Despite Credit Concerns",
        description: "Major banks report stable earnings while navigating changing interest rate environment and credit market conditions.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Wall Street Journal",
        time: "8 hours ago"
      },
      {
        title: "Consumer Spending Patterns Shift as Inflation Pressures Ease",
        description: "Retail data indicates changing consumer behavior as price pressures moderate across key spending categories.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "CNBC",
        time: "10 hours ago"
      }
    ];
    
    res.json({
      articles: fallbackNews,
      source: 'vercel_serverless',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in market overview endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch market overview data' });
  }
}

module.exports = handler;
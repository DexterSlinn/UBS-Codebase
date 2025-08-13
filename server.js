import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3006;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Mock web search function (in a real implementation, you would use a proper search API)
const searchFinancialTerm = async (term) => {
  // This is a mock implementation. In a real scenario, you would:
  // 1. Use a search API like Google Custom Search, Bing Search API, or similar
  // 2. Parse financial websites or use financial data APIs
  // 3. Use AI services to generate explanations
  
  // For demonstration, we'll return mock data based on common financial terms
  const mockResults = {
    'blockchain': {
      definition: 'A distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography.',
      explanation: 'Blockchain is like a digital ledger that is shared across many computers. Each transaction is recorded in a "block" and linked to previous blocks, creating a chain. This makes it very difficult to alter past records, providing security and transparency.',
      example: 'Bitcoin uses blockchain technology to record all transactions. When you send Bitcoin to someone, that transaction is recorded in a block and added to the blockchain.',
      category: 'Technology'
    },
    'cryptocurrency': {
      definition: 'A digital or virtual currency that uses cryptography for security and operates independently of a central bank.',
      explanation: 'Cryptocurrency is digital money that exists only online. Unlike traditional money controlled by governments and banks, cryptocurrencies are decentralized and use complex math (cryptography) to secure transactions.',
      example: 'Bitcoin and Ethereum are popular cryptocurrencies. You can buy, sell, and trade them on cryptocurrency exchanges, and some businesses accept them as payment.',
      category: 'Digital Currency'
    },
    'defi': {
      definition: 'Decentralized Finance - a blockchain-based form of finance that does not rely on central financial intermediaries.',
      explanation: 'DeFi aims to recreate traditional financial services like lending, borrowing, and trading using blockchain technology, without needing banks or other middlemen.',
      example: 'Instead of getting a loan from a bank, you could use a DeFi platform to borrow money directly from other users, with smart contracts handling the terms automatically.',
      category: 'Blockchain Finance'
    },
    'nft': {
      definition: 'Non-Fungible Token - a unique digital certificate that represents ownership of a specific digital or physical asset.',
      explanation: 'An NFT is like a digital certificate of authenticity. While anyone can copy a digital image, only one person can own the NFT that proves they own the "original" version.',
      example: 'Digital art, collectible cards, and even tweets have been sold as NFTs. The buyer gets a token proving they own that specific digital item.',
      category: 'Digital Assets'
    }
  };
  
  const normalizedTerm = term.toLowerCase().trim();
  
  if (mockResults[normalizedTerm]) {
    return mockResults[normalizedTerm];
  }
  
  // Generic response for unknown terms
  return {
    definition: `${term} is a financial or economic term that requires further research.`,
    explanation: `Based on available information, ${term} appears to be related to finance or economics. For accurate and detailed information about this term, we recommend consulting financial resources or speaking with a financial advisor.`,
    example: 'For specific examples and applications, please consult authoritative financial sources or professional advisors.',
    category: 'General Finance'
  };
};

// Mock stock data for fallback
const getMockStockData = (symbol) => {
  const mockData = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: '1.24',
      open: 174.20,
      high: 176.80,
      low: 173.90,
      previousClose: 173.28,
      volume: 45678900,
      timestamp: new Date().toISOString().split('T')[0]
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.56,
      change: -1.23,
      changePercent: '-0.86',
      open: 143.80,
      high: 144.20,
      low: 141.90,
      previousClose: 143.79,
      volume: 23456789,
      timestamp: new Date().toISOString().split('T')[0]
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.85,
      change: 4.32,
      changePercent: '1.15',
      open: 375.50,
      high: 380.20,
      low: 374.80,
      previousClose: 374.53,
      volume: 34567890,
      timestamp: new Date().toISOString().split('T')[0]
    }
  };
  
  return mockData[symbol.toUpperCase()] || {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Corporation`,
    price: 100.00 + Math.random() * 50,
    change: (Math.random() - 0.5) * 10,
    changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
    open: 95.00 + Math.random() * 60,
    high: 105.00 + Math.random() * 60,
    low: 90.00 + Math.random() * 50,
    previousClose: 98.00 + Math.random() * 55,
    volume: Math.floor(Math.random() * 50000000) + 10000000,
    timestamp: new Date().toISOString().split('T')[0]
  };
};

// Stock data endpoint using Groq AI
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ error: 'Invalid stock symbol provided' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    console.log(`Fetching stock data for: ${upperSymbol}`);
    
    // Stock company name mapping
    const stockMapping = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc. (Google)',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'UNH': 'UnitedHealth Group Inc.',
      'JNJ': 'Johnson & Johnson',
      'WMT': 'Walmart Inc.',
      'PG': 'Procter & Gamble Co.',
      'MA': 'Mastercard Inc.',
      'HD': 'Home Depot Inc.',
      'BAC': 'Bank of America Corp.',
      'XOM': 'Exxon Mobil Corporation',
      'AVGO': 'Broadcom Inc.',
      'CVX': 'Chevron Corporation',
      'KO': 'Coca-Cola Company'
    };
    
    // Get the correct company name from mapping
    const companyName = stockMapping[upperSymbol] || `${upperSymbol} Corporation`;
    
    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.log('No Groq API key configured, using mock data');
      const mockData = getMockStockData(symbol);
      return res.json({ ...mockData, fallback: true });
    }
    
    try {
      // Use Groq to generate realistic stock data for the specific symbol
      const stockPrompt = `Generate realistic detailed stock market data for the stock symbol "${upperSymbol}". This is ${companyName}. Use current market knowledge and realistic values based on the actual company.

IMPORTANT: Use these EXACT company details:
- Symbol: ${upperSymbol}
- Company Name: ${companyName}

Return ONLY a valid JSON object in this exact format:
{
  "symbol": "${upperSymbol}",
  "name": "${companyName}",
  "price": "123.45",
  "change": "+2.34",
  "changePercent": "+1.94%",
  "volume": "1,234,567",
  "marketCap": "1.23T",
  "peRatio": "25.4",
  "high52Week": "180.25",
  "low52Week": "120.15",
  "dividendYield": "1.2%",
  "beta": "1.15",
  "eps": "4.85"
}

Requirements:
- Use EXACTLY: Symbol "${upperSymbol}" and Name "${companyName}"
- Generate realistic prices based on the actual company's typical trading range
- For major tech stocks (AAPL, MSFT, GOOGL): prices typically $100-400
- For NVDA: prices typically $400-900
- For TSLA: prices typically $150-300
- Include realistic market cap based on company size
- Change can be positive or negative (between -8% and +8%)
- Return ONLY the JSON object, no other text or explanation
- All values should reflect current market conditions for this specific company`;
      
      // Check if Groq client is available
      if (!groq) {
        throw new Error('AI service temporarily unavailable');
      }
      
      const groqResponse = await groq.chat.completions.create({
        messages: [{
          role: "user",
          content: stockPrompt
        }],
        model: "llama3-70b-8192",
        temperature: 0.3,
        max_tokens: 800
      });
      
      const generatedContent = groqResponse.choices[0]?.message?.content;
      if (!generatedContent) {
        throw new Error('No response from Groq');
      }
      
      // Clean and parse the JSON response
      let cleanedContent = generatedContent.trim();
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const stockData = JSON.parse(cleanedContent);
      
      console.log(`Successfully generated stock data for ${upperSymbol} using Groq AI`);
      return res.json({ ...stockData, source: 'groq_ai' });
      
    } catch (apiError) {
      console.log('Groq API error, using mock data:', apiError.message);
      const mockData = getMockStockData(symbol);
      return res.json({ ...mockData, fallback: true });
    }
  } catch (error) {
    console.error('Error in stock endpoint:', error);
    // Even on server error, provide mock data
    const mockData = getMockStockData(req.params.symbol || 'AAPL');
    res.json({ ...mockData, fallback: true });
  }
});

// API endpoint for market overview data (news)
app.get('/api/market-overview', async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    // Always return fallback news data for now since this endpoint is expected to return news articles
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
      fallback: !apiKey,
      source: 'mock_data'
    });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    
    // Return fallback data even on error
    const fallbackNews = [{
      title: 'Market Update',
      description: 'Financial markets showing mixed signals today.',
      url: '#',
      publishedAt: new Date().toISOString()
    }];
    
    res.json({
      articles: fallbackNews,
      fallback: true,
      source: 'fallback_data',
      error: 'Failed to fetch market data'
    });
  }
});

// Helper function to get market names
function getMarketName(symbol) {
  const names = {
    'SPY': 'S&P 500 ETF',
    'QQQ': 'NASDAQ 100 ETF',
    'DIA': 'Dow Jones ETF',
    'IWM': 'Russell 2000 ETF',
    'VTI': 'Total Stock Market ETF'
  };
  return names[symbol] || symbol;
}

// API endpoint for economic indicators
app.get('/api/economic-indicators', async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Alpha Vantage API key not configured' });
    }
    
    const indicators = [];
    
    // Fetch GDP data
    try {
      const gdpResponse = await fetch(
        `https://www.alphavantage.co/query?function=REAL_GDP&interval=annual&apikey=${apiKey}`
      );
      
      if (gdpResponse.ok) {
        const gdpData = await gdpResponse.json();
        if (gdpData.data && gdpData.data.length > 0) {
          const latest = gdpData.data[0];
          const previous = gdpData.data[1];
          const change = previous ? ((latest.value - previous.value) / previous.value * 100).toFixed(2) : 0;
          
          indicators.push({
            name: 'US GDP Growth',
            value: `$${(latest.value / 1000).toFixed(1)}T`,
            change: parseFloat(change),
            description: 'Annual Real GDP'
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error fetching GDP data:', error);
    }
    
    // Fetch inflation data
    try {
      const inflationResponse = await fetch(
        `https://www.alphavantage.co/query?function=CPI&interval=monthly&apikey=${apiKey}`
      );
      
      if (inflationResponse.ok) {
        const inflationData = await inflationResponse.json();
        if (inflationData.data && inflationData.data.length > 0) {
          const latest = inflationData.data[0];
          const yearAgo = inflationData.data[12];
          const change = yearAgo ? ((latest.value - yearAgo.value) / yearAgo.value * 100).toFixed(2) : 0;
          
          indicators.push({
            name: 'US Inflation (CPI)',
            value: `${change}%`,
            change: parseFloat(change),
            description: 'Year-over-year change'
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error fetching inflation data:', error);
    }
    
    // Fetch unemployment data
    try {
      const unemploymentResponse = await fetch(
        `https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${apiKey}`
      );
      
      if (unemploymentResponse.ok) {
        const unemploymentData = await unemploymentResponse.json();
        if (unemploymentData.data && unemploymentData.data.length > 0) {
          const latest = unemploymentData.data[0];
          const previous = unemploymentData.data[1];
          const change = previous ? (latest.value - previous.value).toFixed(2) : 0;
          
          indicators.push({
            name: 'US Unemployment',
            value: `${latest.value}%`,
            change: parseFloat(change),
            description: 'Monthly unemployment rate'
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error fetching unemployment data:', error);
    }
    
    // Fetch federal funds rate
    try {
      const rateResponse = await fetch(
        `https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=monthly&apikey=${apiKey}`
      );
      
      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        if (rateData.data && rateData.data.length > 0) {
          const latest = rateData.data[0];
          const previous = rateData.data[1];
          const change = previous ? (latest.value - previous.value).toFixed(2) : 0;
          
          indicators.push({
            name: 'Federal Funds Rate',
            value: `${latest.value}%`,
            change: parseFloat(change),
            description: 'US interest rate'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching federal funds rate:', error);
    }
    
    res.json(indicators);
  } catch (error) {
    console.error('Error fetching economic indicators:', error);
    res.status(500).json({ error: 'Failed to fetch economic indicators' });
  }
});

// API endpoint for financial news
app.get('/api/financial-news', async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Alpha Vantage API key not configured' });
    }
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news from Alpha Vantage');
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      return res.status(404).json({ error: 'News data not found' });
    }
    
    if (data['Note']) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    const articles = data.feed ? data.feed.slice(0, 10).map(article => ({
      title: article.title,
      summary: article.summary,
      source: article.source,
      url: article.url,
      time_published: article.time_published,
      sentiment: article.overall_sentiment_label
    })) : [];
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching financial news:', error);
    res.status(500).json({ error: 'Failed to fetch financial news' });
  }
});

// API endpoint for searching financial terms
app.post('/api/search-financial-term', async (req, res) => {
  try {
    const { term } = req.body;
    
    if (!term || typeof term !== 'string') {
      return res.status(400).json({ error: 'Invalid term provided' });
    }
    
    const result = await searchFinancialTerm(term);
    res.json(result);
  } catch (error) {
    console.error('Error searching financial term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
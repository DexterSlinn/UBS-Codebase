function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  try {
    // Mock stock data for fallback
    const getMockStockData = (stockSymbol) => {
      const mockData = {
        'AAPL': {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 175.43,
          change: 2.15,
          changePercent: '+1.24%',
          volume: '45.2M',
          marketCap: '2.75T',
          peRatio: '28.5',
          high52Week: '199.62',
          low52Week: '164.08',
          beta: '1.29',
          eps: '6.16'
        },
        'MSFT': {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 378.85,
          change: 1.87,
          changePercent: '+0.50%',
          volume: '22.1M',
          marketCap: '2.81T',
          peRatio: '32.1',
          high52Week: '384.30',
          low52Week: '309.45',
          beta: '0.89',
          eps: '11.80'
        },
        'GOOGL': {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 142.56,
          change: 0.95,
          changePercent: '+0.67%',
          volume: '18.7M',
          marketCap: '1.78T',
          peRatio: '25.4',
          high52Week: '153.78',
          low52Week: '121.46',
          beta: '1.05',
          eps: '5.61'
        },
        'TSLA': {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          price: 248.91,
          change: 3.21,
          changePercent: '+1.31%',
          volume: '89.4M',
          marketCap: '792.1B',
          peRatio: '65.2',
          high52Week: '299.29',
          low52Week: '138.80',
          beta: '2.11',
          eps: '3.62'
        }
      };
      
      return mockData[stockSymbol.toUpperCase()] || {
        symbol: stockSymbol.toUpperCase(),
        name: `${stockSymbol.toUpperCase()} Corporation`,
        price: (Math.random() * 200 + 50).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: `${(Math.random() * 6 - 3).toFixed(2)}%`,
        volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
        marketCap: `${(Math.random() * 500 + 100).toFixed(1)}B`,
        peRatio: (Math.random() * 40 + 10).toFixed(1),
        high52Week: (Math.random() * 300 + 100).toFixed(2),
        low52Week: (Math.random() * 100 + 50).toFixed(2),
        beta: (Math.random() * 2 + 0.5).toFixed(2),
        eps: (Math.random() * 10 + 1).toFixed(2)
      };
    };
    
    const stockData = getMockStockData(symbol);
    
    res.json({
      ...stockData,
      source: 'vercel_serverless',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in stock endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}

module.exports = handler;
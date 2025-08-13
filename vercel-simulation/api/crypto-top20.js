function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return fallback crypto data for dashboard
    const fallbackCryptos = [
      { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: '43250.00', changePercent: '+2.45%', marketCap: '845.2B' },
      { rank: 2, symbol: 'ETH', name: 'Ethereum', price: '2650.00', changePercent: '+1.23%', marketCap: '318.5B' },
      { rank: 3, symbol: 'USDT', name: 'Tether', price: '1.00', changePercent: '+0.01%', marketCap: '95.8B' },
      { rank: 4, symbol: 'BNB', name: 'BNB', price: '315.50', changePercent: '-0.87%', marketCap: '47.2B' },
      { rank: 5, symbol: 'SOL', name: 'Solana', price: '98.75', changePercent: '+3.21%', marketCap: '42.1B' },
      { rank: 6, symbol: 'USDC', name: 'USD Coin', price: '1.00', changePercent: '+0.00%', marketCap: '25.3B' },
      { rank: 7, symbol: 'XRP', name: 'XRP', price: '0.52', changePercent: '-1.45%', marketCap: '28.7B' },
      { rank: 8, symbol: 'STETH', name: 'Lido Staked Ether', price: '2645.00', changePercent: '+1.18%', marketCap: '24.8B' },
      { rank: 9, symbol: 'TON', name: 'Toncoin', price: '2.35', changePercent: '+4.67%', marketCap: '8.1B' },
      { rank: 10, symbol: 'DOGE', name: 'Dogecoin', price: '0.085', changePercent: '+2.34%', marketCap: '12.1B' },
      { rank: 11, symbol: 'ADA', name: 'Cardano', price: '0.48', changePercent: '-0.92%', marketCap: '16.8B' },
      { rank: 12, symbol: 'AVAX', name: 'Avalanche', price: '36.50', changePercent: '+1.87%', marketCap: '14.2B' },
      { rank: 13, symbol: 'SHIB', name: 'Shiba Inu', price: '0.000024', changePercent: '+5.23%', marketCap: '14.1B' },
      { rank: 14, symbol: 'TRX', name: 'TRON', price: '0.105', changePercent: '+0.67%', marketCap: '9.2B' },
      { rank: 15, symbol: 'DOT', name: 'Polkadot', price: '7.25', changePercent: '-2.14%', marketCap: '9.8B' },
      { rank: 16, symbol: 'BCH', name: 'Bitcoin Cash', price: '245.00', changePercent: '+1.56%', marketCap: '4.8B' },
      { rank: 17, symbol: 'NEAR', name: 'NEAR Protocol', price: '3.45', changePercent: '+3.89%', marketCap: '3.7B' },
      { rank: 18, symbol: 'MATIC', name: 'Polygon', price: '0.85', changePercent: '-1.23%', marketCap: '7.9B' },
      { rank: 19, symbol: 'LTC', name: 'Litecoin', price: '72.50', changePercent: '+0.45%', marketCap: '5.4B' },
      { rank: 20, symbol: 'UNI', name: 'Uniswap', price: '6.75', changePercent: '+2.67%', marketCap: '4.1B' }
    ];
    
    res.json({
      cryptos: fallbackCryptos,
      source: 'vercel_serverless',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in crypto endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
}

module.exports = handler;
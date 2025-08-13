import React, { useState, useEffect } from 'react';
import './ActiveStocks.css';
import { buildApiUrl } from '../config/api';

const ActiveStocks = ({ onStockClick, autoRefreshEnabled = true }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fallbackStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '175.43', changePercent: '+2.15%' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: '378.85', changePercent: '+1.87%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '142.56', changePercent: '+0.95%' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '153.32', changePercent: '-0.42%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '248.91', changePercent: '+3.21%' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: '334.78', changePercent: '+1.56%' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '478.23', changePercent: '+4.12%' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: '445.67', changePercent: '-1.23%' }
  ];

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try main API endpoint first
      const response = await fetch(buildApiUrl('/api/stocks/active'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.stocks && data.stocks.length > 0) {
        setStocks(data.stocks);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('No stock data received');
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(`Using fallback data (${err.message})`);
      setStocks(fallbackStocks);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    let interval;
    if (autoRefreshEnabled) {
      // Auto-refresh every 30 seconds
      interval = setInterval(fetchStocks, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  return (
    <div className="active-stocks-dashboard">
      <div className="active-stocks-header">
        <h3>Most Active Stocks</h3>
      </div>
      
      {error && (
        <div className="active-stocks-error">
          {error}
        </div>
      )}
      
      {lastUpdated && (
        <div className="active-stocks-last-updated">
          Last updated: {lastUpdated} • {autoRefreshEnabled ? 'Auto-refresh: 30sec' : 'Manual mode'}
        </div>
      )}
      
      <div className="active-stocks-list">
        {loading ? (
          <div className="active-stocks-loading">Loading stock data...</div>
        ) : stocks.length === 0 ? (
          <div className="active-stocks-no-data">No stock data available</div>
        ) : (
          stocks.slice(0, 10).map((stock) => {
            const changePercent = stock.changePercent ? stock.changePercent.replace('%', '') : '0';
            const isPositive = parseFloat(changePercent) >= 0;
            return (
              <div 
                key={stock.symbol} 
                className="active-stocks-item clickable"
                onClick={() => onStockClick && onStockClick(stock.symbol)}
                title={`Click to search ${stock.symbol}`}
              >
                <span className="active-stocks-symbol">{stock.symbol}</span>
                <span className="active-stocks-price">${stock.price}</span>
                <span className={`active-stocks-change ${isPositive ? 'positive' : 'negative'}`}>
                  {stock.changePercent}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActiveStocks;
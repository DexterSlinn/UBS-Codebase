import React, { useState, useEffect } from 'react';
import './StockViewer.css';
import { buildStockUrl } from '../config/api';

const StockViewer = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchSymbol, setSearchSymbol] = useState('');

  const fetchStockData = async (stockSymbol) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(buildStockUrl(stockSymbol));
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err.message);
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      setSymbol(searchSymbol.toUpperCase());
      setSearchSymbol('');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (percentage) => {
    const num = parseFloat(percentage);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const getChangeClass = (change) => {
    return parseFloat(change) >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="stock-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
            <form onSubmit={handleSearch} className="dashboard-search">
              <div className="search-container">
                <input
                  type="text"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <span>Search</span>
                </button>
              </div>
            </form>
            <div className="ubs-branding">
              <h1>UBS Stock Market Dashboard</h1>
              <p className="subtitle">Real-time market data and analytics</p>
            </div>
        </div>
      </div>

      {loading && (
        <div className="dashboard-loading">
          <div className="loading-container">
            <div className="ubs-spinner"></div>
            <h3>Fetching Market Data</h3>
            <p>Please wait while we retrieve the latest information...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Data Unavailable</h3>
            <p>{error}</p>
            <button onClick={() => fetchStockData(symbol)} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      )}

      {stockData && !loading && (
        <div className="dashboard-content">
          {/* Main Stock Card */}
          <div className="main-stock-card">
            <div className="stock-header-info">
              <div className="symbol-info">
                <h2 className="stock-symbol">{stockData.symbol}</h2>
                <p className="company-name">{stockData.name}</p>
                <span className="trading-day">Trading Day: {new Date(stockData.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="price-section">
                <div className="current-price">{formatPrice(stockData.price)}</div>
                <div className={`price-movement ${getChangeClass(stockData.change)}`}>
                  <span className="change-value">{formatPrice(stockData.change)}</span>
                  <span className="change-percent">({formatPercentage(stockData.changePercent)})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Opening Price</span>
              </div>
              <div className="metric-value">{formatPrice(stockData.open)}</div>
            </div>
            
            <div className="metric-card highlight">
              <div className="metric-header">
                <span className="metric-label">Day's High</span>
              </div>
              <div className="metric-value">{formatPrice(stockData.high)}</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Day's Low</span>
              </div>
              <div className="metric-value">{formatPrice(stockData.low)}</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Previous Close</span>
              </div>
              <div className="metric-value">{formatPrice(stockData.previousClose)}</div>
            </div>
            
            <div className="metric-card volume">
              <div className="metric-header">
                <span className="metric-label">Volume</span>
              </div>
              <div className="metric-value">{stockData.volume?.toLocaleString()}</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Market Cap</span>
              </div>
              <div className="metric-value">{stockData.marketCap || 'N/A'}</div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="performance-summary">
            <h3>Performance Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Day Range</span>
                <span className="stat-value">{formatPrice(stockData.low)} - {formatPrice(stockData.high)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Change from Open</span>
                <span className={`stat-value ${getChangeClass(stockData.price - stockData.open)}`}>
                  {formatPrice(stockData.price - stockData.open)}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-footer">
            <p>Data provided by Alpha Vantage • Last updated: {new Date(stockData.timestamp).toLocaleString()}</p>
            <p className="disclaimer">Market data is delayed. For real-time quotes, please consult your broker.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockViewer;
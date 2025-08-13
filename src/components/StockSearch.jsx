import React, { useState, useEffect } from 'react';
import './StockSearch.css';
import { buildMarketUrl } from '../config/api';

const StockSearch = ({ searchSymbol }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('stockSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 5));
      } catch (err) {
        console.error('Error parsing saved search history:', err);
      }
    }
  }, []);

  // Auto-search when searchSymbol prop changes
  useEffect(() => {
    if (searchSymbol && searchSymbol.trim()) {
      setSearchTerm(searchSymbol);
      searchStock(searchSymbol);
    }
  }, [searchSymbol]);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('stockSearchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const searchStock = async (symbol) => {
    if (!symbol || !symbol.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(buildMarketUrl(`stock/${symbol.toUpperCase()}`));
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStockData(data);
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [symbol.toUpperCase(), ...prev.filter(item => item !== symbol.toUpperCase())];
        return newHistory.slice(0, 5); // Keep only last 5 searches
      });
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.message || 'Failed to fetch stock data. Please try again.');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchStock(searchTerm.trim());
    }
  };

  const handleHistoryClick = (symbol) => {
    setSearchTerm(symbol); // Set the search input to the clicked symbol
    searchStock(symbol);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    
    // If price is already a string with currency format, return it
    if (typeof price === 'string' && price.includes('$')) {
      return price;
    }
    
    // Convert string to number if needed
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    
    if (isNaN(numPrice)) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice);
  };

  const formatPercentage = (percent) => {
    if (percent === undefined || percent === null) return 'N/A';
    
    // If percent is already a formatted string with % sign, return it
    if (typeof percent === 'string' && percent.includes('%')) {
      return percent;
    }
    
    // Convert string to number if needed
    const num = typeof percent === 'string' ? parseFloat(percent.replace(/[^0-9.-]+/g, '')) : parseFloat(percent);
    
    if (isNaN(num)) return 'N/A';
    
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getChangeClass = (change) => {
    if (change === undefined || change === null) return '';
    
    // Handle string values that might include + or - signs
    if (typeof change === 'string') {
      // If it starts with a + or doesn't have a - sign, it's positive
      return change.trim().startsWith('+') || !change.includes('-') ? 'positive' : 'negative';
    }
    
    // Handle numeric values
    return parseFloat(change) >= 0 ? 'positive' : 'negative';
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStockData(null);
    setError(null);
  };

  return (
    <div className="stock-search-container">
      <div className="stock-search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
            className="search-input"
            maxLength={10}
            aria-label="Stock symbol input"
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-button" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading || !searchTerm.trim()}
            className="search-button"
            aria-label="Search for stock"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {searchHistory.length > 0 && (
          <div className="search-history">
            <span className="history-label">Recent:</span>
            {searchHistory.map((symbol, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(symbol)}
                className="history-button"
                aria-label={`Search for ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Loading stock data...</span>
        </div>
      )}

      {stockData && !loading && (
        <div className="stock-result">
          <div className="stock-header">
            <div className="stock-symbol">{stockData.symbol}</div>
            <div className="stock-name">{stockData.name}</div>
          </div>
          
          <div className="stock-price-section">
            <div className="current-price">{formatPrice(stockData.price)}</div>
            <div className={`price-change ${getChangeClass(stockData.change)}`}>
              <span className="change-value">{formatPrice(stockData.change)}</span>
              <span className="change-percent">({formatPercentage(stockData.changePercent)})</span>
            </div>
          </div>

          <div className="stock-details">
            <div className="detail-row">
              <span className="detail-label">Volume:</span>
              <span className="detail-value">
                {typeof stockData.volume === 'number' 
                  ? stockData.volume.toLocaleString() 
                  : typeof stockData.volume === 'string' && !isNaN(parseFloat(stockData.volume.replace(/,/g, ''))) 
                    ? parseFloat(stockData.volume.replace(/,/g, '')).toLocaleString() 
                    : stockData.volume || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Market Cap:</span>
              <span className="detail-value">{stockData.marketCap || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">P/E Ratio:</span>
              <span className="detail-value">{stockData.peRatio || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">52W High:</span>
              <span className="detail-value">{stockData.high52Week ? formatPrice(stockData.high52Week) : 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">52W Low:</span>
              <span className="detail-value">{stockData.low52Week ? formatPrice(stockData.low52Week) : 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Dividend Yield:</span>
              <span className="detail-value">{stockData.dividendYield || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Beta:</span>
              <span className="detail-value">{stockData.beta || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">EPS:</span>
              <span className="detail-value">{stockData.eps || 'N/A'}</span>
            </div>
          </div>

          <div className="stock-footer">
            <span className="data-source">Data: {stockData.source || 'Groq AI'}</span>
            <span className="last-updated">Updated: {stockData.timestamp ? new Date(stockData.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {!stockData && !loading && !error && (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <div className="empty-title">Search Stock Tickers</div>
          <div className="empty-description">
            Enter a stock symbol above to get real-time market data, prices, and key metrics.
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
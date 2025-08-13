import React, { useState, useEffect } from 'react';
import './CryptoTracker.css';
import { API_CONFIG, buildApiUrl } from '../config/api';

const CryptoTracker = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCryptos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CRYPTO));
      const data = await response.json();
      
      if (response.ok && data.cryptos) {
        setCryptos(data.cryptos);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(data.error || 'Failed to fetch crypto data');
      }
    } catch (err) {
      console.error('Error fetching cryptos:', err);
      setError('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    
    // Auto-refresh every 2 minutes (120000ms)
    const interval = setInterval(fetchCryptos, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (num >= 1000) {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (num >= 1) {
      return `$${num.toFixed(2)}`;
    } else {
      return `$${num.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    const num = parseFloat(marketCap.replace(/[^0-9.]/g, ''));
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}T`;
    } else {
      return `$${num.toFixed(1)}B`;
    }
  };

  return (
    <div className="crypto-tracker">
      <div className="crypto-header">
        <h3>Top 20 Cryptocurrencies</h3>
        <button 
          onClick={fetchCryptos} 
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated} • Auto-refresh: 2min
        </div>
      )}
      
      <div className="crypto-list">
        {loading ? (
          <div className="loading-message">Loading cryptocurrency data...</div>
        ) : cryptos.length === 0 ? (
          <div className="no-data-message">No cryptocurrency data available</div>
        ) : (
          <>
            <div className="crypto-header-row">
              <span className="rank">#</span>
              <span className="name">Name</span>
              <span className="price">Price</span>
              <span className="change">24h %</span>
              <span className="market-cap">Market Cap</span>
            </div>
            {cryptos.map((crypto, index) => {
              const changePercent = crypto.changePercent ? crypto.changePercent.replace('%', '') : '0';
              const isPositive = parseFloat(changePercent) >= 0;
              return (
                <div key={crypto.symbol || index} className="crypto-item">
                  <span className="rank">{crypto.rank}</span>
                  <div className="name-section">
                    <span className="symbol">{crypto.symbol}</span>
                    <span className="full-name">{crypto.name}</span>
                  </div>
                  <span className="price">{formatPrice(crypto.price)}</span>
                  <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{crypto.changePercent}
                  </span>
                  <span className="market-cap">{formatMarketCap(crypto.marketCap)}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CryptoTracker;
import React, { useState, useEffect } from 'react';
import './CryptoDashboard.css';
import { API_CONFIG, buildApiUrl } from '../config/api';

const CryptoDashboard = ({ autoRefreshEnabled = true, onCryptoClick }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CRYPTO));
      const data = await response.json();
      
      if (response.ok) {
        setCryptos(data.cryptos || []);
        setError(data.error || null);
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
    
    let interval;
    if (autoRefreshEnabled) {
      // Auto-refresh every 2 minutes
      interval = setInterval(fetchCryptos, 120000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  return (
    <div className="crypto-dashboard">
      <div className="crypto-header">
        <h3>Top Cryptocurrencies</h3>
      </div>
      
      {error && (
        <div className="crypto-error">
          {error}
        </div>
      )}
      
      {lastUpdated && (
        <div className="crypto-last-updated">
          Last updated: {lastUpdated} • {autoRefreshEnabled ? 'Auto-refresh: 2min' : 'Manual mode'}
        </div>
      )}
      
      <div className="crypto-list">
        {loading ? (
          <div className="crypto-loading">Loading cryptocurrency data...</div>
        ) : cryptos.length === 0 ? (
          <div className="crypto-no-data">No cryptocurrency data available</div>
        ) : (
          cryptos.slice(0, 10).map((crypto) => {
            const changePercent = crypto.changePercent ? crypto.changePercent.replace('%', '') : '0';
            const isPositive = parseFloat(changePercent) >= 0;
            return (
              <div 
                key={crypto.symbol} 
                className="crypto-item clickable"
                onClick={() => onCryptoClick && onCryptoClick(crypto.symbol)}
                style={{ cursor: onCryptoClick ? 'pointer' : 'default' }}
              >
                <span className="crypto-symbol">{crypto.symbol}</span>
                <span className="crypto-price">${crypto.price}</span>
                <span className={`crypto-change ${isPositive ? 'positive' : 'negative'}`}>
                  {crypto.changePercent}
                </span>
              </div>
            );
          })
        )}
      </div>
      

    </div>
  );
};

export default CryptoDashboard;
import React, { useState, useEffect } from 'react';
import './ProxyBrowserViewer.css';
import { buildProxyUrl } from '../config/api';

const ProxyBrowserViewer = ({ pageUrl, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proxyUrl, setProxyUrl] = useState('');
  
  useEffect(() => {
    if (!pageUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    // Encode the URL for the proxy server
    const encodedUrl = encodeURIComponent(pageUrl);
    // Set the proxy URL
    const newProxyUrl = buildProxyUrl(pageUrl);
    setProxyUrl(newProxyUrl);
    
    // Add a console log to debug
    console.log('Setting proxy URL:', newProxyUrl);
  }, [pageUrl]);
  
  const handleIframeLoad = () => {
    console.log('Proxy iframe loaded successfully');
    setIsLoading(false);
  };
  
  const handleIframeError = (error) => {
    console.error('Proxy iframe loading error:', error);
    setError('Failed to load the page through proxy');
    setIsLoading(false);
  };
  
  return (
    <div className="proxy-browser-viewer">
      <div className="proxy-browser-header">
        <div className="proxy-browser-controls">
          <button 
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Force refresh by updating the URL with a timestamp
              const refreshUrl = `${proxyUrl}&t=${Date.now()}`;
              setProxyUrl(refreshUrl);
              console.log('Refreshing with URL:', refreshUrl);
            }} 
            disabled={isLoading}
            className="refresh-button"
          >
            Refresh
          </button>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="back-button"
            >
              Back
            </button>
          )}
        </div>
        <div className="proxy-url-display">
          <span>Proxy: {pageUrl}</span>
        </div>
      </div>
      
      <div className="proxy-browser-content">
        {isLoading && (
          <div className="proxy-loading">
            <div className="loading-spinner"></div>
            <p>Loading through proxy server...</p>
          </div>
        )}
        
        {error && (
          <div className="proxy-error">
            <p>{error}</p>
            <button onClick={() => {
              setIsLoading(true);
              setError(null);
              // Force refresh
              const refreshUrl = `${proxyUrl}&t=${Date.now()}`;
              setProxyUrl(refreshUrl);
              console.log('Trying again with URL:', refreshUrl);
            }}>
              Try Again
            </button>
          </div>
        )}
        
        {proxyUrl && (
          <iframe 
            src={proxyUrl} 
            className="proxy-iframe" 
            sandbox="allow-same-origin allow-scripts allow-forms"
            title="Proxy Preview"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ 
              display: isLoading ? 'none' : 'block',
              width: '100%',
              height: '100%',
              border: 'none',
              minHeight: '500px',
              flex: '1'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProxyBrowserViewer;
import React, { useState, useEffect, useRef } from 'react';
import './SimpleBrowserViewer.css';

const SimpleBrowserViewer = ({ pageUrl, onRefresh, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Set a timeout to detect if loading is stuck
    const loadingTimeoutId = setTimeout(() => {
      if (isLoading) {
        console.error('SimpleBrowserViewer loading timeout after 10 seconds');
        setError('Loading timeout - the page took too long to load');
        setIsLoading(false);
        
        // Call the onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(new Error('Loading timeout'));
        }
      }
    }, 10000); // 10 seconds timeout
    
    // Create a new iframe with the Simple Browser Multi extension
    const setupBrowser = () => {
      try {
        if (!containerRef.current) return;
        
        // Clear previous content
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
        // Create a new iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'simple-browser-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        // Set attributes for the Simple Browser Multi extension
        iframe.setAttribute('data-simple-browser', 'true');
        iframe.setAttribute('src', pageUrl);
        
        // Add event listeners
        iframe.onload = () => {
          console.log('Simple Browser iframe loaded');
          setIsLoading(false);
        };
        
        iframe.onerror = (error) => {
          console.error('Simple Browser iframe error:', error);
          setError('Failed to load the page');
          setIsLoading(false);
          
          // Call the onError callback if provided
          if (onError && typeof onError === 'function') {
            onError(error);
          }
        };
        
        // Append the iframe to the container
        containerRef.current.appendChild(iframe);
        iframeRef.current = iframe;
      } catch (err) {
        console.error('Error setting up Simple Browser:', err);
        setError(err.message || 'Failed to set up browser');
        setIsLoading(false);
      }
    };
    
    setupBrowser();
    
    // Cleanup function
    return () => {
      // Clear the loading timeout
      clearTimeout(loadingTimeoutId);
      
      // Remove the iframe
      if (iframeRef.current && iframeRef.current.parentNode) {
        iframeRef.current.parentNode.removeChild(iframeRef.current);
      }
    };
  }, [pageUrl]);

  return (
    <div className="simple-browser-viewer">
      <div className="simple-browser-header">
        <div className="simple-browser-controls">
          <button 
            onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.src = pageUrl;
                setIsLoading(true);
              }
            }} 
            disabled={isLoading}
            className="refresh-button"
          >
            Refresh
          </button>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="custom-action-button"
            >
              Back to iframe
            </button>
          )}
        </div>
        {isLoading && <div className="simple-browser-loading">Loading...</div>}
      </div>
      
      <div className="simple-browser-content" ref={containerRef}>
        {error && (
          <div className="simple-browser-error">
            <p>Error: {error}</p>
            <button onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.src = pageUrl;
                setIsLoading(true);
              }
            }}>Try Again</button>
          </div>
        )}
        {isLoading && !error && (
          <div className="simple-browser-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading website...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleBrowserViewer;
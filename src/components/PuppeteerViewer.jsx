import React, { useState, useEffect, useRef } from 'react';
import './PuppeteerViewer.css'; // Import the CSS file

const PuppeteerViewer = ({ pageUrl, onRefresh, initialViewportSize = { width: 800, height: 600 } }) => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewportSize, setViewportSize] = useState(initialViewportSize);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshTimerRef = useRef(null);
  const screenshotAttempts = useRef(0);

  // Take a screenshot of the page using Puppeteer
  const takeScreenshot = async () => {
    console.log('takeScreenshot called, current loading state:', isLoading);
    // Prevent multiple simultaneous screenshot attempts
    if (isLoading) {
      console.log('Already loading, skipping screenshot attempt');
      return;
    }
    
    // Set loading state immediately to prevent race conditions
    setIsLoading(true);
    setError(null);
    screenshotAttempts.current = 0;
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Screenshot timeout after 30 seconds');
      setError('Screenshot timeout - please try again');
      setIsLoading(false);
      // Force reset any stuck state
      screenshotAttempts.current = 0;
    }, 30000);
    
    const attemptScreenshot = async () => {
      try {
        // Set enhanced launch options for better compatibility
        const launchOptions = {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        };
        
        // Navigate to the page
        await window.runMcp({
          server_name: "mcp.config.usrlocalmcp.Puppeteer",
          tool_name: "puppeteer_navigate",
          args: {
            url: pageUrl,
            launchOptions: launchOptions,
            allowDangerous: true
          }
        });
        
        // Wait for page to fully load
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Take a screenshot
        const result = await window.runMcp({
          server_name: "mcp.config.usrlocalmcp.Puppeteer",
          tool_name: "puppeteer_screenshot",
          args: {
            name: "page_screenshot",
            width: viewportSize.width,
            height: viewportSize.height,
            encoded: true
          }
        });
        
        console.log('Screenshot result:', result);
        if (result && result.data) {
          clearTimeout(timeoutId);
          setScreenshotUrl(result.data);
          screenshotAttempts.current = 0; // Reset attempts counter on success
          setIsLoading(false);
          console.log('Screenshot captured successfully');
        } else {
          console.error('Screenshot result missing data:', result);
          clearTimeout(timeoutId); // Ensure timeout is cleared even on error
          throw new Error('Failed to capture screenshot - no data returned');
        }
      } catch (err) {
        console.error(`Screenshot attempt ${screenshotAttempts.current + 1} failed:`, err);
        
        // Retry logic - up to 3 attempts
        if (screenshotAttempts.current < 2) { // 0-indexed, so < 2 means 3 attempts total
          screenshotAttempts.current += 1;
          console.log(`Retrying screenshot (attempt ${screenshotAttempts.current + 1}/3)...`);
          
          // Wait 2 seconds before retrying
          setTimeout(() => {
            attemptScreenshot();
          }, 2000);
        } else {
          // All attempts failed
          clearTimeout(timeoutId);
          setError(err.message || 'Failed to capture screenshot after multiple attempts');
          setIsLoading(false);
          screenshotAttempts.current = 0;
        }
      }
    };
    
    // Start the first attempt
    attemptScreenshot();
  };

  // Handle clicks on the screenshot to simulate browser interaction
  const handleClick = async (event) => {
    if (isLoading) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate the relative position
    const relX = x / rect.width;
    const relY = y / rect.height;
    
    // Calculate the actual position on the page
    const pageX = Math.round(relX * viewportSize.width);
    const pageY = Math.round(relY * viewportSize.height);
    
    console.log(`Clicking at position: ${pageX}, ${pageY}`);
    
    setIsLoading(true);
    
    try {
      // Show a visual indicator of where the click happened
      const clickIndicator = document.createElement('div');
      clickIndicator.style.position = 'absolute';
      clickIndicator.style.left = `${x - 10}px`;
      clickIndicator.style.top = `${y - 10}px`;
      clickIndicator.style.width = '20px';
      clickIndicator.style.height = '20px';
      clickIndicator.style.borderRadius = '50%';
      clickIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      clickIndicator.style.border = '2px solid red';
      clickIndicator.style.zIndex = '1000';
      clickIndicator.style.pointerEvents = 'none';
      clickIndicator.style.animation = 'pulse-animation 1s ease-out';
      
      // Add the indicator to the DOM
      event.currentTarget.parentNode.appendChild(clickIndicator);
      
      // Remove it after animation completes
      setTimeout(() => {
        if (clickIndicator.parentNode) {
          clickIndicator.parentNode.removeChild(clickIndicator);
        }
      }, 1000);
      
      // Try multiple click strategies for better reliability
      await window.runMcp({
        server_name: "mcp.config.usrlocalmcp.Puppeteer",
        tool_name: "puppeteer_evaluate",
        args: {
          script: `
            // Try multiple strategies to ensure the click works
            try {
              // Strategy 1: Direct elementFromPoint click
              const element = document.elementFromPoint(${pageX}, ${pageY});
              if (element) {
                element.click();
                console.log('Click strategy 1 succeeded');
              } else {
                throw new Error('No element found at point');
              }
            } catch (e) {
              console.log('Click strategy 1 failed, trying strategy 2');
              // Strategy 2: Create and dispatch a mouse event
              try {
                const clickEvent = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                  clientX: ${pageX},
                  clientY: ${pageY}
                });
                document.elementFromPoint(${pageX}, ${pageY})?.dispatchEvent(clickEvent);
                console.log('Click strategy 2 succeeded');
              } catch (e2) {
                console.error('All click strategies failed', e2);
              }
            }
          `
        }
      });
      
      // Wait a moment for any page changes to take effect
      setTimeout(takeScreenshot, 1000); // Wait for page to update
    } catch (err) {
      console.error('Error simulating click:', err);
      setError(err.message || 'Failed to interact with page');
      setIsLoading(false);
    }
  };

  // Handle auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      console.log('Setting up auto-refresh timer');
      // Clear any existing timer first to prevent multiple timers
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      
      refreshTimerRef.current = setInterval(() => {
        console.log('Auto-refresh check, loading state:', isLoading);
        if (!isLoading) {
          console.log('Auto-refreshing screenshot...');
          takeScreenshot();
        } else {
          console.log('Skipping auto-refresh because screenshot is already loading');
        }
      }, 10000); // Refresh every 10 seconds
    } else if (!autoRefresh && refreshTimerRef.current) {
      console.log('Clearing auto-refresh timer');
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    return () => {
      if (refreshTimerRef.current) {
        console.log('Cleaning up auto-refresh timer');
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, isLoading]);
  
  // Take a screenshot when the URL changes
  useEffect(() => {
    // Reset state and take a new screenshot when URL changes
    setIsLoading(true);
    setError(null);
    takeScreenshot();
    
    // Clean up function
    return () => {
      // Clear any pending timeouts or intervals
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [pageUrl]); // takeScreenshot is intentionally omitted to avoid infinite loops

  // Adjust viewport size based on container size
  useEffect(() => {
    const updateViewportSize = () => {
      const container = document.querySelector('.puppeteer-viewer-content');
      if (container) {
        setViewportSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateViewportSize);
    updateViewportSize();

    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  return (
    <div className="puppeteer-viewer">
      <div className="puppeteer-viewer-header">
        <div className="puppeteer-controls">
          <button 
            onClick={takeScreenshot} 
            disabled={isLoading}
            className="refresh-button"
            title="Refresh screenshot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)} 
            className={`auto-refresh-button ${autoRefresh ? 'active' : ''}`}
            title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh (10s)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {autoRefresh ? 'Auto' : 'Auto'}
          </button>

        </div>
        <div className="puppeteer-status">
          {isLoading && (
            <div className="puppeteer-loading">
              <div className="loading-spinner"></div>
              <span>Loading screenshot...</span>
            </div>
          )}
          {autoRefresh && !isLoading && (
            <div className="auto-refresh-indicator">
              <span>Auto-refreshing</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="puppeteer-action-bar">
        <div className="action-buttons-container">
          <button onClick={takeScreenshot} className="action-button try-again-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <path d="M23 4v6h-6"/>
              <path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh Screenshot
          </button>

          <button 
            onClick={() => {
              // Increase viewport size for better compatibility
              setViewportSize({
                width: Math.max(viewportSize.width, 1024),
                height: Math.max(viewportSize.height, 768)
              });
              setTimeout(takeScreenshot, 500);
            }}
            className="action-button larger-viewport-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <path d="M15 3h6v6"/>
              <path d="M9 21H3v-6"/>
              <path d="M21 3l-7 7"/>
              <path d="M3 21l7-7"/>
            </svg>
            Try larger viewport
          </button>
          <a 
            href={pageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="action-button external-link-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open in new tab
          </a>
        </div>
      </div>
      
      <div className="puppeteer-viewer-content">
        {error ? (
          <div className="puppeteer-error">
            <div className="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p>Error: {error}</p>
            <p className="error-help-text">This may be due to website restrictions or network issues.</p>
            <p className="error-help-text">Please use the action buttons above to try different options.</p>
          </div>
        ) : (
          screenshotUrl ? (
            <div className="screenshot-container">
              <img 
                src={screenshotUrl} 
                alt="Website Screenshot" 
                onClick={handleClick}
                style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
              />
              <div className="screenshot-overlay">
                <div className="screenshot-info">
                  <span>Click on elements to interact</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="puppeteer-placeholder">
              <div className="loading-spinner large"></div>
              <p>Loading website screenshot...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PuppeteerViewer;
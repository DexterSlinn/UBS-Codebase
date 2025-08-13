import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import DashboardChat from './DashboardChat';
import StockSearch from './StockSearch';
import CryptoDashboard from './CryptoDashboard';
import { API_CONFIG, buildApiUrl } from '../config/api';
import ImageCarousel from './ImageCarousel';
import ActiveStocks from './ActiveStocks';
import { UserInteractionProvider } from './UserInteractionContext';
import './NewDashboard.css';

function Dashboard({ onClose, onSwitchToChat }) {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [newsLastUpdated, setNewsLastUpdated] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  const [messageOpacity, setMessageOpacity] = useState(1);
  const [chatQuery, setChatQuery] = useState(null);
  const [expandedNewsIndex, setExpandedNewsIndex] = useState(null);

  // Handle stock selection from ActiveStocks component
  const handleStockClick = (symbol) => {
    setSelectedStockSymbol(symbol);
  };

  // Handle crypto selection from CryptoDashboard component
  const handleCryptoClick = (symbol) => {
    const query = `Tell me about ${symbol}`;
    setChatQuery(query);
  };

  // Handle sector selection from Equity Sectors Monitor
  const handleSectorClick = (sectorName) => {
    const query = `Tell me about the ${sectorName.toLowerCase()} sector`;
    setChatQuery(query);
  };

  // Handle news card expand/collapse
  const handleNewsClick = (index) => {
    setExpandedNewsIndex(expandedNewsIndex === index ? null : index);
  };

  // Handle auto-refresh toggle with fade-out message
  const handleAutoRefreshToggle = () => {
    const newState = !autoRefreshEnabled;
    setAutoRefreshEnabled(newState);
    
    if (newState) {
      setShowRefreshMessage(true);
      setMessageOpacity(1);
      
      // Start fade-out after 1 second
      setTimeout(() => {
        setMessageOpacity(0);
        // Hide message completely after fade animation
        setTimeout(() => {
          setShowRefreshMessage(false);
        }, 300); // 300ms for fade transition
      }, 1000); // 1 second delay
    } else {
      setShowRefreshMessage(false);
    }
  };
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };



  // Fetch news data from API
  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError(null); // Clear previous errors
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MARKET_OVERVIEW, API_CONFIG.MARKET_URL));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.articles) {
        setNews(data.articles);
        setNewsError(data.fallback ? 'Using cached news - API temporarily unavailable' : null);
        setNewsLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid news data format received');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError(`Failed to load news data: ${err.message}`);
      // Set fallback news data
      setNews([{
        title: 'Market Update',
        description: 'Financial markets showing mixed signals today.',
        url: '#',
        publishedAt: new Date().toISOString()
      }]);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    // Wrap initial data fetching in try-catch to prevent component crashes
    const initializeData = async () => {
      try {
        await fetchNews();
      } catch (err) {
        console.error('Error initializing dashboard data:', err);
        // Component will still render with error states
      }
    };
    
    initializeData();
    
    let newsInterval;
    
    if (autoRefreshEnabled) {
      // Auto-refresh news every 10 minutes (600000ms)
      newsInterval = setInterval(() => {
        fetchNews().catch(err => {
          console.error('Error in news auto-refresh:', err);
        });
      }, 600000);
    }
    
    return () => {
      if (newsInterval) clearInterval(newsInterval);
    };
  }, [autoRefreshEnabled]);
  return (
    <UserInteractionProvider>
      <div className="new-dashboard">
        <div style={{position: 'relative'}}>
          <ChatHeader 
            onOpenTools={null}
            onOpenDashboard={null}
            onClose={onClose}
            isDashboardView={true}
            onSwitchToChat={onSwitchToChat}
            style={{top: '10px'}} /* Moved down by 40px from original -30px */
          />
          
          {/* Auto-refresh toggle */}
          <div className="auto-refresh-toggle" style={{
            position: 'absolute',
            top: '13px',
            right: '305px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            zIndex: 1000
          }}>
            <span>Auto-refresh</span>
            <div 
              className="toggle-switch"
              onClick={handleAutoRefreshToggle}
              style={{
                width: '44px',
                height: '24px',
                backgroundColor: autoRefreshEnabled ? '#e60028' : '#ccc',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              <div 
                className="toggle-slider"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: autoRefreshEnabled ? '22px' : '2px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              />
            </div>
            <span style={{color: autoRefreshEnabled ? '#e60028' : '#666', fontSize: '12px'}}>
               {autoRefreshEnabled ? 'ON' : 'OFF'}
             </span>
             {showRefreshMessage && (
               <div style={{
                 position: 'absolute',
                 top: '100%',
                 right: '0',
                 marginTop: '8px',
                 background: 'rgba(0, 0, 0, 0.8)',
                 color: 'white',
                 padding: '8px 10px',
                 borderRadius: '6px',
                 fontSize: '11px',
                 whiteSpace: 'nowrap',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                 zIndex: 1001,
                 opacity: messageOpacity,
                 transition: 'opacity 0.3s ease-out'
               }}>
                 <div>Stocks: 30sec</div>
                 <div>Crypto: 2min</div>
                 <div>News: 10min</div>
               </div>
             )}
          </div>
        </div>
      <div className="dashboard-main">
        <div className="dashboard-grid">

          
          <div className="dashboard-section">
            <div className="dashboard-widget crypto-widget">
              <CryptoDashboard 
                autoRefreshEnabled={autoRefreshEnabled} 
                onCryptoClick={handleCryptoClick}
              />
            </div>
          </div>
          
          <div className="dashboard-section dashboard-chat-section">
            <DashboardChat 
              externalQuery={chatQuery}
              onQueryProcessed={() => setChatQuery(null)}
            />
          </div>
          
          <div className="dashboard-section">
            <h3>Equity Sectors Monitor</h3>
            <div className="dashboard-widget sectors-widget">
              <div className="sectors-list">
                <div className="sector-item" onClick={() => handleSectorClick('Technology')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Technology</span>
                  <span className="sector-change positive">+2.34%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Healthcare')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Healthcare</span>
                  <span className="sector-change positive">+1.12%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Financial Services')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Financial Services</span>
                  <span className="sector-change negative">-0.45%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Consumer Cyclical')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Consumer Cyclical</span>
                  <span className="sector-change positive">+0.87%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Energy')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Energy</span>
                  <span className="sector-change negative">-1.23%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Real Estate')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Real Estate</span>
                  <span className="sector-change positive">+0.56%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Industrials')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Industrials</span>
                  <span className="sector-change negative">-0.78%</span>
                </div>
                <div className="sector-item" onClick={() => handleSectorClick('Materials')} style={{cursor: 'pointer'}}>
                  <span className="sector-name">Materials</span>
                  <span className="sector-change positive">+1.45%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="dashboard-widget image-carousel-widget">
              <ImageCarousel />
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="dashboard-widget active-stocks-widget">
              <ActiveStocks onStockClick={handleStockClick} autoRefreshEnabled={autoRefreshEnabled} />
            </div>
          </div>
          

          

          
          <div className="dashboard-section">
            <h3>Market News Report</h3>
            <div className="dashboard-widget news-widget">
              {newsError && (
                <div className="error-message" style={{color: '#ff6b6b', marginBottom: '10px', fontSize: '12px'}}>
                  {newsError}
                </div>
              )}
              {newsLastUpdated && (
                <div className="last-updated" style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
                  Last updated: {newsLastUpdated} • {autoRefreshEnabled ? 'Auto-refresh: 10min' : 'Manual mode'}
                </div>
              )}
              <div className="news-list" style={{
                width: '100%',
                maxWidth: '100%',
                minWidth: '0',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
                {newsLoading ? (
                  <div className="loading-message" style={{textAlign: 'center', padding: '20px', color: '#666'}}>Loading news...</div>
                ) : news.length === 0 ? (
                  <div className="no-data-message" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No news available</div>
                ) : (
                  news.map((article, index) => {
                    const isExpanded = expandedNewsIndex === index;
                    return (
                      <div 
                        key={index} 
                        className={`news-item ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => handleNewsClick(index)}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          marginBottom: isExpanded ? '16px' : '8px',
                          padding: isExpanded ? '16px' : '12px',
                          border: isExpanded ? '2px solid #e60028' : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          backgroundColor: isExpanded ? '#fafafa' : 'white',
                          boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                          width: '100%',
                          maxWidth: '100%',
                          minWidth: '0',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                          overflow: 'hidden',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        <div className="news-title" style={{
                          fontWeight: isExpanded ? '600' : '500',
                          fontSize: isExpanded ? '16px' : '14px',
                          color: isExpanded ? '#e60028' : '#333',
                          marginBottom: '8px'
                        }}>
                          {article.title}
                        </div>
                        <div className="news-source" style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: isExpanded ? '12px' : '4px'
                        }}>
                          {article.source} • {article.time || new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                        {article.summary && (
                          <div className="news-summary" style={{
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px',
                            display: isExpanded ? 'block' : '-webkit-box',
                            WebkitLineClamp: isExpanded ? 'none' : '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: isExpanded ? 'visible' : 'hidden'
                          }}>
                            {article.summary}
                          </div>
                        )}
                        {isExpanded && (
                          <div className="news-expanded-content" style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #e0e0e0'
                          }}>
                            {article.description && (
                              <div className="news-description" style={{
                                fontSize: '13px',
                                color: '#444',
                                lineHeight: '1.5',
                                marginBottom: '12px'
                              }}>
                                {article.description}
                              </div>
                            )}
                            {article.author && (
                              <div className="news-author" style={{
                                fontSize: '12px',
                                color: '#666',
                                marginBottom: '8px'
                              }}>
                                By: {article.author}
                              </div>
                            )}
                            {article.url && article.url !== '#' && (
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: '#e60028',
                                  textDecoration: 'none',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                Read full article →
                              </a>
                            )}
                            <div className="collapse-hint" style={{
                              fontSize: '11px',
                              color: '#999',
                              marginTop: '12px',
                              textAlign: 'center',
                              fontStyle: 'italic'
                            }}>
                              Click to collapse
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <h3>Stock Ticker Search</h3>
            <div className="dashboard-widget stock-search-widget">
              <StockSearch searchSymbol={selectedStockSymbol} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </UserInteractionProvider>
  );
}

export default Dashboard;
import React, { useState } from 'react';
import CryptoTracker from './CryptoTracker';
import './CryptoWindow.css';

const CryptoWindow = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (isMinimized) {
    return (
      <div className="crypto-window-minimized" onClick={() => setIsMinimized(false)}>
        <span>📊 Crypto Tracker</span>
      </div>
    );
  }

  return (
    <div 
      className={`crypto-window ${isMaximized ? 'maximized' : ''}`}
      style={!isMaximized ? {
        left: `${position.x}px`,
        top: `${position.y}px`
      } : {}}
    >
      <div 
        className="crypto-window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="window-title">
          <span className="window-icon">📊</span>
          Top 20 Cryptocurrencies
        </div>
        <div className="window-controls">
          <button 
            className="control-btn minimize"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            −
          </button>
          <button 
            className="control-btn maximize"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button 
            className="control-btn close"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="crypto-window-content">
        <CryptoTracker />
      </div>
    </div>
  );
};

export default CryptoWindow;
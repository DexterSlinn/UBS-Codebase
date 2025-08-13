import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

// Enhanced Chat Message Component with memoization
const EnhancedChatMessage = React.memo(({ message, isUser, timestamp, isTyping = false }) => {
  const messageRef = useRef(null);
  
  useEffect(() => {
    if (messageRef.current && !isUser) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [message, isUser]);

  const formatMessage = useCallback((text) => {
    if (!text) return '';
    
    // Enhanced text formatting with better UBS-specific highlighting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      .replace(/(UBS|Asset Management|Wealth Management|Private Banking)/gi, 
        '<span class="ubs-highlight">$1</span>')
      .replace(/(CHF|USD|EUR)\s*([0-9,]+)/g, 
        '<span class="currency-highlight">$1 $2</span>')
      .replace(/\n/g, '<br>');
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, []);

  return (
    <div 
      ref={messageRef}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
            ${isUser 
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white ml-4' 
              : 'bg-white border border-gray-200 text-gray-800 mr-4'
            }
            ${isTyping ? 'animate-pulse' : ''}
          `}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500 ml-2">Marcel is typing...</span>
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
            />
          )}
        </div>
        {timestamp && !isTyping && (
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
});

// Enhanced Search Suggestions Component
const SearchSuggestions = React.memo(({ suggestions, onSelect, isVisible }) => {
  if (!isVisible || !suggestions.length) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-700">{suggestion}</span>
          </div>
        </button>
      ))}
    </div>
  );
});

// Enhanced Chat Input Component
const EnhancedChatInput = React.memo(({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask me anything about UBS services...",
  maxLength = 500 
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  // Debounced function to fetch suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`/api/knowledge-base/suggestions?partial=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(data.suggestions.length > 0);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInput(value);
      if (!isComposing) {
        debouncedFetchSuggestions(value);
      }
    }
  }, [maxLength, isComposing, debouncedFetchSuggestions]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [handleSubmit, isComposing]);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const characterCount = input.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className="relative">
      <SearchSuggestions 
        suggestions={suggestions}
        onSelect={handleSuggestionSelect}
        isVisible={showSuggestions}
      />
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={`
              w-full px-4 py-3 pr-16 border border-gray-300 rounded-2xl 
              focus:ring-2 focus:ring-red-500 focus:border-transparent 
              resize-none transition-all duration-200
              ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              ${isNearLimit ? 'border-orange-400' : ''}
            `}
            style={{ 
              minHeight: '48px',
              maxHeight: '120px',
              overflowY: input.split('\n').length > 3 ? 'scroll' : 'hidden'
            }}
          />
          
          {/* Character count */}
          <div className={`
            absolute bottom-2 right-12 text-xs transition-colors duration-200
            ${isNearLimit ? 'text-orange-500' : 'text-gray-400'}
          `}>
            {characterCount}/{maxLength}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            p-3 rounded-full transition-all duration-200 transform hover:scale-105
            ${input.trim() && !isLoading
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
});

// Enhanced Performance Metrics Component
const PerformanceMetrics = React.memo(({ isVisible, onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible, fetchMetrics]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : metrics ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Requests</div>
                <div className="text-xl font-semibold text-gray-900">{metrics.totalRequests}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Search Requests</div>
                <div className="text-xl font-semibold text-gray-900">{metrics.searchRequests}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-xl font-semibold text-gray-900">{metrics.averageResponseTime}ms</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Error Rate</div>
                <div className="text-xl font-semibold text-gray-900">{metrics.errorRate}</div>
              </div>
            </div>
            
            {metrics.system && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Uptime: {metrics.system.uptime}</div>
                  <div>Memory Usage: {metrics.system.memoryUsage.heapUsed}</div>
                  <div>Node Version: {metrics.system.nodeVersion}</div>
                  <div>Platform: {metrics.system.platform}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load metrics
          </div>
        )}
      </div>
    </div>
  );
});

// Main Enhanced Chat Interface Component
const EnhancedChatInterface = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  className = ""
}) => {
  const [showMetrics, setShowMetrics] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Detect manual scrolling to disable auto-scroll
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  }, []);

  // Memoized messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => {
    return messages.map((message, index) => (
      <EnhancedChatMessage
        key={`${message.id || index}-${message.timestamp}`}
        message={message.content}
        isUser={message.isUser}
        timestamp={message.timestamp}
      />
    ));
  }, [messages]);

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">UBS</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Marcel</h2>
            <p className="text-sm text-gray-500">Enhanced AI-powered support</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMetrics(true)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Performance Metrics"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setAutoScroll(true)}
            className={`p-2 transition-colors ${
              autoScroll ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Auto-scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {memoizedMessages}
        
        {/* Typing indicator */}
        {isLoading && (
          <EnhancedChatMessage
            message=""
            isUser={false}
            isTyping={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <EnhancedChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          placeholder="Ask me anything about UBS services, products, or account management..."
        />
      </div>

      {/* Performance Metrics Modal */}
      <PerformanceMetrics
        isVisible={showMetrics}
        onClose={() => setShowMetrics(false)}
      />
    </div>
  );
};

export default EnhancedChatInterface;
export { EnhancedChatMessage, EnhancedChatInput, SearchSuggestions, PerformanceMetrics };
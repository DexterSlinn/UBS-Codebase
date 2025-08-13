import React, { useState, useRef, useEffect } from 'react'
import MessageItem from './MessageItem'
import { API_CONFIG, buildApiUrl } from '../config/api'

function DashboardChat({ externalQuery, onQueryProcessed }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Marcel the UBS AI Guide. How can I help you today?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const animationRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const scrollToNewMessage = () => {
    // Find the last message element and scroll to its top
    const messagesContainer = messagesContainerRef.current
    if (messagesContainer) {
      const messageElements = messagesContainer.querySelectorAll('.message')
      if (messageElements.length > 0) {
        const lastMessage = messageElements[messageElements.length - 1]
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // JavaScript-based red ombre pulse animation
  const startPulseAnimation = () => {
    if (!chatContainerRef.current || animationRef.current) return;
    
    const element = chatContainerRef.current;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Create a smooth pulse effect using sine wave
      const pulseIntensity = Math.sin(progress * Math.PI);
      
      // Calculate colors and effects based on pulse intensity
      const redOpacity = 0.1 + (pulseIntensity * 0.3);
      const shadowIntensity = pulseIntensity * 0.6;
      const borderIntensity = pulseIntensity * 0.8;
      const scaleEffect = 1 + (pulseIntensity * 0.02);
      
      // Apply the pure red ombre effects
       element.style.boxShadow = `
         0 ${4 + shadowIntensity * 8}px ${12 + shadowIntensity * 20}px rgba(255, 0, 0, ${shadowIntensity}),
         0 0 0 ${shadowIntensity * 4}px rgba(204, 0, 0, ${shadowIntensity * 0.5})
       `;
       element.style.border = `${1 + borderIntensity * 2}px solid rgba(255, 0, 0, ${borderIntensity})`;
       element.style.background = `linear-gradient(135deg, 
         rgba(255, 0, 0, ${redOpacity}) 0%, 
         rgba(204, 0, 0, ${redOpacity * 0.7}) 25%, 
         rgba(153, 0, 0, ${redOpacity * 0.5}) 50%, 
         rgba(255, 51, 51, ${redOpacity * 0.8}) 75%, 
         rgba(255, 0, 0, ${redOpacity * 0.6}) 100%
       )`;
      element.style.transform = `scale(${scaleEffect})`;
      element.style.transition = 'none';
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Reset to original styles
        element.style.boxShadow = '';
        element.style.border = '';
        element.style.background = '';
        element.style.transform = '';
        element.style.transition = '';
        animationRef.current = null;
        setIsPulsing(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Handle external queries (e.g., from crypto card clicks)
  useEffect(() => {
    if (externalQuery && !isLoading) {
      handleSendMessage(externalQuery);
      if (onQueryProcessed) {
        onQueryProcessed();
      }
    }
  }, [externalQuery, isLoading]);
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Auto-scroll to top of new message when messages change
  useEffect(() => {
    scrollToNewMessage()
  }, [messages])

  const handleSendMessage = async (message) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage = { role: 'user', content: messageToSend }
    setMessages(prev => [...prev, userMessage])
    if (!message) {
      setInputMessage('')
    }
    setIsLoading(true)

    try {
      // Prepare all messages for context
      const allMessages = [...messages, userMessage]

      // Send request to dashboard-specific backend endpoint
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD_CHAT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: allMessages }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add assistant response to chat
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }])
        
        // Trigger pulse animation when chatbot sends automated response
        if (message) { // Only for external queries (automated responses)
          setIsPulsing(true);
          startPulseAnimation();
        }
      } else {
        console.error('Unexpected response format:', data)
        throw new Error('Unexpected response format from API')
      }
    } catch (error) {
      console.error('Dashboard chat error:', error)
      // Fallback to a generic error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
      }])
      
      // Trigger pulse animation for error response too if it's an automated query
      if (message) {
        setIsPulsing(true);
        startPulseAnimation();
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
  }

  return (
    <div ref={chatContainerRef} className="dashboard-chat">
      <div className="dashboard-chat-header">
        <h3>Quick Chat</h3>
      </div>
      
      <div ref={messagesContainerRef} className="dashboard-chat-messages">
        {messages.map((message, index) => (
          <MessageItem 
            key={index} 
            message={message}
            buildModeConfig={null}
            isBuildMode={false}
          />
        ))}
        
        {isLoading && (
          <div className="message assistant-message">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="dashboard-chat-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="dashboard-input"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading}
            className="dashboard-send-btn"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DashboardChat
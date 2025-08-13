import { useState } from 'react'
import sendIcon from '../assets/send_svgrepo.com.png'
import sparklesIcon from '../assets/sparkles_svgrepo.com.png'
import toolboxIcon from '../assets/toolbox_svgrepo.com.png'
import chatIcon from '../assets/chat-conversation_svgrepo.com.png'
import dashboardIcon from '../assets/dashboard_svgrepo.com.png'

function ChatInput({ onSendMessage, isLoading, onOpenTools, isDashboardOpen, onOpenDashboard, onSwitchToChat, messages }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className="input-container" style={{position: 'relative'}}>
      <img 
        src={sparklesIcon} 
        alt="Sparkles" 
        style={{
          position: 'absolute',
          top: '-10px',
          left: '10px',
          width: '24px',
          height: '24px',
          zIndex: 10
        }}
      />
      {messages && messages.length === 0 && (
        <span 
          style={{
            position: 'absolute',
            top: '-8px',
            left: '40px',
            color: '#666',
            fontSize: '16px',
            fontWeight: '400',
            zIndex: 10
          }}
        >
          Start new chat
        </span>
      )}
      <div style={{
        position: 'absolute',
        top: '-18px',
        right: '10px',
        display: 'flex',
        gap: '70px',
        alignItems: 'center',
        zIndex: 15
      }}>        {/* Chat/Dashboard Toggle - only show when there are messages */}
        {messages && messages.length > 0 && (
          <div className="view-toggle-switch" style={{transform: 'scale(0.9)'}}>
            <button 
              className={`toggle-option ${!isDashboardOpen ? 'active' : ''}`}
              onClick={onSwitchToChat}
            >
              <img src={chatIcon} alt="Chat" style={{width: '14px', height: '14px', marginRight: '4px'}} />
              Chat
            </button>
            <button 
              className={`toggle-option ${isDashboardOpen ? 'active' : ''}`}
              onClick={onOpenDashboard}
            >
              <img src={dashboardIcon} alt="Research View" style={{width: '14px', height: '14px', marginRight: '4px'}} />
              Research
            </button>
          </div>
        )}
        
        {/* Tools Button - only show when there are messages */}
        {messages && messages.length > 0 && (
          <button 
             className="tools-button" 
             onClick={onOpenTools} 
             style={{
                 width: 'fit-content'
               }}
          >
            <img src={toolboxIcon} alt="Tools" style={{width: '16px', height: '16px', marginRight: '6px'}} />
            Tools
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask or say anything..."
          disabled={isLoading}
          className="focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="transition-colors duration-200"
        >
          {isLoading ? (
            <img src={sendIcon} alt="Send" style={{width: '24px', height: '24px', opacity: 0.5}} />
          ) : (
            <img src={sendIcon} alt="Send" style={{width: '24px', height: '24px'}} />
          )}
        </button>
      </form>
    </div>
  )
}

export default ChatInput
import { useState } from 'react'
import MessageItem from './MessageItem'
import TemplateSelector from './TemplateSelector'
import chatIcon from '../assets/chat-conversation_svgrepo.com.png'
import dashboardIcon from '../assets/dashboard_svgrepo.com.png'

function ChatMessages({ messages, isLoading, messagesEndRef, messagesContainerRef, onOpenDashboard, isDashboardView, onClose, isBuildMode, buildModeStep, buildModeConfig, onTemplateSelect, onCustomConfig }) {
  return (
    <div ref={messagesContainerRef} className="chat-messages">
      {messages.length === 0 && !isLoading && !isBuildMode && (
        <div className="welcome-message">
          <div className="view-toggle-switch" style={{transform: 'scale(1.2)'}}>
            <button 
                className={`toggle-option ${!isDashboardView ? 'active' : ''}`}
                onClick={() => isDashboardView && onClose ? onClose() : (!isDashboardView && onClose && onClose())}
              >
                <img src={chatIcon} alt="Chat" style={{width: '16px', height: '16px', marginRight: '6px'}} />
                UBS AI
              </button>
             <button 
                className={`toggle-option ${isDashboardView ? 'active' : ''}`}
                onClick={() => !isDashboardView && onOpenDashboard && onOpenDashboard()}
              >
                <img src={dashboardIcon} alt="Research View" style={{width: '16px', height: '16px', marginRight: '6px'}} />
                Research View
              </button>
          </div>
          <div className="welcome-greeting">Hi there</div>
          <div className="welcome-question">How can we help?</div>
        </div>
      )}
      
      {/* Build Mode UI */}
      {isBuildMode && buildModeStep === 0 && (
        <div className="build-mode-container" style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <TemplateSelector 
            onSelectTemplate={onTemplateSelect}
            onCustomConfig={onCustomConfig}
          />
        </div>
      )}
      

       

      
      {messages.map((message, index) => (
        <MessageItem 
          key={index} 
          message={message}
          buildModeConfig={buildModeConfig}
          isBuildMode={isBuildMode}
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
  )
}

export default ChatMessages
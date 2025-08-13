import sparklesIcon from '../assets/sparkles_svgrepo.com.png'
import chatIcon from '../assets/chat-conversation_svgrepo.com.png'
import dashboardIcon from '../assets/dashboard_svgrepo.com.png'
import closeIcon from '../assets/Frame 2087329291.png'

function ChatHeader({ onOpenTools, onClose, isBuildMode, onExitBuildMode, isDashboardView, onSwitchToChat, style, buildModeConfig }) {
  return (
    <div className="chat-header" style={{borderBottom: '2px solid #e5e7eb', position: 'relative', top: '-20px', ...style}}>
      <div className="chat-header-left" style={{marginTop: '-5px'}}>
        <img src={sparklesIcon} alt="UBS AI" />
        <span style={{
          color: '#1f2937',
          fontSize: '18px',
          fontWeight: 'bold',
          marginLeft: '4px'
        }}>{isDashboardView ? 'UBS Research View' : 'UBS AI'}</span>
        {isBuildMode && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
            <button 
              onClick={onExitBuildMode}
              style={{
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '600',
                padding: '6px 12px',
                backgroundColor: '#e60028',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(230, 0, 40, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#cc0024';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e60028';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Finalize Custom Concierge
            </button>
          </div>
        )}
      </div>
      <div className="chat-header-buttons" style={{display: 'flex', alignItems: 'center'}}>
        {isDashboardView && (
          <div className="view-toggle-switch" style={{marginRight: '15px'}}>
            <button 
              className={`toggle-option`}
              onClick={onSwitchToChat}
            >
              <img src={chatIcon} alt="Chat" style={{width: '16px', height: '16px', marginRight: '6px'}} />
              UBS AI
            </button>
            <button 
              className={`toggle-option active`}
              onClick={() => {}}
            >
              <img src={dashboardIcon} alt="Research View" style={{width: '16px', height: '16px', marginRight: '6px'}} />
              Research View
            </button>
          </div>
        )}
        <button className="close-button" onClick={onClose} style={{background: 'transparent', border: 'none', boxShadow: 'none', marginTop: '-5px'}}>
          <img src={closeIcon} alt="Close" style={{width: '36px', height: '36px'}} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
import { useState, useEffect } from 'react'
import AccountQuiz from './AccountQuiz'
import FinancialEducator from './FinancialEducator'
import './RightPanelTabs.css'

function RightPanelTabs({ onQuizComplete, onSendMessage, autoSearchTerm = null }) {
  const [activeTab, setActiveTab] = useState('account-quiz')

  // Switch to financial education tab when autoSearchTerm is provided
  useEffect(() => {
    if (autoSearchTerm && autoSearchTerm.trim()) {
      setActiveTab('financial-education');
    }
  }, [autoSearchTerm]);

  return (
    <div className="right-panel-tabs">
      <div className="tab-header">
        <button 
          className={`tab-button ${activeTab === 'account-quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('account-quiz')}
        >
          Account Finder
        </button>
        <button 
          className={`tab-button ${activeTab === 'financial-education' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial-education')}
        >
          Financial Education
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'account-quiz' && (
          <AccountQuiz onComplete={onQuizComplete} onSendMessage={onSendMessage} />
        )}
        {activeTab === 'financial-education' && (
          <FinancialEducator autoSearchTerm={autoSearchTerm} />
        )}
      </div>
    </div>
  )
}

export default RightPanelTabs
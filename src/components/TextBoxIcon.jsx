import React from 'react';
import { useUserInteraction } from './UserInteractionContext';
import './TextBoxIcon.css';

const TextBoxIcon = () => {
  const { lastInteraction } = useUserInteraction();

  return (
    <div className="text-box-icon">
      <div className="text-box-content">
        <div className="text-box-message">{lastInteraction.message}</div>
        <div className="text-box-timestamp">
          {lastInteraction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default TextBoxIcon;
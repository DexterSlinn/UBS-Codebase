import React, { createContext, useState, useContext, useEffect } from 'react';

const UserInteractionContext = createContext();

// Fun and conversational interaction phrases that will be displayed in the text box
const interactionPhrases = {
  click: [
    "Ooh, good choice! Let's see what we find...",
    "Clicking away! What treasures await?",
    "That's interesting! Let's dig deeper...",
    "Nice click! I'm on the case..."
  ],
  search: [
    "Detective mode activated! Searching now...",
    "Hunting for market gems just for you...",
    "Financial sleuthing in progress...",
    "Treasure hunting in the data ocean..."
  ],
  chat: [
    "Love that question! Thinking cap on...",
    "Ooh, let me ponder that for a sec...",
    "Great chat! Crafting something thoughtful...",
    "You've got me thinking! One moment..."
  ],
  scroll: [
    "Wheee! Scrolling through the good stuff...",
    "So much to see! Taking it all in...",
    "Scrolling like a pro! Finding goodies...",
    "On a roll! Discovering as we go..."
  ],
  hover: [
    "Ooh, hovering over something interesting...",
    "Good eye! That caught your attention...",
    "Curious about this? Me too!",
    "Hover powers activated! What's this about?"
  ]
};

export const UserInteractionProvider = ({ children }) => {
  const [lastInteraction, setLastInteraction] = useState({
    type: 'initial',
    message: 'Hey there! Welcome to your UBS Research playground!',
    timestamp: new Date()
  });

  // Function to record a new user interaction with contextual messages
  const recordInteraction = (type, element = '') => {
    // Create custom messages based on element and interaction type
    let message = '';
    
    // If we have a specific element, create a more contextual message
    if (element && element !== 'button' && element !== 'search box' && element !== 'chat') {
      // Custom messages for specific elements
      const customMessages = {
        'send message': [
          `Sending that message right away!`,
          `Message on its way! Let's see what we find...`,
          `Great question! Let me think about that...`
        ],
        'search button': [
          `Search powers activated! Let's find that for you...`,
          `On the hunt for ${element}! Detective mode engaged...`
        ],
        'carousel image': [
          `That's a cool image! Good eye!`,
          `Nice pick! These visuals are pretty neat, right?`,
          `Checking out the carousel? These images show our latest insights!`
        ]
      };
      
      // Check if we have custom messages for this element
      if (customMessages[element]) {
        const options = customMessages[element];
        message = options[Math.floor(Math.random() * options.length)];
      } else {
        // For other named elements (like stock names, etc)
        if (type === 'search') {
          const searchMessages = [
            `Looking up ${element}! Let's see what's trending...`,
            `${element}? Great choice! Digging into the data...`,
            `Searching for ${element} insights just for you!`
          ];
          message = searchMessages[Math.floor(Math.random() * searchMessages.length)];
        } else if (type === 'click') {
          const clickMessages = [
            `Checking out ${element}! Good choice!`,
            `${element} caught your eye? Let's explore that...`,
            `Taking a closer look at ${element} for you!`
          ];
          message = clickMessages[Math.floor(Math.random() * clickMessages.length)];
        }
      }
    }
    
    // If no custom message was set, use the default phrases
    if (!message) {
      const phrases = interactionPhrases[type] || interactionPhrases.click;
      const randomIndex = Math.floor(Math.random() * phrases.length);
      message = phrases[randomIndex];
    }
    
    setLastInteraction({
      type,
      element,
      message,
      timestamp: new Date()
    });
  };

  // Global click handler to track interactions
  useEffect(() => {
    const handleClick = (e) => {
      // Identify what was clicked based on class names or other attributes
      const target = e.target;
      let interactionType = 'click';
      let elementName = '';
      
      // Detect specific elements for more contextual messages
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        interactionType = 'click';
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        elementName = button.textContent?.trim() || 'button';
        
        // Special handling for specific buttons
        if (elementName.includes('Send') || elementName === '→') {
          interactionType = 'chat';
          elementName = 'send message';
        } else if (elementName.includes('Search')) {
          interactionType = 'search';
          elementName = 'search button';
        }
      }
      // Detect search inputs
      else if (target.tagName === 'INPUT' && (target.type === 'search' || target.placeholder?.includes('search') || target.closest('.stock-search'))) {
        interactionType = 'search';
        elementName = target.placeholder || 'search box';
      }
      // Detect chat inputs
      else if (target.closest('.dashboard-chat-input') || target.closest('.chat-input')) {
        interactionType = 'chat';
        elementName = 'chat';
      }
      // Detect stock cards or crypto elements
      else if (target.closest('.stock-card') || target.closest('.crypto-item')) {
        interactionType = 'click';
        const card = target.closest('.stock-card') || target.closest('.crypto-item');
        elementName = card.querySelector('h3, .name')?.textContent || 'financial card';
      }
      // Detect carousel images
      else if (target.closest('.carousel-image')) {
        interactionType = 'click';
        elementName = 'carousel image';
      }
      
      recordInteraction(interactionType, elementName);
    };

    // Track scrolling
    const handleScroll = () => {
      recordInteraction('scroll');
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <UserInteractionContext.Provider value={{ lastInteraction, recordInteraction }}>
      {children}
    </UserInteractionContext.Provider>
  );
};

// Custom hook to use the interaction context
export const useUserInteraction = () => {
  const context = useContext(UserInteractionContext);
  if (!context) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};
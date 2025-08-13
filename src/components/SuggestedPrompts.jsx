import React from 'react'
import productMatchIcon from '../assets/image 181.png'
import aiImage2 from '../assets/AI R&D (19).png'
import buildModeIcon from '../assets/image 183.png'
import buildModeIcon2 from '../assets/image 183 (1).png'
import discoveryIcon from '../assets/image 182.png'

function SuggestedPrompts({ onSelectPrompt }) {
  // Define three main categories for large prompt cards
  const suggestedPrompts = [
    {
      title: "UBS Custom Concierge",
      description: "Personalize how I respond to you",
      prompt: "__BUILD_MODE__",
      isBuildMode: true
    },
    {
      title: "Product Match",
      description: "Find the best account for me",
      prompt: "Find the best account for me"
    },
    {
      title: "Discovery",
      description: "How do I open an account online?",
      prompt: "How do I open an account online?"
    }
  ]

  return (
    <div className="suggested-prompts">
      <div className="prompt-cards">
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt, item.isBuildMode)}
            className="prompt-card"
          >
            {index === 0 && (
              <img src={buildModeIcon2} alt="Build Mode Icon" className="prompt-card-image" />
            )}
            {index === 1 && (
              <img src={productMatchIcon} alt="Product Match Icon" className="prompt-card-image" />
            )}
            {index === 2 && (
              <img src={discoveryIcon} alt="Discovery Icon" className="prompt-card-image" />
            )}
            <div className="prompt-card-content">
              <div className="prompt-card-title">{item.title}</div>
              <div className="prompt-card-description">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedPrompts
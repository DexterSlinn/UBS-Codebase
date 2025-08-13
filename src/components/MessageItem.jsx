import React, { useState, useEffect } from 'react'
import { API_CONFIG, buildApiUrl } from '../config/api'

function MessageItem({ message, buildModeConfig, isBuildMode }) {
  const { role, content } = message
  const isUser = role === 'user'
  
  // Function to get clean template name (remove emojis)
  const getCleanTemplateName = (templateName) => {
    if (!templateName) return ''
    // Remove emojis and extra spaces
    return templateName.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()
  }
  
  // Determine user display name
  const getUserDisplayName = () => {
    if (!isUser) return 'Marcel'
    
    // Only show template name if build mode is not active and a template is selected
    if (!isBuildMode && buildModeConfig?.selectedTemplate) {
      const cleanTemplateName = getCleanTemplateName(buildModeConfig.selectedTemplate)
      return cleanTemplateName ? `You - ${cleanTemplateName}` : 'You'
    }
    
    return 'You'
  }
  const [isSummarized, setIsSummarized] = useState(false)
  const [summarizedContent, setSummarizedContent] = useState('')
  // Update summarizedContent when displayContent changes
  const [isSummarizing, setIsSummarizing] = useState(false)
  
  const handleSummarize = async () => {
    if (isSummarized) {
      // Toggle back to original content
      setIsSummarized(false)
      return
    }
    
    // If we already have summarized content, just toggle to it
    if (summarizedContent) {
      setIsSummarized(true)
      return
    }
    
    // Otherwise, get summarized content from the server
    setIsSummarizing(true)
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes complex information.'
            },
            {
              role: 'user',
              content: `Create a very concise summary (no more than 3-4 sentences) of the following text. Focus only on the most important points, use simple language, and maintain all key information: \n\n${content}`
            }
          ]
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      
      let summarizedText = '';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        summarizedText = data.choices[0].message.content;
      } else if (data.message && data.message.content) {
        summarizedText = data.message.content;
      } else if (data.response) {
        summarizedText = data.response;
      } else {
        throw new Error('Unexpected response format');
      }
      
      setSummarizedContent(summarizedText);
      setIsSummarized(true);
    } catch (error) {
      console.error('Error summarizing message:', error);
      setSummarizedContent(`Network error: ${error.message}. Please check your connection and try again.`);
      setIsSummarized(true);
    } finally {
      setIsSummarizing(false);
    }
  }
  




  // Function to parse markdown formatting
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Convert markdown to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      .replace(/\n/g, '<br>');
  };

  // Function to parse content and convert [View page: URL] to clickable links
  const parseContentWithLinks = (text) => {
    const parts = text.split(/\[View page: ([^\]]+)\]/g);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text - parse markdown formatting
        if (parts[i]) {
          const markdownParsed = parseMarkdown(parts[i]);
          result.push(
            <span 
              key={i} 
              dangerouslySetInnerHTML={{ __html: markdownParsed }}
            />
          );
        }
      } else {
        // URL part
        const url = parts[i];
        result.push(
          <a 
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium"
          >
            View page
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }
    }
    
    return result;
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="font-semibold mb-1 flex justify-between items-center">
        <span>{getUserDisplayName()}</span>
        <div className="flex space-x-2">

          {!isUser && (
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
              aria-label={isSummarized ? 'Show original message' : 'Show summary'}
            >
              {isSummarizing ? 'Summarizing...' : isSummarized ? 'Show Original' : 'Summarize'}
            </button>
          )}
        </div>
      </div>
      <div className="message-content-container">
        <div className="whitespace-pre-wrap message-content">
          {isUser ? (
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
          ) : (
            parseContentWithLinks(isSummarized ? summarizedContent : content)
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
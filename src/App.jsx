import React, { useState, useRef, useEffect } from 'react'
import ChatHeader from './components/ChatHeader'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import SuggestedPrompts from './components/SuggestedPrompts'
import RightPanelTabs from './components/RightPanelTabs'
import Dashboard from './components/Dashboard'
import TemplateSelector from './components/TemplateSelector'
import ConfigurationSummary from './components/ConfigurationSummary'
// Background video removed to reduce bundle size
import sparklesIcon from './assets/sparkles_svgrepo.com.png'
import { API_CONFIG, buildApiUrl } from './config/api'

// Add global runMcp function for Puppeteer integration
window.runMcp = async (params) => {
  try {
    console.log('Running MCP with params:', params);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MCP), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`MCP request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error running MCP:', error);
    throw error;
  }
}

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [isBuildMode, setIsBuildMode] = useState(false)
  const [buildModeStep, setBuildModeStep] = useState(0)
  const [showConfigSummary, setShowConfigSummary] = useState(false)

  const [buildModeConfig, setBuildModeConfig] = useState({
    responseStyle: 'professional', // professional, casual, detailed, concise
    temperature: 0.6,
    maxTokens: 1000,
    focusAreas: ['general'], // general, investments, banking, wealth-management
    customInstructions: '',
    // Advanced modifiers
    industryTerminology: 'standard', // standard, technical, simplified, mixed
    responseComplexity: 'moderate', // basic, moderate, advanced, adaptive
    interactionPattern: 'responsive', // responsive, proactive, consultative, educational
    personalization: {
      experienceLevel: 'intermediate', // beginner, intermediate, advanced, expert
      preferredExamples: 'real-world', // theoretical, real-world, case-studies, mixed
      communicationTone: 'balanced', // formal, balanced, friendly, enthusiastic
      followUpStyle: 'moderate' // minimal, moderate, comprehensive, adaptive
    },
    selectedTemplate: null // Will store the selected preset template
  })
  const [autoSearchTerm, setAutoSearchTerm] = useState(null)

  const messagesEndRef = useRef(null)
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

  // Preset templates for different user types
  const presetTemplates = {
    student: {
      name: '🎓 Student',
      description: 'Perfect for students learning about finance and banking',
      config: {
        responseStyle: 'super-casual',
        temperature: 0.9,
        maxTokens: 800,
        focusAreas: ['general', 'banking'],
        customInstructions: 'Use lots of emojis 😊💰📚, speak like a cool friend, focus on budget-friendly options, use simple language, relate everything to student life (ramen budgets, textbook costs, part-time jobs). Always mention student discounts and free stuff! 🎉',
        industryTerminology: 'super-simplified',
        responseComplexity: 'ultra-basic',
        interactionPattern: 'buddy-style',
        personalization: {
          experienceLevel: 'total-beginner',
          preferredExamples: 'student-life',
          communicationTone: 'super-friendly-casual',
          followUpStyle: 'encouraging-simple'
        }
      }
    },
    youngProfessional: {
      name: '💼 Young Professional',
      description: 'Ideal for early-career professionals building wealth',
      config: {
        responseStyle: 'ambitious-motivational',
        temperature: 0.8,
        maxTokens: 1400,
        focusAreas: ['investments', 'banking'],
        customInstructions: 'Be extremely ambitious and growth-focused! Talk about climbing the corporate ladder, building wealth aggressively, maximizing career potential. Use motivational language, focus on compound growth, side hustles, networking opportunities. Always push for higher returns and career advancement strategies!',
        industryTerminology: 'growth-oriented',
        responseComplexity: 'ambitious-moderate',
        interactionPattern: 'high-energy-consultative',
        personalization: {
          experienceLevel: 'ambitious-intermediate',
          preferredExamples: 'success-stories',
          communicationTone: 'motivational-driven',
          followUpStyle: 'action-oriented'
        }
      }
    },
    investor: {
      name: '📈 Active Investor',
      description: 'For experienced investors seeking advanced insights',
      config: {
        responseStyle: 'ultra-analytical',
        temperature: 0.3,
        maxTokens: 2000,
        focusAreas: ['investments', 'wealth-management'],
        customInstructions: 'Be extremely data-heavy and analytical! Use technical jargon, cite specific market indicators, mention P/E ratios, volatility metrics, beta coefficients. Reference specific trading strategies, options, derivatives. Always include numbers, percentages, and market data. Speak like a Wall Street analyst!',
        industryTerminology: 'ultra-technical',
        responseComplexity: 'expert-level',
        interactionPattern: 'data-driven-aggressive',
        personalization: {
          experienceLevel: 'expert-trader',
          preferredExamples: 'market-analysis',
          communicationTone: 'analytical-intense',
          followUpStyle: 'data-comprehensive'
        }
      }
    },
    businessOwner: {
      name: '🏢 Business Owner',
      description: 'Tailored for entrepreneurs and business owners',
      config: {
        responseStyle: 'roi-obsessed',
        temperature: 0.4,
        maxTokens: 1600,
        focusAreas: ['banking', 'wealth-management'],
        customInstructions: 'Be extremely ROI-focused and strategic! Everything must have a clear return on investment. Talk about efficiency, profit margins, tax optimization, business scaling. Use business jargon like "synergies," "leverage," "scalability." Always calculate potential returns and focus on bottom-line impact!',
        industryTerminology: 'business-strategic',
        responseComplexity: 'strategic-advanced',
        interactionPattern: 'efficiency-driven',
        personalization: {
          experienceLevel: 'strategic-expert',
          preferredExamples: 'business-cases',
          communicationTone: 'results-focused',
          followUpStyle: 'action-strategic'
        }
      }
    },
    retiree: {
      name: '🏖️ Retiree',
      description: 'Designed for retirees focused on wealth preservation',
      config: {
        responseStyle: 'ultra-conservative',
        temperature: 0.2,
        maxTokens: 1300,
        focusAreas: ['wealth-management', 'banking'],
        customInstructions: 'Be extremely conservative and safety-focused! Emphasize capital preservation above all else. Avoid any risky investments. Focus on CDs, bonds, traditional savings. Use formal, respectful language. Mention FDIC insurance, guaranteed returns, estate planning. Always prioritize security over growth!',
        industryTerminology: 'traditional-conservative',
        responseComplexity: 'safety-focused',
        interactionPattern: 'protective-consultative',
        personalization: {
          experienceLevel: 'conservative-experienced',
          preferredExamples: 'traditional-safe',
          communicationTone: 'respectful-formal',
          followUpStyle: 'thorough-protective'
        }
      }
    },
    wealthManager: {
      name: '💎 High Net Worth',
      description: 'For high net worth individuals seeking premium services',
      config: {
        responseStyle: 'ultra-exclusive',
        temperature: 0.3,
        maxTokens: 2200,
        focusAreas: ['wealth-management', 'investments'],
        customInstructions: 'Be extremely sophisticated and exclusive! Use premium language, mention private banking, exclusive opportunities, bespoke solutions. Reference luxury assets, art investments, private equity, hedge funds. Speak about "white-glove service," "concierge banking," and "ultra-high-net-worth strategies." Everything should feel premium and exclusive!',
        industryTerminology: 'ultra-sophisticated',
        responseComplexity: 'elite-level',
        interactionPattern: 'premium-proactive',
        personalization: {
          experienceLevel: 'ultra-sophisticated',
          preferredExamples: 'exclusive-cases',
          communicationTone: 'premium-formal',
          followUpStyle: 'white-glove-comprehensive'
        }
      }
    },
    familyPlanner: {
       name: '👨‍👩‍👧‍👦 Family Planner',
       description: 'Perfect for families planning their financial future',
       config: {
         responseStyle: 'protective-nurturing',
         temperature: 0.6,
         maxTokens: 1500,
         focusAreas: ['banking', 'investments'],
         customInstructions: 'Be extremely protective and long-term focused! Everything should be about securing the family\'s future, children\'s education, emergency funds. Use nurturing language, mention 529 plans, life insurance, family emergency funds. Focus on generational wealth, teaching kids about money. Always prioritize family security and education savings!',
         industryTerminology: 'family-focused',
         responseComplexity: 'family-oriented',
         interactionPattern: 'protective-educational',
         personalization: {
           experienceLevel: 'family-focused',
           preferredExamples: 'family-scenarios',
           communicationTone: 'caring-protective',
           followUpStyle: 'comprehensive-nurturing'
         }
       }
     },
     techSavvy: {
       name: '💻 Tech-Savvy User',
       description: 'For users who prefer digital-first banking solutions',
       config: {
         responseStyle: 'cutting-edge',
         temperature: 0.8,
         maxTokens: 1100,
         focusAreas: ['banking', 'investments'],
         customInstructions: 'Be extremely tech-focused and innovation-driven! Use tech jargon, mention APIs, blockchain, fintech, robo-advisors, AI-powered tools. Focus on digital-first solutions, mobile apps, automation. Reference cryptocurrency, digital wallets, contactless payments. Always push for the latest and most innovative financial technology!',
         industryTerminology: 'tech-heavy',
         responseComplexity: 'innovation-focused',
         interactionPattern: 'digital-first',
         personalization: {
           experienceLevel: 'tech-expert',
           preferredExamples: 'tech-innovations',
           communicationTone: 'enthusiastic-tech',
           followUpStyle: 'innovation-minimal'
         }
       }
     }
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll to top of new message when messages change
  useEffect(() => {
    scrollToNewMessage()
  }, [messages])

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages])



  const handleQuizComplete = (quizResult) => {
    // Add the quiz results to the chat as a user message
    const userMessage = { 
      role: 'user', 
      content: 'I used the Account Finder to find the right account and card for me.' 
    };
    
    // Add the assistant response with the recommendations
    const assistantResponse = {
      role: 'assistant',
      content: `Based on your preferences, I recommend the following:\n\n` +
        `**Account Recommendation: ${quizResult.result.account.title}**\n` +
        `${quizResult.result.account.description}\n\n` +
        `Key features:\n` +
        `${quizResult.result.account.features.map(f => `- ${f}`).join('\n')}\n\n` +
        `[View page: ${quizResult.result.account.url}]\n\n` +
        `**Card Recommendation: ${quizResult.result.card.title}**\n` +
        `${quizResult.result.card.description}\n\n` +
        `Key features:\n` +
        `${quizResult.result.card.features.map(f => `- ${f}`).join('\n')}\n\n` +
        `[View page: ${quizResult.result.card.url}]\n\n` +
        `Would you like more information about either of these recommendations?`
    };
    
    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setActiveModal(null); // Close the modal after completion
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setAutoSearchTerm(null); // Clear auto search term when modal is closed
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const openDashboard = () => {
    setIsDashboardOpen(true);
    setIsChatOpen(false);
    setActiveModal(null);
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };





  const switchToChat = () => {
    setIsDashboardOpen(false);
    setIsChatOpen(true);
    setActiveModal(null);
  };

  const getBuildModeQuestion = (step) => {
    const questions = [
      {
        question: "🔧 **Build Mode Activated!**\n\nLet's customize how I communicate with you. What communication style would you prefer?",
        examples: "Examples: 'professional and formal', 'casual and friendly', 'detailed explanations', 'concise and to-the-point'"
      },
      {
        question: "Great! Now, how creative should I be in my responses?",
        examples: "Examples: 'stick to facts and data', 'be moderately creative', 'use analogies and examples', 'be very creative and engaging'"
      },
      {
        question: "Perfect! What length of responses do you prefer?",
        examples: "Examples: 'short and quick answers', 'moderate length', 'comprehensive detailed responses', 'varies by topic'"
      },
      {
        question: "Excellent! What areas should I focus on to best help you?",
        examples: "Examples: 'general banking questions', 'investment advice', 'wealth management', 'personal banking', 'all areas equally'"
      },
      {
        question: "Now, what level of industry terminology should I use?",
        examples: "Examples: 'simplified terms', 'standard banking language', 'technical financial jargon', 'mix of simple and technical'"
      },
      {
        question: "How complex should my explanations be?",
        examples: "Examples: 'basic explanations', 'moderate complexity', 'advanced analysis', 'adapt to the topic'"
      },
      {
        question: "What interaction style works best for you?",
        examples: "Examples: 'respond to my questions', 'be proactive with suggestions', 'act as a consultant', 'focus on education'"
      },
      {
        question: "What's your experience level with financial topics?",
        examples: "Examples: 'complete beginner', 'some experience', 'quite experienced', 'expert level'"
      },
      {
        question: "What type of examples do you prefer?",
        examples: "Examples: 'theoretical concepts', 'real-world scenarios', 'detailed case studies', 'mix of different types'"
      },
      {
        question: "Finally, do you have any specific instructions or preferences for how I should assist you?",
        examples: "Examples: 'always ask follow-up questions', 'provide Swiss-specific information', 'include relevant examples', 'be proactive with suggestions'"
      }
    ];
    return questions[step] || null;
  };

  const enterBuildMode = () => {
    setIsBuildMode(true);
    setBuildModeStep(0);

    
    const firstQuestion = getBuildModeQuestion(0);
    const buildModeMessage = {
      role: 'assistant',
      content: `${firstQuestion.question}\n\n*${firstQuestion.examples}*`
    };
    setMessages(prev => [...prev, buildModeMessage]);
  };

  const handleBuildModeResponse = (userResponse) => {
    const currentStep = buildModeStep;
    
    // Handle template selection first
    if (currentStep === -1) {
      handleTemplateSelection(userResponse);
      return;
    }
    
    // Handle custom instructions step
    if (currentStep === 100) {
      // Process custom instructions
      const configUpdate = {
        customInstructions: userResponse,
        responseStyle: 'custom',
        temperature: 0.7,
        maxTokens: 1000,
        focusAreas: ['general'],
        industryTerminology: 'adaptive',
        responseComplexity: 'adaptive',
        interactionPattern: 'adaptive',
        personalization: {
          experienceLevel: 'adaptive',
          preferredExamples: 'mixed',
          communicationTone: 'adaptive',
          followUpStyle: 'adaptive'
        }
      };
      
      setBuildModeConfig(prev => ({ ...prev, ...configUpdate }));
      
      // Move to finalize step
      setBuildModeStep(10);
      const summaryMessage = {
        role: 'assistant',
        content: `🎉 **Custom Configuration Complete!**\n\nI've saved your custom instructions:\n\n**Your Instructions:**\n"${userResponse}"\n\n**Configuration Applied:**\n• Style: Custom based on your instructions\n• Adaptability: High - I'll adjust based on your preferences\n• Focus: As specified in your instructions\n\nType 'finalize' to complete your custom concierge setup and start using your personalized assistant!`
      };
      setMessages(prev => [...prev, summaryMessage]);
      return;
    }
    
    // Handle finalize step
    if (currentStep === 10) {
      const lowerResponse = userResponse.toLowerCase();
      if (lowerResponse.includes('finalize') || lowerResponse.includes('finish') || 
          lowerResponse.includes('complete') || lowerResponse.includes('done') ||
          lowerResponse.includes('ready') || lowerResponse.includes('start')) {
        exitBuildMode();
        return;
      } else {
        // User didn't use finalize keywords, prompt them again
        const promptMessage = {
          role: 'assistant',
          content: `Please type 'finalize' or 'ready' to complete your custom concierge setup and start using your personalized assistant.`
        };
        setMessages(prev => [...prev, promptMessage]);
        return;
      }
    }
    
    // Process the user's response based on current step
    let configUpdate = {};
    
    switch(currentStep) {
      case 0: // Communication style
        if (userResponse.toLowerCase().includes('professional')) configUpdate.responseStyle = 'professional';
        else if (userResponse.toLowerCase().includes('casual')) configUpdate.responseStyle = 'casual';
        else if (userResponse.toLowerCase().includes('detailed')) configUpdate.responseStyle = 'detailed';
        else if (userResponse.toLowerCase().includes('concise')) configUpdate.responseStyle = 'concise';
        break;
      case 1: // Creativity level
        if (userResponse.toLowerCase().includes('fact') || userResponse.toLowerCase().includes('data')) configUpdate.temperature = 0.3;
        else if (userResponse.toLowerCase().includes('creative') || userResponse.toLowerCase().includes('engaging')) configUpdate.temperature = 0.8;
        else configUpdate.temperature = 0.6;
        break;
      case 2: // Response length
        if (userResponse.toLowerCase().includes('short') || userResponse.toLowerCase().includes('quick')) configUpdate.maxTokens = 500;
        else if (userResponse.toLowerCase().includes('comprehensive') || userResponse.toLowerCase().includes('detailed')) configUpdate.maxTokens = 1500;
        else configUpdate.maxTokens = 1000;
        break;
      case 3: // Focus areas
        const areas = [];
        if (userResponse.toLowerCase().includes('investment')) areas.push('investments');
        if (userResponse.toLowerCase().includes('wealth')) areas.push('wealth-management');
        if (userResponse.toLowerCase().includes('personal banking')) areas.push('banking');
        if (userResponse.toLowerCase().includes('general') || areas.length === 0) areas.push('general');
        configUpdate.focusAreas = areas;
        break;
      case 4: // Industry terminology
        if (userResponse.toLowerCase().includes('simplified') || userResponse.toLowerCase().includes('simple')) configUpdate.industryTerminology = 'simplified';
        else if (userResponse.toLowerCase().includes('technical') || userResponse.toLowerCase().includes('jargon')) configUpdate.industryTerminology = 'technical';
        else if (userResponse.toLowerCase().includes('mix') || userResponse.toLowerCase().includes('both')) configUpdate.industryTerminology = 'mixed';
        else configUpdate.industryTerminology = 'standard';
        break;
      case 5: // Response complexity
        if (userResponse.toLowerCase().includes('basic')) configUpdate.responseComplexity = 'basic';
        else if (userResponse.toLowerCase().includes('advanced')) configUpdate.responseComplexity = 'advanced';
        else if (userResponse.toLowerCase().includes('adapt')) configUpdate.responseComplexity = 'adaptive';
        else configUpdate.responseComplexity = 'moderate';
        break;
      case 6: // Interaction pattern
        if (userResponse.toLowerCase().includes('proactive') || userResponse.toLowerCase().includes('suggest')) configUpdate.interactionPattern = 'proactive';
        else if (userResponse.toLowerCase().includes('consultant')) configUpdate.interactionPattern = 'consultative';
        else if (userResponse.toLowerCase().includes('education') || userResponse.toLowerCase().includes('teach')) configUpdate.interactionPattern = 'educational';
        else configUpdate.interactionPattern = 'responsive';
        break;
      case 7: // Experience level
        if (userResponse.toLowerCase().includes('beginner') || userResponse.toLowerCase().includes('complete')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, experienceLevel: 'beginner' };
        } else if (userResponse.toLowerCase().includes('expert')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, experienceLevel: 'expert' };
        } else if (userResponse.toLowerCase().includes('experienced') || userResponse.toLowerCase().includes('quite')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, experienceLevel: 'advanced' };
        } else {
          configUpdate.personalization = { ...buildModeConfig.personalization, experienceLevel: 'intermediate' };
        }
        break;
      case 8: // Preferred examples
        if (userResponse.toLowerCase().includes('theoretical')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, preferredExamples: 'theoretical' };
        } else if (userResponse.toLowerCase().includes('case') || userResponse.toLowerCase().includes('studies')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, preferredExamples: 'case-studies' };
        } else if (userResponse.toLowerCase().includes('mix') || userResponse.toLowerCase().includes('different')) {
          configUpdate.personalization = { ...buildModeConfig.personalization, preferredExamples: 'mixed' };
        } else {
          configUpdate.personalization = { ...buildModeConfig.personalization, preferredExamples: 'real-world' };
        }
        break;
      case 9: // Custom instructions
        configUpdate.customInstructions = userResponse;
        break;
    }
    
    // Update config
    setBuildModeConfig(prev => ({ ...prev, ...configUpdate }));
    
    // This section is no longer used for custom configuration
    // Custom configuration now uses step 100 for free-form instructions
    // This code remains for potential future use with preset template modifications
  };

  const exitBuildMode = () => {
    setIsBuildMode(false);
    setBuildModeStep(0);
    setShowConfigSummary(true);
    
    // Hide the summary after 10 seconds
    setTimeout(() => {
      setShowConfigSummary(false);
    }, 10000);
  };

  const updateBuildModeConfig = (newConfig) => {
    setBuildModeConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Function to apply a preset template
  const applyPresetTemplate = (templateKey) => {
    const template = presetTemplates[templateKey];
    if (template) {
      setBuildModeConfig(prev => ({
        ...prev,
        ...template.config,
        selectedTemplate: template.name
      }));
      
      // Send confirmation message
      const confirmationMessage = {
        role: 'assistant',
        content: `✅ **${template.name} Template Applied!**\n\n${template.description}\n\nYour assistant has been configured with the following settings:\n• Communication Style: ${template.config.responseStyle}\n• Industry Terminology: ${template.config.industryTerminology}\n• Response Complexity: ${template.config.responseComplexity}\n• Interaction Pattern: ${template.config.interactionPattern}\n• Experience Level: ${template.config.personalization.experienceLevel}\n\nType 'finalize' to complete your custom concierge setup and start using your personalized assistant!`
      };
      setMessages(prev => [...prev, confirmationMessage]);
      
      // Move to finalize step instead of exiting build mode
      setBuildModeStep(10);
    }
  };

  // Enhanced build mode with template selection
  const enterAdvancedBuildMode = () => {
    setIsBuildMode(true);
    setBuildModeStep(-1); // Start with template selection

    
    const templateSelectionMessage = {
      role: 'assistant',
      content: `🎯 **Choose Your Assistant Profile**\n\nSelect a preset template that best matches your needs, or choose 'Custom Configuration' to build your own:\n\n${Object.entries(presetTemplates).map(([key, template]) => 
        `**${template.name}**\n${template.description}\n`
      ).join('\n')}\n**🔧 Custom Configuration**\nBuild your own personalized assistant from scratch\n\n*Simply type the name of your preferred option (e.g., 'Student', 'Investor', 'Custom Configuration')*`
    };
    setMessages(prev => [...prev, templateSelectionMessage]);
  };

  // Function to handle template selection or custom build mode
  const handleTemplateSelection = (userResponse) => {
    const lowerResponse = userResponse.toLowerCase();
    
    // Define keyword synonyms for each template
    const templateKeywords = {
      student: ['student', 'college', 'university', 'learning', 'education', 'beginner', 'school', 'academic', 'study', 'studying'],
      youngProfessional: ['young professional', 'professional', 'career', 'early career', 'working', 'employee', 'job', 'workplace', 'corporate'],
      investor: ['investor', 'active investor', 'trading', 'stocks', 'portfolio', 'investing', 'market', 'trader', 'investment', 'finance'],
      businessOwner: ['business owner', 'entrepreneur', 'company', 'business', 'startup', 'owner', 'ceo', 'founder', 'enterprise', 'commercial'],
      retiree: ['retiree', 'retired', 'retirement', 'senior', 'pension', 'elderly', 'golden years', 'post-career', 'pensioner'],
      wealthManager: ['high net worth', 'wealthy', 'rich', 'affluent', 'premium', 'luxury', 'exclusive', 'private banking', 'wealth management', 'hnw'],
      familyPlanner: ['family', 'family planner', 'parent', 'parents', 'children', 'kids', 'household', 'family planning', 'dependents'],
      techSavvy: ['tech savvy', 'tech', 'technology', 'digital', 'mobile', 'app', 'online', 'techie', 'digital native', 'tech-savvy']
    };
    
    // Check if user selected a preset template
    for (const [key, template] of Object.entries(presetTemplates)) {
      // Clean template name by removing emojis and extra spaces
      const cleanTemplateName = template.name.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();
      // Also check against the key directly
      const keyWords = key.toLowerCase().replace(/([A-Z])/g, ' $1').trim();
      
      // Check template keywords/synonyms
      const keywords = templateKeywords[key] || [];
      const keywordMatch = keywords.some(keyword => lowerResponse.includes(keyword));
      
      if (lowerResponse.includes(cleanTemplateName) || 
          lowerResponse.includes(keyWords) ||
          lowerResponse.includes(key.toLowerCase()) ||
          keywordMatch) {
        applyPresetTemplate(key);
        return;
      }
    }
    
    // Check if user wants custom configuration
    if (lowerResponse.includes('custom') || lowerResponse.includes('build') || lowerResponse.includes('scratch')) {
      // Start custom instructions mode
      setBuildModeStep(100); // Use special step number for custom instructions
      const customInstructionsMessage = {
        role: 'assistant',
        content: `🔧 **Custom Configuration Mode**\n\nPlease write your comprehensive custom instructions for how you'd like me to assist you. Include details about:\n\n• **Communication style** (formal, casual, detailed, concise)\n• **Response preferences** (creative, factual, balanced)\n• **Areas of focus** (investments, banking, education, etc.)\n• **Experience level** (beginner, intermediate, advanced, expert)\n• **Specific behaviors** you want me to follow\n• **Any other preferences** for our interactions\n\n*Example: "Be professional but friendly, focus on investment advice for beginners, always explain financial terms, ask follow-up questions to understand my goals better, and provide Swiss-specific information when relevant."*\n\nType your complete custom instructions below:`
      };
      setMessages(prev => [...prev, customInstructionsMessage]);
    } else {
      // User didn't select a valid option, ask again
      const clarificationMessage = {
        role: 'assistant',
        content: `I didn't recognize that selection. Please choose one of the preset templates by name (e.g., 'Student', 'Young Professional', 'Investor') or type 'Custom Configuration' to build your own.`
      };
      setMessages(prev => [...prev, clarificationMessage]);
    }
  };

  const suggestedPrompts = [
    "Discover trending stocks in real-time",
    "Find the perfect UBS account for your needs",
    "Learn financial terms that matter to you",
    "Track crypto markets and portfolio performance",
    "Get personalized investment recommendations",
    "Explore UBS wealth management solutions",
    "Search and analyze stock market data",
    "View live market news and insights",
    "Compare UBS banking products and services",
    "Find the right credit card for your lifestyle",
    "Discover mobile banking features and tools",
    "Build your custom investment portfolio",
    "Analyze market trends with UBS research",
    "Plan your retirement with UBS advisors",
    "Master financial concepts with our education center",
    "Learn about secure digital banking options",
    "Explore premium wealth management services",
    "Take our account finder quiz for recommendations",
    "Discover international banking solutions",
    "Get instant market updates and alerts",
    "Set and track your financial goals",
    "Access professional investment research",
    "Calculate potential investment returns",
    "Explore mortgage and real estate financing",
    "Try our interactive financial calculators"
  ];

  const randomPrompt = suggestedPrompts[Math.floor(Math.random() * suggestedPrompts.length)];

  const handlePromptSelect = async (message, shouldEnterBuildMode = false) => {
    if (shouldEnterBuildMode) {
      // Enter advanced build mode with template selection
      enterAdvancedBuildMode();
    } else {
      // Regular prompt selection
      await sendMessage(message);
    }
  };

  // Function to detect if user is asking for account/card recommendations
  const detectAccountFinderIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate account/card recommendation intent
    const accountKeywords = [
      'which account', 'what account', 'best account', 'right account', 'account for me',
      'account recommendation', 'recommend account', 'choose account', 'account type',
      'banking account', 'savings account', 'checking account', 'current account'
    ];
    
    const cardKeywords = [
      'which card', 'what card', 'best card', 'right card', 'card for me',
      'card recommendation', 'recommend card', 'choose card', 'credit card',
      'debit card', 'prepaid card', 'banking card'
    ];
    
    const generalRecommendationKeywords = [
      'what should i choose', 'help me choose', 'what\'s best for me',
      'recommendation', 'suggest', 'advice on', 'which one should i',
      'what do you recommend', 'help me decide'
    ];
    
    // Check if message contains account/card keywords
    const hasAccountKeywords = accountKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasCardKeywords = cardKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Check if message contains general recommendation keywords with banking context
    const hasGeneralKeywords = generalRecommendationKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasBankingContext = lowerMessage.includes('bank') || lowerMessage.includes('ubs') || 
                             lowerMessage.includes('financial') || lowerMessage.includes('money');
    
    return hasAccountKeywords || hasCardKeywords || (hasGeneralKeywords && hasBankingContext);
  };

  // Function to detect if user is asking for financial term definitions
  const detectFinancialEducationIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate definition/explanation intent
    const definitionKeywords = [
      'what is', 'what does', 'define', 'definition of', 'meaning of', 'explain',
      'what means', 'how does', 'tell me about', 'help me understand'
    ];
    
    // Financial terms that might be asked about
    const financialTerms = [
      'compound interest', 'diversification', 'liquidity', 'credit score', 'inflation',
      'etf', 'mortgage', 'portfolio', 'dividend', 'bond', 'stock', 'investment',
      'savings', 'loan', 'interest', 'apr', 'apy', 'asset', 'liability', 'equity',
      'mutual fund', 'index fund', 'retirement', '401k', 'ira', 'roth', 'pension',
      'insurance', 'premium', 'deductible', 'annuity', 'capital gains', 'tax',
      'budget', 'debt', 'credit', 'bankruptcy', 'foreclosure', 'refinance'
    ];
    
    // Check if message contains definition keywords
    const hasDefinitionKeywords = definitionKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Check if message contains financial terms
    const hasFinancialTerms = financialTerms.some(term => lowerMessage.includes(term));
    
    // Extract potential search term from the message
    let searchTerm = null;
    if (hasDefinitionKeywords || hasFinancialTerms) {
      // Try to extract the term being asked about
      for (const term of financialTerms) {
        if (lowerMessage.includes(term)) {
          searchTerm = term;
          break;
        }
      }
      
      // If no predefined term found, try to extract from common patterns
      if (!searchTerm) {
        const patterns = [
          /what is (?:a |an |the )?([\w\s]+?)(?:\?|$)/,
          /define (?:a |an |the )?([\w\s]+?)(?:\?|$)/,
          /meaning of (?:a |an |the )?([\w\s]+?)(?:\?|$)/,
          /explain (?:a |an |the )?([\w\s]+?)(?:\?|$)/
        ];
        
        for (const pattern of patterns) {
          const match = lowerMessage.match(pattern);
          if (match && match[1]) {
            searchTerm = match[1].trim();
            break;
          }
        }
      }
    }
    
    return {
      isFinancialEducationIntent: hasDefinitionKeywords && (hasFinancialTerms || lowerMessage.includes('financial')),
      searchTerm: searchTerm
    };
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    
    // Check if user is asking for account/card recommendations
    if (detectAccountFinderIntent(message) && !isBuildMode) {
      // Add assistant response suggesting the account finder
      const suggestionMessage = {
        role: 'assistant',
        content: 'I can help you find the perfect account or card! I\'ve opened our Account Finder tool for you. Please answer a few quick questions to get personalized recommendations tailored to your needs.'
      };
      setMessages(prev => [...prev, suggestionMessage]);
      
      // Automatically open the account finder modal
      setActiveModal('account-finder');
      return;
    }
    
    // Check if user is asking for financial term definitions
    const financialEducationResult = detectFinancialEducationIntent(message);
    if (financialEducationResult.isFinancialEducationIntent && !isBuildMode) {
      // Add assistant response suggesting the financial education center
      const suggestionMessage = {
        role: 'assistant',
        content: financialEducationResult.searchTerm 
          ? `I can help you understand "${financialEducationResult.searchTerm}"! I\'ve opened our Financial Education Center and searched for this term. You\'ll find a detailed explanation with examples.`
          : 'I can help you learn about financial terms and concepts! I\'ve opened our Financial Education Center where you can search for definitions and explanations.'
      };
      setMessages(prev => [...prev, suggestionMessage]);
      
      // Automatically open the financial education modal with search term
      setActiveModal('financial-education');
      setAutoSearchTerm(financialEducationResult.searchTerm);
      return;
    }
    
    // If in build mode, handle the response locally
    if (isBuildMode) {
      handleBuildModeResponse(message);
      return;
    }
    
    setIsLoading(true)

    try {
      // Prepare all messages for context
      const allMessages = [...messages, userMessage]

      // Send request to backend with build mode config
      const requestBody = {
        messages: allMessages,
        isBuildMode: isBuildMode,
        buildModeConfig: buildModeConfig
      };
      
      // Debug logging for buildModeConfig
      console.log('🔧 DEBUG: Sending buildModeConfig to API:', JSON.stringify(buildModeConfig, null, 2));
      console.log('🔧 DEBUG: isBuildMode:', isBuildMode);
      console.log('🔧 DEBUG: Full request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      console.log('API response:', data)
      
      // Handle build mode configuration updates from the bot
      if (data.buildModeUpdate) {
        updateBuildModeConfig(data.buildModeUpdate);
      }
      
      // Add assistant response to chat
      console.log('Processing response data:', JSON.stringify(data));
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }])
      } else if (data.message && data.message.content) {
        // Alternative response format
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message.content
        }])
      } else {
        throw new Error('Unexpected response format from API: ' + JSON.stringify(data))
      }
    } catch (error) {
      console.error('Error:', error)
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.'
      } else if (error.message.includes('Unexpected response format')) {
        errorMessage = 'The server returned an unexpected response format. Please try again later.'
      } else if (error.message.includes('Failed to get response')) {
        errorMessage = 'The server is not responding. Please try again later.'
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }



  // Debug logging for button visibility
  console.log('🔍 DEBUG: Button visibility check:', {
    isChatOpen,
    isDashboardOpen,
    shouldShowButton: !isChatOpen && !isDashboardOpen,
    sparklesIcon,
    randomPrompt
  });

  // Additional debugging for the button element
  useEffect(() => {
    const buttonElement = document.querySelector('.chat-toggle-button');
    console.log('🔍 DEBUG: Button element found:', buttonElement);
    if (buttonElement) {
      console.log('🔍 DEBUG: Button styles:', window.getComputedStyle(buttonElement));
    }
  }, [isChatOpen, isDashboardOpen]);

  return (
    <div className="app-container">
      {/* Floating Buttons */}
      {!isChatOpen && !isDashboardOpen && (
        <>
          <button 
            className="chat-toggle-button" 
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              display: 'block !important',
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              zIndex: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // 85% opaque white for debugging
              border: '2px solid white'
            }}
          >
            <img src={sparklesIcon} alt="Marcel" style={{ width: '40px', height: '40px' }} />
            {isHovered && (
              <div className="prompt-preview">
                {randomPrompt}
              </div>
            )}
          </button>
        </>
      )}
      

      
      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-layout-container">
          <div className="chat-section-full">
            {/* Background video removed to reduce bundle size */}
            <ChatHeader 
              onOpenTools={() => openModal('tools')} 
              onClose={toggleChat}
              isBuildMode={isBuildMode}
              onExitBuildMode={exitBuildMode}
              buildModeConfig={buildModeConfig}
            />
            <ChatMessages 
              messages={messages} 
              isLoading={isLoading} 
              messagesEndRef={messagesEndRef}
              messagesContainerRef={messagesContainerRef}
              onOpenDashboard={openDashboard}
              isDashboardView={isDashboardOpen}
              onClose={toggleChat}
              isBuildMode={isBuildMode}
              buildModeStep={buildModeStep}
              buildModeConfig={buildModeConfig}
              onTemplateSelect={handleTemplateSelection}
              onCustomConfig={() => handleTemplateSelection('custom')}
            />
            {messages.length <= 1 && !isBuildMode && (
              <SuggestedPrompts onSelectPrompt={handlePromptSelect} />
            )}
            <div className="chat-input-wrapper">
               <ChatInput 
                 onSendMessage={sendMessage} 
                 isLoading={isLoading}
                 onOpenTools={() => openModal('tools')}
                 isDashboardOpen={isDashboardOpen}
                 onOpenDashboard={openDashboard}
                 onSwitchToChat={switchToChat}
                 messages={messages}
               />
             </div>
          </div>
          
          {/* Side Panel */}
          {(activeModal === 'tools' || activeModal === 'account-finder' || activeModal === 'financial-education' || activeModal === 'stock-market') && (
            <div className="financial-education-panel">
              <div className="panel-header">
                <h3>UBS Tools</h3>
                <button className="panel-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <RightPanelTabs onQuizComplete={handleQuizComplete} onSendMessage={sendMessage} autoSearchTerm={autoSearchTerm} />
            </div>
          )}
        </div>
      )}

      {/* Dashboard Window */}
      {isDashboardOpen && (
        <Dashboard onClose={closeDashboard} onSwitchToChat={switchToChat} />
      )}

      {/* Configuration Summary Modal */}
      {showConfigSummary && (
        <ConfigurationSummary 
          buildModeConfig={buildModeConfig} 
          onClose={() => {
            setShowConfigSummary(false);
            setMessages([]);
          }}
        />
      )}

    </div>
  )
}

export default App
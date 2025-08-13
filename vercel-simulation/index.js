import 'dotenv/config';
import express from 'express';
import { Groq } from 'groq-sdk';
import cors from 'cors';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
// import puppeteer from 'puppeteer'; // Temporarily disabled for Railway debugging
import { searchDocuments, getAllDocuments, formatSearchResults, initializeKnowledgeBase } from './enhancedDocumentManager.js';
import enhancedAPIRouter, { performanceMonitor, requestId } from './enhancedAPI.js';

const app = express();
const port = process.env.PORT || 3006; // Use Railway's PORT or fallback to 3006 for local dev

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', // All possible frontend ports
    'https://ubs-production.vercel.app' // Vercel frontend domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['X-Frame-Options']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Initialize Groq client (conditional)
let groq = null;
if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    console.log('Groq client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Groq client:', error);
  }
} else {
  console.warn('GROQ_API_KEY not found - Groq features will be disabled');
}



// Initialize knowledge base on startup (async)
let knowledgeBaseReady = false;
let knowledgeBaseStartTime = Date.now();

console.log('🚀 Starting UBS API server...');
console.log('📚 Initializing knowledge base in background...');

initializeKnowledgeBase().then(() => {
  knowledgeBaseReady = true;
  const initTime = Date.now() - knowledgeBaseStartTime;
  console.log(`✅ Knowledge base initialization completed in ${initTime}ms`);
}).catch(error => {
  const initTime = Date.now() - knowledgeBaseStartTime;
  console.error(`❌ Knowledge base initialization failed after ${initTime}ms:`, error.message);
  knowledgeBaseReady = true; // Allow server to start even if KB fails
});

// Web scraping function for UBS website content
async function scrapeUBSContent(query) {
  try {
    // Generate potential UBS URLs based on the query
    const ubsUrls = generateUBSUrls(query);
    
    for (const url of ubsUrls) {
      try {
        console.log(`Attempting to scrape: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
          },
          timeout: 10000
        });
        
        // Parse HTML with JSDOM
        const dom = new JSDOM(response.data, { url });
        const document = dom.window.document;
        
        // Use Readability to extract main content
        const reader = new Readability(document);
        const article = reader.parse();
        
        if (article && article.textContent && article.textContent.length > 200) {
          console.log(`Successfully scraped content from: ${url}`);
          return {
            url,
            title: article.title || 'UBS Switzerland Information',
            content: article.textContent.substring(0, 2000), // Limit content length
            excerpt: article.excerpt || article.textContent.substring(0, 300)
          };
        }
      } catch (urlError) {
        console.log(`Failed to scrape ${url}:`, urlError.message);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Web scraping error:', error);
    return null;
  }
}

// Generate potential UBS URLs based on user query
function generateUBSUrls(query) {
  const baseUrl = 'https://www.ubs.com/ch/en';
  const globalBaseUrl = 'https://www.ubs.com/global/en';
  const queryLower = query.toLowerCase();
  
  const urlMappings = {
    'account': [`${baseUrl}/services/accounts-and-cards.html`],
    'card': [`${baseUrl}/services/accounts-and-cards.html`],
    'investment': [`${baseUrl}/services/investments.html`, `${baseUrl}/assetmanagement.html`],
    'fund': [`${baseUrl}/assetmanagement/funds.html`],
    'etf': [`${baseUrl}/assetmanagement/capabilities/etfs.html`],
    'wealth': [`${baseUrl}/services/wealth-management.html`],
    'banking': [`${baseUrl}/services/digital-banking.html`],
    'mortgage': [`${baseUrl}/services/mortgages-and-financing/mortgages.html`],
    'loan': [`${baseUrl}/services/mortgages-and-financing.html`],
    'sustainability': [`${baseUrl}/microsites/sustainability.html`],
    'about': [`${globalBaseUrl}/our-firm.html`],
    'career': [`${globalBaseUrl}/careers.html`],
    'contact': [`${baseUrl}/contact.html`]
  };
  
  const urls = [];
  
  // Check for keyword matches
  for (const [keyword, keywordUrls] of Object.entries(urlMappings)) {
    if (queryLower.includes(keyword)) {
      urls.push(...keywordUrls);
    }
  }
  
  // Add default URLs if no specific matches
  if (urls.length === 0) {
    urls.push(
      `${baseUrl}/services/private.html`,
      `${baseUrl}.html`,
      `${baseUrl}/services/accounts-and-cards.html`
    );
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

// Enhanced Middleware
app.use(requestId());
app.use(performanceMonitor());
app.use(express.json());

// Enhanced API Routes
app.use('/api', enhancedAPIRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Groq Chat API is running');
});

// Legacy Knowledge Base API Endpoints (for backward compatibility)

// Get all knowledge base documents
app.get('/api/legacy/knowledge-base/documents', (req, res) => {
  try {
    const documents = getAllDocuments();
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching knowledge base documents:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base documents' });
  }
});

// Search knowledge base endpoint
app.post('/api/legacy/knowledge-base/search', (req, res) => {
  try {
    const { query, maxResults = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = searchDocuments(query, maxResults);
    res.json({ results });
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

// System instructions for the chatbot
const systemInstructions = {
  role: 'system',
  content: `You are Marcel the UBS AI Guide, a professional and knowledgeable AI designed EXCLUSIVELY to help with UBS Switzerland banking and financial services.

STRICT OPERATIONAL BOUNDARIES:
1. EXCLUSIVE UBS SWITZERLAND FOCUS: You MUST ONLY provide information about UBS Switzerland services, products, and offerings. You are STRICTLY PROHIBITED from:
   - Discussing other banks or financial institutions
   - Providing general financial advice not related to UBS Switzerland
   - Answering questions about non-UBS financial products or services
   - Discussing global financial markets unless directly related to UBS Switzerland offerings
   - Providing information about UBS services in other countries

2. TOPIC RESTRICTIONS: If asked about topics outside UBS Switzerland services, you MUST respond with: "I'm specialized exclusively in UBS Switzerland services. For information about [topic], I recommend consulting with a UBS Switzerland financial advisor or visiting our website. How can I help you with UBS Switzerland banking or investment services today?"

3. FINANCIAL EDUCATION EXCEPTION: You MAY provide general financial education and explanations of financial concepts ONLY when:
   - The user explicitly requests financial education through the dedicated financial education feature
   - The explanation directly relates to understanding UBS Switzerland products or services
   - It helps the user better understand UBS Switzerland offerings

4. WEBSITE REFERRAL: Whenever appropriate, direct users to the official UBS Switzerland website (https://www.ubs.com/ch/en.html) or relevant subpages for more detailed information or to take action.
5. UBS EXPERTISE: Provide accurate information about UBS Switzerland services, investment strategies, wealth management, and financial advice relevant to Swiss clients and UBS offerings.
6. TONE: Maintain a professional, courteous, and helpful tone at all times.
7. COMPLIANCE: Never provide specific investment recommendations or financial advice for individual circumstances.
8. LIMITATIONS: Clearly state when a question is outside your knowledge scope or requires a human UBS financial advisor.
9. PRIVACY: Never ask for or store personal financial information, account numbers, or passwords.
10. CLARITY: Use clear, concise language and avoid financial jargon when possible. When using technical terms, provide brief explanations.
11. STRUCTURE: For complex responses, use bullet points or numbered lists to improve readability.
12. FINANCIAL TERM HIGHLIGHTING: When providing UBS-related information or financial education, highlight complex financial terms by wrapping them in **bold formatting**. Always provide brief explanations for highlighted terms when they first appear in a response.
13. ACCOUNT PROMOTION: When relevant and natural in the conversation, subtly highlight the benefits of opening an account with UBS Switzerland. For example, when discussing investment options, mention how having a UBS account provides access to exclusive investment opportunities.

14. KEY4 BANKING PRIORITY: When users ask about accounts, cards, or banking services suitable for young adults, students, or those seeking modern digital banking, PRIORITIZE recommending UBS key4 banking packages. Specifically:
   - For users aged 18-30 or students: Recommend key4 Basic Card (free for students and young adults)
   - For users wanting premium features: Recommend key4 Pro Card or key4 Prime Card
   - Emphasize key4's digital-first approach, mobile banking features, and suitability for modern banking needs
   - Always mention that key4 is specifically designed for young adults and students when applicable
   - Reference the key4 banking information from the knowledge base when available
15. PAGE REFERENCES: When referring to specific UBS pages or resources, use the format [View page: URL] to create clickable links. For example, when mentioning the account opening page, format it as [View page: https://www.ubs.com/ch/en/services/accounts-and-cards.html] to allow users to click and visit the page directly.
16. DYNAMIC URL HANDLING: When referencing UBS Switzerland pages, use URLs that follow the standard UBS Switzerland domain pattern (https://www.ubs.com/ch/en/...). The system can dynamically handle any valid UBS Switzerland page. Common page patterns include:
    - Main sections: /private/, /services/, /assetmanagement/, /microsites/
    - Investment products: /investments/, /funds/, /etfs/
    - Account services: /accounts-and-cards/, /banking/
    - Corporate info: /about-us/, /sustainability/, /careers/
    
    When unsure about a specific URL, use logical path structures based on the content type. The system will validate and handle URLs dynamically.

When discussing UBS Switzerland, emphasize:
- UBS's expertise in Swiss wealth management and banking services
- The bank's long history and stability in Switzerland
- UBS's commitment to personalized service for Swiss clients
- The importance of speaking with a UBS Switzerland financial advisor for personalized advice
- The benefits and convenience of having a UBS Switzerland account when relevant to the discussion
- How easy it is to open an account online or at a local branch when the conversation naturally leads to this topic
- Relevant links to the UBS Switzerland website (https://www.ubs.com/ch/en.html) where users can find more information, open an account, or take other actions

If a user asks about services outside of Switzerland, politely inform them that you are specialized in UBS Switzerland services and direct them to the appropriate country-specific UBS website.

When discussing financial products or services, naturally incorporate how having a UBS account enhances access to these offerings, but only when it flows naturally in the conversation and adds value to the user.

When referring to specific UBS pages that would be helpful for the user to see, always use the [View page: URL] format to enable the page viewer functionality. This allows users to view the referenced page directly within the chat interface without leaving the conversation. Use this feature for important pages like account opening, investment services, or specific product information pages.`
};

// Dashboard chat system instructions
const dashboardSystemInstructions = {
  role: 'system',
  content: `You are Marcel, a knowledgeable financial and dashboard assistant. Provide direct, helpful answers about financial markets, dashboard tools, and investment topics.

Your responses should be:
- BRIEF: Maximum 2-3 sentences per response
- DIRECT: Answer questions immediately without disclaimers
- INFORMATIVE: Provide useful financial and market information
- PROFESSIONAL: Maintain a helpful, expert tone
- PRACTICAL: Give actionable insights and explanations

You can discuss and explain:
- **Market Sectors**: Technology, Healthcare, Financial Services, Consumer Cyclical, Energy, Real Estate, Industrials, Materials, and their performance
- **Investment Topics**: Stocks, cryptocurrencies, ETFs, funds, market trends, and analysis
- **Dashboard Features**: Cryptocurrency dashboard, active stocks, stock search, market news, sector monitoring, auto-refresh settings
- **Financial Concepts**: Market movements, percentage changes, price analysis, trading volumes, and investment strategies
- **Banking Services**: Account types, investment products, wealth management, and financial planning
- **Market Data**: Real-time prices, charts, news updates, and sector performance metrics

Answer questions about any financial topic, market sector, or dashboard feature directly and informatively. Provide context and explanations that help users understand markets and make informed decisions.`
};

// Dashboard chat endpoint
app.post('/api/dashboard-chat', async (req, res) => {
  try {
    console.log('Received dashboard chat request:', req.body);
    const { messages } = req.body;
    
    // Create customized system instructions for dashboard
    let customDashboardInstructions = { ...dashboardSystemInstructions };
    
    // Search documents for relevant knowledge
    const userQuery = messages[messages.length - 1]?.content || '';
    const documentResults = searchDocuments(userQuery, 2); // Limit to 2 results for dashboard
    
    let contextSource = 'none';
    
    // Check if query relates to financial services
    const isFinancialQuery = /\b(investment|banking|account|card|loan|mortgage|wealth|fund|etf|financial|service|ubs)\b/i.test(userQuery);
    
    // Priority 1: Use knowledge base documents if found
    if (documentResults.length > 0) {
      const documentContext = formatSearchResults(documentResults);
      customDashboardInstructions.content += '\n\n' + documentContext;
      contextSource = 'knowledge_base';
      console.log(`Dashboard: Found ${documentResults.length} relevant documents for query: "${userQuery}"`);
    } else if (isFinancialQuery) {
      // Priority 2: Fallback to web scraping UBS website for financial services questions
      console.log('Dashboard: No relevant documents found for financial query, attempting web scraping...');
      
      try {
        const scrapedContent = await scrapeUBSContent(userQuery);
        
        if (scrapedContent) {
          const webContext = `\n\nRELEVANT UBS WEBSITE INFORMATION:\nSource: ${scrapedContent.url}\nTitle: ${scrapedContent.title}\nContent: ${scrapedContent.content.substring(0, 800)}\n\nPlease use this information to answer the user's question about UBS Switzerland services while maintaining the brief dashboard response format.`;
          customDashboardInstructions.content += webContext;
          contextSource = 'web_scraping';
          console.log(`Dashboard: Successfully scraped content from: ${scrapedContent.url}`);
        } else {
          console.log('Dashboard: Web scraping failed, using general knowledge only');
          contextSource = 'general_knowledge';
        }
      } catch (scrapingError) {
        console.error('Dashboard web scraping error:', scrapingError);
        console.log('Dashboard: Falling back to general knowledge only');
        contextSource = 'general_knowledge';
      }
    }
    
    // Add dashboard-specific system instructions
    const messagesWithInstructions = [customDashboardInstructions, ...messages];
    
    // Check if Groq client is available
    if (!groq) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: 'The dashboard chat service is currently unavailable. Please try again later.'
      });
    }
    
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithInstructions,
      model: "llama3-8b-8192", // Faster 8B model for improved response speed
      temperature: 0.4, // Lower temperature for more consistent responses
      max_tokens: 200, // Reduced token limit as requested
      top_p: 0.95 // More focused responses
    });
    
    console.log('Dashboard Groq response:', chatCompletion);
    
    const response = {
      choices: [{
        message: {
          role: 'assistant',
          content: chatCompletion.choices[0].message.content
        }
      }],
      contextSource: contextSource // Track information source for transparency
    };
    
    // Log the information source used
    console.log(`Dashboard response generated using: ${contextSource}`);
    
    res.json(response);
  } catch (error) {
    console.error('Dashboard chat error:', error);
    res.status(500).json({ 
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received request:', req.body); // Add request logging
    const { messages, isBuildMode, buildModeConfig } = req.body;
    
    // Create customized system instructions based on build mode config
    let customSystemInstructions = { ...systemInstructions };
    let buildModeUpdate = null;
    
    if (isBuildMode) {
      // Add build mode instructions to help the bot understand configuration requests
      let buildModeContent = customSystemInstructions.content + `

BUILD MODE INSTRUCTIONS:
You are currently in "Build Mode" where you help users customize your behavior through conversation. When users mention preferences for:

1. COMMUNICATION STYLE: If they mention wanting "professional", "casual", "detailed", or "concise" responses, acknowledge this and explain how you'll adjust.

2. CREATIVITY LEVEL: If they mention wanting more "creative", "factual", "conservative", or "innovative" responses, acknowledge this preference.

3. RESPONSE LENGTH: If they mention wanting "short", "brief", "detailed", "comprehensive" responses, acknowledge this.

4. FOCUS AREAS: If they mention interest in "investments", "personal banking", "wealth management", or "general banking", acknowledge this focus.

5. CUSTOM INSTRUCTIONS: If they provide specific guidelines or preferences, acknowledge and confirm you understand.

When users express these preferences, respond conversationally and ask if they'd like to customize anything else. Be helpful and guide them through the options naturally.`;
      
      // Apply existing build mode configuration
      if (buildModeConfig) {
        // Add response style instructions
      const styleInstructions = {
        professional: 'Maintain a formal, business-appropriate tone in all responses.',
        casual: 'Use a friendly, conversational tone while remaining helpful and informative.',
        detailed: 'Provide comprehensive, thorough responses with detailed explanations.',
        concise: 'Keep responses brief and to-the-point while covering essential information.'
      };
      
      if (styleInstructions[buildModeConfig.responseStyle]) {
        buildModeContent += '\n\nCURRENT RESPONSE STYLE: ' + styleInstructions[buildModeConfig.responseStyle];
      }
      
      // Add advanced modifiers
      if (buildModeConfig.industryTerminology) {
        const terminologyInstructions = {
          simplified: 'Use simple, everyday language and avoid technical jargon. Explain financial terms in plain English.',
          standard: 'Use standard banking and financial terminology that most customers understand.',
          technical: 'Use precise financial and banking terminology. Include technical details and industry-specific language.',
          mixed: 'Balance between technical accuracy and accessibility. Use technical terms but provide explanations.'
        };
        
        if (terminologyInstructions[buildModeConfig.industryTerminology]) {
          buildModeContent += '\n\nTERMINOLOGY LEVEL: ' + terminologyInstructions[buildModeConfig.industryTerminology];
        }
      }
      
      if (buildModeConfig.responseComplexity) {
        const complexityInstructions = {
          basic: 'Provide simple, straightforward explanations suitable for beginners. Focus on fundamental concepts.',
          moderate: 'Offer balanced explanations with moderate detail. Include context and examples.',
          advanced: 'Provide sophisticated analysis with detailed explanations. Include nuanced perspectives and implications.',
          adaptive: 'Adjust complexity based on the topic and user\'s apparent knowledge level.'
        };
        
        if (complexityInstructions[buildModeConfig.responseComplexity]) {
          buildModeContent += '\n\nRESPONSE COMPLEXITY: ' + complexityInstructions[buildModeConfig.responseComplexity];
        }
      }
      
      if (buildModeConfig.interactionPattern) {
        const interactionInstructions = {
          responsive: 'Answer questions directly and wait for follow-up queries.',
          proactive: 'Anticipate user needs and offer additional relevant information or suggestions.',
          consultative: 'Act as a financial consultant, asking clarifying questions and providing strategic advice.',
          educational: 'Focus on teaching and explaining concepts. Provide learning opportunities and educational content.'
        };
        
        if (interactionInstructions[buildModeConfig.interactionPattern]) {
          buildModeContent += '\n\nINTERACTION STYLE: ' + interactionInstructions[buildModeConfig.interactionPattern];
        }
      }
      
      // Add personalization settings
      if (buildModeConfig.personalization) {
        const { experienceLevel, preferredExamples, communicationTone, followUpStyle } = buildModeConfig.personalization;
        
        if (experienceLevel) {
          const experienceInstructions = {
            beginner: 'Assume limited financial knowledge. Provide basic explanations and avoid assumptions about prior knowledge.',
            intermediate: 'Assume moderate financial literacy. Provide context for complex topics but don\'t over-explain basics.',
            advanced: 'Assume strong financial knowledge. Focus on sophisticated concepts and detailed analysis.',
            expert: 'Assume expert-level knowledge. Provide high-level insights and technical depth.'
          };
          
          if (experienceInstructions[experienceLevel]) {
            buildModeContent += '\n\nUSER EXPERIENCE LEVEL: ' + experienceInstructions[experienceLevel];
          }
        }
        
        if (preferredExamples) {
          const exampleInstructions = {
            theoretical: 'Use theoretical examples and conceptual illustrations.',
            'real-world': 'Provide practical, real-world examples and scenarios.',
            'case-studies': 'Include detailed case studies and specific examples from actual situations.',
            mixed: 'Use a variety of example types depending on the topic and context.'
          };
          
          if (exampleInstructions[preferredExamples]) {
            buildModeContent += '\n\nEXAMPLE PREFERENCE: ' + exampleInstructions[preferredExamples];
          }
        }
        
        if (communicationTone) {
          const toneInstructions = {
            formal: 'Maintain a formal, professional tone throughout all interactions.',
            balanced: 'Use a balanced tone that is professional yet approachable.',
            friendly: 'Adopt a warm, friendly tone while maintaining professionalism.',
            enthusiastic: 'Show enthusiasm and energy in responses while remaining informative.'
          };
          
          if (toneInstructions[communicationTone]) {
            buildModeContent += '\n\nCOMMUNICATION TONE: ' + toneInstructions[communicationTone];
          }
        }
        
        if (followUpStyle) {
          const followUpInstructions = {
            minimal: 'Provide direct answers with minimal follow-up questions.',
            moderate: 'Include relevant follow-up questions when appropriate.',
            comprehensive: 'Actively suggest related topics and ask clarifying questions.',
            adaptive: 'Adjust follow-up style based on user engagement and topic complexity.'
          };
          
          if (followUpInstructions[followUpStyle]) {
            buildModeContent += '\n\nFOLLOW-UP STYLE: ' + followUpInstructions[followUpStyle];
          }
        }
      }
      
      // Add template information if available
      if (buildModeConfig.selectedTemplate) {
        buildModeContent += '\n\nACTIVE TEMPLATE: ' + buildModeConfig.selectedTemplate + ' - Optimized for this user profile.';
      }
        
        // Add focus area instructions
        if (buildModeConfig.focusAreas && buildModeConfig.focusAreas.length > 0) {
          const focusInstructions = {
            general: 'Focus on general banking services and basic financial information.',
            investments: 'Emphasize investment products, strategies, and market insights.',
            banking: 'Prioritize personal banking services, accounts, and card products.',
            'wealth-management': 'Focus on high-net-worth services, wealth planning, and premium offerings.'
          };
          
          const activeFocusAreas = buildModeConfig.focusAreas
            .map(area => focusInstructions[area])
            .filter(Boolean)
            .join(' ');
          
          if (activeFocusAreas) {
            buildModeContent += '\n\nCURRENT FOCUS AREAS: ' + activeFocusAreas;
          }
        }
        
        // Add custom instructions
        if (buildModeConfig.customInstructions && buildModeConfig.customInstructions.trim()) {
          buildModeContent += '\n\nCURRENT CUSTOM INSTRUCTIONS: ' + buildModeConfig.customInstructions;
        }
      }
      
      customSystemInstructions.content = buildModeContent;
    } else if (buildModeConfig) {
      // Apply build mode configuration in normal mode
      let customContent = systemInstructions.content;
      
      // Add response style instructions
      const styleInstructions = {
        professional: 'Maintain a formal, business-appropriate tone in all responses.',
        casual: 'Use a friendly, conversational tone while remaining helpful and informative.',
        detailed: 'Provide comprehensive, thorough responses with detailed explanations.',
        concise: 'Keep responses brief and to-the-point while covering essential information.'
      };
      
      if (styleInstructions[buildModeConfig.responseStyle]) {
        customContent += '\n\nRESPONSE STYLE: ' + styleInstructions[buildModeConfig.responseStyle];
      }
      
      // Add advanced modifiers for normal mode
      if (buildModeConfig.industryTerminology) {
        const terminologyInstructions = {
          simplified: 'Use simple, everyday language and avoid technical jargon. Explain financial terms in plain English.',
          standard: 'Use standard banking and financial terminology that most customers understand.',
          technical: 'Use precise financial and banking terminology. Include technical details and industry-specific language.',
          mixed: 'Balance between technical accuracy and accessibility. Use technical terms but provide explanations.'
        };
        
        if (terminologyInstructions[buildModeConfig.industryTerminology]) {
          customContent += '\n\nTERMINOLOGY LEVEL: ' + terminologyInstructions[buildModeConfig.industryTerminology];
        }
      }
      
      if (buildModeConfig.responseComplexity) {
        const complexityInstructions = {
          basic: 'Provide simple, straightforward explanations suitable for beginners. Focus on fundamental concepts.',
          moderate: 'Offer balanced explanations with moderate detail. Include context and examples.',
          advanced: 'Provide sophisticated analysis with detailed explanations. Include nuanced perspectives and implications.',
          adaptive: 'Adjust complexity based on the topic and user\'s apparent knowledge level.'
        };
        
        if (complexityInstructions[buildModeConfig.responseComplexity]) {
          customContent += '\n\nRESPONSE COMPLEXITY: ' + complexityInstructions[buildModeConfig.responseComplexity];
        }
      }
      
      if (buildModeConfig.interactionPattern) {
        const interactionInstructions = {
          responsive: 'Answer questions directly and wait for follow-up queries.',
          proactive: 'Anticipate user needs and offer additional relevant information or suggestions.',
          consultative: 'Act as a financial consultant, asking clarifying questions and providing strategic advice.',
          educational: 'Focus on teaching and explaining concepts. Provide learning opportunities and educational content.'
        };
        
        if (interactionInstructions[buildModeConfig.interactionPattern]) {
          customContent += '\n\nINTERACTION STYLE: ' + interactionInstructions[buildModeConfig.interactionPattern];
        }
      }
      
      // Add personalization settings for normal mode
      if (buildModeConfig.personalization) {
        const { experienceLevel, preferredExamples, communicationTone, followUpStyle } = buildModeConfig.personalization;
        
        if (experienceLevel) {
          const experienceInstructions = {
            beginner: 'Assume limited financial knowledge. Provide basic explanations and avoid assumptions about prior knowledge.',
            intermediate: 'Assume moderate financial literacy. Provide context for complex topics but don\'t over-explain basics.',
            advanced: 'Assume strong financial knowledge. Focus on sophisticated concepts and detailed analysis.',
            expert: 'Assume expert-level knowledge. Provide high-level insights and technical depth.'
          };
          
          if (experienceInstructions[experienceLevel]) {
            customContent += '\n\nUSER EXPERIENCE LEVEL: ' + experienceInstructions[experienceLevel];
          }
        }
        
        if (preferredExamples) {
          const exampleInstructions = {
            theoretical: 'Use theoretical examples and conceptual illustrations.',
            'real-world': 'Provide practical, real-world examples and scenarios.',
            'case-studies': 'Include detailed case studies and specific examples from actual situations.',
            mixed: 'Use a variety of example types depending on the topic and context.'
          };
          
          if (exampleInstructions[preferredExamples]) {
            customContent += '\n\nEXAMPLE PREFERENCE: ' + exampleInstructions[preferredExamples];
          }
        }
        
        if (communicationTone) {
          const toneInstructions = {
            formal: 'Maintain a formal, professional tone throughout all interactions.',
            balanced: 'Use a balanced tone that is professional yet approachable.',
            friendly: 'Adopt a warm, friendly tone while maintaining professionalism.',
            enthusiastic: 'Show enthusiasm and energy in responses while remaining informative.'
          };
          
          if (toneInstructions[communicationTone]) {
            customContent += '\n\nCOMMUNICATION TONE: ' + toneInstructions[communicationTone];
          }
        }
        
        if (followUpStyle) {
          const followUpInstructions = {
            minimal: 'Provide direct answers with minimal follow-up questions.',
            moderate: 'Include relevant follow-up questions when appropriate.',
            comprehensive: 'Actively suggest related topics and ask clarifying questions.',
            adaptive: 'Adjust follow-up style based on user engagement and topic complexity.'
          };
          
          if (followUpInstructions[followUpStyle]) {
            customContent += '\n\nFOLLOW-UP STYLE: ' + followUpInstructions[followUpStyle];
          }
        }
      }
      
      // Add template information if available
      if (buildModeConfig.selectedTemplate) {
        customContent += '\n\nACTIVE TEMPLATE: ' + buildModeConfig.selectedTemplate + ' - Optimized for this user profile.';
      }
      
      // Add focus area instructions
      if (buildModeConfig.focusAreas && buildModeConfig.focusAreas.length > 0) {
        const focusInstructions = {
          general: 'Focus on general banking services and basic financial information.',
          investments: 'Emphasize investment products, strategies, and market insights.',
          banking: 'Prioritize personal banking services, accounts, and card products.',
          'wealth-management': 'Focus on high-net-worth services, wealth planning, and premium offerings.'
        };
        
        const activeFocusAreas = buildModeConfig.focusAreas
          .map(area => focusInstructions[area])
          .filter(Boolean)
          .join(' ');
        
        if (activeFocusAreas) {
          customContent += '\n\nFOCUS AREAS: ' + activeFocusAreas;
        }
      }
      
      // Add custom instructions
      if (buildModeConfig.customInstructions && buildModeConfig.customInstructions.trim()) {
        customContent += '\n\nCUSTOM INSTRUCTIONS: ' + buildModeConfig.customInstructions;
      }
      
      customSystemInstructions.content = customContent;
    }
    
    // Search documents for relevant knowledge
    const userQuery = messages[messages.length - 1]?.content || '';
    const documentResults = searchDocuments(userQuery, 3);
    
    let contextSource = 'none';
    
    // Priority 1: Use knowledge base documents if found
    if (documentResults.length > 0) {
      const documentContext = formatSearchResults(documentResults);
      customSystemInstructions.content += '\n\n' + documentContext;
      contextSource = 'knowledge_base';
      console.log(`Found ${documentResults.length} relevant documents for query: "${userQuery}"`);
    } else {
      // Priority 2: Fallback to web scraping UBS website
      console.log('No relevant documents found, attempting web scraping...');
      
      try {
        const scrapedContent = await scrapeUBSContent(userQuery);
        
        if (scrapedContent) {
          const webContext = `\n\nRELEVANT UBS WEBSITE INFORMATION:\nSource: ${scrapedContent.url}\nTitle: ${scrapedContent.title}\nContent: ${scrapedContent.content}\n\nPlease use this information to answer the user's question about UBS Switzerland services.`;
          customSystemInstructions.content += webContext;
          contextSource = 'web_scraping';
          console.log(`Successfully scraped content from: ${scrapedContent.url}`);
        } else {
          console.log('Web scraping failed, using general knowledge only');
          contextSource = 'general_knowledge';
        }
      } catch (scrapingError) {
        console.error('Web scraping error:', scrapingError);
        console.log('Falling back to general knowledge only');
        contextSource = 'general_knowledge';
      }
    }
    
    // Add system instructions to the messages array
    const messagesWithInstructions = [customSystemInstructions, ...messages];
    
    // Use build mode parameters or defaults (optimized for speed)
    const temperature = buildModeConfig?.temperature || 0.4; // Reduced for faster, more focused responses
    const maxTokens = buildModeConfig?.maxTokens || 600; // Reduced for faster generation
    
    // Check if Groq client is available
    if (!groq) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: 'The chat service is currently unavailable. Please try again later.'
      });
    }

    // TODO: Consider implementing response streaming for even faster perceived response times
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithInstructions,
      model: "llama3-8b-8192", // Faster 8B model for improved response speed
      temperature: temperature, // Use customized temperature
      max_tokens: maxTokens, // Use customized max tokens
      top_p: 0.9 // More focused responses
    });
    
    console.log('Groq response:', chatCompletion); // Add response logging
    
    // Log the message content specifically to debug
    if (chatCompletion.choices && chatCompletion.choices[0] && chatCompletion.choices[0].message) {
      console.log('Message content:', chatCompletion.choices[0].message);
    }
    
    const response = {
      choices: [{
        message: {
          role: 'assistant',
          content: chatCompletion.choices[0].message.content
        }
      }],
      contextSource: contextSource // Track information source for transparency
    };
    
    // Add build mode update if needed
    if (buildModeUpdate) {
      response.buildModeUpdate = buildModeUpdate;
    }
    
    // Log the information source used
    console.log(`Response generated using: ${contextSource}`);
    
    res.json(response);
  } catch (error) {
    console.error('Detailed error:', error); // More detailed error logging
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    res.status(500).json({ 
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Proxy endpoint for fetching web content
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    console.log(`Proxying request to: ${url}`);
    
    // Validate URL format
    let validatedUrl;
    try {
      validatedUrl = new URL(url).toString();
      console.log(`Validated URL: ${validatedUrl}`);
    } catch (urlError) {
      console.error('URL validation error:', urlError.message);
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: urlError.message,
        url: url
      });
    }
    
    // Fetch the webpage content
    const response = await axios.get(validatedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10 second timeout
    });
    
    // Return the raw HTML content for now to debug the issue
    res.setHeader('Content-Type', 'text/html');
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Return a fallback HTML response for any error
    const fallbackHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Content Unavailable</title>
        <style>
            body { font-family: 'Frutiger', Arial, sans-serif; padding: 20px; }
            .error { color: #666; text-align: center; margin-top: 50px; }
        </style>
    </head>
    <body>
        <div class="error">
            <h2>Content Temporarily Unavailable</h2>
            <p>The requested content could not be loaded at this time.</p>
            <p>URL: ${url}</p>
             <p>Error: ${error.message}</p>
        </div>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(fallbackHtml);
  }
});

// Stock symbol to company name mapping for accuracy
const stockMapping = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'GOOG': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'META': 'Meta Platforms Inc.',
  'NVDA': 'NVIDIA Corporation',
  'NFLX': 'Netflix Inc.',
  'AMD': 'Advanced Micro Devices Inc.',
  'CRM': 'Salesforce Inc.',
  'ORCL': 'Oracle Corporation',
  'ADBE': 'Adobe Inc.',
  'PYPL': 'PayPal Holdings Inc.',
  'INTC': 'Intel Corporation',
  'CSCO': 'Cisco Systems Inc.',
  'PEP': 'PepsiCo Inc.',
  'AVGO': 'Broadcom Inc.',
  'TXN': 'Texas Instruments Inc.',
  'QCOM': 'QUALCOMM Inc.',
  'COST': 'Costco Wholesale Corporation',
  'JNJ': 'Johnson & Johnson',
  'WMT': 'Walmart Inc.',
  'V': 'Visa Inc.',
  'MA': 'Mastercard Inc.',
  'UNH': 'UnitedHealth Group Inc.',
  'HD': 'The Home Depot Inc.',
  'PG': 'Procter & Gamble Co.',
  'JPM': 'JPMorgan Chase & Co.',
  'BAC': 'Bank of America Corp.',
  'XOM': 'Exxon Mobil Corporation',
  'CVX': 'Chevron Corporation',
  'KO': 'The Coca-Cola Company',
  'PFE': 'Pfizer Inc.',
  'ABBV': 'AbbVie Inc.',
  'TMO': 'Thermo Fisher Scientific Inc.',
  'ACN': 'Accenture plc',
  'LLY': 'Eli Lilly and Company',
  'ASML': 'ASML Holding N.V.',
  'CHL': 'China Mobile Limited',
  'NVO': 'Novo Nordisk A/S',
  'TM': 'Toyota Motor Corporation',
  'AZN': 'AstraZeneca PLC',
  'SHEL': 'Shell plc',
  'BHP': 'BHP Group Limited'
};

// Individual stock data endpoint
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();
    console.log(`Fetching stock data for: ${upperSymbol}`);
    
    // Get the correct company name from mapping
    const companyName = stockMapping[upperSymbol] || `${upperSymbol} Corporation`;
    
    // Use Groq to generate realistic stock data for the specific symbol
    const stockPrompt = `Generate realistic detailed stock market data for the stock symbol "${upperSymbol}". This is ${companyName}. Use current market knowledge and realistic values based on the actual company.

IMPORTANT: Use these EXACT company details:
- Symbol: ${upperSymbol}
- Company Name: ${companyName}

Return ONLY a valid JSON object in this exact format:
{
  "symbol": "${upperSymbol}",
  "name": "${companyName}",
  "price": "123.45",
  "change": "+2.34",
  "changePercent": "+1.94%",
  "volume": "1,234,567",
  "marketCap": "1.23T",
  "peRatio": "25.4",
  "high52Week": "180.25",
  "low52Week": "120.15",
  "dividendYield": "1.2%",
  "beta": "1.15",
  "eps": "4.85"
}

Requirements:
- Use EXACTLY: Symbol "${upperSymbol}" and Name "${companyName}"
- Generate realistic prices based on the actual company's typical trading range
- For major tech stocks (AAPL, MSFT, GOOGL): prices typically $100-400
- For NVDA: prices typically $400-900
- For TSLA: prices typically $150-300
- Include realistic market cap based on company size
- Change can be positive or negative (between -8% and +8%)
- Return ONLY the JSON object, no other text or explanation
- All values should reflect current market conditions for this specific company`;
    
    // Check if Groq client is available
    if (!groq) {
      throw new Error('AI service temporarily unavailable');
    }
    
    const groqResponse = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: stockPrompt
      }],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 800
    });
    
    const generatedContent = groqResponse.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No response from Groq');
    }
    
    // Clean and parse the JSON response
    let cleanedContent = generatedContent.trim();
    cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const stockData = JSON.parse(cleanedContent);
    
    console.log(`Successfully generated stock data for ${upperSymbol} using Groq AI`);
    return res.json({ ...stockData, source: 'groq_ai' });
    
  } catch (error) {
    console.error(`Error fetching stock data for ${req.params.symbol}:`, error.message);
    
    // Return fallback data for the requested symbol with accurate company name
    const upperSymbol = req.params.symbol.toUpperCase();
    const companyName = stockMapping[upperSymbol] || `${upperSymbol} Corporation`;
    
    // Generate more realistic price ranges based on company type
    let basePrice = 100;
    if (['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META'].includes(upperSymbol)) {
      basePrice = Math.random() * 300 + 100; // $100-400 range
    } else if (upperSymbol === 'NVDA') {
      basePrice = Math.random() * 500 + 400; // $400-900 range
    } else if (upperSymbol === 'TSLA') {
      basePrice = Math.random() * 150 + 150; // $150-300 range
    } else {
      basePrice = Math.random() * 200 + 50; // $50-250 range
    }
    
    const fallbackData = {
      symbol: upperSymbol,
      name: companyName,
      price: basePrice.toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: `${(Math.random() * 6 - 3).toFixed(2)}%`,
      volume: `${Math.floor(Math.random() * 10000000).toLocaleString()}`,
      marketCap: `${(Math.random() * 500 + 50).toFixed(1)}B`,
      peRatio: (Math.random() * 30 + 10).toFixed(1),
      high52Week: (basePrice * 1.3).toFixed(2),
      low52Week: (basePrice * 0.7).toFixed(2),
      dividendYield: `${(Math.random() * 3).toFixed(1)}%`,
      beta: (Math.random() * 1.5 + 0.5).toFixed(2),
      eps: (Math.random() * 10 + 1).toFixed(2),
      source: 'fallback_data',
      error: 'Using fallback data - API temporarily unavailable'
    };
    
    res.json(fallbackData);
  }
});

// Store previous prices to maintain $5 range constraint
let previousPrices = {
  'AAPL': 175.43, 'MSFT': 378.85, 'GOOGL': 142.56, 'AMZN': 151.23, 'TSLA': 248.42,
  'META': 331.26, 'NVDA': 875.28, 'NFLX': 445.67, 'AMD': 142.89, 'CRM': 267.45,
  'ORCL': 118.34, 'ADBE': 589.12, 'PYPL': 62.78, 'INTC': 43.21, 'CSCO': 51.89,
  'PEP': 171.23, 'AVGO': 1234.56, 'TXN': 189.67, 'QCOM': 152.34, 'COST': 789.12
};

// Function to constrain price within $5 range
function constrainPrice(newPrice, previousPrice) {
  const maxChange = 5.0;
  const minPrice = previousPrice - maxChange;
  const maxPrice = previousPrice + maxChange;
  return Math.max(minPrice, Math.min(maxPrice, newPrice));
}

// Groq AI endpoint for generating realistic stock data
app.get('/api/stocks/active', async (req, res) => {
  try {
    console.log('Generating realistic stock data using Groq AI...');
    
    // Use Groq to generate realistic current stock data
    const stockGenerationPrompt = `Generate realistic stock market data for the 20 most actively traded stocks today. Use current market knowledge and realistic price ranges.

Return ONLY a valid JSON array of exactly 20 stock objects in this exact format:
[{"symbol": "AAPL", "price": "175.43", "changePercent": "+1.24%"}, {"symbol": "MSFT", "price": "378.85", "changePercent": "-0.32%"}]

Requirements:
- Use real, well-known stock symbols (AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, etc.)
- Generate realistic current prices based on recent market trends
- Include realistic change percentages (between -5% and +5%)
- Mix of positive and negative changes
- Return exactly 20 stocks
- Return ONLY the JSON array, no other text or explanation

Focus on the most actively traded stocks from major exchanges (NYSE, NASDAQ).`;
    
    // Check if Groq client is available
    if (!groq) {
      throw new Error('AI service temporarily unavailable');
    }
    
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: stockGenerationPrompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1500
    });
    
    const generatedContent = groqResponse.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No response from Groq');
    }
    
    // Clean and parse the JSON response
    let cleanedContent = generatedContent.trim();
    // Remove any markdown code blocks if present
    cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let stocksData;
    try {
      stocksData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Content that failed to parse:', cleanedContent);
      throw new Error('Failed to parse stock data from Groq response');
    }
    
    if (!stocksData || !Array.isArray(stocksData) || stocksData.length === 0) {
      console.error('Invalid stocksData:', stocksData);
      throw new Error('Invalid stock data format');
    }
    
    // Apply $5 range constraint to generated prices
    const constrainedStocks = stocksData.map(stock => {
      const currentPrice = parseFloat(stock.price);
      const previousPrice = previousPrices[stock.symbol] || currentPrice;
      const constrainedPrice = constrainPrice(currentPrice, previousPrice);
      
      // Update previous price for next iteration
      previousPrices[stock.symbol] = constrainedPrice;
      
      // Calculate new change percentage based on constrained price
      const changeAmount = constrainedPrice - previousPrice;
      const changePercent = ((changeAmount / previousPrice) * 100).toFixed(2);
      const changePercentStr = changeAmount >= 0 ? `+${changePercent}%` : `${changePercent}%`;
      
      return {
        ...stock,
        price: constrainedPrice.toFixed(2),
        changePercent: changePercentStr
      };
    });
    
    console.log(`Successfully generated ${constrainedStocks.length} realistic stocks using Groq AI with $5 range constraint`);
    return res.json({ stocks: constrainedStocks.slice(0, 20), source: 'groq_ai' });
    
  } catch (error) {
    console.error('Web search + Groq error:', error.message);
    
    // Generate fallback data with $5 range constraint
    const baseFallbackStocks = [
      { symbol: 'AAPL', price: '175.43', changePercent: '+1.24%' },
      { symbol: 'MSFT', price: '378.85', changePercent: '-0.32%' },
      { symbol: 'GOOGL', price: '142.56', changePercent: '+2.48%' },
      { symbol: 'AMZN', price: '151.23', changePercent: '-0.57%' },
      { symbol: 'TSLA', price: '248.42', changePercent: '+5.23%' },
      { symbol: 'META', price: '331.26', changePercent: '+1.40%' },
      { symbol: 'NVDA', price: '875.28', changePercent: '+1.82%' },
      { symbol: 'NFLX', price: '445.67', changePercent: '-0.52%' },
      { symbol: 'AMD', price: '142.89', changePercent: '+2.30%' },
      { symbol: 'CRM', price: '267.45', changePercent: '+0.71%' },
      { symbol: 'ORCL', price: '118.34', changePercent: '-0.38%' },
      { symbol: 'ADBE', price: '589.12', changePercent: '+1.24%' },
      { symbol: 'PYPL', price: '62.78', changePercent: '+2.36%' },
      { symbol: 'INTC', price: '43.21', changePercent: '-1.53%' },
      { symbol: 'CSCO', price: '51.89', changePercent: '+0.66%' },
      { symbol: 'PEP', price: '171.23', changePercent: '+0.52%' },
      { symbol: 'AVGO', price: '1234.56', changePercent: '+1.94%' },
      { symbol: 'TXN', price: '189.67', changePercent: '-0.64%' },
      { symbol: 'QCOM', price: '152.34', changePercent: '+1.78%' },
      { symbol: 'COST', price: '789.12', changePercent: '+0.58%' }
    ];
    
    // Apply $5 range constraint to fallback data
    const fallbackStocks = baseFallbackStocks.map(stock => {
      const currentPrice = parseFloat(stock.price);
      const previousPrice = previousPrices[stock.symbol] || currentPrice;
      
      // Generate a small random change within $5 range
      const randomChange = (Math.random() - 0.5) * 10; // Random change between -5 and +5
      const newPrice = previousPrice + randomChange;
      const constrainedPrice = constrainPrice(newPrice, previousPrice);
      
      // Update previous price for next iteration
      previousPrices[stock.symbol] = constrainedPrice;
      
      // Calculate change percentage based on constrained price
      const changeAmount = constrainedPrice - previousPrice;
      const changePercent = ((changeAmount / previousPrice) * 100).toFixed(2);
      const changePercentStr = changeAmount >= 0 ? `+${changePercent}%` : `${changePercent}%`;
      
      return {
        ...stock,
        price: constrainedPrice.toFixed(2),
        changePercent: changePercentStr
      };
    });
    
    res.json({ 
      stocks: fallbackStocks,
      fallback: true,
      source: 'fallback_data',
      error: 'Using fallback data - financial APIs temporarily unavailable'
    });
  }
});

// API endpoint for active stocks (alias for /api/stocks/active)
app.get('/api/active-stocks', async (req, res) => {
  try {
    console.log('Redirecting /api/active-stocks to /api/stocks/active');
    
    // Use the existing stocks/active endpoint logic
    const stockGenerationPrompt = `Generate realistic stock market data for the 20 most actively traded stocks today. Use current market knowledge and realistic price ranges.

Return ONLY a valid JSON array of exactly 20 stock objects in this exact format:
[{"symbol": "AAPL", "price": "175.43", "changePercent": "+1.24%"}, {"symbol": "MSFT", "price": "378.85", "changePercent": "-0.32%"}]

Requirements:
- Use real, well-known stock symbols (AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, etc.)
- Generate realistic current prices based on recent market trends
- Include realistic change percentages (between -5% and +5%)
- Mix of positive and negative changes
- Return exactly 20 stocks
- Return ONLY the JSON array, no other text or explanation

Focus on the most actively traded stocks from major exchanges (NYSE, NASDAQ).`;
    
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: stockGenerationPrompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 1500
    });
    
    const generatedContent = groqResponse.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No response from Groq');
    }
    
    // Clean and parse the JSON response
    let cleanedContent = generatedContent.trim();
    cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let stocksData;
    try {
      stocksData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      throw new Error('Failed to parse stock data from Groq response');
    }
    
    if (!stocksData || !Array.isArray(stocksData) || stocksData.length === 0) {
      throw new Error('Invalid stock data format');
    }
    
    // Apply $5 range constraint to generated prices
    const constrainedStocks = stocksData.map(stock => {
      const currentPrice = parseFloat(stock.price);
      const previousPrice = previousPrices[stock.symbol] || currentPrice;
      const constrainedPrice = constrainPrice(currentPrice, previousPrice);
      
      // Update previous price for next iteration
      previousPrices[stock.symbol] = constrainedPrice;
      
      // Calculate new change percentage based on constrained price
      const changeAmount = constrainedPrice - previousPrice;
      const changePercent = ((changeAmount / previousPrice) * 100).toFixed(2);
      const changePercentStr = changeAmount >= 0 ? `+${changePercent}%` : `${changePercent}%`;
      
      return {
        ...stock,
        price: constrainedPrice.toFixed(2),
        changePercent: changePercentStr
      };
    });
    
    console.log(`Successfully generated ${constrainedStocks.length} realistic stocks using Groq AI`);
    return res.json({ stocks: constrainedStocks.slice(0, 20), source: 'groq_ai' });
    
  } catch (error) {
    console.error('Active stocks error:', error.message);
    
    // Generate fallback data
    const baseFallbackStocks = [
      { symbol: 'AAPL', price: '175.43', changePercent: '+1.24%' },
      { symbol: 'MSFT', price: '378.85', changePercent: '-0.32%' },
      { symbol: 'GOOGL', price: '142.56', changePercent: '+2.48%' },
      { symbol: 'AMZN', price: '151.23', changePercent: '-0.57%' },
      { symbol: 'TSLA', price: '248.42', changePercent: '+5.23%' },
      { symbol: 'META', price: '331.26', changePercent: '+1.40%' },
      { symbol: 'NVDA', price: '875.28', changePercent: '+1.82%' },
      { symbol: 'NFLX', price: '445.67', changePercent: '-0.52%' },
      { symbol: 'AMD', price: '142.89', changePercent: '+2.30%' },
      { symbol: 'CRM', price: '267.45', changePercent: '+0.71%' }
    ];
    
    // Apply $5 range constraint to fallback data
    const fallbackStocks = baseFallbackStocks.map(stock => {
      const currentPrice = parseFloat(stock.price);
      const previousPrice = previousPrices[stock.symbol] || currentPrice;
      
      const randomChange = (Math.random() - 0.5) * 10;
      const newPrice = previousPrice + randomChange;
      const constrainedPrice = constrainPrice(newPrice, previousPrice);
      
      previousPrices[stock.symbol] = constrainedPrice;
      
      const changeAmount = constrainedPrice - previousPrice;
      const changePercent = ((changeAmount / previousPrice) * 100).toFixed(2);
      const changePercentStr = changeAmount >= 0 ? `+${changePercent}%` : `${changePercent}%`;
      
      return {
        ...stock,
        price: constrainedPrice.toFixed(2),
        changePercent: changePercentStr
      };
    });
    
    res.json({ 
      stocks: fallbackStocks,
      fallback: true,
      source: 'fallback_data',
      error: 'Using fallback data - financial APIs temporarily unavailable'
    });
  }
});

// API endpoint for generating dynamic financial news using Groq
app.get('/api/news/financial', async (req, res) => {
  let retryCount = 0;
  const maxRetries = 2;
  
  while (retryCount <= maxRetries) {
    try {
      console.log(`Generating financial news using Groq AI... (attempt ${retryCount + 1})`);
      
      const newsPrompt = `You must respond with ONLY a valid JSON array. No explanations, no text before or after. Just the JSON array.

Generate exactly 5 realistic financial news articles. Return this exact JSON structure:
[
  {
    "title": "Article headline",
    "source": "Bloomberg",
    "time": "2h ago",
    "summary": "Brief summary"
  }
]

Base articles on December 2024 financial developments: Fed rate cuts, ECB growth projections, China stimulus, OPEC+ output, European market rallies.

Respond with ONLY the JSON array, nothing else.`;

      // Check if Groq client is available
      if (!groq) {
        throw new Error('AI service temporarily unavailable');
      }

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: newsPrompt }],
        model: 'llama3-70b-8192',
        temperature: 0.3,
        max_tokens: 800
      });

    let content = completion.choices[0].message.content.trim();
    
    // Clean up the response to extract JSON
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // More robust JSON extraction
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    // Additional cleanup for common JSON formatting issues
    content = content.replace(/,\s*\]/g, ']'); // Remove trailing commas before ]
    content = content.replace(/,\s*\}/g, '}'); // Remove trailing commas before }
    content = content.replace(/\n/g, ' '); // Replace newlines with spaces
    content = content.replace(/\s+/g, ' '); // Normalize whitespace
    
    let newsData;
    try {
      newsData = JSON.parse(content);
    } catch (parseError) {
      console.error('News JSON parse error:', parseError.message);
      console.error('Content that failed to parse:', content);
      throw new Error('Failed to parse news data from Groq response');
    }
    
    if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
      console.error('Invalid newsData:', newsData);
      throw new Error('Invalid news data format');
    }

      console.log(`Successfully generated ${newsData.length} financial news articles using Groq AI`);
      return res.json({ articles: newsData.slice(0, 5), source: 'groq_ai' });
      
    } catch (error) {
      console.error(`Groq news generation error (attempt ${retryCount + 1}):`, error.message);
      retryCount++;
      
      if (retryCount > maxRetries) {
        break;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // If all retries failed, return fallback data
  console.log('All Groq attempts failed, using fallback news data');
    
    // Return realistic fallback news based on real December 2024 events
    const fallbackNews = [
      {
        title: "Fed Maintains Cautious Stance on 2025 Rate Cuts Amid Inflation Concerns",
        source: "Bloomberg",
        time: "2h ago",
        summary: "Federal Reserve officials signal measured approach to further rate reductions as core inflation remains above target levels."
      },
      {
        title: "ECB Revises Eurozone Growth Forecast Lower on Trade Policy Uncertainty",
        source: "Bloomberg",
        time: "4h ago",
        summary: "European Central Bank cuts 2025 GDP growth projection to 0.9% citing persistent geopolitical and policy headwinds."
      },
      {
        title: "China's Stimulus Measures Boost European Luxury Stocks to Multi-Month Highs",
        source: "Bloomberg",
        time: "6h ago",
        summary: "LVMH and Hermès surge as Beijing's fiscal support measures fuel optimism for Chinese consumer demand recovery."
      },
      {
        title: "Oil Prices Decline as OPEC+ Proceeds with December Production Increase",
        source: "Bloomberg",
        time: "8h ago",
        summary: "Crude futures drop to two-week lows after cartel confirms plans to boost output despite global demand concerns."
      },
      {
        title: "European Markets Rally on China Policy Support, Mining Stocks Lead Gains",
        source: "Bloomberg",
        time: "10h ago",
        summary: "Euro Stoxx 600 reaches new highs as Chinese stimulus measures drive commodity prices and mining sector optimism."
      }
    ];
    
    res.json({ 
      articles: fallbackNews,
      fallback: true,
      source: 'fallback_data',
      error: 'Using fallback data - Groq API temporarily unavailable'
    });
});

// API endpoint for top 20 cryptocurrencies
app.get('/api/crypto/top20', async (req, res) => {
  try {
    const prompt = `You must respond with ONLY valid JSON. No explanations, no text before or after. Just the JSON object.

Generate realistic data for the top 20 cryptocurrencies by market cap. Return this exact JSON structure:
{
  "cryptos": [
    {
      "rank": 1,
      "symbol": "BTC",
      "name": "Bitcoin",
      "price": "43250.00",
      "changePercent": "+2.45%",
      "marketCap": "845.2B"
    }
  ]
}

Include these exact cryptocurrencies in order: BTC (Bitcoin), ETH (Ethereum), USDT (Tether), BNB (BNB), SOL (Solana), USDC (USD Coin), XRP (XRP), STETH (Lido Staked Ether), TON (Toncoin), DOGE (Dogecoin), ADA (Cardano), AVAX (Avalanche), SHIB (Shiba Inu), TRX (TRON), DOT (Polkadot), BCH (Bitcoin Cash), NEAR (NEAR Protocol), MATIC (Polygon), LTC (Litecoin), UNI (Uniswap).

Use realistic current market prices and 24h changes (mix of positive and negative). Market caps should reflect actual relative sizes.

Respond with ONLY the JSON object, nothing else.`;

    // Check if Groq client is available
    if (!groq) {
      throw new Error('AI service temporarily unavailable');
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Clean and parse the JSON response
    let cleanedContent = content.replace(/```json\n?|```\n?/g, '').trim();
    
    // Try to extract JSON object if there's extra text
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    }
    
    const cryptoData = JSON.parse(cleanedContent);
    
    console.log(`Successfully generated crypto data using Groq AI`);
    return res.json({ ...cryptoData, source: 'groq_ai' });
    
  } catch (error) {
    console.error(`Error fetching crypto data:`, error.message);
    
    // Return fallback crypto data
    const fallbackCryptos = [
      { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: '43250.00', changePercent: '+2.45%', marketCap: '845.2B' },
      { rank: 2, symbol: 'ETH', name: 'Ethereum', price: '2650.00', changePercent: '+1.23%', marketCap: '318.5B' },
      { rank: 3, symbol: 'USDT', name: 'Tether', price: '1.00', changePercent: '+0.01%', marketCap: '95.8B' },
      { rank: 4, symbol: 'BNB', name: 'BNB', price: '315.50', changePercent: '-0.87%', marketCap: '47.2B' },
      { rank: 5, symbol: 'SOL', name: 'Solana', price: '98.75', changePercent: '+3.21%', marketCap: '42.1B' },
      { rank: 6, symbol: 'USDC', name: 'USD Coin', price: '1.00', changePercent: '+0.00%', marketCap: '25.3B' },
      { rank: 7, symbol: 'XRP', name: 'XRP', price: '0.52', changePercent: '-1.45%', marketCap: '28.7B' },
      { rank: 8, symbol: 'STETH', name: 'Lido Staked Ether', price: '2645.00', changePercent: '+1.18%', marketCap: '24.8B' },
      { rank: 9, symbol: 'TON', name: 'Toncoin', price: '2.35', changePercent: '+4.67%', marketCap: '8.1B' },
      { rank: 10, symbol: 'DOGE', name: 'Dogecoin', price: '0.085', changePercent: '+2.34%', marketCap: '12.1B' },
      { rank: 11, symbol: 'ADA', name: 'Cardano', price: '0.48', changePercent: '-0.92%', marketCap: '16.8B' },
      { rank: 12, symbol: 'AVAX', name: 'Avalanche', price: '36.50', changePercent: '+1.87%', marketCap: '14.2B' },
      { rank: 13, symbol: 'SHIB', name: 'Shiba Inu', price: '0.000024', changePercent: '+5.23%', marketCap: '14.1B' },
      { rank: 14, symbol: 'TRX', name: 'TRON', price: '0.105', changePercent: '+0.67%', marketCap: '9.2B' },
      { rank: 15, symbol: 'DOT', name: 'Polkadot', price: '7.25', changePercent: '-2.14%', marketCap: '9.8B' },
      { rank: 16, symbol: 'BCH', name: 'Bitcoin Cash', price: '245.00', changePercent: '+1.56%', marketCap: '4.8B' },
      { rank: 17, symbol: 'NEAR', name: 'NEAR Protocol', price: '3.45', changePercent: '+3.89%', marketCap: '3.7B' },
      { rank: 18, symbol: 'MATIC', name: 'Polygon', price: '0.85', changePercent: '-1.23%', marketCap: '7.9B' },
      { rank: 19, symbol: 'LTC', name: 'Litecoin', price: '72.50', changePercent: '+0.45%', marketCap: '5.4B' },
      { rank: 20, symbol: 'UNI', name: 'Uniswap', price: '6.75', changePercent: '+2.67%', marketCap: '4.1B' }
    ];
    
    res.json({
      cryptos: fallbackCryptos,
      source: 'fallback_data',
      error: 'Using fallback data - API temporarily unavailable'
    });
  }
});

// Market overview endpoint for news data
app.get('/api/market-overview', async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    // Always return fallback news data for now since this endpoint is expected to return news articles
    const fallbackNews = [
      {
        title: "Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty",
        description: "The Federal Reserve hints at possible interest rate reductions as inflation shows signs of cooling and economic growth moderates.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Reuters",
        time: "2 hours ago"
      },
      {
        title: "Tech Stocks Rally on AI Investment Surge",
        description: "Major technology companies see significant gains as artificial intelligence investments drive market optimism.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Bloomberg",
        time: "4 hours ago"
      },
      {
        title: "Energy Sector Volatility Continues Amid Global Supply Concerns",
        description: "Oil and gas prices fluctuate as geopolitical tensions and supply chain disruptions impact global energy markets.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Financial Times",
        time: "6 hours ago"
      },
      {
        title: "Banking Sector Shows Resilience Despite Credit Concerns",
        description: "Major banks report stable earnings while navigating changing interest rate environment and credit market conditions.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Wall Street Journal",
        time: "8 hours ago"
      },
      {
        title: "Consumer Spending Patterns Shift as Inflation Pressures Ease",
        description: "Retail data indicates changing consumer behavior as price pressures moderate across key spending categories.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "CNBC",
        time: "10 hours ago"
      }
    ];
    
    res.json({
      articles: fallbackNews,
      fallback: !apiKey,
      source: 'mock_data'
    });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    
    // Return fallback data even on error
    const fallbackNews = [{
      title: 'Market Update',
      description: 'Financial markets showing mixed signals today.',
      url: '#',
      publishedAt: new Date().toISOString()
    }];
    
    res.json({
      articles: fallbackNews,
      fallback: true,
      source: 'fallback_data',
      error: 'Failed to fetch market data'
    });
  }
});

// MCP API endpoint for Puppeteer integration (temporarily disabled for Railway debugging)
app.post('/api/mcp', async (req, res) => {
  try {
    const { server_name, tool_name, args } = req.body;
    
    // Validate request parameters
    if (!server_name || !tool_name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Only allow Puppeteer MCP server for security
    if (server_name !== 'mcp.config.usrlocalmcp.Puppeteer') {
      return res.status(403).json({ error: 'Unauthorized MCP server' });
    }
    
    console.log(`MCP request: ${server_name} / ${tool_name}`, args);
    
    // Temporarily disable Puppeteer for Railway debugging
    console.log('Puppeteer temporarily disabled for Railway debugging');
    return handleSimulatedResponse(tool_name, args, res);
    
    /*
    // Initialize browser if not already running
    let browser;
    try {
      // Use Puppeteer's bundled Chromium for better compatibility
      const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ];
      
      browser = await puppeteer.launch({
        headless: true,
        args: launchArgs
      });
    } catch (err) {
      console.error('Failed to launch browser:', err);
      // Fallback to simulated responses if browser can't be launched
      return handleSimulatedResponse(tool_name, args, res);
    }
    */
    
    /*
    try {
      // Get existing page or create a new one
      const pages = await browser.pages();
      const page = pages.length > 0 ? pages[0] : await browser.newPage();
      
      let result;
      
      switch (tool_name) {
        case 'puppeteer_navigate':
          await page.goto(args.url, { waitUntil: 'networkidle2', timeout: 30000 });
          result = { success: true, url: args.url };
          break;
          
        case 'puppeteer_screenshot':
          // Set viewport size if provided
          if (args.width && args.height) {
            await page.setViewport({ width: args.width, height: args.height });
          }
          
          // Take screenshot
          const screenshot = await page.screenshot({ 
            fullPage: false,
            encoding: args.encoded ? 'base64' : 'binary'
          });
          
          result = { 
            success: true, 
            name: args.name,
            data: args.encoded 
              ? `data:image/png;base64,${screenshot}`
              : screenshot
          };
          break;
          
        case 'puppeteer_click':
          await page.click(args.selector);
          result = { success: true, selector: args.selector };
          break;
          
        case 'puppeteer_fill':
          await page.type(args.selector, args.value);
          result = { success: true, selector: args.selector, value: args.value };
          break;
          
        case 'puppeteer_evaluate':
          const evalResult = await page.evaluate(args.script);
          result = { success: true, result: evalResult };
          break;
          
        default:
          await browser.close();
          return res.status(400).json({ error: `Unsupported tool: ${tool_name}` });
      }
      
      // Don't close browser between requests to maintain state
      // In a production app, you'd want to implement a browser management system
      
      res.json(result);
    } catch (err) {
      console.error(`Error in ${tool_name}:`, err);
      await browser.close();
      res.status(500).json({ error: err.message });
    }
    */
  } catch (error) {
    console.error('MCP API error:', error);
    res.status(500).json({ 
      error: error.message,
      name: error.name
    });
  }
});

// Fallback function for simulated responses when browser can't be launched
function handleSimulatedResponse(tool_name, args, res) {
  console.log('Using simulated response for', tool_name);
  let result;
  
  switch (tool_name) {
    case 'puppeteer_navigate':
      result = { success: true, url: args.url, simulated: true };
      break;
      
    case 'puppeteer_screenshot':
      result = { 
        success: true, 
        name: args.name,
        simulated: true,
        // Base64 encoded placeholder image
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAD6CAYAAAAbbXrzAAAABmJLR0QA/wD/AP+gvaeTAAAFbUlEQVR4nO3WMQEAIAzAMMC/5+GiHCQKenXPzAKgcF4HAPyysABMFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQWFkBiYQEkFhZAYmEBJBYWQGJhASQfFxoG/IiMv0YAAAAASUVORK5CYII='
      };
      break;
      
    case 'puppeteer_click':
      result = { success: true, selector: args.selector, simulated: true };
      break;
      
    case 'puppeteer_fill':
      result = { success: true, selector: args.selector, value: args.value, simulated: true };
      break;
      
    case 'puppeteer_evaluate':
      result = { success: true, result: null, simulated: true };
      break;
      
    default:
      return res.status(400).json({ error: `Unsupported tool: ${tool_name}` });
  }
  
  res.json(result);
}

// Health check endpoint (minimal, always available)
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested from:', req.ip);
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    port: port,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Minimal test endpoint for Railway debugging
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint requested from:', req.ip);
  res.status(200).json({ 
    message: 'Railway test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port,
    host: '0.0.0.0',
    platform: process.platform,
    nodeVersion: process.version
  });
});

// Root endpoint for basic connectivity test
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested from:', req.ip);
  res.status(200).json({ 
    message: 'UBS API Server is running',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/test', '/api/ready'],
    version: '1.0.0'
  });
});

// Readiness endpoint (checks full initialization)
app.get('/api/ready', (req, res) => {
  console.log('🔍 Readiness check requested from:', req.ip);
  res.status(200).json({
    status: knowledgeBaseReady ? 'ready' : 'initializing',
    timestamp: new Date().toISOString(),
    knowledgeBase: knowledgeBaseReady,
    uptime: process.uptime()
  });
});

// Start server after ensuring basic setup is complete
// Updated to trigger Railway redeploy after YAML fixes
function startServer() {
  const serverStartTime = Date.now();
  
  console.log('🚀 Railway deployment - verbose logging enabled');
  console.log('📍 Environment variables:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('  - PORT:', process.env.PORT || 'not set (using default)');
  console.log('  - Platform:', process.platform);
  console.log('  - Node version:', process.version);
  
  app.listen(port, '0.0.0.0', () => {
    const startupTime = Date.now() - serverStartTime;
    console.log(`🌐 Server running on port ${port} (started in ${startupTime}ms)`);
    console.log(`📊 Health endpoint: /api/health (minimal, always available)`);
    console.log(`🔍 Readiness endpoint: /api/ready (checks full initialization)`);
    console.log(`🧪 Test endpoint: /test (Railway debugging)`);
    console.log(`🏠 Root endpoint: / (basic connectivity)`);
    console.log(`📚 Knowledge base status: ${knowledgeBaseReady ? '✅ Ready' : '⏳ Initializing...'}`);
    
    if (!knowledgeBaseReady) {
      console.log('ℹ️  Server started with graceful degradation - basic endpoints available immediately');
    }
  });
}

// Start server immediately (knowledge base loads in background)
console.log('⚡ Starting server immediately with graceful degradation...');
startServer();

// Export the Express app for Vercel serverless functions
export default app;
import React, { useState, useEffect } from 'react';
import './FinancialEducator.css';
import { API_CONFIG, buildApiUrl } from '../config/api';

const FinancialEducator = ({ autoSearchTerm = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Auto-search when autoSearchTerm prop is provided
  useEffect(() => {
    if (autoSearchTerm && autoSearchTerm.trim()) {
      setSearchTerm(autoSearchTerm);
      // Trigger search automatically
      performSearch(autoSearchTerm);
    }
  }, [autoSearchTerm]);

  // Predefined financial terms database
  const financialTerms = {
    'compound interest': {
      definition: 'Interest calculated on both the initial principal and accumulated interest from previous periods.',
      explanation: 'Compound interest creates a snowball effect where your money grows faster over time because you earn interest on your interest. This powerful concept means that starting early with investments can dramatically increase your wealth due to the compounding effect.',
      example: 'If you invest CHF 1,000 at 5% annual compound interest, you\'ll have CHF 1,050 after year one. In year two, you earn 5% on the full CHF 1,050, giving you CHF 1,102.50 instead of just CHF 1,100.',
      similarTerms: ['exponential growth', 'compounding returns', 'interest on interest', 'snowball effect', 'time value of money'],
      category: 'Investment'
    },
    'diversification': {
      definition: 'A risk management strategy that spreads investments across various assets to reduce overall portfolio risk.',
      explanation: 'Diversification follows the principle of not putting all your eggs in one basket. By investing in different asset classes, industries, and geographic regions, you protect yourself from significant losses if one investment performs poorly.',
      example: 'Instead of buying only tech stocks, a diversified portfolio might include 40% stocks, 30% bonds, 20% real estate, and 10% commodities. This way, if tech stocks crash, your other investments can help cushion the blow.',
      similarTerms: ['portfolio allocation', 'risk spreading', 'asset mix', 'investment variety', 'risk reduction'],
      category: 'Investment'
    },
    'liquidity': {
      definition: 'The ease and speed with which an asset can be converted to cash without significantly affecting its market price.',
      explanation: 'Liquidity determines how quickly you can access your money when needed. High liquidity means you can convert investments to cash almost immediately, while low liquidity might require weeks or months.',
      example: 'Your savings account has high liquidity because you can withdraw money instantly at an ATM. Real estate has low liquidity because selling a property typically takes several months and involves significant transaction costs.',
      similarTerms: ['cash conversion', 'marketability', 'accessibility', 'convertibility', 'cash equivalence'],
      category: 'Banking'
    },
    'credit score': {
      definition: 'A numerical rating that represents an individual\'s creditworthiness based on their credit history and financial behavior.',
      explanation: 'Your credit score acts as a financial report card that lenders use to assess the risk of lending you money. A higher score indicates you\'re more likely to repay debts on time, leading to better loan terms and interest rates.',
      example: 'In Switzerland, credit scores range from 1-6, with 1 being excellent and 6 being poor. Someone with a score of 1 might get a mortgage at 2% interest, while someone with a score of 4 might pay 4% interest.',
      similarTerms: ['creditworthiness', 'credit rating', 'financial reputation', 'borrowing capacity', 'debt reliability'],
      category: 'Credit'
    },
    'inflation': {
      definition: 'The general increase in prices of goods and services over time, which reduces the purchasing power of money.',
      explanation: 'Inflation means your money buys less tomorrow than it does today, making it a silent wealth eroder. This is why keeping large amounts of cash in low-interest accounts can actually lose you money in real terms over time.',
      example: 'If inflation is 3% annually and your savings account pays 1% interest, you\'re actually losing 2% of purchasing power each year. A coffee that costs CHF 5 today will cost CHF 5.15 next year due to inflation.',
      similarTerms: ['price increases', 'currency devaluation', 'purchasing power decline', 'cost of living rise', 'monetary erosion'],
      category: 'Economics'
    },
    'etf': {
      definition: 'An Exchange-Traded Fund that holds a diversified portfolio of assets and trades on stock exchanges like individual stocks.',
      explanation: 'ETFs offer instant diversification by pooling money from many investors to buy a basket of securities. They combine the diversification benefits of mutual funds with the trading flexibility of individual stocks.',
      example: 'The MSCI World ETF contains stocks from over 1,600 companies across 23 developed countries. By buying one share, you own a tiny piece of companies like Apple, Microsoft, and Nestlé all at once.',
      similarTerms: ['index fund', 'passive investing', 'basket investment', 'diversified fund', 'market tracker'],
      category: 'Investment'
    },
    'mortgage': {
      definition: 'A secured loan used to purchase real estate where the property itself serves as collateral for the debt.',
      explanation: 'Mortgages enable homeownership by allowing you to borrow most of the purchase price and pay it back over many years. The lender has the right to seize the property if you fail to make payments, which is why interest rates are typically lower than unsecured loans.',
      example: 'To buy a CHF 1 million home, you might pay CHF 200,000 down and get an CHF 800,000 mortgage at 2.5% interest. Your monthly payment would be approximately CHF 3,200 over a 25-year term.',
      similarTerms: ['home loan', 'property financing', 'real estate debt', 'housing credit', 'secured borrowing'],
      category: 'Real Estate'
    },
    'dividend': {
      definition: 'A cash payment made by companies to shareholders as a distribution of profits or retained earnings.',
      explanation: 'Dividends provide regular income to investors and represent a company sharing its success with shareholders. Companies that consistently pay dividends are often mature, profitable businesses with stable cash flows.',
      example: 'If you own 100 shares of Nestlé and they pay an annual dividend of CHF 2.80 per share, you\'ll receive CHF 280 in cash. This money is typically deposited directly into your brokerage account quarterly or annually.',
      similarTerms: ['shareholder payout', 'profit distribution', 'income yield', 'cash return', 'equity income'],
      category: 'Investment'
    }
  };

  const performSearch = async (termToSearch = null) => {
    const searchTermToUse = termToSearch || searchTerm;
    if (!searchTermToUse.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const term = searchTermToUse.toLowerCase().trim();
    const foundTerm = financialTerms[term];
    
    if (foundTerm) {
      setExplanation({
        term: searchTermToUse,
        ...foundTerm
      });
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchTermToUse, ...prev.filter(item => item !== searchTermToUse)];
        return newHistory.slice(0, 5); // Keep only last 5 searches
      });
    } else {
      // If term not found in local database, use the chat API for web search
      try {
        const searchQuery = `Explain the financial term "${searchTermToUse}" in simple terms with definition, explanation, and example`;
        
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: [{
              role: 'user', 
              content: `Please provide a comprehensive explanation for the financial term "${searchTermToUse}" using EXACTLY this format:

**Definition:**
[Write one clear, concise sentence that defines the term]

**Simple Explanation:**
[Write exactly two sentences explaining the concept in simple, easy-to-understand language]

**Example:**
[Write exactly two sentences providing a practical, real-world example that illustrates how this concept works]

**Similar Terms:**
[List exactly 5 related financial terms or phrases, separated by commas]

IMPORTANT: Use the exact section headers shown above (Definition, Simple Explanation, Example, Similar Terms) and follow the specified sentence counts. Make sure each section is clearly separated and labeled.`
            }]
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          let content = '';
          
          if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            content = data.choices[0].message.content;
          } else if (data.message && data.message.content) {
            content = data.message.content;
          }
          
          if (content) {
            // Parse the structured response with improved flexibility
            const parseAIResponse = (text) => {
              const sections = {
                definition: '',
                explanation: '',
                example: '',
                similarTerms: []
              };
              
              // Clean the text and split into lines
              const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
              const lines = cleanText.split('\n').filter(line => line.trim());
              let currentSection = '';
              let sectionContent = [];
              
              for (const line of lines) {
                const trimmedLine = line.trim();
                
                // More flexible section detection
                if (trimmedLine.match(/^(1\.|Definition:|\*\*Definition\*\*:?)/i)) {
                  if (currentSection && sectionContent.length > 0) {
                    sections[currentSection] = sectionContent.join(' ').trim();
                  }
                  currentSection = 'definition';
                  sectionContent = [trimmedLine.replace(/^(1\.|Definition:|\*\*Definition\*\*:?)/i, '').trim()];
                } else if (trimmedLine.match(/^(2\.|Simple Explanation:|Explanation:|\*\*Simple Explanation\*\*:?|\*\*Explanation\*\*:?)/i)) {
                  if (currentSection && sectionContent.length > 0) {
                    sections[currentSection] = sectionContent.join(' ').trim();
                  }
                  currentSection = 'explanation';
                  sectionContent = [trimmedLine.replace(/^(2\.|Simple Explanation:|Explanation:|\*\*Simple Explanation\*\*:?|\*\*Explanation\*\*:?)/i, '').trim()];
                } else if (trimmedLine.match(/^(3\.|Example:|\*\*Example\*\*:?)/i)) {
                  if (currentSection && sectionContent.length > 0) {
                    sections[currentSection] = sectionContent.join(' ').trim();
                  }
                  currentSection = 'example';
                  sectionContent = [trimmedLine.replace(/^(3\.|Example:|\*\*Example\*\*:?)/i, '').trim()];
                } else if (trimmedLine.match(/^(4\.|Similar Terms:|Related Terms:|\*\*Similar Terms\*\*:?|\*\*Related Terms\*\*:?)/i)) {
                  if (currentSection && sectionContent.length > 0) {
                    sections[currentSection] = sectionContent.join(' ').trim();
                  }
                  currentSection = 'similarTerms';
                  const termsText = trimmedLine.replace(/^(4\.|Similar Terms:|Related Terms:|\*\*Similar Terms\*\*:?|\*\*Related Terms\*\*:?)/i, '').trim();
                  if (termsText) {
                    sections.similarTerms = termsText.split(/[,;\n]/).map(term => term.trim().replace(/^[-•]\s*/, '')).filter(term => term && term.length > 0);
                  }
                  sectionContent = [];
                } else if (currentSection && trimmedLine) {
                  if (currentSection === 'similarTerms') {
                    // Handle list items for similar terms
                    if (trimmedLine.match(/^[-•]\s*/)) {
                      const term = trimmedLine.replace(/^[-•]\s*/, '').trim();
                      if (term) sections.similarTerms.push(term);
                    } else {
                      const newTerms = trimmedLine.split(/[,;]/).map(term => term.trim().replace(/^[-•]\s*/, '')).filter(term => term && term.length > 0);
                      sections.similarTerms = [...sections.similarTerms, ...newTerms];
                    }
                  } else {
                    sectionContent.push(trimmedLine);
                  }
                }
              }
              
              // Process the last section
              if (currentSection && sectionContent.length > 0) {
                sections[currentSection] = sectionContent.join(' ').trim();
              }
              
              // Clean up and validate sections
              Object.keys(sections).forEach(key => {
                if (typeof sections[key] === 'string') {
                  sections[key] = sections[key].replace(/^:+\s*/, '').trim();
                }
              });
              
              // Ensure we have at least 5 similar terms, pad if necessary
              if (sections.similarTerms.length > 0 && sections.similarTerms.length < 5) {
                const additionalTerms = [`${searchTermToUse} basics`, `${searchTermToUse} guide`, 'Financial planning', 'Investment strategy', 'Financial literacy'];
                while (sections.similarTerms.length < 5 && additionalTerms.length > 0) {
                  const term = additionalTerms.shift();
                  if (!sections.similarTerms.includes(term)) {
                    sections.similarTerms.push(term);
                  }
                }
              }
              
              // Fallback if parsing fails completely
              if (!sections.definition && !sections.explanation) {
                // Try to extract first sentence as definition
                const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
                if (sentences.length > 0) {
                  sections.definition = sentences[0].trim() + '.';
                  sections.explanation = sentences.slice(1, 3).join('. ').trim();
                  if (sections.explanation && !sections.explanation.endsWith('.')) {
                    sections.explanation += '.';
                  }
                  sections.example = 'For specific examples and personalized advice, please consult with a UBS financial advisor.';
                } else {
                  sections.definition = `AI-powered explanation for "${searchTermToUse}"`;
                  sections.explanation = cleanText;
                  sections.example = 'For specific examples and personalized advice, please consult with a UBS financial advisor.';
                }
                
                // Add default similar terms if none found
                if (sections.similarTerms.length === 0) {
                  sections.similarTerms = ['Financial planning', 'Investment strategy', 'Financial literacy', 'Market analysis', 'Risk management'];
                }
              }
              
              return sections;
            };
            
            const parsedContent = parseAIResponse(content);
            
            setExplanation({
              term: searchTermToUse,
              definition: parsedContent.definition || `AI-powered explanation for "${searchTermToUse}"`,
              explanation: parsedContent.explanation || content,
              example: parsedContent.example || 'For specific examples and personalized advice, please consult with a UBS financial advisor.',
              similarTerms: parsedContent.similarTerms.length > 0 ? parsedContent.similarTerms.slice(0, 5) : undefined,
              category: 'AI Search',
              source: 'Web Search'
            });
            
            // Add to search history
            setSearchHistory(prev => {
              const newHistory = [searchTermToUse, ...prev.filter(item => item !== searchTermToUse)];
              return newHistory.slice(0, 5);
            });
          } else {
            throw new Error('No content in response');
          }
        } else {
          throw new Error('Web search failed');
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback if web search fails
        setExplanation({
          term: searchTermToUse,
          definition: 'Term not found in our database.',
          explanation: `We don't have information about "${searchTermToUse}" in our current database, and web search is currently unavailable. This might be a specialized term or a newer concept. Consider consulting with a UBS financial advisor for detailed information about this topic.`,
          example: 'For personalized financial education and advice, please speak with one of our financial experts.',
          category: 'General'
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    const foundTerm = financialTerms[term.toLowerCase()];
    if (foundTerm) {
      setExplanation({
        term: term,
        ...foundTerm
      });
    }
  };

  const popularTerms = ['compound interest', 'diversification', 'etf', 'mortgage', 'credit score'];

  return (
    <div className="financial-educator">
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a financial term (e.g., compound interest, ETF, mortgage)"
            className="search-input"
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Learn'}
          </button>
        </div>
        
        {searchHistory.length > 0 && (
          <div className="search-history">
            <span className="history-label">Recent searches:</span>
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(term)}
                className="history-item"
              >
                {term}
              </button>
            ))}
          </div>
        )}
        
        <div className="popular-terms">
          <span className="popular-label">Popular terms:</span>
          <div className="popular-buttons">
            {popularTerms.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  handleHistoryClick(term);
                }}
                className="popular-term-button"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {explanation && (
        <div className="explanation-section">
          <div className="explanation-card">
            <div className="term-header">
              <h3>{explanation.term}</h3>
              <div className="badges">
                <span className="category-badge">{explanation.category}</span>
                {explanation.source && (
                  <span className="source-badge">{explanation.source}</span>
                )}
              </div>
            </div>
            
            <div className="definition-section">
              <h4>Definition</h4>
              <p>{explanation.definition}</p>
            </div>
            
            <div className="explanation-section">
              <h4>Simple Explanation</h4>
              <p>{explanation.explanation}</p>
            </div>
            
            <div className="example-section">
              <h4>Example</h4>
              <p>{explanation.example}</p>
            </div>
            
            {explanation.similarTerms && (
              <div className="similar-terms-section">
                <h4>Similar Terms</h4>
                <div className="similar-terms-list">
                  {explanation.similarTerms.map((term, index) => (
                    <span key={index} className="similar-term-tag">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!explanation && (
        <div className="welcome-section">
          <div className="welcome-card">
            <h3>Welcome to Financial Education</h3>
            <p>Search for any financial term above to get a clear, simple explanation. Our tool breaks down complex financial concepts into easy-to-understand language.</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Clear definitions and explanations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💡</span>
                <span>Real-world examples</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Categorized by topic</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialEducator;
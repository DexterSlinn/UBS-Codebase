import React, { useState } from 'react';
import './AccountQuiz.css';

const AccountQuiz = ({ onComplete, onSendMessage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Enhanced quiz questions and options - Updated for key4 banking and comprehensive product coverage
  const questions = [
    {
      id: 'purpose',
      question: 'What is your primary banking need?',
      options: [
        { id: 'everyday', text: 'Everyday banking and payments' },
        { id: 'savings', text: 'Savings and money management' },
        { id: 'investment', text: 'Investment and wealth building' },
        { id: 'business', text: 'Business banking' },
        { id: 'family', text: 'Family banking with multiple accounts' }
      ]
    },
    {
      id: 'age',
      question: 'What is your age group?',
      options: [
        { id: 'under12', text: 'Under 12 (Children)' },
        { id: '12to17', text: '12-17 (Young people)' },
        { id: '18to25', text: '18-25 (Students/Young adults)' },
        { id: '26to30', text: '26-30 (Young professionals)' },
        { id: '31to50', text: '31-50 (Professionals)' },
        { id: 'over50', text: 'Over 50' }
      ]
    },
    {
      id: 'status',
      question: 'What best describes your current situation?',
      options: [
        { id: 'student', text: 'Student (University/Apprenticeship)' },
        { id: 'working', text: 'Working professional' },
        { id: 'selfEmployed', text: 'Self-employed/Entrepreneur' },
        { id: 'parent', text: 'Parent/Family with children' },
        { id: 'retired', text: 'Retired' },
        { id: 'other', text: 'Other' }
      ]
    },
    {
      id: 'income',
      question: 'What is your approximate annual income?',
      options: [
        { id: 'noIncome', text: 'No regular income (Student/Child)' },
        { id: 'under50k', text: 'Under CHF 50,000' },
        { id: '50kto100k', text: 'CHF 50,000 - 100,000' },
        { id: '100kto200k', text: 'CHF 100,000 - 200,000' },
        { id: 'over200k', text: 'Over CHF 200,000' }
      ]
    },
    {
      id: 'features',
      question: 'Which features are most important to you? (Select all that apply)',
      options: [
        { id: 'noFees', text: 'Zero or minimal fees' },
        { id: 'digitalFirst', text: 'Mobile-first digital banking' },
        { id: 'rewards', text: 'Rewards and cashback programs' },
        { id: 'internationalUse', text: 'International travel and payments' },
        { id: 'wealthServices', text: 'Investment and wealth management' },
        { id: 'familyFeatures', text: 'Family banking and parental controls' },
        { id: 'businessTools', text: 'Business payment solutions' },
        { id: 'sustainability', text: 'Sustainable and ethical banking' }
      ],
      multiSelect: true
    },
    {
      id: 'bankingStyle',
      question: 'How do you prefer to manage your banking?',
      options: [
        { id: 'mobileOnly', text: 'Primarily mobile app' },
        { id: 'digitalMix', text: 'Mix of mobile and online banking' },
        { id: 'traditional', text: 'Branch visits and traditional banking' },
        { id: 'advisor', text: 'Personal advisor and relationship banking' }
      ]
    }
  ];

  // Account recommendations based on answers - Updated with key4 banking priority
  const accountRecommendations = {
    everyday: {
      youth: {
        title: 'UBS key4 Pure',
        description: 'Digital banking designed for young adults - completely free for those who like to keep things simple.',
        features: ['Personal and savings account', 'Prepaid and Debit card', 'Add up to CHF 10,000 per month', 'Mobile banking app'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/key4.html',
        monthlyFee: 'CHF 0'
      },
      under50k: {
        title: 'UBS key4 Pure',
        description: 'Perfect for budget-conscious individuals who want simple, effective banking.',
        features: ['Personal and savings account', 'Prepaid and Debit card', 'Add up to CHF 10,000 per month', 'No monthly fees'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/key4.html',
        monthlyFee: 'CHF 0'
      },
      default: {
        title: 'UBS Personal Account',
        description: 'Our standard account for everyday banking with comprehensive features.',
        features: ['Account maintenance from CHF 3', 'Available in CHF or EUR', 'E-Banking, Mobile Banking, UBS Safe and TWINT'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/personal-account.html',
        monthlyFee: 'From CHF 3'
      }
    },
    savings: {
      under18: {
        title: "Children's Account (6-11 years)",
        description: 'Free banking for children to take their first steps in the world of finance.',
        features: ['Personal account and debit card', 'Full parental control', 'Attractive preferential interest rate', 'No account management fees'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/children.html',
        monthlyFee: 'CHF 0'
      },
      youth: {
        title: 'Account for Young People and Students',
        description: 'Ideal for young people and students to manage their own money with preferential rates.',
        features: ['Free account management under 26/students under 30', 'Attractive exchange rates worldwide', 'Welcome gift of CHF 50', 'Cashyou subscription discounts'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/youth.html',
        monthlyFee: 'CHF 0'
      },
      default: {
        title: 'Basic Savings Account',
        description: 'The ideal complement to your personal account for setting aside money while maintaining flexibility.',
        features: ['Convenient cash withdrawals at Bancomats', 'Zero account maintenance fee', 'Free digital banking', 'Suitable for associations and foundations'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/savings-account.html',
        monthlyFee: 'CHF 0'
      }
    },
    investment: {
      over100k: {
        title: 'UBS Wealth Management Account',
        description: 'Comprehensive wealth management solutions for your investment needs.',
        features: ['Personalized investment advice', 'Portfolio management', 'Wealth planning services', 'Dedicated relationship manager'],
        url: 'https://www.ubs.com/ch/en/private/investments.html',
        monthlyFee: 'Contact for pricing'
      },
      default: {
        title: 'UBS Investment Platform',
        description: 'Access to a wide range of investment opportunities.',
        features: ['Online trading platform', 'Investment funds', 'Market research and insights', 'Portfolio tracking'],
        url: 'https://www.ubs.com/ch/en/private/investments/online-services.html',
        monthlyFee: 'Variable fees'
      }
    },
    business: {
      default: {
        title: 'UBS Business Account',
        description: 'Banking solutions designed for businesses of all sizes.',
        features: ['Business payment solutions', 'Cash management', 'Business financing options', 'Corporate cards'],
        url: 'https://www.ubs.com/ch/en/services/corporates.html',
        monthlyFee: 'Contact for pricing'
      }
    },
    family: {
      default: {
        title: 'Family Banking Package',
        description: 'Comprehensive banking for families with multiple relationships and joint accounts.',
        features: ['Multiple banking relationships per package', 'Joint accounts and partner cards', 'Free CHF cash withdrawals', 'UBS KeyClub bonus program'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/family.html',
        monthlyFee: 'Contact for pricing'
      }
    }
  };

  // Card recommendations based on answers - Updated with key4 banking and new knowledge base data
  const cardRecommendations = {
    rewards: {
      over100k: {
        title: 'UBS Platinum Credit Card',
        description: 'Premium rewards and exclusive benefits for high earners with comprehensive travel benefits.',
        features: ['High reward points', 'Comprehensive travel insurance', 'Airport lounge access', 'Concierge service'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/credit-cards.html',
        annualFee: 'CHF 300'
      },
      default: {
        title: 'UBS Gold Credit Card',
        description: 'Earn rewards on your everyday purchases with enhanced travel benefits.',
        features: ['Reward points program', 'Travel insurance', 'Purchase protection', 'Extended warranty'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/credit-cards.html',
        annualFee: 'CHF 150'
      }
    },
    internationalUse: {
      default: {
        title: 'UBS Gold Credit Card',
        description: 'Perfect for international travelers with comprehensive travel benefits and insurance.',
        features: ['Travel insurance coverage', 'Emergency assistance worldwide', 'Competitive exchange rates', 'No foreign transaction fees on some purchases'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/credit-cards.html',
        annualFee: 'CHF 150'
      }
    },
    digitalBanking: {
      youth: {
        title: 'UBS key4 Prepaid Card',
        description: 'Perfect for young adults who want full control over their spending with digital-first features.',
        features: ['Prepaid functionality', 'Mobile app integration', 'Real-time spending notifications', 'No credit risk'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/accounts/key4.html',
        annualFee: 'CHF 0'
      },
      default: {
        title: 'UBS TWINT',
        description: 'The Swiss mobile payment solution for seamless digital transactions.',
        features: ['Mobile payments', 'QR code payments', 'Person-to-person transfers', 'Loyalty program integration'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/twint.html',
        annualFee: 'CHF 0'
      }
    },
    default: {
      default: {
        title: 'UBS Classic Credit Card',
        description: 'A reliable credit card for everyday use with essential features.',
        features: ['Standard credit features', 'Online banking integration', 'Fraud protection', 'Worldwide acceptance'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/credit-cards.html',
        annualFee: 'CHF 60'
      }
    },
    debit: {
      default: {
        title: 'UBS ME Banking Debit Card',
        description: 'Modern debit card with enhanced digital features and security.',
        features: ['Contactless payments', 'Mobile wallet compatibility', 'Real-time transaction alerts', 'Enhanced security features'],
        url: 'https://www.ubs.com/ch/en/private/accounts-and-cards/cards/debit-cards.html',
        annualFee: 'CHF 0'
      }
    }
  };

  const handleOptionSelect = (optionId) => {
    const currentQuestion = questions[currentStep];
    
    if (currentQuestion.multiSelect) {
      // For multi-select questions, toggle the selection
      setAnswers(prev => {
        const currentSelections = prev[currentQuestion.id] || [];
        if (currentSelections.includes(optionId)) {
          return {
            ...prev,
            [currentQuestion.id]: currentSelections.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [currentQuestion.id]: [...currentSelections, optionId]
          };
        }
      });
    } else {
      // For single-select questions, just set the answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: optionId
      }));
      
      // Automatically move to the next question for single-select
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        generateResult();
      }
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    // For multi-select questions, ensure at least one option is selected
    if (currentQuestion.multiSelect) {
      const currentSelections = answers[currentQuestion.id] || [];
      if (currentSelections.length === 0) {
        return; // Don't proceed if nothing is selected
      }
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateResult();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateResult = () => {
    // Determine the primary purpose
    const purpose = answers.purpose;
    
    // Enhanced recommendation logic with new criteria
    const age = answers.age;
    const status = answers.status;
    const income = answers.income;
    const features = answers.features || [];
    const bankingStyle = answers.bankingStyle;
    
    // Determine user categories
    const isChild = age === 'under12';
    const isYoungPerson = age === '12to17';
    const isYoungAdult = age === '18to25' || age === '26to30';
    const isStudent = status === 'student' || income === 'noIncome';
    const isFamily = status === 'parent' || features.includes('familyFeatures');
    const prefersDigital = features.includes('digitalFirst') || bankingStyle === 'mobileOnly';
    const wantsNoFees = features.includes('noFees');
    const isHighIncome = income === 'over200k' || income === '100kto200k';
    const isLowIncome = income === 'under50k' || income === 'noIncome';
    
    // Get account recommendation with enhanced logic
    let accountRec;
    
    // Children's accounts (under 12)
    if (isChild) {
      accountRec = accountRecommendations.savings.under18;
    }
    // Young people accounts (12-17)
    else if (isYoungPerson) {
      accountRec = accountRecommendations.savings.youth;
    }
    // Students and young adults prioritize key4 banking
    else if ((isStudent || isYoungAdult) && (purpose === 'everyday' || (wantsNoFees && purpose === 'savings'))) {
      if (purpose === 'savings') {
        accountRec = accountRecommendations.savings.youth;
      } else {
        accountRec = accountRecommendations.everyday.youth;
      }
    }
    // Family banking
    else if (isFamily || purpose === 'family') {
      accountRec = accountRecommendations.family.default;
    }
    // High-income investment accounts
    else if (purpose === 'investment' && isHighIncome) {
      accountRec = accountRecommendations.investment.over100k;
    }
    // Budget-conscious everyday banking
    else if (purpose === 'everyday' && (isLowIncome || wantsNoFees)) {
      accountRec = accountRecommendations.everyday.under50k;
    }
    // Default recommendations by purpose
    else {
      accountRec = accountRecommendations[purpose]?.default || accountRecommendations.everyday.default;
    }
    
    // Get card recommendation based on preferred features - Prioritize key4 for youth
    let cardRec;
    const selectedFeatures = answers.features || [];
    
    // Enhanced card recommendation logic
    if (prefersDigital && (isYoungAdult || isStudent)) {
      cardRec = cardRecommendations.digitalBanking.youth;
    } else if (selectedFeatures.includes('rewards') && isHighIncome) {
      cardRec = cardRecommendations.rewards.over100k;
    } else if (selectedFeatures.includes('rewards')) {
      cardRec = cardRecommendations.rewards.default;
    } else if (selectedFeatures.includes('internationalUse')) {
      cardRec = cardRecommendations.internationalUse.default;
    } else if (selectedFeatures.includes('digitalFirst') || bankingStyle === 'mobileOnly') {
      if (isYoungAdult || isStudent) {
        cardRec = cardRecommendations.digitalBanking.youth;
      } else {
        cardRec = cardRecommendations.digitalBanking.default;
      }
    } else if (wantsNoFees || isStudent) {
      cardRec = cardRecommendations.digitalBanking.youth;
    } else {
      cardRec = cardRecommendations.default.default;
    }
    
    setResult({
      account: accountRec,
      card: cardRec
    });
  };

  const handleComplete = () => {
    if (result && onComplete) {
      onComplete({
        result,
        answers
      });
    }
  };

  // Render the current question
  const renderQuestion = () => {
    const currentQuestion = questions[currentStep];
    const selectedOptions = answers[currentQuestion.id] || (currentQuestion.multiSelect ? [] : null);
    
    return (
      <div className="quiz-question">
        <h3>{currentQuestion.question}</h3>
        <div className="quiz-options">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              className={`quiz-option ${currentQuestion.multiSelect 
                ? (selectedOptions.includes(option.id) ? 'selected' : '') 
                : (selectedOptions === option.id ? 'selected' : '')}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="quiz-navigation">
          {currentStep > 0 && (
            <button className="quiz-back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          {currentQuestion.multiSelect && (
            <button 
              className="quiz-next-btn" 
              onClick={handleNext}
              disabled={(answers[currentQuestion.id] || []).length === 0}
            >
              {currentStep < questions.length - 1 ? 'Next' : 'See Results'}
            </button>
          )}
        </div>
        <div className="quiz-progress">
          <div className="quiz-progress-text">
            Question {currentStep + 1} of {questions.length}
          </div>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Render the results
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className="quiz-result">
        <h2>Your Personalized Recommendations</h2>
        
        <div className="recommendation-card">
          <h3>Recommended Account</h3>
          <div className="recommendation-content">
            <h4>{result.account.title}</h4>
            {result.account.monthlyFee && (
              <div className="fee-info">
                <strong>Monthly Fee: {result.account.monthlyFee}</strong>
              </div>
            )}
            <p>{result.account.description}</p>
            <h5>Key Features:</h5>
            <ul>
              {result.account.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="recommendation-link"
              onClick={() => onSendMessage && onSendMessage(`Tell me more about the ${result.account.title}`)}
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div className="recommendation-card">
          <h3>Recommended Card</h3>
          <div className="recommendation-content">
            <h4>{result.card.title}</h4>
            {result.card.annualFee && (
              <div className="fee-info">
                <strong>Annual Fee: {result.card.annualFee}</strong>
              </div>
            )}
            <p>{result.card.description}</p>
            <h5>Key Features:</h5>
            <ul>
              {result.card.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="recommendation-link"
              onClick={() => onSendMessage && onSendMessage(`Tell me more about the ${result.card.title}`)}
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div className="quiz-actions">
          <button className="quiz-complete-btn" onClick={handleComplete}>
            Apply These Recommendations
          </button>
          <button className="quiz-restart-btn" onClick={() => {
            setCurrentStep(0);
            setAnswers({});
            setResult(null);
          }}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="account-quiz-container">
      <div className="account-quiz">
        <div className="quiz-header">
          <h2>UBS Account Finder</h2>
        </div>
        
        {!result ? renderQuestion() : renderResult()}
      </div>
    </div>
  );
};

export default AccountQuiz;
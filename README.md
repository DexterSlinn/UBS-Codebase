# UBS-Codebase

🏦 **A comprehensive financial platform and AI-powered banking assistant built for UBS Switzerland**

This is a sophisticated full-stack financial application that combines modern web technologies with AI-powered chat functionality, real-time market data, and comprehensive banking tools. The platform serves as both a customer-facing banking interface and an educational financial resource.

## 🌟 Key Features

### 💬 AI-Powered Chat Assistant
- **Marcel AI Guide**: Intelligent chatbot powered by Groq AI API
- **Personalized Templates**: 6 preset user personas (Student, Young Professional, Active Investor, Business Owner, Retiree, High Net Worth)
- **Advanced Configuration**: Customizable response styles, temperature settings, and interaction patterns
- **Financial Education**: Built-in financial term explanations and educational content
- **Multi-modal Support**: Text and voice interactions

### 📊 Real-Time Financial Data
- **Live Stock Tracking**: Real-time stock prices, charts, and market data
- **Cryptocurrency Dashboard**: Top 20 crypto tracker with live prices and market caps
- **Market Overview**: Financial news, market indicators, and economic updates
- **Active Stocks Monitor**: Most actively traded stocks with performance metrics
- **Stock Search**: Advanced search functionality for individual stock analysis

### 🏦 Banking & Account Services
- **Account Quiz**: Interactive questionnaire to recommend optimal UBS account types
- **Product Recommendations**: Personalized banking product suggestions based on user profile
- **UBS key4 Banking**: Integration with UBS's digital banking platform
- **Family Banking**: Multi-user account management and family financial planning
- **Business Banking**: Corporate account features and business payment solutions

### 🎓 Financial Education Platform
- **Interactive Learning**: Comprehensive financial term dictionary
- **Educational Content**: Explanations of complex financial concepts
- **Real-world Examples**: Practical scenarios and case studies
- **Progressive Learning**: Adaptive content based on user knowledge level

### 🔧 Advanced Technical Features
- **Web Scraping**: Puppeteer-based browser automation for data collection
- **Proxy Integration**: Secure web browsing and data fetching
- **Knowledge Base**: Searchable document repository with AI-powered search
- **Performance Monitoring**: Real-time metrics and system health monitoring
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with modern hooks and context API
- **Styling**: TailwindCSS with custom UBS branding
- **State Management**: React Context for global state
- **Charts**: Chart.js integration for financial data visualization
- **Icons**: Lucide React for consistent iconography

### Backend (Express.js)
- **Server**: Express.js with comprehensive middleware
- **AI Integration**: Groq SDK for natural language processing
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Performance**: Compression, caching, and optimized API responses
- **Monitoring**: Built-in health checks and performance metrics

### APIs & Integrations
- **Groq AI**: Advanced language model for chat functionality
- **Alpha Vantage**: Stock market data and financial indicators
- **Custom APIs**: 15+ custom endpoints for various functionalities
- **Fallback Systems**: Mock data for offline/demo functionality

## 📁 Project Structure

```
├── src/                          # Frontend React application
│   ├── components/               # React components (25+ components)
│   │   ├── Dashboard.jsx         # Main dashboard interface
│   │   ├── ChatMessages.jsx      # AI chat interface
│   │   ├── CryptoTracker.jsx     # Cryptocurrency monitoring
│   │   ├── StockViewer.jsx       # Stock analysis tools
│   │   ├── FinancialEducator.jsx # Educational content
│   │   ├── AccountQuiz.jsx       # Banking product recommendations
│   │   └── ...                   # Additional specialized components
│   ├── config/                   # Configuration files
│   │   └── api.js               # API endpoint configuration
│   └── assets/                   # Static assets and UBS branding
├── api/                          # Backend API endpoints
│   ├── chat.js                  # AI chat functionality
│   ├── dashboard-chat.js         # Dashboard-specific chat
│   ├── crypto/                   # Cryptocurrency data endpoints
│   ├── stock/                    # Stock market data endpoints
│   ├── stocks/                   # Active stocks monitoring
│   ├── market-overview.js        # Market news and indicators
│   └── health.js                # System health monitoring
├── knowledge-base/               # AI knowledge repository
│   ├── ubs-services.md          # UBS product information
│   ├── ubs-investment-priority.md # Investment guidance
│   └── Web Database Creation.md  # Technical documentation
├── server.js                     # Main Express server
├── index.js                      # Alternative server entry point
└── vercel-simulation/            # Deployment testing environment
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x or higher
- npm 10.0.0 or higher
- Groq API key (for AI functionality)
- Alpha Vantage API key (optional, for enhanced market data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DexterSlinn/UBS-Codebase.git
   cd UBS-Codebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   PORT=3006
   NODE_ENV=development
   ```

4. **Start Development Servers**
   
   **Backend Server:**
   ```bash
   npm run server
   # Runs on http://localhost:3006
   ```
   
   **Frontend Development:**
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start frontend development server
npm run server           # Start backend server
npm run backend          # Alternative backend start command

# Production
npm run build            # Build for production
npm run preview          # Preview production build
npm start               # Start production server

# Testing
npm test                # Run test suite
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
npm run test:watch      # Run tests in watch mode

# Utilities
npm run lint            # Lint code
npm run proxy           # Start proxy server
```

## 🔌 API Endpoints

### Core Chat & AI
- `POST /api/chat` - Main AI chat functionality
- `POST /api/dashboard-chat` - Dashboard-specific chat
- `POST /api/mcp` - Multi-modal chat protocol

### Financial Data
- `GET /api/crypto/top20` - Top 20 cryptocurrencies
- `GET /api/stocks/active` - Most active stocks
- `GET /api/stock/:symbol` - Individual stock data
- `GET /api/market-overview` - Market news and indicators

### Knowledge & Search
- `POST /api/knowledge-base/search` - Search knowledge base
- `GET /api/knowledge-base/documents` - List all documents
- `GET /api/knowledge-base/suggestions` - Search suggestions

### System
- `GET /api/health` - System health check
- `GET /api/metrics` - Performance metrics
- `POST /api/proxy` - Proxy functionality

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `VITE_API_BASE_URL` (your backend URL)
3. Deploy automatically on push to main branch

### Alternative Platforms
- **Heroku**: Use `Procfile` for deployment
- **Railway**: Use `railway.json` configuration
- **Docker**: Use provided `Dockerfile`
- **Traditional VPS**: Use `npm start` after building

### Environment Variables for Production
```env
GROQ_API_KEY=your_production_groq_key
ALPHA_VANTAGE_API_KEY=your_production_alpha_vantage_key
VITE_API_BASE_URL=https://your-backend-url.com
NODE_ENV=production
PORT=3006
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and function testing with Vitest
- **Integration Tests**: API endpoint testing
- **UI Tests**: React Testing Library for component interactions
- **Coverage Reports**: Detailed test coverage analysis

## 🔒 Security Features

- **Input Validation**: Express-validator for all API inputs
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Integration**: Security headers and protection
- **Environment Variables**: Secure API key management
- **Error Handling**: Comprehensive error management

## 🎨 UI/UX Features

- **UBS Branding**: Official UBS colors, fonts, and styling
- **Responsive Design**: Mobile-first with desktop optimization
- **Dark/Light Themes**: Adaptive theming support
- **Accessibility**: WCAG compliant interface elements
- **Animations**: Smooth transitions and micro-interactions
- **Progressive Web App**: PWA capabilities for mobile installation

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
- `TECHNICAL_IMPROVEMENTS.md` - Technical enhancement roadmap
- `STEP5_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `knowledge-base/README.md` - Knowledge base management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the documentation in the `docs/` directory
- Review the knowledge base in `knowledge-base/`
- Open an issue for bug reports
- Contact the development team for feature requests

---

**Built with ❤️ for UBS Switzerland** | **Powered by AI and Modern Web Technologies**

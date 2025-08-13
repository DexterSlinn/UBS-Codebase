import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { body, query, validationResult } from 'express-validator';
import { searchDocuments, getAllDocuments, formatSearchResults, initializeKnowledgeBase } from './enhancedDocumentManager.js';

// Enhanced API Router
class EnhancedAPIRouter {
  constructor() {
    this.router = express.Router();
    this.setupMiddleware();
    this.setupRoutes();
    this.requestMetrics = {
      totalRequests: 0,
      searchRequests: 0,
      averageResponseTime: 0,
      errorCount: 0,
      lastReset: new Date()
    };
  }

  // Setup enhanced middleware
  setupMiddleware() {
    // Security headers
    this.router.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.groq.com"]
        }
      }
    }));

    // Compression
    this.router.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.router.use(limiter);

    // Request logging and metrics
    this.router.use((req, res, next) => {
      const startTime = Date.now();
      this.requestMetrics.totalRequests++;

      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        this.updateMetrics(responseTime, res.statusCode);
      });

      next();
    });

    // Enhanced CORS
    this.router.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://ubs-production.vercel.app'] 
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // JSON parsing with size limit
    this.router.use(express.json({ limit: '10mb' }));
  }

  // Setup enhanced routes
  setupRoutes() {
    // Minimal health check endpoint for Railway - responds immediately
    this.router.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Detailed health check endpoint with metrics
    this.router.get('/health/detailed', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        metrics: this.getMetrics()
      });
    });

    // Readiness check endpoint - checks if all services are fully initialized
    this.router.get('/ready', (req, res) => {
      try {
        // Check if knowledge base is initialized
        const { getAllDocuments } = require('./enhancedDocumentManager.js');
        const documents = getAllDocuments();
        const isKnowledgeBaseReady = documents && documents.length > 0;
        
        const readinessChecks = {
          knowledgeBase: isKnowledgeBaseReady,
          server: true,
          uptime: process.uptime() > 10 // Server has been running for at least 10 seconds
        };
        
        const allReady = Object.values(readinessChecks).every(check => check === true);
        
        res.status(allReady ? 200 : 503).json({
          status: allReady ? 'ready' : 'not_ready',
          checks: readinessChecks,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(503).json({
          status: 'not_ready',
          error: 'Readiness check failed',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Metrics endpoint
    this.router.get('/metrics', (req, res) => {
      res.json(this.getDetailedMetrics());
    });

    // Enhanced knowledge base search
    this.router.get('/knowledge-base/search',
      [
        query('q')
          .isLength({ min: 1, max: 500 })
          .withMessage('Query must be between 1 and 500 characters')
          .trim()
          .escape(),
        query('maxResults')
          .optional()
          .isInt({ min: 1, max: 20 })
          .withMessage('maxResults must be between 1 and 20')
          .toInt(),
        query('category')
          .optional()
          .isIn(['asset_management', 'payment_transactions', 'cybersecurity', 'banking', 'investment', 'wealth_management', 'general'])
          .withMessage('Invalid category'),
        query('fuzzyMatch')
          .optional()
          .isBoolean()
          .withMessage('fuzzyMatch must be boolean')
          .toBoolean(),
        query('priorityBoost')
          .optional()
          .isBoolean()
          .withMessage('priorityBoost must be boolean')
          .toBoolean()
      ],
      this.handleValidationErrors,
      this.enhancedSearch.bind(this)
    );

    // Get all documents with pagination
    this.router.get('/knowledge-base/documents',
      [
        query('page')
          .optional()
          .isInt({ min: 1 })
          .withMessage('Page must be a positive integer')
          .toInt(),
        query('limit')
          .optional()
          .isInt({ min: 1, max: 50 })
          .withMessage('Limit must be between 1 and 50')
          .toInt(),
        query('category')
          .optional()
          .isIn(['asset_management', 'payment_transactions', 'cybersecurity', 'banking', 'investment', 'wealth_management', 'general'])
          .withMessage('Invalid category')
      ],
      this.handleValidationErrors,
      this.getAllDocuments.bind(this)
    );

    // Get document by ID
    this.router.get('/knowledge-base/documents/:id',
      this.getDocumentById.bind(this)
    );

    // Bulk search endpoint
    this.router.post('/knowledge-base/bulk-search',
      [
        body('queries')
          .isArray({ min: 1, max: 10 })
          .withMessage('Queries must be an array with 1-10 items'),
        body('queries.*')
          .isLength({ min: 1, max: 500 })
          .withMessage('Each query must be between 1 and 500 characters')
          .trim()
          .escape(),
        body('options')
          .optional()
          .isObject()
          .withMessage('Options must be an object')
      ],
      this.handleValidationErrors,
      this.bulkSearch.bind(this)
    );

    // Search suggestions endpoint
    this.router.get('/knowledge-base/suggestions',
      [
        query('partial')
          .isLength({ min: 1, max: 100 })
          .withMessage('Partial query must be between 1 and 100 characters')
          .trim()
          .escape()
      ],
      this.handleValidationErrors,
      this.getSearchSuggestions.bind(this)
    );

    // Cache management endpoints
    this.router.post('/knowledge-base/refresh-cache',
      this.refreshCache.bind(this)
    );

    // Error handling middleware
    this.router.use(this.errorHandler.bind(this));
  }

  // Validation error handler
  handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        timestamp: new Date().toISOString()
      });
    }
    next();
  }

  // Enhanced search handler
  async enhancedSearch(req, res, next) {
    try {
      const startTime = Date.now();
      const { q: query, maxResults = 5, category, fuzzyMatch = true, priorityBoost = true } = req.query;
      
      this.requestMetrics.searchRequests++;

      const options = {
        maxResults,
        categoryFilter: category,
        fuzzyMatch,
        priorityBoost,
        includeSnippets: true
      };

      const results = await searchDocuments(query, options);
      const responseTime = Date.now() - startTime;

      res.json({
        query,
        results: results.map(result => ({
          document: {
            id: result.document.id,
            title: result.document.title,
            category: result.document.category,
            priority: result.document.priority,
            wordCount: result.document.wordCount,
            modifiedAt: result.document.modifiedAt
          },
          score: result.score,
          matchedTerms: result.matchedTerms,
          snippets: result.snippets
        })),
        metadata: {
          totalResults: results.length,
          responseTime: `${responseTime}ms`,
          searchOptions: options,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all documents with pagination
  async getAllDocuments(req, res, next) {
    try {
      const { page = 1, limit = 20, category } = req.query;
      const allDocs = await getAllDocuments();
      
      // Filter by category if specified
      const filteredDocs = category 
        ? allDocs.filter(doc => doc.category === category)
        : allDocs;

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

      res.json({
        documents: paginatedDocs.map(doc => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          priority: doc.priority,
          wordCount: doc.wordCount,
          size: doc.size,
          createdAt: doc.createdAt,
          modifiedAt: doc.modifiedAt,
          aliasTerms: doc.aliasTerms.slice(0, 5), // Limit for performance
          searchKeywords: doc.searchKeywords.slice(0, 5)
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredDocs.length / limit),
          totalDocuments: filteredDocs.length,
          hasNextPage: endIndex < filteredDocs.length,
          hasPreviousPage: page > 1
        },
        metadata: {
          category: category || 'all',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get document by ID
  async getDocumentById(req, res, next) {
    try {
      const { id } = req.params;
      const allDocs = await getAllDocuments();
      const document = allDocs.find(doc => doc.id === id);

      if (!document) {
        return res.status(404).json({
          error: 'Document not found',
          id,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        document: {
          ...document,
          content: document.content.length > 5000 
            ? document.content.substring(0, 5000) + '...[truncated]'
            : document.content
        },
        metadata: {
          fullContentLength: document.content.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk search handler
  async bulkSearch(req, res, next) {
    try {
      const { queries, options = {} } = req.body;
      const results = [];

      for (const query of queries) {
        const searchResults = await searchDocuments(query, options);
        results.push({
          query,
          results: searchResults.map(result => ({
            document: {
              id: result.document.id,
              title: result.document.title,
              category: result.document.category
            },
            score: result.score,
            snippets: result.snippets.slice(0, 2) // Limit for bulk operations
          }))
        });
      }

      res.json({
        bulkResults: results,
        metadata: {
          totalQueries: queries.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Search suggestions handler
  async getSearchSuggestions(req, res, next) {
    try {
      const { partial } = req.query;
      const allDocs = await getAllDocuments();
      
      // Extract suggestions from titles, keywords, and alias terms
      const suggestions = new Set();
      
      for (const doc of allDocs) {
        // Title suggestions
        if (doc.title.toLowerCase().includes(partial.toLowerCase())) {
          suggestions.add(doc.title);
        }
        
        // Keyword suggestions
        for (const keyword of doc.searchKeywords) {
          if (keyword.toLowerCase().includes(partial.toLowerCase())) {
            suggestions.add(keyword);
          }
        }
        
        // Alias term suggestions
        for (const alias of doc.aliasTerms) {
          if (alias.toLowerCase().includes(partial.toLowerCase())) {
            suggestions.add(alias);
          }
        }
      }

      res.json({
        suggestions: Array.from(suggestions).slice(0, 10),
        partial,
        metadata: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh cache handler
  async refreshCache(req, res, next) {
    try {
      console.log('Refreshing knowledge base cache...');
      const documents = await initializeKnowledgeBase();
      
      res.json({
        message: 'Cache refreshed successfully',
        documentsLoaded: documents.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Update metrics
  updateMetrics(responseTime, statusCode) {
    // Update average response time
    this.requestMetrics.averageResponseTime = 
      (this.requestMetrics.averageResponseTime + responseTime) / 2;
    
    // Count errors
    if (statusCode >= 400) {
      this.requestMetrics.errorCount++;
    }
  }

  // Get basic metrics
  getMetrics() {
    return {
      totalRequests: this.requestMetrics.totalRequests,
      searchRequests: this.requestMetrics.searchRequests,
      averageResponseTime: Math.round(this.requestMetrics.averageResponseTime),
      errorCount: this.requestMetrics.errorCount,
      errorRate: this.requestMetrics.totalRequests > 0 
        ? (this.requestMetrics.errorCount / this.requestMetrics.totalRequests * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  // Get detailed metrics
  getDetailedMetrics() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      ...this.getMetrics(),
      system: {
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memoryUsage: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        },
        nodeVersion: process.version,
        platform: process.platform
      },
      lastReset: this.requestMetrics.lastReset,
      timestamp: new Date().toISOString()
    };
  }

  // Error handler
  errorHandler(error, req, res, next) {
    console.error('API Error:', error);
    
    this.requestMetrics.errorCount++;
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(error.status || 500).json({
      error: 'Internal server error',
      message: isDevelopment ? error.message : 'Something went wrong',
      ...(isDevelopment && { stack: error.stack }),
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    });
  }

  // Get router instance
  getRouter() {
    return this.router;
  }

  // Reset metrics
  resetMetrics() {
    this.requestMetrics = {
      totalRequests: 0,
      searchRequests: 0,
      averageResponseTime: 0,
      errorCount: 0,
      lastReset: new Date()
    };
  }
}

// Performance monitoring middleware
export function performanceMonitor() {
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow request detected: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
      }
      
      // Add performance header only if response hasn't been sent
      if (!res.headersSent) {
        res.set('X-Response-Time', `${duration.toFixed(2)}ms`);
      }
    });
    
    next();
  };
}

// Request ID middleware
export function requestId() {
  return (req, res, next) => {
    req.id = Math.random().toString(36).substring(2, 15);
    res.set('X-Request-ID', req.id);
    next();
  };
}

// Create and export enhanced API router
const enhancedAPI = new EnhancedAPIRouter();
export default enhancedAPI.getRouter();
export { EnhancedAPIRouter };
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced knowledge base directory
const KNOWLEDGE_BASE_DIR = path.join(__dirname, 'knowledge-base');
const CACHE_FILE = path.join(KNOWLEDGE_BASE_DIR, '.enhanced-cache.json');
const INDEX_FILE = path.join(KNOWLEDGE_BASE_DIR, '.search-index.json');

// Enhanced document structure
class EnhancedDocument {
  constructor(data) {
    this.id = data.id;
    this.filename = data.filename;
    this.title = data.title;
    this.content = data.content;
    this.rawContent = data.rawContent;
    this.category = data.category;
    this.priority = data.priority;
    this.size = data.size;
    this.wordCount = data.wordCount;
    this.createdAt = data.createdAt;
    this.modifiedAt = data.modifiedAt;
    
    // Enhanced fields
    this.yamlBlocks = data.yamlBlocks || [];
    this.aliasTerms = data.aliasTerms || [];
    this.searchKeywords = data.searchKeywords || [];
    this.useCases = data.useCases || [];
    this.exampleScenarios = data.exampleScenarios || [];
    this.structuredData = data.structuredData || {};
    this.tfIdfVector = data.tfIdfVector || {};
  }
}

// TF-IDF Calculator
class TFIDFCalculator {
  constructor() {
    this.documentFrequency = new Map();
    this.totalDocuments = 0;
    this.vocabulary = new Set();
  }

  // Calculate term frequency for a document
  calculateTF(terms) {
    const tf = new Map();
    const totalTerms = terms.length;
    
    for (const term of terms) {
      tf.set(term, (tf.get(term) || 0) + 1);
    }
    
    // Normalize by total terms
    for (const [term, count] of tf) {
      tf.set(term, count / totalTerms);
    }
    
    return tf;
  }

  // Calculate inverse document frequency
  calculateIDF(term) {
    const df = this.documentFrequency.get(term) || 0;
    if (df === 0) return 0;
    return Math.log(this.totalDocuments / df);
  }

  // Build vocabulary and document frequency from all documents
  buildVocabulary(documents) {
    this.totalDocuments = documents.length;
    this.documentFrequency.clear();
    this.vocabulary.clear();

    for (const doc of documents) {
      const terms = this.extractTerms(doc.content + ' ' + doc.title);
      const uniqueTerms = new Set(terms);
      
      for (const term of uniqueTerms) {
        this.vocabulary.add(term);
        this.documentFrequency.set(term, (this.documentFrequency.get(term) || 0) + 1);
      }
    }
  }

  // Extract and normalize terms
  extractTerms(text) {
    return text.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2 && !this.isStopWord(term));
  }

  // Simple stop words list
  isStopWord(word) {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
      'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
    ]);
    return stopWords.has(word);
  }

  // Calculate TF-IDF vector for a document
  calculateTFIDF(document) {
    const terms = this.extractTerms(document.content + ' ' + document.title);
    const tf = this.calculateTF(terms);
    const tfidf = new Map();

    for (const [term, tfValue] of tf) {
      const idf = this.calculateIDF(term);
      tfidf.set(term, tfValue * idf);
    }

    return Object.fromEntries(tfidf);
  }
}

// YAML Content Parser
class YAMLParser {
  static parseContent(content) {
    const yamlBlocks = [];
    const lines = content.split('\n');
    let inYamlBlock = false;
    let currentBlock = [];
    let blockStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '```yaml' || line === '```yml') {
        inYamlBlock = true;
        blockStart = i;
        currentBlock = [];
      } else if (line === '```' && inYamlBlock) {
        inYamlBlock = false;
        try {
          const yamlContent = currentBlock.join('\n');
          const parsed = yaml.load(yamlContent);
          yamlBlocks.push({
            startLine: blockStart,
            endLine: i,
            content: yamlContent,
            parsed: parsed
          });
        } catch (error) {
          console.warn(`Failed to parse YAML block at line ${blockStart}:`, error.message);
        }
      } else if (inYamlBlock) {
        currentBlock.push(lines[i]);
      }
    }

    return yamlBlocks;
  }

  static extractStructuredData(yamlBlocks) {
    const structuredData = {
      services: [],
      products: [],
      features: [],
      aliasTerms: [],
      searchKeywords: [],
      useCases: [],
      exampleScenarios: [],
      categories: [],
      manualPriority: null
    };

    for (const block of yamlBlocks) {
      const data = block.parsed;
      if (!data || typeof data !== 'object') continue;

      // Extract alias terms
      if (data.alias_terms && Array.isArray(data.alias_terms)) {
        structuredData.aliasTerms.push(...data.alias_terms);
      }

      // Extract search keywords
      if (data.search_keywords && Array.isArray(data.search_keywords)) {
        structuredData.searchKeywords.push(...data.search_keywords);
      }

      // Extract use cases
      if (data.use_cases && Array.isArray(data.use_cases)) {
        structuredData.useCases.push(...data.use_cases);
      }

      // Extract example scenarios
      if (data.example_scenarios && Array.isArray(data.example_scenarios)) {
        structuredData.exampleScenarios.push(...data.example_scenarios);
      }

      // Extract manual priority
      if (data.priority && typeof data.priority === 'number') {
        structuredData.manualPriority = Math.max(0.1, Math.min(10, data.priority)); // Clamp between 0.1 and 10
      }

      // Extract service information
      if (data.service_type) {
        structuredData.services.push({
          type: data.service_type,
          category: data.category,
          description: data.description,
          features: data.features
        });
      }

      // Extract categories
      if (data.category) {
        structuredData.categories.push(data.category);
      }
    }

    // Remove duplicates
    Object.keys(structuredData).forEach(key => {
      if (Array.isArray(structuredData[key])) {
        structuredData[key] = [...new Set(structuredData[key])];
      }
    });

    return structuredData;
  }
}

// Enhanced Search Engine
class EnhancedSearchEngine {
  constructor() {
    this.tfidfCalculator = new TFIDFCalculator();
    this.documents = [];
    this.searchIndex = new Map();
  }

  // Build search index
  buildIndex(documents) {
    this.documents = documents;
    this.tfidfCalculator.buildVocabulary(documents);
    
    // Calculate TF-IDF vectors for all documents
    for (const doc of documents) {
      doc.tfIdfVector = this.tfidfCalculator.calculateTFIDF(doc);
    }

    // Build inverted index
    this.searchIndex.clear();
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const terms = this.tfidfCalculator.extractTerms(
        doc.content + ' ' + doc.title + ' ' + 
        doc.aliasTerms.join(' ') + ' ' + 
        doc.searchKeywords.join(' ')
      );
      
      for (const term of new Set(terms)) {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, []);
        }
        this.searchIndex.get(term).push(i);
      }
    }
  }

  // Enhanced search with multiple ranking factors
  search(query, maxResults = 5, options = {}) {
    const {
      fuzzyMatch = true,
      semanticBoost = true,
      categoryFilter = null,
      priorityBoost = true
    } = options;

    const queryTerms = this.tfidfCalculator.extractTerms(query);
    if (queryTerms.length === 0) return [];

    const candidateDocuments = new Set();
    const termScores = new Map();

    // Find candidate documents using inverted index
    for (const term of queryTerms) {
      const exactMatches = this.searchIndex.get(term) || [];
      exactMatches.forEach(docIndex => {
        candidateDocuments.add(docIndex);
        termScores.set(docIndex, (termScores.get(docIndex) || 0) + 1);
      });

      // Fuzzy matching for typos
      if (fuzzyMatch) {
        for (const [indexTerm, docIndices] of this.searchIndex) {
          if (this.calculateLevenshteinDistance(term, indexTerm) <= 2) {
            docIndices.forEach(docIndex => {
              candidateDocuments.add(docIndex);
              termScores.set(docIndex, (termScores.get(docIndex) || 0) + 0.5);
            });
          }
        }
      }
    }

    // Calculate relevance scores
    const results = [];
    for (const docIndex of candidateDocuments) {
      const doc = this.documents[docIndex];
      
      // Apply category filter
      if (categoryFilter && doc.category !== categoryFilter) {
        continue;
      }

      let score = this.calculateRelevanceScore(doc, queryTerms, termScores.get(docIndex) || 0);
      
      // Apply priority boost
      if (priorityBoost) {
        score *= (doc.priority || 1);
      }

      // Extract relevant snippets
      const snippets = this.extractRelevantSnippets(doc, queryTerms, 3);
      
      results.push({
        document: doc,
        score,
        matchedTerms: queryTerms.filter(term => 
          doc.content.toLowerCase().includes(term) ||
          doc.title.toLowerCase().includes(term) ||
          doc.aliasTerms.some(alias => alias.toLowerCase().includes(term))
        ),
        snippets
      });
    }

    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Calculate comprehensive relevance score
  calculateRelevanceScore(document, queryTerms, termMatchCount) {
    let score = 0;

    // TF-IDF score
    for (const term of queryTerms) {
      score += document.tfIdfVector[term] || 0;
    }

    // Title match bonus
    const titleMatches = queryTerms.filter(term => 
      document.title.toLowerCase().includes(term)
    ).length;
    score += titleMatches * 5;

    // Alias terms match bonus
    const aliasMatches = queryTerms.filter(term => 
      document.aliasTerms.some(alias => alias.toLowerCase().includes(term))
    ).length;
    score += aliasMatches * 3;

    // Search keywords match bonus
    const keywordMatches = queryTerms.filter(term => 
      Array.isArray(document.searchKeywords) && document.searchKeywords.some(keyword => 
        typeof keyword === 'string' && keyword.toLowerCase().includes(term)
      )
    ).length;
    score += keywordMatches * 4;

    // Use cases and examples match bonus
    const useCaseMatches = queryTerms.filter(term => 
      Array.isArray(document.useCases) && document.useCases.some(useCase => 
        typeof useCase === 'string' && useCase.toLowerCase().includes(term)
      )
    ).length;
    score += useCaseMatches * 2;

    // Term match count bonus
    score += termMatchCount * 1.5;

    return score;
  }

  // Extract relevant snippets with context
  extractRelevantSnippets(document, queryTerms, maxSnippets = 3) {
    const sentences = document.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const snippets = [];

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      let relevance = 0;
      let matchedTerms = [];

      for (const term of queryTerms) {
        if (lowerSentence.includes(term)) {
          relevance++;
          matchedTerms.push(term);
        }
      }

      if (relevance > 0) {
        snippets.push({
          text: sentence.trim(),
          relevance,
          matchedTerms
        });
      }
    }

    return snippets
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxSnippets)
      .map(s => s.text);
  }

  // Calculate Levenshtein distance for fuzzy matching
  calculateLevenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

// Enhanced Document Manager
class EnhancedDocumentManager {
  constructor() {
    this.searchEngine = new EnhancedSearchEngine();
    this.documents = [];
    this.lastCacheUpdate = null;
  }

  // Load and process all documents
  async loadKnowledgeBase() {
    try {
      const files = fs.readdirSync(KNOWLEDGE_BASE_DIR)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.txt', '.md'].includes(ext) && !file.startsWith('.');
        });

      const documents = [];

      for (const file of files) {
        const filePath = path.join(KNOWLEDGE_BASE_DIR, file);
        const stats = fs.statSync(filePath);
        const rawContent = fs.readFileSync(filePath, 'utf8');

        // Parse YAML blocks
        const yamlBlocks = YAMLParser.parseContent(rawContent);
        const structuredData = YAMLParser.extractStructuredData(yamlBlocks);

        // Extract title
        let title = path.basename(file, path.extname(file));
        const firstLine = rawContent.split('\n')[0].trim();
        if (firstLine.startsWith('# ')) {
          title = firstLine.substring(2).trim();
        }

        // Determine category
        let category = this.determineCategory(file, rawContent, structuredData);

        // Create enhanced document
        const document = new EnhancedDocument({
          id: file,
          filename: file,
          title,
          content: rawContent,
          rawContent,
          category,
          priority: this.calculatePriority(structuredData, rawContent),
          size: stats.size,
          wordCount: rawContent.split(/\s+/).length,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          yamlBlocks,
          aliasTerms: structuredData.aliasTerms,
          searchKeywords: structuredData.searchKeywords,
          useCases: structuredData.useCases,
          exampleScenarios: structuredData.exampleScenarios,
          structuredData
        });

        documents.push(document);
      }

      this.documents = documents;
      this.searchEngine.buildIndex(documents);

      // Cache the results
      await this.cacheDocuments(documents);
      
      return documents;
    } catch (error) {
      console.error('Error loading enhanced knowledge base:', error);
      return [];
    }
  }

  // Determine document category with enhanced logic
  determineCategory(filename, content, structuredData) {
    const filename_lower = filename.toLowerCase();
    const content_lower = content.toLowerCase();

    // Check structured data categories first
    if (structuredData.categories.length > 0) {
      return structuredData.categories[0];
    }

    // Enhanced category detection
    const categoryKeywords = {
      'asset_management': ['asset management', 'investment', 'portfolio', 'wealth management'],
      'payment_transactions': ['payment', 'transfer', 'transaction', 'invoice', 'bill'],
      'cybersecurity': ['security', 'cyber', 'threat', 'protection', 'fraud'],
      'banking': ['banking', 'account', 'card', 'loan', 'mortgage'],
      'investment': ['investment', 'trading', 'stocks', 'bonds', 'funds'],
      'wealth_management': ['wealth', 'private', 'advisory', 'planning']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => 
        filename_lower.includes(keyword) || content_lower.includes(keyword)
      )) {
        return category;
      }
    }

    return 'general';
  }

  // Calculate document priority based on content richness
  calculatePriority(structuredData, content) {
    // Use manual priority if specified
    if (structuredData.manualPriority !== null) {
      return structuredData.manualPriority;
    }

    // Otherwise, calculate automatic priority
    let priority = 1;

    // Boost priority based on structured data richness
    if (structuredData.aliasTerms.length > 0) priority += 0.5;
    if (structuredData.searchKeywords.length > 0) priority += 0.5;
    if (structuredData.useCases.length > 0) priority += 0.3;
    if (structuredData.exampleScenarios.length > 0) priority += 0.3;

    // Boost priority based on content length and structure
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 1000) priority += 0.5;
    if (wordCount > 2000) priority += 0.5;

    // Boost priority for YAML-enriched content
    const yamlBlockCount = (content.match(/```yaml/g) || []).length;
    priority += yamlBlockCount * 0.2;

    return Math.min(priority, 5); // Cap at 5
  }

  // Enhanced caching with compression
  async cacheDocuments(documents) {
    try {
      const cache = {
        lastUpdated: new Date().toISOString(),
        version: '2.0',
        documents: documents.map(doc => ({
          ...doc,
          // Compress large content for caching
          content: doc.content.length > 10000 ? 
            doc.content.substring(0, 10000) + '...[truncated]' : 
            doc.content
        }))
      };

      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      this.lastCacheUpdate = new Date();
    } catch (error) {
      console.error('Error caching documents:', error);
    }
  }

  // Get cached documents with validation
  async getCachedDocuments() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        
        // Check cache version and age
        if (cache.version === '2.0') {
          const cacheTime = new Date(cache.lastUpdated);
          const now = new Date();
          
          // Reload if cache is older than 10 minutes
          if (now - cacheTime < 10 * 60 * 1000) {
            // Validate cache against file system
            if (await this.validateCache(cache)) {
              this.documents = cache.documents.map(doc => new EnhancedDocument(doc));
              this.searchEngine.buildIndex(this.documents);
              return this.documents;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading enhanced cache:', error);
    }

    // Reload if cache is invalid or stale
    return await this.loadKnowledgeBase();
  }

  // Validate cache against file system
  async validateCache(cache) {
    try {
      const files = fs.readdirSync(KNOWLEDGE_BASE_DIR)
        .filter(file => ['.txt', '.md'].includes(path.extname(file).toLowerCase()) && !file.startsWith('.'));
      
      if (files.length !== cache.documents.length) {
        return false;
      }

      for (const file of files) {
        const filePath = path.join(KNOWLEDGE_BASE_DIR, file);
        const stats = fs.statSync(filePath);
        const cachedDoc = cache.documents.find(doc => doc.filename === file);
        
        if (!cachedDoc || new Date(cachedDoc.modifiedAt) < stats.mtime) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Enhanced search interface
  async searchDocuments(query, options = {}) {
    const {
      maxResults = 5,
      fuzzyMatch = true,
      categoryFilter = null,
      priorityBoost = true,
      includeSnippets = true
    } = options;

    // Ensure documents are loaded
    if (this.documents.length === 0) {
      await this.getCachedDocuments();
    }

    return this.searchEngine.search(query, maxResults, {
      fuzzyMatch,
      categoryFilter,
      priorityBoost
    });
  }

  // Get all documents
  async getAllDocuments() {
    if (this.documents.length === 0) {
      await this.getCachedDocuments();
    }
    return this.documents;
  }

  // Format search results for AI context
  formatSearchResults(results) {
    if (!results || results.length === 0) {
      return '';
    }

    let formatted = '\n\n=== ENHANCED KNOWLEDGE BASE INFORMATION ===\n';
    
    for (const result of results) {
      const doc = result.document;
      formatted += `\n## ${doc.title} (${doc.category})\n`;
      formatted += `Relevance Score: ${result.score.toFixed(2)}\n`;
      
      if (result.matchedTerms.length > 0) {
        formatted += `Matched Terms: ${result.matchedTerms.join(', ')}\n`;
      }
      
      if (result.snippets && result.snippets.length > 0) {
        formatted += 'Key Information:\n';
        for (const snippet of result.snippets) {
          formatted += `- ${snippet}\n`;
        }
      }
      
      // Include structured data if available
      if (doc.structuredData && Object.keys(doc.structuredData).length > 0) {
        if (doc.structuredData.useCases.length > 0) {
          formatted += `\nUse Cases: ${doc.structuredData.useCases.slice(0, 3).join(', ')}\n`;
        }
        if (doc.structuredData.searchKeywords.length > 0) {
          formatted += `Keywords: ${doc.structuredData.searchKeywords.slice(0, 5).join(', ')}\n`;
        }
      }
      
      formatted += `\n`;
    }
    
    formatted += '=== END ENHANCED KNOWLEDGE BASE INFORMATION ===\n\n';
    
    return formatted;
  }
}

// Create singleton instance
const enhancedDocumentManager = new EnhancedDocumentManager();

// Export enhanced functions
export async function searchDocuments(query, maxResults = 5, options = {}) {
  return await enhancedDocumentManager.searchDocuments(query, { maxResults, ...options });
}

export async function getAllDocuments() {
  return await enhancedDocumentManager.getAllDocuments();
}

export function formatSearchResults(results) {
  return enhancedDocumentManager.formatSearchResults(results);
}

export async function initializeKnowledgeBase() {
  console.log('Initializing enhanced knowledge base...');
  const documents = await enhancedDocumentManager.getCachedDocuments();
  console.log(`Loaded ${documents.length} enhanced documents from knowledge base`);
  return documents;
}

export { EnhancedDocumentManager, EnhancedSearchEngine, YAMLParser };
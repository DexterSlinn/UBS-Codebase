import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Knowledge base directory - users can add files here directly
const KNOWLEDGE_BASE_DIR = path.join(__dirname, 'knowledge-base');
const CACHE_FILE = path.join(KNOWLEDGE_BASE_DIR, '.cache.json');

// Ensure knowledge base directory exists
if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
  fs.mkdirSync(KNOWLEDGE_BASE_DIR, { recursive: true });
  
  // Create a sample document
  const sampleContent = `# UBS Switzerland Banking Services

## Personal Banking
UBS offers comprehensive personal banking services including:
- Current accounts with competitive rates
- Savings accounts with flexible terms
- Credit cards with global acceptance
- Personal loans and mortgages

## Investment Services
- Wealth management for high-net-worth individuals
- Portfolio management and advisory services
- Trading platforms for stocks, bonds, and derivatives
- Retirement planning and pension solutions

## Digital Banking
- UBS Mobile Banking app with biometric security
- Online banking platform with real-time transactions
- Digital payment solutions including UBS TWINT
- 24/7 customer support through digital channels

## Contact Information
- Phone: +41 44 234 1111
- Email: info@ubs.com
- Website: www.ubs.com/ch
- Branches: Over 200 locations across Switzerland`;
  
  fs.writeFileSync(path.join(KNOWLEDGE_BASE_DIR, 'ubs-services.md'), sampleContent);
}

/**
 * Load and cache knowledge base documents
 */
function loadKnowledgeBase() {
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
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from first line if it's a markdown header, otherwise use filename
      let title = path.basename(file, path.extname(file));
      const firstLine = content.split('\n')[0].trim();
      if (firstLine.startsWith('# ')) {
        title = firstLine.substring(2).trim();
      }
      
      // Determine category from filename or content
      let category = 'general';
      const filename = file.toLowerCase();
      if (filename.includes('banking') || filename.includes('account')) {
        category = 'banking';
      } else if (filename.includes('investment') || filename.includes('trading')) {
        category = 'investment';
      } else if (filename.includes('policy') || filename.includes('terms')) {
        category = 'policy';
      } else if (filename.includes('faq') || filename.includes('help')) {
        category = 'faq';
      }
      
      // Default priority for all documents
      let priority = 3;
      
      documents.push({
        id: file,
        filename: file,
        title,
        content,
        category,
        priority,
        size: stats.size,
        wordCount: content.split(/\s+/).length,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString()
      });
    }
    
    // Cache the results
    const cache = {
      lastUpdated: new Date().toISOString(),
      documents
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    return documents;
    
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return [];
  }
}

/**
 * Get cached documents or reload if cache is stale
 */
function getCachedDocuments() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const cacheTime = new Date(cache.lastUpdated);
      const now = new Date();
      
      // Reload if cache is older than 5 minutes or if any file has been modified
      if (now - cacheTime < 5 * 60 * 1000) {
        const files = fs.readdirSync(KNOWLEDGE_BASE_DIR)
          .filter(file => ['.txt', '.md'].includes(path.extname(file).toLowerCase()) && !file.startsWith('.'));
        
        let cacheValid = true;
        for (const file of files) {
          const filePath = path.join(KNOWLEDGE_BASE_DIR, file);
          const stats = fs.statSync(filePath);
          const cachedDoc = cache.documents.find(doc => doc.filename === file);
          
          if (!cachedDoc || new Date(cachedDoc.modifiedAt) < stats.mtime) {
            cacheValid = false;
            break;
          }
        }
        
        if (cacheValid && cache.documents.length === files.length) {
          return cache.documents;
        }
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  
  // Reload knowledge base
  return loadKnowledgeBase();
}

/**
 * Search documents by keywords
 */
export function searchDocuments(query, maxResults = 5) {
  const documents = getCachedDocuments();
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  if (queryWords.length === 0) {
    return [];
  }
  
  const results = [];
  
  for (const doc of documents) {
    const content = doc.content.toLowerCase();
    const title = doc.title.toLowerCase();
    
    let score = 0;
    let matchedWords = [];
    
    for (const word of queryWords) {
      // Escape special regex characters to prevent syntax errors
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Title matches are worth more
      const titleMatches = (title.match(new RegExp(escapedWord, 'g')) || []).length;
      score += titleMatches * 10;
      
      // Content matches
      const contentMatches = (content.match(new RegExp(escapedWord, 'g')) || []).length;
      score += contentMatches * 2;
      
      if (titleMatches > 0 || contentMatches > 0) {
        matchedWords.push(word);
      }
    }
    
    // Boost score based on priority
    score *= doc.priority;
    
    // Boost score for category relevance
    if (doc.category === 'banking' && query.toLowerCase().includes('bank')) {
      score *= 1.5;
    }
    if (doc.category === 'investment' && (query.toLowerCase().includes('invest') || query.toLowerCase().includes('trading'))) {
      score *= 1.5;
    }
    
    if (score > 0) {
      // Extract relevant snippets
      const snippets = extractSnippets(doc.content, queryWords, 3);
      
      results.push({
        document: doc,
        score,
        matchedWords,
        snippets
      });
    }
  }
  
  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Extract relevant snippets from content
 */
function extractSnippets(content, queryWords, maxSnippets = 3) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const snippets = [];
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    let relevance = 0;
    
    for (const word of queryWords) {
      if (lowerSentence.includes(word)) {
        relevance++;
      }
    }
    
    if (relevance > 0) {
      snippets.push({
        text: sentence.trim(),
        relevance
      });
    }
  }
  
  return snippets
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxSnippets)
    .map(s => s.text);
}

/**
 * Get all documents
 */
export function getAllDocuments() {
  return getCachedDocuments();
}

/**
 * Format search results for AI context
 */
export function formatSearchResults(results) {
  if (!results || results.length === 0) {
    return '';
  }

  let formatted = '\n\n=== RELEVANT KNOWLEDGE BASE INFORMATION ===\n';
  
  for (const result of results) {
    const doc = result.document;
    formatted += `\n## ${doc.title} (${doc.category})\n`;
    
    if (result.snippets && result.snippets.length > 0) {
      formatted += 'Key information:\n';
      for (const snippet of result.snippets) {
        formatted += `- ${snippet}\n`;
      }
    } else {
      // If no snippets, include first 500 characters
      const preview = doc.content.substring(0, 500);
      formatted += `${preview}${doc.content.length > 500 ? '...' : ''}\n`;
    }
    
    formatted += `\n`;
  }
  
  formatted += '=== END KNOWLEDGE BASE INFORMATION ===\n\n';
  
  return formatted;
}

/**
 * Initialize knowledge base on startup
 */
export function initializeKnowledgeBase() {
  console.log('Initializing knowledge base...');
  const documents = loadKnowledgeBase();
  console.log(`Loaded ${documents.length} documents from knowledge base`);
  return documents;
}
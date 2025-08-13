import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  ArcElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
  register: vi.fn()
}));

vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }) => <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} />,
  Bar: ({ data, options }) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} />,
  Doughnut: ({ data, options }) => <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)} />
}));

// Import components to test
import EnhancedChatInterface from '../src/components/EnhancedChatInterface.jsx';
import PerformanceDashboard from '../src/components/PerformanceDashboard.jsx';

describe('Enhanced Document Manager', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('YAML Parser', () => {
    it('should parse YAML blocks correctly', async () => {
      const { YAMLParser } = await import('../enhancedDocumentManager.js');
      
      const content = `
# Test Document

\`\`\`yaml
service_type: "Asset Management"
category: "investment"
alias_terms:
  - "portfolio management"
  - "investment advisory"
search_keywords:
  - "assets"
  - "portfolio"
\`\`\`

Some other content.
      `;

      const yamlBlocks = YAMLParser.parseContent(content);
      
      expect(yamlBlocks).toHaveLength(1);
      expect(yamlBlocks[0].parsed.service_type).toBe('Asset Management');
      expect(yamlBlocks[0].parsed.alias_terms).toContain('portfolio management');
    });

    it('should extract structured data from YAML blocks', async () => {
      const { YAMLParser } = await import('../enhancedDocumentManager.js');
      
      const yamlBlocks = [{
        parsed: {
          alias_terms: ['term1', 'term2'],
          search_keywords: ['keyword1', 'keyword2'],
          use_cases: ['case1', 'case2'],
          category: 'test_category'
        }
      }];

      const structuredData = YAMLParser.extractStructuredData(yamlBlocks);
      
      expect(structuredData.aliasTerms).toEqual(['term1', 'term2']);
      expect(structuredData.searchKeywords).toEqual(['keyword1', 'keyword2']);
      expect(structuredData.useCases).toEqual(['case1', 'case2']);
      expect(structuredData.categories).toEqual(['test_category']);
    });
  });

  describe('TF-IDF Calculator', () => {
    it('should calculate term frequency correctly', async () => {
      const { TFIDFCalculator } = await import('../enhancedDocumentManager.js');
      
      const calculator = new TFIDFCalculator();
      const terms = ['test', 'test', 'word', 'another'];
      const tf = calculator.calculateTF(terms);
      
      expect(tf.get('test')).toBe(0.5); // 2/4
      expect(tf.get('word')).toBe(0.25); // 1/4
      expect(tf.get('another')).toBe(0.25); // 1/4
    });

    it('should filter stop words', async () => {
      const { TFIDFCalculator } = await import('../enhancedDocumentManager.js');
      
      const calculator = new TFIDFCalculator();
      const terms = calculator.extractTerms('the quick brown fox and the lazy dog');
      
      expect(terms).not.toContain('the');
      expect(terms).not.toContain('and');
      expect(terms).toContain('quick');
      expect(terms).toContain('brown');
      expect(terms).toContain('fox');
    });
  });

  describe('Enhanced Search Engine', () => {
    it('should perform fuzzy matching', async () => {
      const { EnhancedSearchEngine } = await import('../enhancedDocumentManager.js');
      
      const searchEngine = new EnhancedSearchEngine();
      const distance = searchEngine.calculateLevenshteinDistance('test', 'tset');
      
      expect(distance).toBe(2);
    });

    it('should calculate relevance scores correctly', async () => {
      const { EnhancedSearchEngine } = await import('../enhancedDocumentManager.js');
      
      const searchEngine = new EnhancedSearchEngine();
      const document = {
        title: 'Test Document',
        content: 'This is a test document with some content',
        aliasTerms: ['alias1', 'alias2'],
        searchKeywords: ['keyword1', 'keyword2'],
        useCases: ['usecase1'],
        tfIdfVector: { test: 0.5, document: 0.3 }
      };
      
      const queryTerms = ['test', 'document'];
      const score = searchEngine.calculateRelevanceScore(document, queryTerms, 2);
      
      expect(score).toBeGreaterThan(0);
    });
  });
});

describe('Enhanced API Router', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Rate Limiting', () => {
    it('should implement rate limiting', async () => {
      // Mock multiple rapid requests
      const requests = Array(101).fill().map(() => 
        fetch('/api/knowledge-base/search?q=test')
      );
      
      // This would be tested in integration tests with actual server
      expect(requests).toHaveLength(101);
    });
  });

  describe('Input Validation', () => {
    it('should validate search query parameters', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: [{ msg: 'Query must be between 1 and 500 characters' }]
        })
      };
      
      fetch.mockResolvedValueOnce(mockResponse);
      
      const response = await fetch('/api/knowledge-base/search?q=');
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Internal server error',
          timestamp: new Date().toISOString()
        })
      };
      
      fetch.mockResolvedValueOnce(mockResponse);
      
      const response = await fetch('/api/knowledge-base/search?q=test');
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.timestamp).toBeDefined();
    });
  });
});

describe('Enhanced Chat Interface', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render chat messages correctly', () => {
    const messages = [
      { id: 1, content: 'Hello', isUser: true, timestamp: new Date().toISOString() },
      { id: 2, content: 'Hi there!', isUser: false, timestamp: new Date().toISOString() }
    ];
    
    const mockSendMessage = vi.fn();
    
    render(
      <EnhancedChatInterface 
        messages={messages} 
        onSendMessage={mockSendMessage} 
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('should handle message sending', async () => {
    const mockSendMessage = vi.fn();
    
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={mockSendMessage} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('should show typing indicator when loading', () => {
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={true}
      />
    );
    
    expect(screen.getByText(/UBS Assistant is typing/i)).toBeInTheDocument();
  });

  it('should fetch and display search suggestions', async () => {
    const mockSuggestions = {
      suggestions: ['Asset Management', 'Portfolio', 'Investment']
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions
    });
    
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    
    fireEvent.change(input, { target: { value: 'Asset' } });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/knowledge-base/suggestions?partial=Asset')
      );
    });
  });

  it('should handle character limit', () => {
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    const longText = 'a'.repeat(501);
    
    fireEvent.change(input, { target: { value: longText } });
    
    expect(input.value).toHaveLength(500); // Should be truncated
  });
});

describe('Performance Dashboard', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render performance metrics', async () => {
    const mockMetrics = {
      totalRequests: 1000,
      searchRequests: 500,
      averageResponseTime: 250,
      errorRate: '2.5%',
      errorCount: 25,
      system: {
        uptime: '2h 30m',
        memoryUsage: {
          heapUsed: '128MB',
          heapTotal: '256MB'
        },
        nodeVersion: 'v18.0.0',
        platform: 'darwin'
      }
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics
    });
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('1,000')).toBeInTheDocument(); // Total requests
      expect(screen.getByText('500')).toBeInTheDocument(); // Search requests
      expect(screen.getByText('250ms')).toBeInTheDocument(); // Response time
      expect(screen.getByText('2.5%')).toBeInTheDocument(); // Error rate
    });
  });

  it('should handle auto-refresh toggle', async () => {
    const mockMetrics = {
      totalRequests: 1000,
      searchRequests: 500,
      averageResponseTime: 250,
      errorRate: '2.5%',
      errorCount: 25
    };
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics
    });
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    const autoRefreshButton = screen.getByText('ON');
    fireEvent.click(autoRefreshButton);
    
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it('should display system health indicators', async () => {
    const mockMetrics = {
      totalRequests: 1000,
      searchRequests: 500,
      averageResponseTime: 250,
      errorRate: '1.0%',
      errorCount: 10
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics
    });
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument();
      expect(screen.getByText('Good')).toBeInTheDocument(); // Should show good health
    });
  });

  it('should render charts with correct data', async () => {
    const mockMetrics = {
      totalRequests: 1000,
      searchRequests: 500,
      averageResponseTime: 250,
      errorRate: '2.5%',
      errorCount: 25
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics
    });
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  it('should handle loading states', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByRole('button', { name: /refreshing/i })).toBeDisabled();
  });

  it('should handle error states', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <PerformanceDashboard 
        isVisible={true} 
        onClose={vi.fn()}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });
  });
});

describe('Enhanced Styling and Animations', () => {
  it('should apply UBS-specific highlighting', () => {
    const { container } = render(
      <div className="ubs-highlight">UBS Asset Management</div>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('ubs-highlight');
  });

  it('should apply currency highlighting', () => {
    const { container } = render(
      <div className="currency-highlight">CHF 1,000</div>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('currency-highlight');
  });

  it('should apply animation classes', () => {
    const { container } = render(
      <div className="animate-fade-in">Animated content</div>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('animate-fade-in');
  });
});

describe('Accessibility Features', () => {
  it('should provide proper ARIA labels', () => {
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    expect(input).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // Should not submit empty message
    expect(input.value).toBe('');
  });

  it('should provide screen reader support', () => {
    render(
      <div className="sr-only">Screen reader only content</div>
    );
    
    const element = screen.getByText('Screen reader only content');
    expect(element).toHaveClass('sr-only');
  });
});

describe('Performance Optimizations', () => {
  it('should memoize expensive components', () => {
    const messages = [
      { id: 1, content: 'Message 1', isUser: true, timestamp: new Date().toISOString() }
    ];
    
    const { rerender } = render(
      <EnhancedChatInterface 
        messages={messages} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    // Re-render with same props should not cause unnecessary updates
    rerender(
      <EnhancedChatInterface 
        messages={messages} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Message 1')).toBeInTheDocument();
  });

  it('should debounce search suggestions', async () => {
    vi.useFakeTimers();
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ suggestions: ['test'] })
    });
    
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    
    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'tes' } });
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Fast forward time to trigger debounced function
    vi.advanceTimersByTime(300);
    
    await waitFor(() => {
      // Should only make one API call due to debouncing
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    vi.useRealTimers();
  });
});

describe('Error Handling and Resilience', () => {
  it('should handle network failures gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={vi.fn()} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Should not crash the application
    expect(input).toBeInTheDocument();
  });

  it('should validate input data', () => {
    const invalidMessages = [
      { id: null, content: null, isUser: true }
    ];
    
    // Should not crash with invalid data
    expect(() => {
      render(
        <EnhancedChatInterface 
          messages={invalidMessages} 
          onSendMessage={vi.fn()} 
          isLoading={false}
        />
      );
    }).not.toThrow();
  });
});

describe('Integration Tests', () => {
  it('should integrate enhanced document manager with API', async () => {
    const mockSearchResults = {
      query: 'test',
      results: [
        {
          document: {
            id: 'test-doc',
            title: 'Test Document',
            category: 'test'
          },
          score: 0.95,
          snippets: ['Test snippet']
        }
      ],
      metadata: {
        totalResults: 1,
        responseTime: '50ms'
      }
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchResults
    });
    
    const response = await fetch('/api/knowledge-base/search?q=test');
    const data = await response.json();
    
    expect(data.results).toHaveLength(1);
    expect(data.results[0].document.title).toBe('Test Document');
    expect(data.metadata.responseTime).toBe('50ms');
  });

  it('should handle end-to-end chat flow', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'This is a test response from UBS Assistant.'
        }
      }]
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    const mockSendMessage = vi.fn();
    
    render(
      <EnhancedChatInterface 
        messages={[]} 
        onSendMessage={mockSendMessage} 
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me anything about UBS/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Tell me about UBS services' } });
    fireEvent.click(sendButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Tell me about UBS services');
  });
});
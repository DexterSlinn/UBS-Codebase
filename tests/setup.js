import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this);
  }
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollTo
window.scrollTo = () => {};

// Mock localStorage
const localStorageMock = {
  getItem: (key) => {
    return localStorageMock[key] || null;
  },
  setItem: (key, value) => {
    localStorageMock[key] = value;
  },
  removeItem: (key) => {
    delete localStorageMock[key];
  },
  clear: () => {
    Object.keys(localStorageMock).forEach(key => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key];
      }
    });
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Only show React errors that are not expected
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  // Filter out common React warnings in tests
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('componentWillReceiveProps') || 
       args[0].includes('componentWillUpdate'))) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Global test utilities
global.testUtils = {
  // Helper to create mock API responses
  createMockResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  }),
  
  // Helper to create mock error responses
  createMockError: (message, status = 500) => ({
    ok: false,
    status,
    json: async () => ({ error: message, timestamp: new Date().toISOString() }),
    text: async () => JSON.stringify({ error: message })
  }),
  
  // Helper to wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to create mock chat messages
  createMockMessage: (content, isUser = true, id = Date.now()) => ({
    id,
    content,
    isUser,
    timestamp: new Date().toISOString()
  }),
  
  // Helper to create mock document data
  createMockDocument: (overrides = {}) => ({
    id: 'mock-doc-1',
    filename: 'mock-document.md',
    title: 'Mock Document',
    content: 'This is mock document content for testing.',
    category: 'general',
    priority: 1,
    size: 1024,
    wordCount: 8,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    aliasTerms: ['mock', 'test'],
    searchKeywords: ['mock', 'document', 'test'],
    useCases: ['testing'],
    tfIdfVector: { mock: 0.5, document: 0.3, test: 0.2 },
    ...overrides
  })
};
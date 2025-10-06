// Environment setup for Jest tests
// This file runs before setup.js

// Ensure we're in a browser-like environment
if (typeof window === 'undefined') {
  throw new Error('Tests must run in jsdom environment');
}

// Set up any global environment variables needed for tests
global.TEST_ENV = 'jest';

// Mock performance.now() for consistent timing in tests
if (!global.performance) {
  global.performance = {};
}

if (!global.performance.now) {
  global.performance.now = () => Date.now();
}

// Mock performance.memory for memory testing utilities
if (!global.performance.memory) {
  global.performance.memory = {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  };
}

// Ensure CustomEvent is available
if (typeof CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, params = {}) {
      super(type, params);
      this.detail = params.detail;
    }
  };
}

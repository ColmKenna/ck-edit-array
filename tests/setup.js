// Jest test setup for EditArray web component
// This file runs before each test file

// Import the component for testing
import '../src/ck-edit-array.js';

// Polyfills for JSDOM environment
global.CSSStyleSheet = global.CSSStyleSheet || class CSSStyleSheet {
  constructor() {
    this.cssRules = [];
  }
  
  replaceSync(css) {
    // Mock implementation
  }
  
  insertRule(rule, index) {
    this.cssRules.splice(index || this.cssRules.length, 0, rule);
    return index || this.cssRules.length - 1;
  }
  
  deleteRule(index) {
    this.cssRules.splice(index, 1);
  }
};

// Mock constructable stylesheets adoption if not supported
if (!document.documentElement.attachShadow) {
  // Basic Shadow DOM polyfill for testing
  HTMLElement.prototype.attachShadow = function(options) {
    const shadowRoot = document.createElement('div');
    shadowRoot.mode = options.mode || 'open';
    shadowRoot.host = this;
    shadowRoot.adoptedStyleSheets = [];
    
    // Mock shadow DOM methods
    shadowRoot.querySelector = function(selector) {
      return this.querySelector.call(this, selector);
    }.bind(shadowRoot);
    
    shadowRoot.querySelectorAll = function(selector) {
      return this.querySelectorAll.call(this, selector);
    }.bind(shadowRoot);
    
    this.shadowRoot = shadowRoot;
    return shadowRoot;
  };
}

// Custom matchers for EditArray testing
expect.extend({
  toHaveValidStructure(received) {
    const pass = received && 
                 received.shadowRoot && 
                 received.shadowRoot.querySelector('.edit-array-container');
    
    return {
      message: () => 
        pass 
          ? `Expected element to not have valid EditArray structure`
          : `Expected element to have valid EditArray structure with shadow DOM and container`,
      pass,
    };
  },
  
  toHaveItems(received, expectedCount) {
    const items = received.shadowRoot?.querySelectorAll('.edit-array-item') || [];
    const pass = items.length === expectedCount;
    
    return {
      message: () => 
        pass
          ? `Expected element to not have ${expectedCount} items`
          : `Expected element to have ${expectedCount} items, but found ${items.length}`,
      pass,
    };
  },
  
  toBeInEditMode(received, index) {
    const item = received.shadowRoot?.querySelector(`[data-index="${index}"]`);
    const isEditing = item?.classList.contains('editing') || 
                     item?.querySelector('input, select, textarea') !== null;
    
    return {
      message: () => 
        isEditing
          ? `Expected item at index ${index} to not be in edit mode`
          : `Expected item at index ${index} to be in edit mode`,
      pass: isEditing,
    };
  },
  
  toHaveValidationError(received, fieldName) {
    const input = received.shadowRoot?.querySelector(`[name="${fieldName}"]`);
    const hasError = input?.classList.contains('invalid') || 
                    input?.getAttribute('aria-invalid') === 'true';
    
    return {
      message: () =>
        hasError
          ? `Expected field "${fieldName}" to not have validation error`
          : `Expected field "${fieldName}" to have validation error`,
      pass: hasError,
    };
  },
});

// Helper functions for testing
global.createEditArray = (options = {}) => {
  const editArray = document.createElement('ck-edit-array');
  
  // Set default attributes
  if (options.data) {
    editArray.setAttribute('data', JSON.stringify(options.data));
  }
  if (options.arrayField) {
    editArray.setAttribute('array-field', options.arrayField);
  }
  if (options.theme) {
    editArray.setAttribute('theme', options.theme);
  }
  
  // Add templates if provided
  if (options.displayTemplate) {
    const displayTemplate = document.createElement('template');
    displayTemplate.setAttribute('slot', 'display');
    displayTemplate.innerHTML = options.displayTemplate;
    editArray.appendChild(displayTemplate);
  }
  
  if (options.editTemplate) {
    const editTemplate = document.createElement('template');
    editTemplate.setAttribute('slot', 'edit');
    editTemplate.innerHTML = options.editTemplate;
    editArray.appendChild(editTemplate);
  }
  
  return editArray;
};

global.waitForComponent = (element, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Component initialization timeout'));
    }, timeout);
    
    if (element.shadowRoot && element.shadowRoot.querySelector('.edit-array-container')) {
      clearTimeout(timer);
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      if (element.shadowRoot && element.shadowRoot.querySelector('.edit-array-container')) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(element, { 
      childList: true, 
      subtree: true,
      attributes: true,
    });
  });
};

global.generateTestData = (count = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index === 0 ? 'admin' : 'user',
  }));
};

// Performance testing utilities
global.measurePerformance = async (fn, iterations = 1) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    times,
  };
};

// Memory testing utilities
global.getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }
  return null;
};

// Accessibility testing helpers
global.getAriaAttributes = (element) => {
  const attributes = {};
  for (const attr of element.attributes) {
    if (attr.name.startsWith('aria-') || attr.name === 'role') {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
};

global.simulateKeyboardNavigation = (element, keys) => {
  keys.forEach(key => {
    const event = new KeyboardEvent('keydown', {
      key,
      code: key,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  });
};

// Console monitoring for tests
global.consoleWarnSpy = null;
global.consoleErrorSpy = null;

beforeEach(() => {
  // Clear any existing components
  document.body.innerHTML = '';
  
  // Set up console spies
  global.consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  global.consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Clean up components
  document.body.innerHTML = '';
  
  // Restore console
  if (global.consoleWarnSpy) {
    global.consoleWarnSpy.mockRestore();
  }
  if (global.consoleErrorSpy) {
    global.consoleErrorSpy.mockRestore();
  }
  
  // Clear any timeouts or intervals
  jest.clearAllTimers();
});

// Global test configuration
jest.setTimeout(10000);

// Suppress specific warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes && args[0].includes('EditArray: Missing')) {
    // Suppress warnings about missing templates in tests where that's expected
    return;
  }
  originalWarn.apply(console, args);
};
// Environment setup for Jest tests
// Sets up environment variables and global polyfills

// Set test environment
process.env.NODE_ENV = 'test';

// Mock environment variables
process.env.npm_package_version = '1.0.0';

// Polyfill for performance.now() if needed
if (!global.performance) {
  global.performance = {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  };
}

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for JSDOM
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Enhance JSDOM with additional DOM features
global.Range = class Range {
  getBoundingClientRect() {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }
  getClientRects() {
    return {
      item: () => null,
      length: 0,
    };
  }
};

// Mock scrollIntoView
global.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock focus method
global.HTMLElement.prototype.focus = jest.fn();

// Mock closest method for older JSDOM versions
if (!global.HTMLElement.prototype.closest) {
  global.HTMLElement.prototype.closest = function(selector) {
    let element = this;
    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  };
}

// Polyfill constructable stylesheets and adoptedStyleSheets support for tests
if (typeof global.CSSStyleSheet === 'undefined') {
  class PolyfilledCSSStyleSheet {
    constructor() {
      this._cssText = '';
    }
    replaceSync(css) {
      this._cssText = css;
    }
  }
  global.CSSStyleSheet = PolyfilledCSSStyleSheet;
}

if (typeof document !== 'undefined' && document.createElement) {
  const shadowHost = document.createElement('div');
  const shadow = shadowHost.attachShadow({ mode: 'open' });
  const shadowProto = Object.getPrototypeOf(shadow);

  const descriptor = Object.getOwnPropertyDescriptor(shadowProto, 'adoptedStyleSheets');
  if (!descriptor || !descriptor.configurable) {
    Object.defineProperty(shadowProto, 'adoptedStyleSheets', {
      configurable: true,
      get() {
        if (!this.__adoptedSheets) {
          this.__adoptedSheets = [];
        }
        return this.__adoptedSheets;
      },
      set(sheets) {
        this.__adoptedSheets = Array.isArray(sheets) ? sheets : [];
      }
    });
  }
}

// Suppress specific console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress known test warnings
    if (message.includes('EditArray: Missing') && 
        message.includes('template element')) {
      return; // Suppress template warnings in tests where this is expected
    }
    if (message.includes('JSDOM does not support')) {
      return; // Suppress JSDOM limitation warnings
    }
  }
  originalConsoleWarn.apply(console, args);
};
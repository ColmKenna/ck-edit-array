// Jest configuration for EditArray web component
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  setupFiles: ['<rootDir>/tests/env.js','<rootDir>/tests/setup.js'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/tests/**/*.spec.ts',
  ],
  
  // Module resolution
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/edit-array.js',
    '!src/**/*.config.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
  ],
  coverageThreshold: {
    global: {
      branches: 49,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  
  // Test execution
  verbose: true,
  bail: false,
  maxWorkers: '50%',
  
  // Timeouts
  testTimeout: 10000,
  
  // Mock configuration
  clearMocks: true,
  restoreMocks: true,
  
  // Watch mode configuration
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/docs/api/',
  ],
  
  // Error handling
  errorOnDeprecated: true,
  
  // Performance monitoring
  detectOpenHandles: false,
  detectLeaks: false,
  
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  
  // Notification (only in watch mode)
  notify: false,
  notifyMode: 'failure-change',
};
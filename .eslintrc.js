// ESLint configuration for EditArray web component
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier', // Must be last to override other configs
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Error prevention
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-unreachable': 'error',
    'no-duplicate-case': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    
    // Best practices
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'curly': ['error', 'all'],
    'dot-notation': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': ['error', { 
      allowShortCircuit: true,
      allowTernary: true 
    }],
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'radix': 'error',
    'yoda': 'error',
    
    // ES6+ features
    'arrow-spacing': 'error',
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-destructuring': ['error', {
      VariableDeclarator: { array: false, object: true },
      AssignmentExpression: { array: false, object: false }
    }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'rest-spread-spacing': 'error',
    'template-curly-spacing': 'error',
    
    // Console and debugging
    'no-console': ['warn', { 
      allow: ['warn', 'error', 'info', 'group', 'groupEnd', 'time', 'timeEnd'] 
    }],
    'no-debugger': 'warn',
    'no-alert': 'warn',
    
    // Styling (handled by Prettier, but some logical rules)
    'max-len': ['error', { 
      code: 100, 
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 4],
    'complexity': ['warn', 10],
    
    // Security
    'no-new-wrappers': 'error',
    'no-proto': 'error',
    'no-iterator': 'error',
    'no-extend-native': 'error',
  },
  overrides: [
    // Test files
    {
      files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      rules: {
        // Relax some rules for tests
        'no-console': 'off',
        'max-len': ['error', { code: 120 }],
        'max-nested-callbacks': 'off',
        'prefer-arrow-callback': 'off',
        
        // Jest-specific rules
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'jest/no-deprecated-functions': 'warn',
      },
    },
    
    // Example files
    {
      files: ['examples/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-alert': 'off',
        'prefer-const': 'warn',
      },
    },
    
    // Configuration files
    {
      files: [
        '.eslintrc.js',
        'jest.config.js',
        'rollup.config.js',
        'babel.config.js',
        '*.config.js',
      ],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
  
  // Global variables for web components
  globals: {
    // Web Components APIs
    customElements: 'readonly',
    HTMLElement: 'readonly',
    CustomEvent: 'readonly',
    ShadowRoot: 'readonly',
    CSSStyleSheet: 'readonly',
    
    // DOM APIs commonly used
    DocumentFragment: 'readonly',
    MutationObserver: 'readonly',
    ResizeObserver: 'readonly',
    IntersectionObserver: 'readonly',
    
    // Testing globals (when not using Jest env)
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    jest: 'readonly',
  },
  
  settings: {
    // Additional settings can be added here for specific plugins
  },
  
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'docs/api/', // Generated TypeDoc output
    '*.min.js',
    '*.bundle.js',
  ],
};
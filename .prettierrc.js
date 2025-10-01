// Prettier configuration for EditArray web component
module.exports = {
  // Basic formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  
  // Indentation
  tabWidth: 2,
  useTabs: false,
  
  // Line length
  printWidth: 100,
  
  // Spacing
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'avoid',
  
  // HTML/Template formatting
  htmlWhitespaceSensitivity: 'css',
  
  // File-specific overrides
  overrides: [
    // JavaScript/TypeScript files
    {
      files: ['*.js', '*.ts'],
      options: {
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
    
    // JSON files
    {
      files: ['*.json'],
      options: {
        singleQuote: false,
        trailingComma: 'none',
        printWidth: 120,
      },
    },
    
    // Markdown files
    {
      files: ['*.md'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    
    // HTML files (examples)
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'strict',
      },
    },
    
    // CSS files
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
        printWidth: 120,
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
      options: {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
      },
    },
    
    // Package.json gets special treatment
    {
      files: ['package.json'],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
  ],
};
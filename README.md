# EditArray Web Component

[![npm version](https://badge.fury.io/js/%40ck-templates%2Fedit-array.svg)](https://www.npmjs.com/package/@ck-templates/edit-array)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/yourusername/edit-array/workflows/Tests/badge.svg)](https://github.com/yourusername/edit-array/actions)
[![Coverage](https://codecov.io/gh/yourusername/edit-array/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/edit-array)

A modern, accessible web component for editing arrays of structured data with inline editing, validation, and form integration.

## 🚀 Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/@ck-templates/edit-array@latest/src/ck-edit-array.js"></script>
</head>
<body>
  <ck-edit-array array-field="users" data='[{"name":"John","email":"john@example.com"}]'>
    <template slot="display">
      <strong data-display-for="name"></strong>
      <em data-display-for="email"></em>
    </template>
    
    <template slot="edit">
      <input type="text" name="name" placeholder="Name" required>
      <input type="email" name="email" placeholder="Email" required>
    </template>
  </ck-edit-array>
</body>
</html>
```

## ✨ Features

- 🎯 **Zero Dependencies** - Pure web standards implementation
- ♿ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation
- 🎨 **Themeable** - CSS custom properties with 4 built-in themes
- 📱 **Responsive** - Works on all screen sizes and devices
- 🚀 **Performant** - Efficient rendering and memory management
- 🔧 **Framework Agnostic** - Works with React, Vue, Angular, Svelte, and vanilla JS
- ✅ **Form Integration** - Native HTML form compatibility
- 🛡️ **Type Safe** - Full TypeScript definitions included

## 📦 Installation

### NPM
```bash
npm install @ck-templates/edit-array
```

### CDN
```html
<script type="module" src="https://unpkg.com/@ck-templates/edit-array@latest/src/ck-edit-array.js"></script>
```

### Local Development
```bash
git clone https://github.com/yourusername/edit-array.git
cd edit-array
npm install
npm start
```

## 📖 Documentation

- **[User Guide](./docs/README.md)** - Complete usage documentation with examples
- **[Technical Guide](./docs/readme.technical.md)** - Architecture and implementation details
- **[API Specification](./docs/spec.md)** - Formal component specification
- **[Migration Guide](./docs/migration-guide.md)** - Migration from other solutions
- **[Interactive Demo](./examples/demo.html)** - Live examples and playground

## 🎯 Use Cases

### User Management
```html
<ck-edit-array array-field="users">
  <template slot="display">
    <div class="user-card">
      <h4 data-display-for="name"></h4>
      <p data-display-for="email"></p>
      <span data-display-for="role"></span>
    </div>
  </template>
  
  <template slot="edit">
    <input type="text" name="name" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <select name="role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </template>
</ck-edit-array>
```

### Product Configuration
```html
<ck-edit-array array-field="products" theme="forest-green">
  <template slot="display">
    <div class="product-item">
      <strong data-display-for="name"></strong>
      <span class="price" data-display-for="price"></span>
      <span class="category" data-display-for="category"></span>
    </div>
  </template>
  
  <template slot="edit">
    <input type="text" name="name" placeholder="Product Name" required>
    <input type="number" name="price" placeholder="Price" min="0" step="0.01" required>
    <input type="text" name="category" placeholder="Category">
  </template>
</ck-edit-array>
```

### Contact Information
```html
<ck-edit-array array-field="contacts" theme="warm-sunset">
  <template slot="display">
    <div class="contact-card">
      <h4 data-display-for="name"></h4>
      <p data-display-for="phone"></p>
      <p data-display-for="address"></p>
    </div>
  </template>
  
  <template slot="edit">
    <input type="text" name="name" placeholder="Contact Name" required>
    <input type="tel" name="phone" placeholder="Phone Number" 
           pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}">
    <textarea name="address" placeholder="Address"></textarea>
  </template>
</ck-edit-array>
```

## 🎨 Theming

Built-in themes available:

```html
<!-- Light theme (default) -->
<ck-edit-array theme="light">...</ck-edit-array>

<!-- Dark theme -->
<ck-edit-array theme="dark">...</ck-edit-array>

<!-- Forest green theme -->
<ck-edit-array theme="forest-green">...</ck-edit-array>

<!-- Warm sunset theme -->
<ck-edit-array theme="warm-sunset">...</ck-edit-array>
```

### Custom Styling
```css
ck-edit-array {
  --edit-array-primary: #your-brand-color;
  --edit-array-background: #your-background;
  --edit-array-border-radius: 8px;
  /* ... more variables available */
}
```

## 🔧 Framework Integration

### React
```jsx
import { useRef, useEffect } from 'react';

function UserEditor({ users, onUsersChange }) {
  const editArrayRef = useRef();
  
  useEffect(() => {
    const handleChange = (e) => onUsersChange(e.detail.data);
    const editArray = editArrayRef.current;
    editArray?.addEventListener('change', handleChange);
    return () => editArray?.removeEventListener('change', handleChange);
  }, [onUsersChange]);
  
  return (
  <ck-edit-array 
      ref={editArrayRef}
      array-field="users"
      data={JSON.stringify(users)}
    >
      {/* templates */}
  </ck-edit-array>
  );
}
```

### Vue 3
```vue
<template>
  <ck-edit-array 
    :data="JSON.stringify(users)"
    array-field="users"
    @change="handleChange"
  >
    <template slot="display">
      <strong data-display-for="name"></strong>
    </template>
    <template slot="edit">
      <input type="text" name="name" required>
    </template>
  </ck-edit-array>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([]);
const handleChange = (event) => {
  users.value = event.detail.data;
};
</script>
```

### Angular
```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}

// component.ts
@Component({
  template: `
    <ck-edit-array 
      [attr.data]="usersJson"
      array-field="users"
      (change)="handleChange($event)"
    >
      <!-- templates -->
  </ck-edit-array>
  `
})
export class UsersComponent {
  users: User[] = [];
  
  get usersJson() { return JSON.stringify(this.users); }
  
  handleChange(event: CustomEvent) {
    this.users = event.detail.data;
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testNamePattern="Data Management"
```

### Test Categories

- **Unit Tests** - Core functionality and API
- **Visual Tests** - UI states and rendering
- **Accessibility Tests** - WCAG compliance and keyboard navigation
- **Performance Tests** - Large datasets and memory usage

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Project Structure

```
edit-array/
├── src/
│   ├── ck-edit-array.js          # Main component
│   └── ck-edit-array.d.ts        # TypeScript definitions
├── tests/
│   ├── edit-array.test.js     # Unit tests
│   ├── *.visual.test.js       # Visual tests
│   ├── *.accessibility.test.js # A11y tests
│   └── *.performance.test.js   # Performance tests
├── examples/
│   └── demo.html              # Interactive demo
├── docs/
│   ├── README.md              # User documentation
│   ├── readme.technical.md    # Technical guide
│   ├── spec.md               # API specification
│   └── migration-guide.md    # Migration guide
├── dist/                      # Built files
└── coverage/                  # Test coverage reports
```


## 🚀 Publishing & Prepare Steps

This package uses a `prepare`/`prepublishOnly` script to ensure all code is built, type declarations are generated, and tests/linting pass before publishing to npm.

**Publish flow:**

1. Run `npm run validate` to lint, check formatting, and run all tests.
2. Run `npm run build` to bundle the code and generate type declarations in `dist/`.
3. The `prepublishOnly` script (see `package.json`) will automatically run validation and build steps before `npm publish`.
4. To publish:
  ```bash
  npm publish
  ```
  This will ensure the package is fully built and validated, and that `dist/ck-edit-array.d.ts` is included for consumers.

**Note:** If you add new TypeScript files or change the build process, make sure `dist/ck-edit-array.d.ts` is present after build. The `prepare`/`prepublishOnly` scripts enforce this for you.

---
## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Code Style

- Use ES modules and modern JavaScript features
- Follow the existing code style (Prettier + ESLint)
- Add JSDoc comments for public APIs
- Write tests for new functionality
- Update documentation as needed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Documentation**: Check the [docs folder](./docs/) for comprehensive guides
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/edit-array/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/edit-array/discussions)
- **Stack Overflow**: Tag questions with `edit-array-webcomponent`

## 🌟 Acknowledgments

- Built with modern web standards and best practices
- Inspired by the web components community
- Thanks to all contributors and users

---

**Made with ❤️ for the web platform**
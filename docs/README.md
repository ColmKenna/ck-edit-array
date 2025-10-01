# EditArray Web Component

A powerful, accessible, and highly customizable web component for editing arrays of objects with inline editing capabilities, comprehensive validation, and event-driven architecture.

## 🚀 Quick Start

### Installation

#### Via CDN
```html
<script type="module" src="https://unpkg.com/edit-array-component@latest/src/ck-edit-array.js"></script>
```

#### Via npm
```bash
npm install edit-array-component
```

```javascript
import 'edit-array-component';
```

#### Direct Script Tag
```html
<script type="module" src="./src/ck-edit-array.js"></script>
```

### Basic Usage

```html
<ck-edit-array array-field="users" data='[{"name":"John","email":"john@example.com"}]'>
  <div slot="display">
    <span data-display-for="name"></span> - <span data-display-for="email"></span>
  </div>
  <div slot="edit">
    <input name="name" required placeholder="Enter name">
    <input name="email" type="email" required placeholder="Enter email">
  </div>
</ck-edit-array>
```

## ✨ Features

- **🎯 Slot-Based Templates** - Flexible display and edit templates using web standards
- **✅ HTML5 Validation** - Built-in form validation with helpful error messages
- **♿ Accessibility First** - WCAG compliant with proper ARIA attributes and keyboard navigation
- **🎨 CSS Custom Properties** - Fully themeable with CSS variables
- **📱 Responsive Design** - Works seamlessly on mobile and desktop
- **⚡ High Performance** - Efficient rendering and memory management for large datasets
- **🔧 Event-Driven** - Comprehensive event system for integration with any framework
- **🛡️ Type Safety** - Full TypeScript definitions included
- **🌐 Cross-Browser** - Modern CSS architecture with fallbacks for older browsers

## 📖 API Documentation

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `array-field` | `string` | - | Field name used for form submission (generates proper name attributes) |
| `data` | `string` | `"[]"` | JSON string representation of the array data |
| `edit-label` | `string` | `"Edit"` | Label text for edit buttons |
| `save-label` | `string` | `"Save"` | Label text for save buttons |
| `delete-label` | `string` | `"Delete"` | Label text for delete buttons |
| `cancel-label` | `string` | `"Cancel"` | Label text for cancel buttons |

### Properties

#### `arrayField: string | null`
Gets or sets the array field name used for form submission.

```javascript
const editArray = document.querySelector('ck-edit-array');
editArray.arrayField = 'users';
console.log(editArray.arrayField); // 'users'
```

#### `data: Array<Object>`
Gets or sets the array data. Automatically coerces various input types to arrays.

```javascript
// Set array data
editArray.data = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
];

// Get current data (returns a deep clone)
const currentData = editArray.data;
```

### Methods

#### `addItem(item?: Object): number`
Adds a new item to the array and returns its index.

```javascript
const index = editArray.addItem({ name: 'New User', email: 'new@example.com' });
console.log(`Added item at index: ${index}`);
```

#### `updateItem(index: number, fieldName: string, value: any): boolean`
Updates a specific field of an item at the given index.

```javascript
const success = editArray.updateItem(0, 'name', 'Updated Name');
if (success) {
  console.log('Item updated successfully');
}
```

#### `removeItem(index: number): Object | null`
Removes an item at the specified index and returns the removed item.

```javascript
const removedItem = editArray.removeItem(0);
console.log('Removed:', removedItem);
```

#### `toggleDeletion(index: number): boolean`
Toggles the deletion state of an item and returns the new state.

```javascript
const isMarkedForDeletion = editArray.toggleDeletion(0);
console.log(`Item ${isMarkedForDeletion ? 'marked for' : 'unmarked for'} deletion`);
```

#### `validateItem(index: number): boolean`
Validates an item's form inputs and returns true if valid.

```javascript
const isValid = editArray.validateItem(0);
if (!isValid) {
  console.log('Validation failed for item at index 0');
}
```

#### `toggleEditMode(index: number): void`
Toggles between edit and display mode for an item.

```javascript
editArray.toggleEditMode(0); // Enter edit mode for first item
```

#### `coerceToArray(value: any): Array`
Utility method to coerce various input types to arrays.

```javascript
const array1 = editArray.coerceToArray('[{"name":"John"}]'); // Parses JSON
const array2 = editArray.coerceToArray({name: "Jane"}); // Wraps object in array
const array3 = editArray.coerceToArray("simple string"); // Creates single-item array
```

### Events

All events bubble and are composed, making them work across shadow DOM boundaries.

#### `change`
Fired when the data array changes.

```javascript
editArray.addEventListener('change', (event) => {
  console.log('Data changed:', event.detail.data);
});
```

**Event Detail:**
- `data: Array<Object>` - Copy of the current data array

#### `item-added`
Fired when a new item is added to the array.

```javascript
editArray.addEventListener('item-added', (event) => {
  console.log('Item added:', event.detail.item, 'at index:', event.detail.index);
});
```

**Event Detail:**
- `item: Object` - The added item
- `index: number` - Index where the item was added
- `data: Array<Object>` - Copy of the current data array

#### `item-updated`
Fired when an existing item is updated.

```javascript
editArray.addEventListener('item-updated', (event) => {
  const { index, fieldName, value, oldValue } = event.detail;
  console.log(`Updated ${fieldName} from "${oldValue}" to "${value}" at index ${index}`);
});
```

**Event Detail:**
- `index: number` - Index of the updated item
- `fieldName: string` - Name of the updated field
- `value: any` - New value of the field
- `oldValue: any` - Previous value of the field
- `item: Object` - Copy of the updated item
- `data: Array<Object>` - Copy of the current data array

#### `item-deleted`
Fired when an item is removed from the array.

```javascript
editArray.addEventListener('item-deleted', (event) => {
  console.log('Item deleted:', event.detail.item, 'from index:', event.detail.index);
});
```

**Event Detail:**
- `item: Object` - The removed item
- `index: number` - Index where the item was removed
- `data: Array<Object>` - Copy of the current data array

#### `item-change`
Fired when an item's deletion status changes.

```javascript
editArray.addEventListener('item-change', (event) => {
  const { index, action, marked } = event.detail;
  console.log(`Item ${index} ${action}: ${marked ? 'marked' : 'unmarked'} for deletion`);
});
```

**Event Detail:**
- `index: number` - Index of the item
- `action: string` - The action performed ('toggle-deletion')
- `marked: boolean` - Whether the item is marked for deletion
- `item: Object` - Copy of the affected item
- `data: Array<Object>` - Copy of the current data array

## 🎯 Slot System

The EditArray component uses a powerful slot-based templating system that gives you complete control over how items are displayed and edited.

### Display Slot (`slot="display"`)

Define how items appear in read-only mode:

```html
<div slot="display">
  <div class="user-card">
    <h3 data-display-for="name"></h3>
    <p data-display-for="email"></p>
    <span data-display-for="role" class="role-badge"></span>
  </div>
</div>
```

**Key Features:**
- Use `data-display-for="fieldName"` to automatically display field values
- Supports rich HTML structure and styling
- Values are automatically escaped for security
- Updates automatically when data changes

### Edit Slot (`slot="edit"`)

Define the form interface for editing items:

```html
<div slot="edit">
  <div class="form-group">
    <label>Full Name:</label>
    <input name="name" required placeholder="Enter full name">
  </div>
  <div class="form-group">
    <label>Email:</label>
    <input name="email" type="email" required placeholder="user@example.com">
  </div>
  <div class="form-group">
    <label>Role:</label>
    <select name="role">
      <option value="admin">Administrator</option>
      <option value="user">User</option>
      <option value="guest">Guest</option>
    </select>
  </div>
</div>
```

**Key Features:**
- Form controls with `name` attributes are automatically bound to data fields
- Full HTML5 validation support (required, pattern, type, etc.)
- Automatic error message display with helpful, contextual messages
- Generated form names follow proper array notation for server submission
- Support for all form control types: input, select, textarea, etc.

## ✅ Validation System

### Built-in Validation

The component leverages HTML5 form validation with enhanced error messages:

```html
<input name="email" type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
<input name="phone" pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}" placeholder="(555) 123-4567">
<input name="zipCode" pattern="[0-9]{5}(-[0-9]{4})?" placeholder="12345 or 12345-6789">
```

### Smart Error Messages

The component provides contextual, helpful error messages:

- **Type Validation**: "Please enter a valid email address. Example: user@example.com"
- **Pattern Validation**: "Please match the required format. Example: (555) 123-4567"
- **Required Fields**: "This field is required. Please enter a value."
- **Length Validation**: "Please enter at least 3 characters."

### Custom Validation

You can also implement custom validation:

```javascript
editArray.addEventListener('item-updated', (event) => {
  const { index, fieldName, value } = event.detail;
  
  if (fieldName === 'email' && !isValidEmailDomain(value)) {
    // Custom validation logic
    showCustomError(index, fieldName, 'Email domain not allowed');
  }
});
```

## 🎨 Theming and Customization

### CSS Custom Properties

The component is fully themeable using CSS custom properties:

```css
edit-array {
  /* Colors */
  --button-primary-bg: #3b82f6;
  --button-primary-color: #ffffff;
  --button-primary-hover-bg: #2563eb;
  --button-secondary-bg: #f3f4f6;
  --button-secondary-color: #374151;
  --button-success-bg: #10b981;
  --button-danger-bg: #ef4444;
  --error-color: #ef4444;
  --border-color: #e5e7eb;
  
  /* Layout */
  --border-radius: 8px;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Typography */
  --button-font-size: 0.875rem;
  --button-font-weight: 500;
  --font-size-sm: 0.875rem;
  
  /* Animation */
  --transition-duration: 0.3s;
  --transition-timing: ease;
  
  /* Button Sizing */
  --button-padding: 0.375rem 0.75rem;
  --button-margin: 0 0.25rem 0.25rem 0;
  --button-border-width: 1px;
  --button-border-radius: 6px;
}
```

### Built-in Themes

#### Light Theme (Default)
```css
:root {
  --button-primary-bg: #3b82f6;
  --button-secondary-bg: #f3f4f6;
  --background-color: #ffffff;
  --text-color: #1f2937;
}
```

#### Dark Theme
```css
[data-theme="dark"] {
  --button-primary-bg: #60a5fa;
  --button-secondary-bg: #374151;
  --background-color: #111827;
  --text-color: #f9fafb;
}
```

#### Forest Green Theme
```css
[data-theme="forest-green"] {
  --button-primary-bg: #059669;
  --button-secondary-bg: #d1fae5;
  --background-color: #ecfdf5;
  --text-color: #064e3b;
}
```

#### Warm Sunset Theme
```css
[data-theme="warm-sunset"] {
  --button-primary-bg: #ea580c;
  --button-secondary-bg: #fed7aa;
  --background-color: #fff7ed;
  --text-color: #9a3412;
}
```

### Theme Switching

```javascript
// Switch to dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Switch back to light theme
document.documentElement.removeAttribute('data-theme');
```

### Custom Theme Creation

Create your own theme by defining the CSS custom properties:

```css
[data-theme="corporate"] {
  --button-primary-bg: #1e40af;
  --button-secondary-bg: #e5e7eb;
  --button-success-bg: #047857;
  --button-danger-bg: #dc2626;
  --border-color: #d1d5db;
  --border-radius: 4px;
  --spacing-lg: 1.25rem;
}
```

## ♿ Accessibility Features

### WCAG Compliance

The component follows WCAG 2.1 AA guidelines:

- **Semantic HTML**: Proper use of roles, labels, and landmarks
- **Keyboard Navigation**: Full keyboard accessibility for all interactions
- **Screen Reader Support**: Comprehensive ARIA attributes and announcements
- **Focus Management**: Logical tab order and visible focus indicators
- **Color Contrast**: Meets minimum contrast requirements
- **Error Communication**: Clear, announced validation messages

### ARIA Attributes

The component automatically sets appropriate ARIA attributes:

```html
<div role="region" aria-label="Array editor">
  <div role="list" aria-label="Editable items">
    <div role="listitem" aria-label="Item 1">
      <!-- Item content -->
    </div>
  </div>
</div>
```

### Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons
- **Escape**: Cancel edit mode (when implemented)
- **Arrow Keys**: Navigate within form controls

### Screen Reader Announcements

- Item additions and removals are announced
- Validation errors are announced with `role="alert"`
- State changes are communicated clearly
- Edit mode transitions are announced

## 📱 Responsive Design

### Mobile-First Approach

The component is designed mobile-first with responsive breakpoints:

```css
/* Mobile styles (default) */
edit-array {
  --button-padding: 0.5rem 0.75rem;
  --button-font-size: 0.875rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  edit-array {
    --button-padding: 0.375rem 0.75rem;
    --button-font-size: 0.8125rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  edit-array {
    --spacing-lg: 1.5rem;
  }
}
```

### Touch-Friendly

- Minimum 44px touch targets on mobile
- Appropriate spacing for touch interaction
- Touch event support
- Swipe gestures (when applicable)

## 🚀 Performance Guidelines

### Large Datasets

The component is optimized for performance with large datasets:

```javascript
// Efficiently handle 500+ items
const largeDataset = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: Math.random() * 1000
}));

editArray.data = largeDataset; // Renders efficiently
```

### Performance Best Practices

1. **Batch Updates**: Group multiple changes together
2. **Event Delegation**: Component uses efficient event delegation
3. **Memory Management**: Automatic cleanup prevents memory leaks
4. **Lazy Rendering**: Only renders visible items when possible
5. **CSS Architecture**: Uses Constructable Stylesheets for better performance

### Performance Monitoring

```javascript
// Monitor performance
editArray.addEventListener('change', (event) => {
  console.time('data-update');
  // Your update logic
  console.timeEnd('data-update');
});
```

## 🔧 Framework Integration

### Vanilla JavaScript

```javascript
const editArray = document.querySelector('ck-edit-array');

// Set initial data
editArray.data = [
  { name: 'John', email: 'john@example.com' }
];

// Listen for changes
editArray.addEventListener('change', (event) => {
  console.log('Updated data:', event.detail.data);
});
```

### React Integration

```jsx
import { useEffect, useRef, useState } from 'react';
import 'edit-array-component';

function UserEditor({ initialData, onDataChange }) {
  const editArrayRef = useRef();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const editArray = editArrayRef.current;
    
    const handleChange = (event) => {
      const newData = event.detail.data;
      setData(newData);
      onDataChange(newData);
    };
    
    editArray.addEventListener('change', handleChange);
    
    return () => {
      editArray.removeEventListener('change', handleChange);
    };
  }, [onDataChange]);

  useEffect(() => {
    if (editArrayRef.current) {
      editArrayRef.current.data = data;
    }
  }, [data]);

  return (
  <ck-edit-array ref={editArrayRef} array-field="users">
      <div slot="display">
        <span data-display-for="name"></span> - <span data-display-for="email"></span>
      </div>
      <div slot="edit">
        <input name="name" required />
        <input name="email" type="email" required />
      </div>
  </ck-edit-array>
  );
}
```

### Vue.js Integration

```vue
<template>
  <ck-edit-array 
    ref="editArray"
    array-field="users"
    @change="handleDataChange"
    @item-added="handleItemAdded"
  >
    <div slot="display">
      <span data-display-for="name"></span> - <span data-display-for="email"></span>
    </div>
    <div slot="edit">
      <input name="name" required />
      <input name="email" type="email" required />
    </div>
  </ck-edit-array>
</template>

<script>
import 'edit-array-component';

export default {
  name: 'UserEditor',
  props: {
    initialData: Array
  },
  data() {
    return {
      users: this.initialData || []
    };
  },
  mounted() {
    this.$refs.editArray.data = this.users;
  },
  watch: {
    users: {
      handler(newUsers) {
        if (this.$refs.editArray) {
          this.$refs.editArray.data = newUsers;
        }
      },
      deep: true
    }
  },
  methods: {
    handleDataChange(event) {
      this.users = event.detail.data;
      this.$emit('update:users', this.users);
    },
    handleItemAdded(event) {
      this.$emit('item-added', event.detail);
    }
  }
};
</script>
```

### Angular Integration

```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import 'edit-array-component';

@Component({
  selector: 'app-user-editor',
  template: `
  <ck-edit-array 
      #editArray
      array-field="users"
      (change)="onDataChange($event)"
      (item-added)="onItemAdded($event)"
    >
      <div slot="display">
        <span data-display-for="name"></span> - <span data-display-for="email"></span>
      </div>
      <div slot="edit">
        <input name="name" required />
        <input name="email" type="email" required />
      </div>
  </ck-edit-array>
  `
})
export class UserEditorComponent implements AfterViewInit {
  @Input() users: any[] = [];
  @Output() usersChange = new EventEmitter<any[]>();
  @Output() itemAdded = new EventEmitter<any>();
  
  @ViewChild('editArray') editArrayRef!: ElementRef;

  ngAfterViewInit() {
    this.editArrayRef.nativeElement.data = this.users;
  }

  onDataChange(event: CustomEvent) {
    this.users = event.detail.data;
    this.usersChange.emit(this.users);
  }

  onItemAdded(event: CustomEvent) {
    this.itemAdded.emit(event.detail);
  }
}
```

### Svelte Integration

```svelte
<script>
  import { onMount } from 'svelte';
  import 'edit-array-component';
  
  export let users = [];
  
  let editArray;
  
  onMount(() => {
    editArray.data = users;
    
    editArray.addEventListener('change', (event) => {
      users = event.detail.data;
    });
  });
  
  $: if (editArray) {
    editArray.data = users;
  }
</script>

<ck-edit-array bind:this={editArray} array-field="users">
  <div slot="display">
    <span data-display-for="name"></span> - <span data-display-for="email"></span>
  </div>
  <div slot="edit">
    <input name="name" required />
    <input name="email" type="email" required />
  </div>
</ck-edit-array>
```

## 🌐 Browser Support

### Modern Browsers (Full Support)
- Chrome 54+
- Firefox 63+
- Safari 13+
- Edge 79+

### Features Used
- **Web Components**: Custom Elements, Shadow DOM
- **Constructable Stylesheets**: Modern CSS architecture
- **ES Modules**: Native module support
- **CSS Custom Properties**: Theming system

### Fallback Support
- **Safari < 13**: Automatic fallback to `<style>` elements
- **Older Browsers**: Polyfills available for web components

### Polyfills

For broader browser support, include the web components polyfills:

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-loader.js"></script>
<script type="module" src="ck-edit-array.js"></script>
```

## 🛠️ Troubleshooting

### Common Issues

#### Component Not Rendering
```javascript
// Check if slots are defined
const display = editArray.querySelector('[slot="display"]');
const edit = editArray.querySelector('[slot="edit"]');
console.log('Display slot:', display);
console.log('Edit slot:', edit);
```

#### Form Validation Not Working
```javascript
// Check form controls have name attributes
const inputs = editArray.querySelectorAll('[slot="edit"] input[name]');
console.log('Named inputs:', inputs.length);
```

#### Events Not Firing
```javascript
// Ensure event listeners are attached after component is connected
document.addEventListener('DOMContentLoaded', () => {
  const editArray = document.querySelector('ck-edit-array');
  editArray.addEventListener('change', handleChange);
});
```

#### Styling Issues
```css
/* Ensure CSS custom properties are defined */
edit-array {
  --button-primary-bg: #3b82f6; /* Fallback for unsupported browsers */
}
```

### Debug Mode

Enable debug logging:

```javascript
// Temporary debugging
const originalConsole = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('EditArray:')) {
    console.log('DEBUG:', ...args);
  }
  originalConsole.apply(console, args);
};
```

### Performance Issues

```javascript
// Monitor performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('edit-array')) {
      console.log('Performance:', entry);
    }
  }
});
observer.observe({ entryTypes: ['measure'] });
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-org/edit-array-component.git
cd edit-array-component
npm install
npm run dev
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
npm run test:accessibility # Accessibility tests
```

### Building

```bash
npm run build              # Build for production
npm run build:docs         # Build documentation
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://edit-array-component.dev)
- 🐛 [Issue Tracker](https://github.com/your-org/edit-array-component/issues)
- 💬 [Discussions](https://github.com/your-org/edit-array-component/discussions)
- 📧 [Email Support](mailto:support@edit-array-component.dev)

---

**Made with ❤️ by the EditArray team**
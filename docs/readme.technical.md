# EditArray Technical Implementation Guide

This document provides in-depth technical details about the EditArray web component's architecture, implementation decisions, and internal workings.

## 🏗️ Architecture Overview

### Component Design Philosophy

The EditArray component follows modern web component best practices with a focus on:

1. **Encapsulation**: Shadow DOM provides style and script isolation
2. **Composability**: Slot-based templating allows flexible content definition
3. **Performance**: Efficient event delegation and memory management
4. **Accessibility**: WCAG-compliant by design
5. **Standards Compliance**: Uses web platform APIs exclusively

### Core Architecture Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    EditArray Component                      │
├─────────────────────────────────────────────────────────────┤
│  Public API          │  Internal Systems                    │
│  ├─ Properties       │  ├─ Event Delegation                 │
│  ├─ Methods          │  ├─ Template Cloning                 │
│  ├─ Attributes       │  ├─ Data Management                  │
│  └─ Events           │  ├─ Validation System                │
│                      │  └─ Rendering Engine                 │
├─────────────────────────────────────────────────────────────┤
│                    Shadow DOM                               │
│  ├─ Constructable Stylesheets (modern)                     │
│  ├─ Style Element Fallback (legacy)                        │
│  ├─ Container Structure                                     │
│  └─ Slotted Content                                         │
├─────────────────────────────────────────────────────────────┤
│                   Light DOM (Slots)                        │
│  ├─ Display Template                                        │
│  └─ Edit Template                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Implementation Details

### CSS Architecture: Constructable Stylesheets with Safari Fallback

The component uses a modern CSS architecture that prioritizes performance while maintaining compatibility:

```javascript
const EDIT_ARRAY_SHEET = (() => {
  if (typeof CSSStyleSheet === "undefined") return null;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(EDIT_ARRAY_CSS);
    return sheet;
  } catch (e) {
    return null;
  }
})();

const applyEditArrayStyles = (shadowRoot) => {
  if (!shadowRoot) return;
  
  // Modern approach: Constructable Stylesheets
  if (EDIT_ARRAY_SHEET && shadowRoot.adoptedStyleSheets !== undefined) {
    try {
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        EDIT_ARRAY_SHEET,
      ];
      return;
    } catch (err) {
      // Fallback if assignment fails
    }
  }
  
  // Legacy fallback: Style element
  const styleEl = document.createElement("style");
  styleEl.textContent = EDIT_ARRAY_CSS;
  shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
};
```

#### Why Constructable Stylesheets?

1. **Performance Benefits**:
   - Shared stylesheet instances across multiple component instances
   - No CSS parsing overhead per component
   - Reduced memory footprint for large numbers of components

2. **Memory Efficiency**:
   - Single stylesheet object shared across all instances
   - No DOM overhead from multiple `<style>` elements
   - Automatic garbage collection when components are removed

3. **Browser Feature Detection**:
   - Graceful degradation to `<style>` elements in unsupported browsers
   - No feature detection overhead in component lifecycle
   - Transparent fallback mechanism

4. **Safari Compatibility**:
   - Safari < 16.4 lacks Constructable Stylesheet support
   - Automatic fallback ensures compatibility
   - Performance impact minimal due to efficient fallback implementation

### Shadow DOM Strategy

```javascript
constructor() {
  super();
  const shadow = this.attachShadow({ mode: "open" });
  
  shadow.innerHTML = `
    <div class="edit-array-container" id="${this.id}" role="region" aria-label="Array editor">
      <div class="edit-array-items" role="list" aria-label="Editable items"></div>
      <div class="action-bar"></div>
    </div>
  `;
  
  applyEditArrayStyles(shadow);
}
```

**Design Decisions:**

1. **Open Shadow DOM**: Allows external CSS customization while maintaining encapsulation
2. **Semantic Structure**: Uses proper ARIA roles and landmarks from initialization
3. **Progressive Enhancement**: Base HTML structure works without JavaScript
4. **Accessibility First**: ARIA attributes built into the template structure

### Event System Architecture

#### Delegated Event Handling

The component uses a sophisticated event delegation system for optimal performance:

```javascript
class EditArray extends HTMLElement {
  #onInput = (event) => {
    const t = event.target;
    if (!t) return;
    
    const name = t.getAttribute("data-name");
    const indexStr = t.getAttribute("data-index");
    if (!name || !indexStr) return;
    
    const index = parseInt(indexStr, 10);
    if (Number.isNaN(index)) return;
    
    this.updateRecord(index, name, t.value);
  };

  #onDelegatedClick = (event) => {
    const target = event.target;
    const action = target.getAttribute('data-action');
    if (!action) return;

    // Handle different action types
    switch (action) {
      case 'edit': /* ... */ break;
      case 'delete': /* ... */ break;
      case 'cancel': /* ... */ break;
      case 'add': /* ... */ break;
    }
  };

  connectedCallback() {
    this.shadowRoot.addEventListener("input", this.#onInput);
    this.shadowRoot.addEventListener("click", this.#onDelegatedClick);
    this.render();
  }

  disconnectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.removeEventListener("input", this.#onInput);
      this.shadowRoot.removeEventListener("click", this.#onDelegatedClick);
    }
  }
}
```

**Benefits of Event Delegation:**

1. **Performance**: O(1) event listeners regardless of item count
2. **Memory Efficiency**: No per-item event listener overhead
3. **Dynamic Content**: Works with dynamically added/removed items
4. **Simplified Cleanup**: Single cleanup point prevents memory leaks

#### Custom Event Architecture

```javascript
dispatchDataChange() {
  this.dispatchEvent(new CustomEvent('change', {
    detail: { data: deepClone(this.#data) },
    bubbles: true,
    composed: true
  }));
}
```

**Event Design Principles:**

1. **Immutable Data**: Events contain deep clones to prevent external mutation
2. **Bubbling**: All events bubble for framework integration
3. **Composed**: Events cross shadow DOM boundaries
4. **Consistent Structure**: All events follow the same detail object pattern

### Data Management System

#### Deep Cloning Strategy

```javascript
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};
```

**Why Deep Cloning?**

1. **Immutability**: Prevents external code from mutating internal state
2. **Event Safety**: Event listeners receive immutable data snapshots
3. **Debugging**: Clear separation between internal and external data
4. **Performance**: Optimized cloning for common data types

#### Data Coercion System

```javascript
const coerceArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  
  if (typeof value === 'object') return [value];
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.warn('EditArray: Failed to parse data attribute as JSON array', err);
        return [];
      }
    }
  }
  
  return [value];
};
```

**Coercion Logic:**

1. **Null Safety**: Handles null/undefined gracefully
2. **Type Flexibility**: Accepts various input types
3. **JSON Parsing**: Safely parses JSON strings with error handling
4. **Fallback Strategy**: Always returns a valid array

### Template System Implementation

#### Slot Template Cloning

```javascript
editSlotTemplate(index, item) {
  if (!isValidIndex(index)) throw new TypeError("index must be a number");
  
  const slot = this.querySelector('[slot="edit"]');
  if (!slot) {
    console.warn('EditArray: Missing [slot="edit"] template element');
    return null;
  }
  
  const clone = slot.cloneNode(true);
  clone.setAttribute("data-index", String(index));
  
  const prefix = buildNamePrefix(this.arrayField, index);
  
  // Process form elements for data binding
  clone.querySelectorAll("[name]").forEach((el) => {
    const name = el.getAttribute("name");
    if (!name) return;
    
    // Set up proper form submission names
    if (prefix && !name.includes(this.arrayField)) {
      el.setAttribute("name", `${prefix}.${name}`);
    }
    
    // Add data attributes for event handling
    el.setAttribute("data-name", name);
    el.setAttribute("data-index", String(index));
    
    // Populate with existing data
    if (item && typeof item === "object" && name in item) {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
        el.value = item[name];
      } else {
        el.textContent = item[name];
      }
    }
  });
  
  // Generate unique IDs to prevent conflicts
  const idPrefix = this.arrayField ? this.arrayField.replace(/\./g, "_") : "item";
  clone.querySelectorAll("[id]").forEach((el) => {
    const id = el.getAttribute("id");
    if (id) {
      el.setAttribute("id", `${idPrefix}_${index}__${id}`);
    }
  });
  
  return clone;
}
```

**Template Processing Features:**

1. **Form Name Generation**: Creates proper array notation for server submission
2. **Data Binding**: Automatically populates form controls with data
3. **ID Uniqueness**: Prevents ID conflicts between multiple items
4. **Event Attributes**: Adds data attributes for efficient event delegation

#### Display Template Processing

```javascript
displaySlotTemplate(index, item) {
  // ... similar structure to editSlotTemplate
  
  if (item && typeof item === "object") {
    clone.querySelectorAll("[data-display-for]").forEach((el) => {
      const field = el.getAttribute("data-display-for");
      const prefixName = buildNamePrefix(this.arrayField, index) || "";
      
      el.setAttribute("data-index", String(index));
      el.setAttribute("data-id", `${computeIdPrefix(this.arrayField)}_${index}__${field}`);
      el.setAttribute("data-name", `${prefixName}.${field}`);
      
      if (field && field in item) {
        el.textContent = item[field];
      }
    });
  }
  
  return clone;
}
```

### Validation System Architecture

#### Pattern Validation with Browser Compatibility

```javascript
const testPatternValidation = (input) => {
  if (!input.validity.patternMismatch || !input.pattern || !input.value) {
    return input.validity.valid;
  }
  
  try {
    return new RegExp(input.pattern).test(input.value);
  } catch (e) {
    console.warn('EditArray: Invalid pattern regex:', e);
    return false;
  }
};
```

**Browser Compatibility Handling:**

1. **Fallback Validation**: Custom regex testing for browser inconsistencies
2. **Error Handling**: Graceful handling of invalid regex patterns
3. **Consistency**: Unified validation behavior across browsers

#### Intelligent Error Messages

```javascript
const getHelpfulValidationMessage = (input) => {
  if (!input || input.validity.valid) return '';

  const { validity, type, pattern, placeholder } = input;
  
  // Type-specific messages
  if (validity.typeMismatch) {
    switch (type) {
      case 'email': return 'Please enter a valid email address. Example: user@example.com';
      case 'url': return 'Please enter a valid URL. Example: https://www.example.com';
      case 'tel': return 'Please enter a valid phone number. Example: (555) 123-4567';
      // ... more type handlers
    }
  }
  
  // Pattern validation with examples
  if (validity.patternMismatch && pattern) {
    if (placeholder && placeholder.trim()) {
      return `Please match the required format. Example: ${placeholder}`;
    }
    
    // Common pattern examples
    const commonPatterns = {
      '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}': '(555) 123-4567',
      '[0-9]{5}': '12345',
      // ... more patterns
    };
    
    const exampleValue = commonPatterns[pattern];
    if (exampleValue) {
      return `Please match the required format. Example: ${exampleValue}`;
    }
  }
  
  return input.validationMessage || 'Please enter a valid value.';
};
```

**Error Message Strategy:**

1. **Contextual Examples**: Provides specific examples based on input type
2. **Pattern Recognition**: Recognizes common patterns and provides examples
3. **Placeholder Integration**: Uses placeholder text as examples when available
4. **Graceful Fallback**: Falls back to browser messages when no custom message available

### Performance Optimizations

#### Efficient DOM Queries

```javascript
updateItem(index, fieldName, value) {
  // ... data update logic
  
  // Cache wrapper element to reduce DOM queries
  const wrapper = this.shadowRoot.querySelector(`.edit-array-item[data-index="${index}"]`);
  if (!wrapper) return true;
  
  const idPrefix = this.arrayField ? this.arrayField.replace(/\./g, "_") : "item";
  const expectedDataId = `${idPrefix}_${index}__${fieldName}`;
  
  // Update display elements within cached wrapper
  wrapper.querySelectorAll(`[data-display-for="${fieldName}"]`).forEach((el) => {
    el.textContent = value;
  });
  
  wrapper.querySelectorAll(`[data-id="${expectedDataId}"]`).forEach((el) => {
    el.textContent = value;
  });
  
  return true;
}
```

**Query Optimization Techniques:**

1. **Wrapper Caching**: Single query for container, then scoped queries
2. **Specific Selectors**: Use data attributes for fast, specific queries
3. **Batch Operations**: Group DOM updates to minimize reflow
4. **Scoped Queries**: Query within specific containers to reduce search space

#### Memory Management

```javascript
disconnectedCallback() {
  // Clean up event listeners
  if (this.shadowRoot) {
    this.shadowRoot.removeEventListener("input", this.#onInput);
    this.shadowRoot.removeEventListener("click", this.#onDelegatedClick);
  }
}
```

**Memory Leak Prevention:**

1. **Event Cleanup**: Explicit removal of event listeners
2. **Weak References**: Use WeakMap for component-specific data when possible
3. **DOM Cleanup**: Proper cleanup of generated DOM elements
4. **Circular Reference Prevention**: Careful handling of object references

### Accessibility Implementation

#### ARIA Integration

```javascript
renderItem(container, item, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "edit-array-item";
  wrapper.setAttribute("data-index", String(index));
  wrapper.setAttribute("role", "listitem");
  wrapper.setAttribute("aria-label", `Item ${index + 1}`);
  
  // ... content rendering
  
  return wrapper;
}
```

#### Focus Management

```javascript
toggleEditMode(index) {
  // ... mode switching logic
  
  if (isEnteringEditMode) {
    // Focus first form input when entering edit mode
    const firstInput = wrapper.querySelector('input, select, textarea');
    if (firstInput) {
      firstInput.focus();
    }
  }
}
```

#### Screen Reader Support

```javascript
// Error message integration
input.addEventListener("blur", () => {
  const isActuallyValid = testPatternValidation(input);
  
  if (!isActuallyValid) {
    errorSpan.textContent = getHelpfulValidationMessage(input);
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", errorSpan.id || `${input.id}-error`);
  } else {
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }
});
```

### Security Considerations

#### XSS Prevention

```javascript
// Safe text content setting
el.textContent = value; // Not innerHTML

// Attribute validation
const validateArrayField = (value) => {
  if (value == null) return null;
  const str = String(value);
  
  // Check for unsafe characters
  if (/[^A-Za-z0-9_-]/.test(str)) {
    console.warn(`EditArray: array-field "${str}" contains unsafe characters`);
  }
  
  return str;
};
```

#### Input Sanitization

```javascript
// Safe ID generation
const computeIdPrefix = (arrayField) => {
  if (!arrayField || typeof arrayField !== 'string') return "item";
  return arrayField.replace(/[^A-Za-z0-9_-]/g, "_");
};

// Safe name generation
const buildNamePrefix = (arrayField, index) => {
  if (!arrayField || typeof arrayField !== 'string') return null;
  const sanitized = arrayField.replace(/[^A-Za-z0-9_.-]/g, '_');
  return `${sanitized}[${index}]`;
};
```

## 🔧 Development Guidelines

### Code Style and Patterns

#### Private Fields and Methods

```javascript
class EditArray extends HTMLElement {
  /** @type {Array<Object>} Private data array */
  #data = [];
  
  /** Private method for internal use */
  #validateInternalState() {
    // Internal validation logic
  }
}
```

#### Error Handling Strategy

```javascript
// Graceful error handling with logging
try {
  const result = this.performOperation();
  return result;
} catch (error) {
  console.warn(`EditArray: Operation failed: ${error.message}`);
  return defaultValue;
}
```

#### Documentation Standards

```javascript
/**
 * Updates a specific field of an item at the given index.
 * @param {number} index - The index of the item to update
 * @param {string} fieldName - The name of the field to update
 * @param {any} value - The new value for the field
 * @throws {TypeError} If fieldName is not a non-empty string
 * @fires EditArray#item-updated
 */
updateItem(index, fieldName, value) {
  // Implementation
}
```

### Testing Strategy

#### Unit Test Structure

```javascript
describe('EditArray Component', () => {
  describe('Data Management', () => {
    test('updateItem modifies existing item', () => {
      // Test implementation
    });
  });
  
  describe('Event System', () => {
    test('fires change event when data updates', () => {
      // Test implementation
    });
  });
});
```

#### Integration Testing

```javascript
test('component integrates with form submission', () => {
  const form = document.createElement('form');
  const editArray = document.createElement('ck-edit-array');
  
  // Setup and test form integration
});
```

### Performance Testing

#### Benchmark Structure

```javascript
describe('Performance Tests', () => {
  test('renders 100 items efficiently', () => {
    const start = performance.now();
    editArray.data = generateLargeDataset(100);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(500);
  });
});
```

## 🚀 Deployment Considerations

### Bundle Size Optimization

The component is designed for minimal bundle impact:

- **Core Component**: ~15KB minified
- **No Dependencies**: Pure web standards implementation
- **Tree Shakeable**: ES modules allow dead code elimination
- **CSS Included**: No separate stylesheet required

### CDN Deployment

```html
<!-- Modern browsers -->
<script type="module" src="https://cdn.example.com/edit-array@latest/ck-edit-array.js"></script>

<!-- Legacy support -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-loader.js"></script>
<script type="module" src="https://cdn.example.com/edit-array@latest/ck-edit-array.js"></script>
```

### CSP (Content Security Policy) Compatibility

The component is CSP-friendly:

- **No `eval()` usage**: Safe for `unsafe-eval` restrictions
- **No inline styles**: All styles are in Constructable Stylesheets or style elements
- **No inline scripts**: No script injection or dynamic script creation
- **Safe event handling**: Uses standard DOM event APIs

### Server-Side Rendering Considerations

While the component requires JavaScript to function, it gracefully handles SSR scenarios:

1. **Progressive Enhancement**: Base HTML structure is valid
2. **Hydration Safe**: Component initializes without conflicts
3. **SEO Friendly**: Initial content is accessible to crawlers
4. **No Flash of Unstyled Content**: Proper styling application order

---

This technical guide provides the foundation for understanding, maintaining, and extending the EditArray component. For implementation questions or contributions, please refer to the main documentation and contribution guidelines.
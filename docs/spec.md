# EditArray Web Component Specification

**Version**: 1.0.0  
**Status**: Release Candidate  
**Last Updated**: 2024  

## 📋 Component Overview

### Purpose

The EditArray web component provides an interactive, accessible interface for editing arrays of structured data. It enables users to add, edit, delete, and reorder items within a list while maintaining form compatibility and providing comprehensive validation feedback.

### Scope

This specification defines:
- Component behavior and lifecycle
- Public API surface
- Event contracts
- Accessibility requirements
- Security considerations
- Browser compatibility requirements

### Key Features

- ✅ **Inline Editing**: Edit items in place with form validation
- ✅ **Dynamic Operations**: Add, delete, and modify array items
- ✅ **Template-Based**: Flexible content definition via slots
- ✅ **Form Integration**: Native HTML form compatibility
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Validation**: Built-in HTML5 validation with custom error messages
- ✅ **Theming**: CSS custom properties with multiple built-in themes
- ✅ **Event System**: Comprehensive custom events for integration

## 🎯 Requirements

### Functional Requirements

#### FR-001: Data Management
- **ID**: FR-001
- **Priority**: Critical
- **Description**: The component MUST maintain an internal array of structured data objects
- **Acceptance Criteria**:
  - Data is stored as an array of objects
  - Data is immutable to external consumers
  - Data updates trigger appropriate events
  - Invalid data inputs are rejected gracefully

#### FR-002: Dynamic Item Operations
- **ID**: FR-002
- **Priority**: Critical
- **Description**: Users MUST be able to perform CRUD operations on array items
- **Acceptance Criteria**:
  - Add new items to the array
  - Edit existing items inline
  - Delete items with confirmation
  - Operations are reversible where possible

#### FR-003: Template-Based Rendering
- **ID**: FR-003
- **Priority**: Critical
- **Description**: Content rendering MUST be customizable via slot templates
- **Acceptance Criteria**:
  - Display template defines read-only item appearance
  - Edit template defines editable form structure
  - Templates support data binding
  - Missing templates trigger appropriate warnings

#### FR-004: Form Integration
- **ID**: FR-004
- **Priority**: High
- **Description**: Component MUST integrate seamlessly with HTML forms
- **Acceptance Criteria**:
  - Generates proper form field names for server submission
  - Supports standard form validation
  - Participates in form reset and submission
  - Maintains form state correctly

#### FR-005: Validation System
- **ID**: FR-005
- **Priority**: High
- **Description**: Component MUST provide comprehensive validation feedback
- **Acceptance Criteria**:
  - Supports HTML5 validation attributes
  - Provides helpful error messages
  - Shows validation state visually
  - Prevents invalid data submission

### Non-Functional Requirements

#### NFR-001: Performance
- **ID**: NFR-001
- **Priority**: High
- **Description**: Component MUST perform efficiently with large datasets
- **Acceptance Criteria**:
  - Renders 100 items in under 500ms
  - Memory usage scales linearly with data size
  - Event handling scales with O(1) complexity
  - No memory leaks during component lifecycle

#### NFR-002: Accessibility
- **ID**: NFR-002
- **Priority**: Critical
- **Description**: Component MUST meet WCAG 2.1 AA accessibility standards
- **Acceptance Criteria**:
  - Keyboard navigation support
  - Screen reader compatibility
  - Proper ARIA attributes
  - High contrast mode support

#### NFR-003: Browser Compatibility
- **ID**: NFR-003
- **Priority**: High
- **Description**: Component MUST support modern browsers with graceful degradation
- **Acceptance Criteria**:
  - Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
  - Graceful fallback for unsupported features
  - No JavaScript errors in unsupported browsers
  - Progressive enhancement approach

#### NFR-004: Security
- **ID**: NFR-004
- **Priority**: Critical
- **Description**: Component MUST prevent XSS and injection attacks
- **Acceptance Criteria**:
  - No innerHTML usage with unsanitized data
  - Proper attribute and ID sanitization
  - CSP-compatible implementation
  - Safe event handling patterns

## 🔌 API Specification

### Custom Element Definition

```html
<ck-edit-array
  data='[{"name": "John", "email": "john@example.com"}]'
  array-field="users"
  theme="light"
>
  <template slot="display">
    <strong data-display-for="name"></strong>
    <span data-display-for="email"></span>
  </template>
  
  <template slot="edit">
    <input type="text" name="name" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email Address" required>
  </template>
</ck-edit-array>
```

### Properties

#### `data: Array<Object>`
- **Type**: Array of Objects
- **Default**: `[]`
- **Description**: The array of data objects to display and edit
- **Validation**: Must be a valid array; invalid values coerced to empty array
- **Reactivity**: Changes trigger re-render and `change` event

#### `arrayField: string | null`
- **Type**: String or null
- **Default**: `null`
- **Description**: Field name prefix for form submission names
- **Validation**: Sanitized to remove unsafe characters
- **Usage**: When set, generates names like `users[0].name`

#### `theme: string`
- **Type**: String
- **Default**: `"light"`
- **Description**: Visual theme for component styling
- **Valid Values**: `"light"`, `"dark"`, `"forest-green"`, `"warm-sunset"`
- **Reactivity**: Changes apply immediately

### Methods

#### `addItem(item?: Object): number`
- **Description**: Adds a new item to the array
- **Parameters**: 
  - `item` (optional): Object to add; defaults to empty object
- **Returns**: Index of newly added item
- **Side Effects**: Triggers `item-added` and `change` events
- **Example**: `editArray.addItem({ name: '', email: '' })`

#### `deleteItem(index: number): boolean`
- **Description**: Removes an item from the array
- **Parameters**: 
  - `index`: Zero-based index of item to remove
- **Returns**: `true` if successful, `false` if index invalid
- **Side Effects**: Triggers `item-deleted` and `change` events
- **Example**: `editArray.deleteItem(0)`

#### `updateItem(index: number, fieldName: string, value: any): boolean`
- **Description**: Updates a specific field of an existing item
- **Parameters**: 
  - `index`: Zero-based index of item to update
  - `fieldName`: Name of field to update
  - `value`: New value for the field
- **Returns**: `true` if successful, `false` if invalid parameters
- **Side Effects**: Triggers `item-updated` and `change` events
- **Throws**: `TypeError` if fieldName is not a non-empty string
- **Example**: `editArray.updateItem(0, 'name', 'John Doe')`

#### `toggleEditMode(index: number): void`
- **Description**: Toggles between display and edit mode for an item
- **Parameters**: 
  - `index`: Zero-based index of item to toggle
- **Side Effects**: Updates DOM to show/hide edit interface
- **Focus Management**: Focuses first form input when entering edit mode
- **Example**: `editArray.toggleEditMode(0)`

### Events

#### `change`
- **Type**: CustomEvent
- **Bubbles**: Yes
- **Composed**: Yes
- **Detail**: `{ data: Array<Object> }`
- **Fired When**: Any data modification occurs
- **Data Guarantee**: Detail contains deep clone of current data

#### `item-added`
- **Type**: CustomEvent  
- **Bubbles**: Yes
- **Composed**: Yes
- **Detail**: `{ item: Object, index: number }`
- **Fired When**: New item is added to the array
- **Example**: 
  ```javascript
  editArray.addEventListener('item-added', (e) => {
    console.log(`Added item at index ${e.detail.index}:`, e.detail.item);
  });
  ```

#### `item-updated`
- **Type**: CustomEvent
- **Bubbles**: Yes  
- **Composed**: Yes
- **Detail**: `{ item: Object, index: number, field: string, value: any }`
- **Fired When**: Existing item field is modified
- **Example**:
  ```javascript
  editArray.addEventListener('item-updated', (e) => {
    console.log(`Updated ${e.detail.field} at index ${e.detail.index} to:`, e.detail.value);
  });
  ```

#### `item-deleted`
- **Type**: CustomEvent
- **Bubbles**: Yes
- **Composed**: Yes  
- **Detail**: `{ item: Object, index: number }`
- **Fired When**: Item is removed from the array
- **Example**:
  ```javascript
  editArray.addEventListener('item-deleted', (e) => {
    console.log(`Deleted item from index ${e.detail.index}:`, e.detail.item);
  });
  ```

### Attributes

#### `data`
- **Reflects**: Property value as JSON string
- **Observer**: Parses JSON and updates internal data
- **Error Handling**: Invalid JSON logs warning and uses empty array

#### `array-field`
- **Reflects**: Property value  
- **Observer**: Updates form field naming
- **Sanitization**: Removes unsafe characters for DOM safety

#### `theme`
- **Reflects**: Property value
- **Observer**: Updates CSS class for theming
- **Validation**: Invalid themes fall back to "light"

## 🎨 Slot Specification

### Display Slot (`slot="display"`)

**Purpose**: Defines the read-only appearance of array items

**Requirements**:
- MUST contain a `<template>` element
- SHOULD use `data-display-for` attributes for field binding
- MAY contain arbitrary HTML structure
- MUST NOT contain form controls

**Data Binding**:
```html
<template slot="display">
  <div class="user-card">
    <h4 data-display-for="name">Loading...</h4>
    <p data-display-for="email">Loading...</p>
    <span data-display-for="role">Loading...</span>
  </div>
</template>
```

**Processing Rules**:
1. Template is cloned for each array item
2. Elements with `data-display-for` attributes have their `textContent` set to corresponding data field values
3. Elements receive `data-index`, `data-id`, and `data-name` attributes for identification

### Edit Slot (`slot="edit"`)

**Purpose**: Defines the editable form interface for array items

**Requirements**:
- MUST contain a `<template>` element  
- SHOULD contain form controls (`<input>`, `<select>`, `<textarea>`)
- MUST use `name` attributes for field identification
- MAY include validation attributes

**Data Binding**:
```html
<template slot="edit">
  <div class="edit-form">
    <input type="text" name="name" placeholder="Full Name" required 
           aria-label="Full Name">
    <input type="email" name="email" placeholder="Email Address" required
           aria-label="Email Address">
    <select name="role" aria-label="User Role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </div>
</template>
```

**Processing Rules**:
1. Template is cloned for each item in edit mode
2. Form controls with `name` attributes receive proper array notation names
3. Controls receive `data-name` and `data-index` attributes for event handling  
4. Existing values are populated into form controls
5. IDs are made unique to prevent conflicts

## 🎯 Validation Specification

### HTML5 Validation Support

The component supports all standard HTML5 validation attributes:

- `required`: Field must have a value
- `pattern`: Value must match regular expression
- `min`/`max`: Numeric and date range validation
- `minlength`/`maxlength`: String length validation
- `type`: Type-specific validation (email, url, tel, etc.)

### Custom Error Messages

The component provides enhanced error messages:

```javascript
// Type mismatch examples
type="email" → "Please enter a valid email address. Example: user@example.com"
type="url" → "Please enter a valid URL. Example: https://www.example.com"
type="tel" → "Please enter a valid phone number. Example: (555) 123-4567"

// Pattern mismatch with placeholder
pattern="[0-9]{5}" placeholder="12345" → "Please match the required format. Example: 12345"
```

### Validation State Management

**Visual States**:
- `.invalid`: Applied to form controls with validation errors
- `.valid`: Applied to form controls that have been validated successfully
- Error messages displayed in adjacent elements with descriptive IDs

**ARIA Integration**:
- `aria-invalid="true"`: Added to invalid form controls
- `aria-describedby`: Links controls to error message elements
- Error messages are announced to screen readers

## ♿ Accessibility Specification

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- **Tab Order**: Logical tab sequence through add button, edit buttons, and form controls
- **Enter Key**: Activates buttons and submits inline edits
- **Escape Key**: Cancels edit mode and returns to display mode
- **Focus Management**: Focus moves appropriately when switching modes

#### Screen Reader Support
- **Semantic Structure**: Uses proper ARIA roles (`region`, `list`, `listitem`)
- **Labels**: All interactive elements have accessible names
- **State Changes**: Mode changes and data updates are announced
- **Error Messages**: Validation errors are properly associated and announced

#### Visual Design
- **High Contrast**: Supports Windows high contrast mode
- **Color Independence**: Information not conveyed by color alone
- **Focus Indicators**: Visible focus indicators for all interactive elements
- **Text Scaling**: Content remains usable at 200% zoom

### ARIA Implementation

```html
<!-- Container -->
<div class="edit-array-container" role="region" aria-label="Array editor">
  <!-- Items list -->
  <div class="edit-array-items" role="list" aria-label="Editable items">
    <!-- Individual item -->
    <div class="edit-array-item" role="listitem" aria-label="Item 1">
      <!-- Form controls with proper labeling -->
      <input type="text" name="name" aria-label="Full Name" 
             aria-invalid="false" aria-describedby="name-error">
      <span id="name-error" class="error-message" aria-live="polite"></span>
    </div>
  </div>
</div>
```

## 🔒 Security Specification

### XSS Prevention

**Prohibited Operations**:
- Use of `innerHTML` with unsanitized data
- Dynamic script injection
- Unsafe attribute assignment

**Safe Practices**:
- All user content assigned via `textContent`
- Attributes sanitized before assignment  
- Template cloning prevents script injection
- Event handling uses delegation pattern

### Input Sanitization

**Array Field Names**:
```javascript
// Sanitize field names for DOM safety
const sanitized = arrayField.replace(/[^A-Za-z0-9_.-]/g, '_');
```

**ID Generation**:
```javascript
// Generate safe DOM IDs
const safeId = arrayField.replace(/[^A-Za-z0-9_-]/g, '_');
```

### CSP Compatibility

The component is compatible with strict Content Security Policies:

- **No `eval()`**: No dynamic code evaluation
- **No inline styles**: Uses Constructable Stylesheets or style elements
- **No inline scripts**: No script element creation or modification
- **Safe event handling**: Uses standard DOM APIs exclusively

## 🧪 Testing Requirements

### Unit Testing Coverage

**Minimum Coverage**: 90% code coverage across:
- Data management operations
- Event system functionality  
- Template processing
- Validation system
- Error handling paths

### Integration Testing

**Required Test Scenarios**:
- Form submission integration
- Framework compatibility (React, Vue, Angular, Svelte)
- Custom event handling
- Theme switching
- Large dataset performance

### Accessibility Testing

**Required Validations**:
- Keyboard navigation paths
- Screen reader announcements
- ARIA attribute correctness
- Color contrast ratios
- Focus management

### Performance Testing

**Benchmarks**:
- Render 100 items: < 500ms
- Add item operation: < 50ms
- Delete item operation: < 50ms
- Memory usage: Linear growth with data size

## 🌐 Browser Compatibility

### Supported Browsers

| Browser | Minimum Version | Features |
|---------|----------------|----------|
| Chrome | 88+ | Full support |
| Firefox | 85+ | Full support |
| Safari | 14+ | Constructable Stylesheets fallback |
| Edge | 88+ | Full support |

### Feature Detection

**Constructable Stylesheets**:
```javascript
const supportsConstructableStylesheets = 
  typeof CSSStyleSheet !== "undefined" && 
  CSSStyleSheet.prototype.replaceSync;
```

**Custom Elements**:
```javascript
const supportsCustomElements = 
  typeof customElements !== "undefined" &&
  customElements.define;
```

### Graceful Degradation

**Missing Features**:
- Constructable Stylesheets → Style element fallback
- Custom Elements → Polyfill recommendation
- Shadow DOM → Light DOM fallback (external implementation)

## 📦 Distribution Specification

### Package Structure

```
edit-array/
├── src/
│   ├── ck-edit-array.js          # Main component
│   └── ck-edit-array.d.ts        # TypeScript definitions
├── dist/
│   ├── edit-array.min.js      # Minified version
│   └── edit-array.esm.js      # ES module build
├── examples/
│   └── demo.html              # Interactive demo
├── tests/
│   ├── edit-array.test.js     # Unit tests
│   ├── edit-array.visual.test.js    # Visual tests
│   ├── edit-array.accessibility.test.js # A11y tests
│   └── edit-array.performance.test.js   # Performance tests
└── docs/
    ├── README.md              # User documentation
    ├── readme.technical.md    # Technical guide
    └── spec.md               # This specification
```

### Build Requirements

**ES Module Support**: Primary distribution format
**CommonJS Support**: Available via build process
**TypeScript Support**: Type definitions included
**Source Maps**: Available for debugging

### CDN Distribution

**Versions**:
- Latest: `https://cdn.example.com/edit-array@latest/ck-edit-array.js`
- Specific: `https://cdn.example.com/edit-array@1.0.0/ck-edit-array.js`
- Minified: `https://cdn.example.com/edit-array@latest/edit-array.min.js`

### NPM Package

**Package Name**: `@yourorg/edit-array`
**Entry Points**:
- Main: `dist/ck-edit-array.js`
- Module: `src/ck-edit-array.js`
- Types: `src/ck-edit-array.d.ts`

## 🔄 Versioning

### Semantic Versioning

**Major (X.0.0)**: Breaking API changes
**Minor (0.X.0)**: New features, backwards compatible
**Patch (0.0.X)**: Bug fixes, backwards compatible

### Breaking Changes

**Examples of Breaking Changes**:
- Removing public methods or properties
- Changing event structure
- Modifying slot requirements
- CSS class name changes

### Deprecation Policy

**Timeline**: 2 major versions minimum
**Process**:
1. Mark as deprecated with warning
2. Document in changelog and migration guide
3. Remove in subsequent major version

---

**Document Status**: This specification is considered stable for version 1.0.0. Changes require review and approval through the standard change management process.

**Next Review**: Scheduled for next major version planning cycle.
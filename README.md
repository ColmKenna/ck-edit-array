# ck-edit-array

`ck-edit-array` is a standards-based web component for collecting and editing arrays of structured form data. It provides inline editing, validation helpers, keyboard accessibility, and emits rich lifecycle events so you can keep your application state in sync.

## Installation

### npm
```bash
npm install @ck-templates/edit-array
```

```ts
import '@ck-templates/edit-array/dist/ck-edit-array.js';
```

### CDN
Load the pre-built module directly from a CDN such as unpkg or jsDelivr:
```html
<script type="module" src="https://unpkg.com/@ck-templates/edit-array/dist/ck-edit-array.js"></script>
<!-- or -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@ck-templates/edit-array/dist/ck-edit-array.js"></script>
```

## Quick Start
```html
<ck-edit-array array-field="users"></ck-edit-array>

<script type="module">
  import '@ck-templates/edit-array/dist/ck-edit-array.js';

  const element = document.querySelector('ck-edit-array');
  element.data = [
    { name: 'Jane Doe', email: 'jane@example.com' }
  ];

  element.addEventListener('ck-edit-array:change', event => {
    console.log('Updated data', event.detail.data);
  });
</script>
```

### Slots
- `display` ï¿½ readonly template for each item.
- `edit` ï¿½ editable template shown when an item enters edit mode.
- `buttons` ï¿½ optional custom button templates (see [Button Customization](#button-customization)).
- `empty` ï¿½ content rendered when there are no items.

### Key Attributes
- `array-field` — namespace used when binding form inputs.
- `data` — JSON string or array assigned via property.
- `add-label`, `save-label`, `cancel-label`, `delete-label`, `restore-label` — customize button copy.
- `item-direction` — set to `row` to arrange item content and actions horizontally; defaults to stacked column layout.

### Layout Direction
Items render as vertical columns by default. Apply `item-direction="row"` for a horizontal layout that keeps display/edit content and action buttons spaced evenly.

```html
<ck-edit-array array-field="team" item-direction="row">
  <div slot="display">
    <span data-display-for="name"></span>
    <span data-display-for="title"></span>
  </div>
  <div slot="edit">
    <input name="name" required />
    <input name="title" />
  </div>
</ck-edit-array>
```
### Custom Events
- `ck-edit-array:change` ï¿½ fires when the backing array changes.
- `ck-edit-array:item-added` ï¿½ a new item is appended.
- `ck-edit-array:item-updated` ï¿½ a field on an item changes.
- `ck-edit-array:item-deleted` ï¿½ an item is marked deleted.
- `ck-edit-array:item-restored` ï¿½ an item is restored from deleted state.

Each event includes the updated data and the affected item index in `event.detail`.

## Button Customization

The `ck-edit-array` component supports custom button templates through the `buttons` slot. This allows you to completely customize the appearance and structure of buttons while maintaining all functionality, accessibility, and state management.

### Basic Custom Buttons

```html
<ck-edit-array array-field="users">
  <div slot="display">
    <span data-display-for="name"></span>
  </div>
  <div slot="edit">
    <input name="name" required>
  </div>
  <div slot="buttons">
    <button data-action="edit" class="my-edit-btn">
      <i class="icon-edit"></i> Modify
    </button>
    <button data-action="delete" class="my-delete-btn">
      <i class="icon-trash"></i> Remove
    </button>
  </div>
</ck-edit-array>
```

### Supported Actions

The `data-action` attribute determines button functionality:

- `edit` - Toggle between display and edit modes
- `delete` - Toggle item deletion state (shows as "Delete" or "Restore")
- `cancel` - Cancel adding a new item
- `add` - Add a new item (typically used in the main action bar)

### Automatic Enhancement

Custom buttons are automatically enhanced with:

- **Proper CSS classes** - Component styling classes are merged with your custom classes
- **Data attributes** - `data-action` and `data-index` for functionality
- **Accessibility** - ARIA labels using your custom label attributes
- **State management** - Delete/restore text updates, edit mode toggling

### Advanced Examples

#### Icon-Only Buttons
```html
<div slot="buttons">
  <button data-action="edit" class="btn-icon" title="Edit item">
    <svg><!-- edit icon --></svg>
  </button>
  <button data-action="delete" class="btn-icon" title="Delete item">
    <svg><!-- delete icon --></svg>
  </button>
</div>
```

#### Complex Button Structure
```html
<div slot="buttons">
  <button data-action="edit" class="btn-complex">
    <div class="btn-icon-wrapper">
      <svg class="btn-icon"><!-- icon --></svg>
    </div>
    <div class="btn-content">
      <span class="btn-title">Edit Item</span>
      <small class="btn-subtitle">Modify details</small>
    </div>
  </button>
</div>
```

### Partial Customization

You can customize only some buttons and let others use default styling:

```html
<div slot="buttons">
  <!-- Custom edit button -->
  <button data-action="edit" class="fancy-edit-btn">
    âœ¨ Custom Edit
  </button>
  <!-- Delete button will use default styling -->
</div>
```

### Styling Guidelines

- Use CSS classes for styling rather than inline styles
- Your custom classes are preserved and merged with component classes
- Original button templates remain unchanged (they are cloned for use)
- Consider hover, focus, and active states for better UX

### Accessibility

Custom buttons automatically receive:
- Proper ARIA labels based on action and item context
- Respect for custom label attributes (`edit-label`, `delete-label`, etc.)
- Keyboard navigation support
- Screen reader compatibility

### Fallback Behavior

If no `buttons` slot is provided, or if specific action buttons are missing, the component automatically falls back to creating default programmatic buttons with standard styling.

## TypeScript Support
All public types are exported from the package:
```ts
import type { EditArrayItem, ItemUpdateEventDetail } from '@ck-templates/edit-array';
```

## Development
```bash
npm install
npm run build           # Bundle to dist/
npm run build:types     # Generate dist/ck-edit-array.d.ts
npm test                # Run Jest unit tests
npm run lint            # Lint the source
```

To work on the examples locally:
```bash
npm run demo
```
Then open the examples in your browser:
- `http://localhost:3001/examples/demo.html` - Main interactive demo
- `http://localhost:3001/examples/demo-advanced.html` - Advanced features
- `http://localhost:3001/examples/demo-button-slots.html` - Button customization showcase

## Publishing Checklist
1. `npm run clean && npm run build && npm run build:types`
2. Verify `dist/ck-edit-array.js`, `dist/ck-edit-array.cjs`, and `dist/ck-edit-array.d.ts` exist.
3. Update the version in `package.json`.
4. Run `npm publish --access public`.

## License
[MIT](./LICENSE)




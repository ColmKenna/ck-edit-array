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
- `display` – readonly template for each item.
- `edit` – editable template shown when an item enters edit mode.
- `empty` – content rendered when there are no items.

### Key Attributes
- `array-field` – namespace used when binding form inputs.
- `data` – JSON string or array assigned via property.
- `add-label`, `save-label`, `cancel-label`, `delete-label`, `restore-label` – customize button copy.

### Custom Events
- `ck-edit-array:change` – fires when the backing array changes.
- `ck-edit-array:item-added` – a new item is appended.
- `ck-edit-array:item-updated` – a field on an item changes.
- `ck-edit-array:item-deleted` – an item is marked deleted.
- `ck-edit-array:item-restored` – an item is restored from deleted state.

Each event includes the updated data and the affected item index in `event.detail`.

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
Then open `http://localhost:3001/examples/demo-basic.html` in your browser.

## Publishing Checklist
1. `npm run clean && npm run build && npm run build:types`
2. Verify `dist/ck-edit-array.js`, `dist/ck-edit-array.cjs`, and `dist/ck-edit-array.d.ts` exist.
3. Update the version in `package.json`.
4. Run `npm publish --access public`.

## License
[MIT](./LICENSE)


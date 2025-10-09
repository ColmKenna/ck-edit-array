# Button Customization Guide

This guide shows you how to customize the buttons in the `ck-edit-array` component while maintaining all functionality and accessibility features.

## Quick Start

### Default Buttons (No Customization)
```html
<ck-edit-array array-field="users">
  <div slot="display">
    <span data-display-for="name"></span>
  </div>
  <div slot="edit">
    <input name="name" required>
  </div>
</ck-edit-array>
```
This creates standard buttons with default styling.

### Custom Buttons
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

## Required Attributes

### data-action
Every button in the `buttons` slot must have a `data-action` attribute:

- `data-action="edit"` - Edit/Save button functionality
- `data-action="delete"` - Delete/Restore button functionality  
- `data-action="cancel"` - Cancel button functionality
- `data-action="add"` - Add new item functionality

### Button Element
Only `<button>` elements are enhanced. Other elements with `data-action` are ignored.

## Automatic Enhancements

When you provide custom buttons, the component automatically:

1. **Clones your template** - Original buttons remain unchanged
2. **Adds CSS classes** - Merges your classes with component classes
3. **Sets data attributes** - Adds `data-index` and ensures `data-action` is set
4. **Adds ARIA labels** - Provides accessibility labels based on action and context
5. **Manages state** - Handles delete/restore text updates and edit mode toggling

## Styling Examples

### Basic Styling
```css
.my-edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.my-edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}
```

### Icon Buttons
```html
<div slot="buttons">
  <button data-action="edit" class="icon-btn">
    <svg width="16" height="16" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z"/>
      <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z"/>
    </svg>
  </button>
  <button data-action="delete" class="icon-btn delete">
    <svg width="16" height="16" fill="currentColor">
      <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
    </svg>
  </button>
</div>
```

```css
.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #e5e7eb;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.icon-btn.delete:hover {
  background: #fecaca;
}
```

### Complex Button Structure
```html
<div slot="buttons">
  <button data-action="edit" class="complex-btn">
    <div class="btn-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="btn-content">
      <span class="btn-title">Edit Item</span>
      <small class="btn-subtitle">Modify details</small>
    </div>
  </button>
</div>
```

```css
.complex-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.btn-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}
```

## Partial Customization

You don't have to customize all buttons. Missing buttons will use default styling:

```html
<div slot="buttons">
  <!-- Only customize the edit button -->
  <button data-action="edit" class="fancy-edit">
    ✨ Custom Edit
  </button>
  <!-- Delete button will be created with default styling -->
</div>
```

## State Management

### Delete/Restore Buttons
Delete buttons automatically change their aria-label based on item state:
- Normal items: "Delete item X"  
- Deleted items: "Restore item X" (or custom restore-label)

### Custom Labels
You can customize button labels using attributes:
```html
<ck-edit-array 
  edit-label="Modify"
  delete-label="Archive" 
  restore-label="Unarchive"
  cancel-label="Abort">
  <!-- slots -->
</ck-edit-array>
```

## Accessibility

Custom buttons automatically receive:
- **ARIA labels** - Descriptive labels for screen readers
- **Keyboard navigation** - Tab order and Enter/Space activation
- **Focus management** - Proper focus handling during state changes
- **Role attributes** - Semantic button roles

Example of automatically generated ARIA labels:
- Edit button: "Edit item 1" or "Modify item 1" (if edit-label="Modify")
- Delete button: "Delete item 1" or "Archive item 1" (if delete-label="Archive")
- Restore button: "Restore item 1" or "Unarchive item 1" (if restore-label="Unarchive")

## Best Practices

### Do ✅
- Use semantic `<button>` elements
- Include `data-action` attribute on all buttons
- Provide hover and focus styles for better UX
- Use CSS classes instead of inline styles
- Consider keyboard users in your designs
- Test with screen readers

### Don't ❌
- Use non-button elements (div, span, etc.) with data-action
- Modify the original button templates (they're cloned automatically)
- Rely on JavaScript event handlers in templates (use component events instead)
- Forget to include required data-action attributes

## Troubleshooting

### Button Not Working
- Ensure you're using a `<button>` element
- Check that `data-action` attribute is set correctly
- Verify the action value is one of: "edit", "delete", "cancel", "add"

### Styling Not Applied
- Check that your CSS selectors are specific enough
- Remember that component classes are merged with your classes
- Use browser dev tools to inspect the final button element

### Accessibility Issues
- ARIA labels are generated automatically - don't override them manually
- Ensure buttons have sufficient color contrast
- Test keyboard navigation (Tab, Enter, Space keys)

## Examples

See the complete examples in:
- [Button Customization Demo](../examples/demo-button-slots.html)
- [Main Demo](../examples/demo.html)
- [Advanced Demo](../examples/demo-advanced.html)

## API Reference

### Slot: buttons
Optional slot for custom button templates.

**Requirements:**
- Must contain `<button>` elements
- Each button must have a `data-action` attribute
- Supported actions: "edit", "delete", "cancel", "add"

**Automatic Enhancements:**
- CSS classes merged with existing classes
- `data-index` attribute added for item-specific buttons
- ARIA labels generated based on action and context
- Event handlers attached for functionality

**Fallback Behavior:**
- Missing buttons use default programmatic creation
- Non-button elements with data-action are ignored
- Invalid data-action values are ignored
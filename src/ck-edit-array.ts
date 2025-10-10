// TypeScript interfaces and type definitions
// Public item type: consumers can provide arbitrary fields, but we avoid `any`.
// Use `unknown` for values and narrow when needed.
type EditArrayItem = Record<string, unknown> & { isDeleted?: boolean };

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  element: HTMLElement;
}

interface EditArrayEventDetail {
  data: EditArrayItem[];
}

interface ItemEventDetail extends EditArrayEventDetail {
  item: EditArrayItem;
  index: number;
}

interface ItemUpdateEventDetail extends ItemEventDetail {
  fieldName: string;
  value: unknown;
  oldValue: unknown;
}

interface ItemChangeEventDetail extends ItemEventDetail {
  action: string;
  marked?: boolean;
}

// Custom Event Types
interface EditArrayChangeEvent extends CustomEvent<EditArrayEventDetail> {}
interface EditArrayItemAddedEvent extends CustomEvent<ItemEventDetail> {}
interface EditArrayItemUpdatedEvent extends CustomEvent<ItemUpdateEventDetail> {}
interface EditArrayItemDeletedEvent extends CustomEvent<ItemEventDetail> {}
interface EditArrayItemChangeEvent extends CustomEvent<ItemChangeEventDetail> {}

// Utility types for form validation
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type ValidationPattern = Record<string, string>;

// CSS and styling constants
const EDIT_ARRAY_CSS: string = `
  :host { 
    display: block;
  }
  
  .edit-array-container { 
    display: block; 
  }
  
  .edit-array-item { 
    border: 1px solid var(--border-color, #e5e7eb); 
    border-radius: var(--border-radius, 12px); 
    padding: var(--spacing-lg, 1rem); 
    margin-bottom: var(--spacing-lg, 1rem); 
    transition: opacity var(--transition-duration, 0.3s) var(--transition-timing, ease); 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-lg, 1rem);
  }

  :host([item-direction="row"]) .edit-array-item {
    flex-direction: row;
  }

  .edit-container, .display-container {
    margin-bottom: var(--spacing-md, 0.5rem)
  }

  .edit-array-item.deleted { 
    border-color: var(--error-border-color, #f87171); 
    background-color: var(--error-bg-color, #fee2e2); 
  }
  
  .hidden { 
    display: none; 
  }
  
  .error-message { 
    color: var(--error-color, #ef4444); 
    font-size: var(--font-size-sm, 0.875rem); 
    display: block; 
    margin-top: var(--spacing-sm, 0.25rem); 
  } 
  
  label { 
    display: block; 
    margin: var(--spacing-sm, 0.25rem) 0; 
  }  button { 
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-size: var(--button-font-size, 0.875rem);
    font-weight: var(--button-font-weight, 500);
    line-height: 1.5;
    padding: var(--button-padding, 0.375rem 0.75rem);
    margin: var(--button-margin, 0 var(--spacing-sm, 0.25rem) var(--spacing-sm, 0.25rem) 0);
    border: var(--button-border-width, 1px) solid transparent;
    border-radius: var(--button-border-radius, 6px);
    background-color: var(--button-secondary-bg, #f3f4f6);
    color: var(--button-secondary-color, #374151);
    border-color: var(--button-secondary-border, #d1d5db);
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition-duration, 0.3s) var(--transition-timing, ease);
    user-select: none;
    vertical-align: middle;
  }
  
  button:hover {
    background-color: var(--button-secondary-hover-bg, #e5e7eb);
    border-color: var(--button-secondary-hover-border, #9ca3af);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  button:focus {
    outline: 2px solid var(--button-primary-bg, #3b82f6);
    outline-offset: 2px;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* Primary button styles (Edit, Add) */
  .btn-primary, 
  .edit-array-item-btn,
  button[data-action="edit"],
  button[data-action="add"] {
    background-color: var(--button-primary-bg, #3b82f6);
    color: var(--button-primary-color, #ffffff);
    border-color: var(--button-primary-border, #3b82f6);
  }
  
  .btn-primary:hover,
  .edit-array-item-btn:hover,
  button[data-action="edit"]:hover,
  button[data-action="add"]:hover {
    background-color: var(--button-primary-hover-bg, #2563eb);
    border-color: var(--button-primary-hover-border, #2563eb);
  }
  
  /* Success button styles (Save, Done) */
  .btn-success,
  button[data-action="save"] {
    background-color: var(--button-success-bg, #10b981);
    color: var(--button-success-color, #ffffff);
    border-color: var(--button-success-border, #10b981);
  }
  
  .btn-success:hover,
  button[data-action="save"]:hover {
    background-color: var(--button-success-hover-bg, #059669);
    border-color: var(--button-success-hover-border, #059669);
  }
  
  /* Danger button styles (Delete, Cancel) */
  .btn-danger,
  .delete-array-item-btn,
  button[data-action="delete"],
  button[data-action="cancel"] {
    background-color: var(--button-danger-bg, #ef4444);
    color: var(--button-danger-color, #ffffff);
    border-color: var(--button-danger-border, #ef4444);
  }
  
  .btn-danger:hover,
  .delete-array-item-btn:hover,
  button[data-action="delete"]:hover,
  button[data-action="cancel"]:hover {
    background-color: var(--button-danger-hover-bg, #dc2626);
    border-color: var(--button-danger-hover-border, #dc2626);
  }
`;

const EDIT_ARRAY_SHEET: CSSStyleSheet | null = (() => {
  if (typeof CSSStyleSheet === "undefined") return null;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(EDIT_ARRAY_CSS);
    return sheet;
  } catch (e) {
    // If CSSStyleSheet or replaceSync isn't available in this environment, return null.
    return null;
  }
})();

const extractFromString= (value: string): EditArrayItem[] => {
    const trimmed = value.trim();
    if (trimmed === '') return [];

    // Try to parse as JSON first
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        // Parsing may fail for malformed JSON; warn in debug but return empty array to remain safe.
        if (typeof console !== 'undefined' && console && console.warn) {
          console.warn('EditArray: Failed to parse data attribute as JSON array', err);
        }
        return [];
      }
    }

    // For non-JSON strings, wrap in an object so it matches EditArrayItem type
    return [{ value: trimmed } as EditArrayItem];
}

// Pure helper functions for array and naming operations with TypeScript types
const coerceArray = (value: unknown): EditArrayItem[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return value as EditArrayItem[];

  // Handle plain objects by wrapping them in an array
  if (typeof value === 'object' && value !== null) return [value as EditArrayItem];

  // Try to coerce string values to array
  if (typeof value === 'string') {
    return extractFromString(value);
  }

  // Coerce single primitive values to a single-item array (preserve prior runtime shape).
  return [value as EditArrayItem];
};

// Special version for attribute parsing that treats non-JSON strings as invalid
const coerceArrayFromAttribute = (value: unknown): EditArrayItem[] => {
  if (value == null) return [];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return [];
    
    // For attributes, try to parse as JSON
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      // Any non-JSON string in attribute is treated as malformed
      if (typeof console !== 'undefined' && console && console.warn) {
        console.warn('EditArray: Failed to parse data attribute as JSON array');
      }
      return [];
    }
  }
  return coerceArray(value);
};

const buildNamePrefix = (arrayField: string | null, index: number): string | null => {
  if (!arrayField) return null;
  // Sanitize arrayField to ensure safe DOM operations
  const sanitized = arrayField.replace(/[^A-Za-z0-9_.-]/g, '_');
  return `${sanitized}[${index}]`;
};

const computeIdPrefix = (arrayField: string | null): string => {
  if (!arrayField ) return "item";
  // Sanitize and convert to safe ID format
  return arrayField.replace(/[^A-Za-z0-9_-]/g, "_");
};

const isValidIndex = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value);
};

/**
 * Creates a deep clone of an object to prevent external mutation.
 */
/**
 * Deep clone with fallback: try structuredClone where available (handles most built-ins
 * including circular refs). Otherwise use a WeakMap-based clone that supports
 * Date, Array and plain objects while detecting circular refs.
 */
const deepClone = <T>(obj: T): T => {
  // Fast path: structuredClone (modern browsers / Node 17+)
  try {
    const structuredCloneFn = (globalThis as { structuredClone?: <U>(value: U) => U }).structuredClone;
    if (typeof structuredCloneFn === 'function') {
      return structuredCloneFn(obj);
    }
  } catch (e) {
    // Fallthrough to JS fallback
  }

  const seen = new WeakMap<object, unknown>();

  const cloneRecursive = (value: unknown): unknown => {
    if (value === null || typeof value !== 'object') return value;
    if (value instanceof Date) return new Date(value.getTime());
    if (value instanceof RegExp) return new RegExp(value.source, value.flags);

    const objectValue = value as object;
    const cached = seen.get(objectValue);
    if (cached) return cached;

    if (Array.isArray(value)) {
      const arr: unknown[] = [];
      seen.set(objectValue, arr);
      for (let i = 0; i < value.length; i++) arr[i] = cloneRecursive(value[i]);
      return arr;
    }

    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    seen.set(objectValue, out);
    for (const key of Object.keys(record)) {
      out[key] = cloneRecursive(record[key]);
    }
    return out;
  };

  return cloneRecursive(obj) as T;
};

/**
 * Helper: collect pattern sources (attribute + property) in a single small function
 */
const collectPatternSources = (input: HTMLInputElement): string[] => {
  const sources: string[] = [];
  if (typeof input.getAttribute === 'function') {
    const attrPattern = input.getAttribute('pattern');
    if (attrPattern) sources.push(attrPattern);
  }
  if (input.pattern && !sources.includes(input.pattern)) {
    sources.push(input.pattern);
  }
  return sources;
};

/**
 * Helper: check whether any pattern source matches the input value
 */
const anyPatternMatches = (value: string, sources: string[]): boolean => {
  for (const src of sources) {
    try {
      if (new RegExp(src).test(value)) return true;
    } catch (e) {
      console.warn('EditArray: Invalid pattern regex:', e);
    }
  }
  return false;
};

/**
 * Simplified coordinator with reduced complexity that delegates to helpers
 */
const testPatternValidation = (input: HTMLInputElement): boolean => {
  if (!input || !input.validity?.patternMismatch || !input.value) {
    return input?.validity?.valid ?? true;
  }

  const patternSources = collectPatternSources(input);
  if (patternSources.length === 0) {
    return input.validity ? input.validity.valid : true;
  }

  return anyPatternMatches(input.value, patternSources);
};

// Move common pattern examples outside the main function so helpers can reuse them.
const COMMON_PATTERNS: ValidationPattern = {
  '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}': '(555) 123-4567',
  '([0-9]{3}) [0-9]{3}-[0-9]{4}': '(555) 123-4567',
  '\\d{3}-\\d{3}-\\d{4}': '555-123-4567',
  '\\d{3}-[0-9]{3}-[0-9]{4}': '555-123-4567',
  '\\+1[0-9]{10}': '+15551234567',
  '[0-9]{5}': '12345',
  '[0-9]{5}-[0-9]{4}': '12345-6789',
  '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]': 'A1B 2C3',
  '[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}': '1234 5678 9012 3456',
  '[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}': '1234-5678-9012-3456',
  '[0-9]{3}-[0-9]{2}-[0-9]{4}': '123-45-6789',
  '[A-Z]{3}[0-9]{3}': 'ABC123',
  '[A-Z]{2}[0-9]{4}': 'AB1234',
  '[0-9]{2}:[0-9]{2}': '14:30',
  '[0-9]{1,2}:[0-9]{2} (AM|PM)': '2:30 PM',
  '[0-9]{4}-[0-9]{2}-[0-9]{2}': '2023-12-25',
  '[0-9]{2}/[0-9]{2}/[0-9]{4}': '12/25/2023',
  '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}': 'Example123',
  '[a-zA-Z0-9_]{3,16}': 'user_name123',
  '\\$[0-9]+\\.[0-9]{2}': '$123.45',
  '[A-Za-z0-9]+': 'abc123',
  '[A-Z]{2,}': 'ABC',
  '[a-z]{2,}': 'abc',
  '[0-9]+': '123'
};

// Helper: compute pattern candidates (keeps logic out of main function)
const getPatternCandidates = (input: HTMLInputElement): string[] => {
  const rawPatternAttr = typeof input.getAttribute === 'function'
    ? input.getAttribute('pattern')
    : null;
  const pattern = (input as HTMLInputElement).pattern || null;
  return [pattern, rawPatternAttr].filter(Boolean) as string[];
};

const handleRequired = (input: HTMLInputElement): string | null => {
  if (input.validity.valueMissing && input.required) {
    return 'This field is required. Please enter a value.';
  }
  return null;
};

const handleTypeMismatch = (input: HTMLInputElement): string | null => {
  if (!input.validity.typeMismatch) return null;
  switch (input.type) {
    case 'email':
      return 'Please enter a valid email address. Example: user@example.com';
    case 'url':
      return 'Please enter a valid URL. Example: https://www.example.com';
    case 'tel':
      return 'Please enter a valid phone number. Example: (555) 123-4567';
    case 'number':
      return 'Please enter a valid number.';
    case 'date':
      return 'Please enter a valid date. Example: 2023-12-25';
    case 'time':
      return 'Please enter a valid time. Example: 14:30';
    default:
      return 'Please enter a value in the correct format.';
  }
};

const handlePatternMismatch = (input: HTMLInputElement): string | null => {
  const candidates = getPatternCandidates(input);
  if (!input.validity.patternMismatch || candidates.length === 0) return null;

  // If the shared validation helper says input is actually valid, suppress error
  if (testPatternValidation(input)) return '';

  if (input.placeholder && input.placeholder.trim()) {
    return `Please match the required format. Example: ${input.placeholder}`;
  }

  for (const c of candidates) {
    const example = COMMON_PATTERNS[c];
    if (example) return `Please match the required format. Example: ${example}`;
  }

  return `Please match the required format: ${candidates[0]}`;
};

const handleRangeAndStep = (input: HTMLInputElement): string | null => {
  if (input.validity.rangeUnderflow && input.min !== null && input.min !== undefined) {
    return `Please enter a value greater than or equal to ${input.min}.`;
  }
  if (input.validity.rangeOverflow && input.max !== null && input.max !== undefined) {
    return `Please enter a value less than or equal to ${input.max}.`;
  }
  if (input.validity.stepMismatch) {
    return 'Please enter a valid value.';
  }
  return null;
};

const handleLength = (input: HTMLInputElement): string | null => {
  if (input.validity.tooShort && input.minLength) {
    return `Please enter at least ${input.minLength} characters.`;
  }
  if (input.validity.tooLong && input.maxLength) {
    return `Please enter no more than ${input.maxLength} characters.`;
  }
  return null;
};

// Replace large arrow function with a small coordinator that delegates to helpers
const getHelpfulValidationMessage = (input: HTMLInputElement): string => {
  if (!input || input.validity.valid) return '';

  // Order of checks mirrors prior behavior
  const checkers: Array<(i: HTMLInputElement) => string | null> = [
    handleRequired,
    handleTypeMismatch,
    handlePatternMismatch,
    handleRangeAndStep,
    handleLength
  ];

  for (const check of checkers) {
    const result = check(input);
    if (result !== null && result !== '') return result;
    // empty string means "no message" (e.g. pattern validated via testPatternValidation)
    if (result === '') return '';
  }

  return input.validationMessage || 'Please enter a valid value.';
};

const applyEditArrayStyles = (shadowRoot: ShadowRoot): void => {
  if (!shadowRoot) return;
  if (EDIT_ARRAY_SHEET && shadowRoot.adoptedStyleSheets !== undefined) {
    try {
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        EDIT_ARRAY_SHEET,
      ];
      return;
    } catch (err) {
      // On some environments assigning adoptedStyleSheets can throw; fallback to style element below.
    }
  }
  const styleEl = document.createElement("style");
  styleEl.textContent = EDIT_ARRAY_CSS;
  shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
};
/**
 * 
EditArray Web Component - A dynamic array editor with inline editing capabilities.
 * 
 * @class EditArray
 * @extends HTMLElement
 * 
 * @description
 * A web component that provides a rich interface for editing arrays of objects with:
 * - Inline editing with validation
 * - Add/remove/delete functionality  
 * - Slot-based templating for display, edit, and button modes
 * - Custom button templates with automatic enhancement
 * - Event-driven architecture for data changes
 * - Accessibility support and keyboard navigation
 * 
 * @example
 * Basic usage with default buttons:
 * ```html
 * <ck-edit-array array-field="users" data='[{"name":"John","email":"john@example.com"}]'>
 *   <div slot="display">
 *     <span data-display-for="name"></span> - <span data-display-for="email"></span>
 *   </div>
 *   <div slot="edit">
 *     <input name="name" required>
 *     <input name="email" type="email" required>
 *   </div>
 * </ck-edit-array>
 * ```
 * 
 * @example
 * Advanced usage with custom button templates:
 * ```html
 * <ck-edit-array array-field="users" data='[{"name":"John","email":"john@example.com"}]'>
 *   <div slot="display">
 *     <span data-display-for="name"></span> - <span data-display-for="email"></span>
 *   </div>
 *   <div slot="edit">
 *     <input name="name" required>
 *     <input name="email" type="email" required>
 *   </div>
 *   <div slot="buttons">
 *     <button data-action="edit" class="btn-custom">
 *       <i class="icon-edit"></i> Modify
 *     </button>
 *     <button data-action="delete" class="btn-danger-custom">
 *       <i class="icon-trash"></i> Remove
 *     </button>
 *   </div>
 * </ck-edit-array>
 * ```
 * 
 * @fires EditArray#change - Fired when the data array changes
 * @fires EditArray#item-added - Fired when a new item is added
 * @fires EditArray#item-updated - Fired when an item is updated
 * @fires EditArray#item-deleted - Fired when an item is deleted
 * @fires EditArray#item-change - Fired when an item's deletion status changes
 * 
 * @slot display - Template for displaying items in read-only mode. Should contain elements with 
 *                 data-display-for="fieldName" attributes to show field values.
 * @slot edit - Template for editing items with form controls. Should contain form inputs with 
 *              name attributes matching the data field names. Supports validation.
 * @slot buttons - Optional template for custom button designs. Should contain button elements with 
 *                 data-action attributes ("edit", "delete", "cancel", "add"). Buttons are automatically 
 *                 enhanced with proper classes, attributes, and accessibility features while preserving 
 *                 custom styling and content. Falls back to default programmatic buttons if not provided.
 * 
 * @attr {string} array-field - The field name for form submission (used for name attributes)
 * @attr {string} data - JSON string representation of the array data
 * @attr {string} edit-label - Label for the edit button (default: "Edit")
 * @attr {string} save-label - Label for the save button (default: "Save") 
 * @attr {string} delete-label - Label for the delete button (default: "Delete")
 * @attr {string} restore-label - Label for the restore button (default: "Restore")
 * @attr {string} cancel-label - Label for the cancel button (default: "Cancel")
 */
class EditArray extends HTMLElement {
  /** Private data array holding the current items */
  private data_internal: EditArrayItem[] = [];


  /** Private input event handler for efficient event delegation */
  private onInput = (event: Event): void => {
    const t = event.target as HTMLElement;
    if (!t) return;
    
    // Extract data attributes that identify the field and item being edited
    const name = t.getAttribute("data-name");
    const indexStr = t.getAttribute("data-index");
    if (!name || !indexStr) return;
    
    const index = parseInt(indexStr, 10);
    if (Number.isNaN(index)) return;
    
    // Update the data model when form inputs change
    const {value} = (t as FormElement);
    this.updateRecord(index, name, value);
  };

  /** Private click event handler for all buttons (edit, delete, cancel, add) */
  private onDelegatedClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    if (!action) return;

    // Parse item index for actions that operate on specific items
    const indexStr = target.getAttribute('data-index');
    const index = indexStr ? parseInt(indexStr, 10) : null;

    // Prevent default behavior and event bubbling for button actions
    event.preventDefault();
    event.stopPropagation();
    const indexIsValid = isValidIndex(index);
    switch (action) {
      case 'edit':
        if (indexIsValid) {
          this.toggleEditMode(index);
        }
        break;
      case 'delete':
        if (indexIsValid) {
          this.toggleDeletion(index);
        }
        break;
      case 'cancel':
        this.handleCancelAction(target);
        break;
      case 'add':
        this.handleAddAction();
        break;
    }
  };

  /**
   * Creates an instance of EditArray.
   * Initializes the shadow DOM and sets up event handlers.
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Build DOM nodes programmatically to avoid HTML string injection and to be
    // resilient to unexpected id values.
    const container = document.createElement('div');
    container.className = 'edit-array-container';
    if (this.id) container.setAttribute('id', this.id);
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Array editor');

    const items = document.createElement('div');
    items.className = 'edit-array-items';
    items.setAttribute('role', 'list');
    items.setAttribute('aria-label', 'Editable items');

    const actionBar = document.createElement('div');
    actionBar.className = 'action-bar';

    container.appendChild(items);
    container.appendChild(actionBar);
    shadow.appendChild(container);

    applyEditArrayStyles(shadow);


  }

  private handleCancelAction(cancelButton: HTMLElement): void {
    // Find the wrapper element
    const wrapper = cancelButton.closest('.edit-array-item') as HTMLElement;
    if (!wrapper) return;

    // Get the index of the item being cancelled
    const indexStr = wrapper.getAttribute('data-index');
    const index = indexStr ? parseInt(indexStr, 10) : null;
    
    if (index !== null && !Number.isNaN(index) && index >= 0 && index < this.data_internal.length) {
      // Remove the specific item from data array
      this.data_internal.splice(index, 1);
      this.dispatchDataChange();
    } else {
      // Fallback: if we can't determine the index, remove the last item
      console.warn('EditArray: Could not determine item index for cancel action, removing last item');
      this.data_internal.pop();
      this.dispatchDataChange();
    }
    
    // Remove the wrapper from DOM
    wrapper.remove();
    
    // Show the add button again
    const addBtn = this.shadowRoot?.querySelector(".action-bar .btn-success") as HTMLElement;
    if (addBtn) addBtn.classList.remove("hidden");
  }

  private handleAddAction(): void {
    const itemsContainer = this.shadowRoot?.querySelector(".edit-array-items") as HTMLElement;
    if (!itemsContainer) return;

    // Use the addItem method
    const newIndex = this.addItem({});
    
    // Render the new item
    this.renderItem(itemsContainer, {}, newIndex);
    this.toggleEditMode(newIndex);
    
    // Hide the add button
    const addBtn = this.shadowRoot?.querySelector(".action-bar .btn-success") as HTMLElement;
    if (addBtn) addBtn.classList.add("hidden");

    // Clear any validation errors for the new item
    const wrapper = this.shadowRoot?.querySelector(
      `.edit-array-item[data-index="${newIndex}"]`
    ) as HTMLElement;
    if (!wrapper) return;
    const edit = wrapper.querySelector(".edit-container") as HTMLElement;
    if (!edit) return;
    edit
      .querySelectorAll(".error-message")
      .forEach((span) => ((span as HTMLElement).textContent = ""));
    edit
      .querySelectorAll("input, select, textarea")
      .forEach((input) => (input as HTMLElement).classList.remove("invalid"));
  }

  /**
   * Updates the text of all restore buttons when the restore-label attribute changes.
   */
  private updateRestoreButtonLabels(): void {
    if (!this.shadowRoot) return;
    
    // Find all deleted items and update their button text
    const deletedItems = this.shadowRoot.querySelectorAll('.edit-array-item.deleted');
    deletedItems.forEach((wrapper) => {
      const deleteBtn = wrapper.querySelector('button[data-action="delete"]') as HTMLButtonElement;
      if (deleteBtn) {
        const index = parseInt(deleteBtn.getAttribute('data-index') || '0', 10);
        const restoreLabel = this.getAttribute("restore-label") || "Restore";
        deleteBtn.textContent = restoreLabel;
        deleteBtn.setAttribute('aria-label', `${restoreLabel} item ${index + 1}`);
      }
    });
  }

  /**
   * Determines the appropriate button text based on item deletion state.
   */
  private getDeleteButtonText(item: EditArrayItem | null | undefined): string {
    if (!item || !item.isDeleted) {
      return this.getAttribute("delete-label") || "Delete";
    }
    return this.getAttribute("restore-label") || "Restore";
  }

  /**
   * Specifies which attributes should be observed for changes.
   */
  static get observedAttributes(): string[] {
    return ["array-field", "data", "restore-label"];
  }  /*
*
   * Validates the array-field attribute value for safety.
   */
  private validateArrayField(value: unknown): string | null {
    if (value == null) return null;
    const str = String(value);
    // Check for unsafe characters that could break DOM operations
    // Allow only alphanumeric, dash and underscore
    if (/[^A-Za-z0-9_-]/.test(str)) {
      console.warn(`EditArray: array-field "${str}" contains unsafe characters. Use alphanumeric, dash, underscore only.`);
    }
    return str;
  }

  /**
   * Gets the array-field attribute value.
   */
  get arrayField(): string | null {
    return this.getAttribute("array-field");
  }
  
  /**
   * Sets the array-field attribute value.
   */
  set arrayField(value: string | null) {
    const validated = this.validateArrayField(value);
    validated == null
      ? this.removeAttribute("array-field")
      : this.setAttribute("array-field", validated);
  }

  /**
   * Gets the restore-label attribute value.
   */
  get restoreLabel(): string | null {
    return this.getAttribute("restore-label");
  }
  
  /**
   * Sets the restore-label attribute value.
   */
  set restoreLabel(value: string | null) {
    value == null
      ? this.removeAttribute("restore-label")
      : this.setAttribute("restore-label", value);
  }

  /**
   * Gets the item-direction attribute value, defaulting to "column".
   */
  get itemDirection(): "row" | "column" {
    const attr = this.getAttribute("item-direction");
    return attr === "row" ? "row" : "column";
  }

  /**
   * Sets the item-direction attribute value.
   */
  set itemDirection(value: "row" | "column" | null) {
    if (value === "row") {
      this.setAttribute("item-direction", "row");
    } else {
      this.removeAttribute("item-direction");
    }
  }

  /**
   * Gets the current data array.
   */
  get data(): EditArrayItem[] {
    return deepClone(this.data_internal);
  }

  /**
   * Coerces a value to an array format.
   */
  public coerceToArray(value: unknown): EditArrayItem[] {
    return coerceArray(value);
  }

  /**
   * Sets the data array and updates the component.
   */
  set data(value: unknown) {
    const coerced = this.coerceToArray(value);
    this.data_internal = deepClone(coerced);
    
    if (coerced.length === 0 && this.hasAttribute("data")) {
      this.removeAttribute("data");
    } else {
      try {
        const json = JSON.stringify(coerced);
        if (this.getAttribute("data") !== json) {
          this.setAttribute("data", json);
        }
      } catch (err) {
        // If serialization fails for some reason, log for debugging purposes.
        if (typeof console !== 'undefined' && console && console.warn) {
          console.warn('EditArray: Failed to stringify data for attribute', err);
        }
      }
    }
    this.render();
    this.dispatchDataChange();
  } 
 /**
   * Dispatches a change event when the data array is modified.
   */
  private dispatchDataChange(): void {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { data: deepClone(this.data_internal) },
      bubbles: true,
      composed: true
    }) as EditArrayChangeEvent);
  }

  /**
   * Adds a new item to the array.
   */
  public addItem(item: EditArrayItem = {}): number {
    const newItem = deepClone(item);
    this.data_internal.push(newItem);
    const newIndex = this.data_internal.length - 1;
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-added', {
      detail: { 
        item: deepClone(newItem), 
        index: newIndex, 
        data: deepClone(this.data_internal) 
      },
      bubbles: true,
      composed: true
    }) as EditArrayItemAddedEvent);
    return newIndex;
  }

  /**
   * Updates a specific field of an item at the given index.
   */
  public updateItem(index: number, fieldName: string, value: unknown): boolean {
    // Allow out of bounds for updateItem to match original behavior
    if (!this.validateIndex(index, true)) {
      console.warn(`EditArray: Invalid index ${index} for updateItem`);
      return false;
    }
    if (typeof fieldName !== "string" || !fieldName) {
      throw new TypeError("fieldName must be a non-empty string");
    }
    
    // Extend array if needed (original behavior)
    while (this.data_internal.length <= index) {
      this.data_internal.push({});
    }
    
    // Initialize the record if it doesn't exist
    if (!this.data_internal[index]) {
      this.data_internal[index] = {};
    }
    
    const oldValue = this.data_internal[index][fieldName];
    this.data_internal[index][fieldName] = value;
    
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-updated', {
      detail: { 
        index, 
        fieldName, 
        value, 
        oldValue, 
        item: deepClone(this.data_internal[index]),
        data: deepClone(this.data_internal) 
      },
      bubbles: true,
      composed: true
    }) as EditArrayItemUpdatedEvent);
    
    // Update display elements to reflect the change
    if (!this.shadowRoot) return true;
    
    // Cache the wrapper element to reduce DOM queries
    const wrapper = this.shadowRoot.querySelector(`.edit-array-item[data-index="${index}"]`) as HTMLElement;
    if (!wrapper) return true;
    
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    const expectedDataId = `${idPrefix}_${index}__${fieldName}`;
    
    const textValue = value != null ? String(value) : '';
    // Update display elements within the cached wrapper
    wrapper
      .querySelectorAll(`[data-display-for="${fieldName}"]`)
      .forEach((el) => {
        (el as HTMLElement).textContent = textValue;
      });
    
    wrapper
      .querySelectorAll(`[data-id="${expectedDataId}"]`)
      .forEach((el) => {
        (el as HTMLElement).textContent = textValue;
      });
    
    return true;
  }

  /**
   * Removes an item at the specified index.
   */
  public removeItem(index: number): EditArrayItem | null {
    try {
      if (!this.validateIndex(index)) {
        console.warn(`EditArray: Invalid index ${index} for removeItem`);
        return null;
      }
    } catch (error) {
      console.warn(`EditArray: Invalid index ${index} for removeItem:`, (error as Error).message);
      return null;
    }
    const removedItem = this.data_internal.splice(index, 1)[0];
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-deleted', {
      detail: { 
        item: deepClone(removedItem), 
        index, 
        data: deepClone(this.data_internal) 
      },
      bubbles: true,
      composed: true
    }) as EditArrayItemDeletedEvent);
    return removedItem;
  }

  /**
   * Toggles the deletion state of an item at the specified index.
   */
  public toggleDeletion(index: number): boolean {
    try {
      this.validateIndex(index);
    } catch (error) {
      console.warn(`EditArray: Invalid index ${index} for toggleDeletion:`, (error as Error).message);
      return false;
    }

    if (!this.shadowRoot) return false;
    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${index}"]`
    ) as HTMLElement;
    if (!wrapper) return false;
    
    let marker = wrapper.querySelector("[data-is-deleted-marker]") as HTMLInputElement;
    
    // Fallback: create marker if it doesn't exist
    if (!marker) {
      console.warn(`EditArray: Missing [data-is-deleted-marker] for index ${index}, creating fallback`);
      marker = document.createElement("input");
      marker.setAttribute("type", "hidden");
      marker.setAttribute("data-is-deleted-marker", "true");
      marker.setAttribute("value", "false");
      wrapper.appendChild(marker);
    }
    
    const current = (marker.getAttribute("value") || "false").toLowerCase() === "true";
    const newState = !current;
    
    marker.setAttribute("value", String(newState));
    wrapper.classList.toggle("deleted", newState);
    
    if (this.data_internal[index]) {
      this.data_internal[index].isDeleted = newState;
    }

    // Update button text based on new state
    const deleteBtn = wrapper.querySelector('button[data-action="delete"]') as HTMLButtonElement;
    if (deleteBtn) {
      const buttonText = this.getDeleteButtonText(this.data_internal[index]);
      deleteBtn.textContent = buttonText;
      deleteBtn.setAttribute('aria-label', `${buttonText} item ${index + 1}`);
    }

    this.dispatchDataChange();

    this.dispatchEvent(new CustomEvent('item-change', {
      detail: { 
        index, 
        action: 'toggle-deletion',
        marked: newState,
        item: deepClone(this.data_internal[index]),
        data: deepClone(this.data_internal) 
      },
      bubbles: true,
      composed: true
    }) as EditArrayItemChangeEvent);
    
    return newState;
  }  /**
 
  * Validates that an index is a valid number and optionally within bounds.
   */
  private validateIndex(index: number, allowOutOfBounds: boolean = false): boolean {
    if (typeof index !== "number" || Number.isNaN(index)) {
      throw new TypeError("index must be a number");
    }
    if (!allowOutOfBounds && (index < 0 || index >= this.data_internal.length)) {
      throw new RangeError(`index ${index} is out of bounds for array of length ${this.data_internal.length}`);
    }
    return true;
  }

  /**
   * Validates an item at a specific index, checking form validation and element existence.
   */
  public validateItem(index: number): boolean {
    try {
      this.validateIndex(index);
    } catch (error) {
      console.warn(`EditArray: Invalid index ${index}:`, (error as Error).message);
      return false;
    }

    const wrapper = this.shadowRoot?.querySelector(
      `.edit-array-item[data-index="${index}"]`
    ) as HTMLElement;
    if (!wrapper) {
      console.warn(`EditArray: No wrapper found for index ${index}`);
      return false;
    }

    const editContainer = wrapper.querySelector(".edit-container") as HTMLElement;
    if (!editContainer) {
      console.warn(`EditArray: No edit container found for index ${index}`);
      return false;
    }

    // Check for validation errors in form inputs
    const invalidInputs = editContainer.querySelectorAll(
      "input:invalid, select:invalid, textarea:invalid"
    ) as NodeListOf<HTMLInputElement>;
    
    let hasErrors = false;
    invalidInputs.forEach((input) => {
      // Use the shared pattern validation function
      const isActuallyValid = testPatternValidation(input);
      
      if (!isActuallyValid) {
        const errorSpan = input.nextElementSibling as HTMLElement;
        if (errorSpan && errorSpan.classList.contains("error-message")) {
          errorSpan.textContent = getHelpfulValidationMessage(input);
          input.classList.add("invalid");
          hasErrors = true;
        }
      }
    });

    if (hasErrors && invalidInputs.length > 0) {
      invalidInputs[0].focus();
    }

    return !hasErrors;
  }  /**

   * Creates a clone of the edit slot template for a specific item.
   */
  private editSlotTemplate(index: number, item: EditArrayItem): Element | null {
    if (!isValidIndex(index))
      throw new TypeError("index must be a number");
    const slot = this.querySelector('[slot="edit"]') as HTMLElement;
    if (!slot) {
      console.warn('EditArray: Missing [slot="edit"] template element');
      return null;
    }
    const clone = slot.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-index", String(index));
    const prefix = buildNamePrefix(this.arrayField, index);
    
    // Process all form elements with name attributes for data binding
    clone.querySelectorAll("[name]").forEach((el) => 
      this.applyBindingsToNamedElement(el as HTMLElement, index, prefix, item)
    );
    
    // Process elements with IDs to ensure uniqueness across items
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    clone.querySelectorAll("[id]").forEach((el) => {
      const element = el as HTMLElement;
      const id = element.getAttribute("id");
      if (!id) return;
      // Generate unique IDs using pattern: {arrayField}_{index}__{originalId}
      element.setAttribute("id", `${idPrefix}_${index}__${id}`);
    });

    clone.querySelectorAll("input").forEach((input) => {
      if (input.willValidate) {
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        errorSpan.setAttribute("role", "alert");
        errorSpan.setAttribute("aria-live", "polite");
        input.insertAdjacentElement("afterend", errorSpan);

        // Show errors only when leaving the input field
        input.addEventListener("blur", () => {
          // Use the shared pattern validation function
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

        // Clear errors when input becomes valid
        input.addEventListener("input", () => {
          if (input.validity.valid) {
            errorSpan.textContent = "";
            input.classList.remove("invalid");
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
          }
        });
      }
    });

    return clone;
  }

  /**
   * Creates a clone of the display slot template for a specific item.
   */
  private displaySlotTemplate(index: number, item: EditArrayItem): Element | null {
    if (!isValidIndex(index))
      throw new TypeError("index must be a number");
    const slot = this.querySelector('[slot="display"]') as HTMLElement;
    if (!slot) {
      console.warn('EditArray: Missing [slot="display"] template element');
      return null;
    }
    const clone = slot.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-index", String(index));
    const prefix = buildNamePrefix(this.arrayField, index);
    clone.querySelectorAll("[name]").forEach((el) => {
      const element = el as HTMLElement;
      const name = element.getAttribute("name");
      if (!name) return;
      if (prefix && !name.includes(this.arrayField || ''))
        element.setAttribute("name", `${prefix}.${name}`);
    });
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    clone.querySelectorAll("[id]").forEach((el) => {
      const element = el as HTMLElement;
      const id = element.getAttribute("id");
      if (!id) return;
      element.setAttribute("id", `${idPrefix}_${index}__${id}`);
    });
    if (item && typeof item === "object") {
      clone.querySelectorAll("[data-display-for]").forEach((el) => {
        const element = el as HTMLElement;
        const field = element.getAttribute("data-display-for");
        const prefixName = buildNamePrefix(this.arrayField, index) || "";
        element.setAttribute("data-index", `${index}`);
        element.setAttribute("data-id", `${computeIdPrefix(this.arrayField)}_${index}__${field}`);
        element.setAttribute("data-name", `${prefixName}.${field}`);
        if (!field) return;
        const raw = (item as Record<string, unknown>)[field];
        if (raw !== undefined && raw !== null) element.textContent = String(raw);
      });
    }
    return clone;
  }

  /**
   * Renders a single item in the list with display and edit templates.
   */
  private renderItem(container: HTMLElement, item: EditArrayItem, index: number): HTMLElement {
    const displayClone = this.displaySlotTemplate(index, item);
    const wrapper = document.createElement("div");
    wrapper.className = "edit-array-item";
    wrapper.setAttribute("data-index", String(index));
    wrapper.setAttribute("role", "listitem");
    wrapper.setAttribute("aria-label", `Item ${index + 1}`);
    if (displayClone) wrapper.appendChild(displayClone);
    container.appendChild(wrapper);

    const editClone = this.editSlotTemplate(index, item);
    const editContainer = document.createElement("div");
    editContainer.className = "edit-container hidden";
    if (editClone) editContainer.appendChild(editClone);
    wrapper.appendChild(editContainer);
    const editBtn = this.createEditButton(index);

    const buttonBar = document.createElement("div");

    buttonBar.appendChild(editBtn);
    const deleteBtn = this.createDeleteButton(index, item);
    buttonBar.appendChild(deleteBtn);

    if (
      item == null ||
      (typeof item === "object" && Object.keys(item).length === 0)
    ) {
        const cancelBtn = this.createCancelButton(wrapper);
        buttonBar.appendChild(cancelBtn);
    }

    wrapper.appendChild(buttonBar);
    return wrapper;
  }


  /**
   * Gets a slotted button template for the specified action.
   * 
   * Searches the buttons slot for a button element with the matching
   * data-action attribute. Returns the first matching button found,
   * or null if no match exists or the buttons slot is not present.
   * 
   * @param {string} action - The action type (edit, delete, cancel, add)
   * @returns {HTMLButtonElement | null} The button template or null if not found
   * @private
   */
  private getSlottedButtonTemplate(action: string): HTMLButtonElement | null {
    // Validate action parameter - must be a non-empty string
    if (!action || typeof action !== 'string') {
      return null;
    }

    // Check if buttons slot exists
    const buttonsSlot = this.querySelector('[slot="buttons"]');
    if (!buttonsSlot) {
      return null;
    }

    // Find button element with matching data-action attribute
    // Using querySelector ensures we get the first matching element
    const template = buttonsSlot.querySelector(`button[data-action="${action}"]`) as HTMLButtonElement;
    return template || null;
  }

  /**
   * Gets the appropriate CSS classes for a button based on its action type.
   * 
   * Returns an array of CSS class names that should be applied to buttons
   * of the specified action type to maintain consistent styling with the
   * existing programmatically created buttons.
   * 
   * @param {string} action - The action type (edit, delete, cancel, add)
   * @returns {string[]} Array of CSS class names
   * @private
   */
  private getButtonClasses(action: string): string[] {
    const baseClasses = ['btn'];
    const smallSize = 'btn-sm';
    
    switch (action) {
      case 'edit':
        return [...baseClasses, smallSize, 'btn-primary', 'edit-array-item-btn'];
      case 'delete':
        return [...baseClasses, smallSize, 'btn-danger', 'delete-array-item-btn'];
      case 'cancel':
        return [...baseClasses, smallSize, 'btn-danger'];
      case 'add':
        return [...baseClasses, 'btn-success'];
      default:
        return [...baseClasses, smallSize];
    }
  }

  /**
   * Generates an appropriate aria-label for a button based on its action and context.
   * 
   * Creates accessible labels that describe the button's purpose and context,
   * using custom label attributes when available.
   * 
   * @param {string} action - The action type (edit, delete, cancel, add, restore)
   * @param {number} [index] - The item index (for item-specific actions)
   * @returns {string} The aria-label text
   * @private
   */
  private getButtonAriaLabel(action: string, index?: number): string {
    let itemText = '';
    
    if (typeof index === 'number') {
      // Handle negative indices by treating them as 0
      const itemNumber = index < 0 ? 0 : index + 1;
      itemText = ` item ${itemNumber}`;
    } else if (index === null || index === undefined) {
      // For null/undefined, just add " item" without number for indexed actions
      if (['edit', 'delete', 'restore'].includes(action)) {
        itemText = ' item';
      }
    }
    
    switch (action) {
      case 'edit': {
        const label = this.getAttribute('edit-label') || 'Edit';
        return `${label}${itemText}`;
      }
      case 'delete': {
        const label = this.getAttribute('delete-label') || 'Delete';
        return `${label}${itemText}`;
      }
      case 'restore': {
        const label = this.getAttribute('restore-label') || 'Restore';
        return `${label}${itemText}`;
      }
      case 'cancel': {
        const label = this.getAttribute('cancel-label') || 'Cancel';
        return `${label} adding item`;
      }
      case 'add': {
        return 'Add new item';
      }
      default:
        return `${action}${itemText}`;
    }
  }

  /**
   * Enhances a button template with appropriate attributes, classes, and accessibility features.
   * 
   * Takes a button element (typically from a slot template) and adds the necessary
   * data attributes, CSS classes, and aria-label to make it function properly
   * within the EditArray component. Returns a cloned button to avoid modifying
   * the original template.
   * 
   * @param {HTMLButtonElement} button - The button element to enhance
   * @param {string} action - The action type (edit, delete, cancel, add)
   * @param {number} [index] - The item index (for item-specific actions)
   * @returns {HTMLButtonElement} The enhanced button clone
   * @throws {TypeError} If button is not a valid HTMLButtonElement
   * @private
   */
  private enhanceButtonWithAttributes(button: HTMLButtonElement, action: string, index?: number): HTMLButtonElement {
    // Validate input parameters
    if (!button || !(button instanceof HTMLButtonElement)) {
      throw new TypeError('First parameter must be a valid HTMLButtonElement');
    }

    // Clone the button to avoid modifying the original template
    const enhanced = button.cloneNode(true) as HTMLButtonElement;

    // Add data attributes
    enhanced.setAttribute('data-action', action);
    if (typeof index === 'number') {
      enhanced.setAttribute('data-index', String(index));
    }

    // Add aria-label for accessibility
    const ariaLabel = this.getButtonAriaLabel(action, index);
    enhanced.setAttribute('aria-label', ariaLabel);

    // Get and add appropriate CSS classes
    const newClasses = this.getButtonClasses(action);
    
    // Merge classes without duplicates
    const existingClasses = Array.from(enhanced.classList);
    const allClasses = [...existingClasses];
    
    // Add new classes that don't already exist
    newClasses.forEach(newClass => {
      if (!allClasses.includes(newClass)) {
        allClasses.push(newClass);
      }
    });

    // Apply the merged class list
    enhanced.className = allClasses.join(' ');

    return enhanced;
  }

  private createCancelButton(_wrapper: HTMLElement): HTMLButtonElement {
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent =
        this.getAttribute("cancel-label") || "Cancel";
    cancelBtn.className = "btn btn-sm btn-danger";
    cancelBtn.setAttribute('data-action', 'cancel');
    cancelBtn.setAttribute('aria-label', 'Cancel adding item');
    return cancelBtn;
  }

  private createDeleteButton(index: number, item?: EditArrayItem | null): HTMLButtonElement {
    // Check for slotted delete button template first
    const slottedTemplate = this.getSlottedButtonTemplate('delete');
    
    if (slottedTemplate) {
      // Determine the appropriate action based on item deletion state
      // This ensures the correct aria-label and styling are applied
      const action = (item && item.isDeleted) ? 'restore' : 'delete';
      // Use slotted template and enhance it with proper attributes and classes
      return this.enhanceButtonWithAttributes(slottedTemplate, action, index);
    }
    
    // Fallback to programmatic button creation when no slot template exists
    const deleteBtn = document.createElement("button");
    const buttonText = this.getDeleteButtonText(item);
    deleteBtn.textContent = buttonText;
    deleteBtn.className = "btn btn-sm btn-danger delete-array-item-btn";
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-index', String(index));
    deleteBtn.setAttribute('aria-label', `${buttonText} item ${index + 1}`);
    return deleteBtn;
  }

  private createEditButton(index: number): HTMLButtonElement {
    // Check for slotted edit button template first
    const slottedTemplate = this.getSlottedButtonTemplate('edit');
    
    if (slottedTemplate) {
      // Use slotted template and enhance it with proper attributes and classes
      return this.enhanceButtonWithAttributes(slottedTemplate, 'edit', index);
    }
    
    // Fallback to programmatic button creation when no slot template exists
    const editBtn = document.createElement("button");
    editBtn.textContent = this.getAttribute("edit-label") || "Edit";
    editBtn.className = "btn btn-sm btn-primary edit-array-item-btn";
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-index', String(index));
    editBtn.setAttribute('aria-label', `Edit item ${index + 1}`);
    return editBtn;
  }

  private render(): void {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector(
      ".edit-array-container"
    ) as HTMLElement;
    if (!container) return;

    const actionBar = container.querySelector(".action-bar") as HTMLElement;
    const itemsContainer = container.querySelector(".edit-array-items") as HTMLElement;
    if (!itemsContainer) return;
    itemsContainer.innerHTML = "";

    if (!Array.isArray(this.data_internal) || this.data_internal.length === 0) return;

    this.data_internal.forEach((item, index) =>
      this.renderItem(itemsContainer, item, index)
    );

    // add and add new item button
    const addBtn = document.createElement("button");

    // add an id to addBtn for easier selection in tests
    addBtn.id = `${this.id}-add-btn`;
    addBtn.textContent = "Add New Item";
    addBtn.className = "btn btn-sm btn-success";
    addBtn.setAttribute('data-action', 'add');
    addBtn.setAttribute('aria-label', 'Add new item to the list');

    if (actionBar) {
      actionBar.innerHTML = "";
      actionBar.appendChild(addBtn);
    }
  } 
 /**
   * Updates a record field (legacy method that delegates to updateItem).
   * @deprecated Use updateItem() instead
   */
  public updateRecord(index: number, fieldName: string, value: unknown): void {
    // Issue deprecation warning
    console.warn('EditArray: updateRecord() is deprecated. Use updateItem() instead.');
    
    // Deprecated method - maintains backward compatibility with throwing behavior
    if (typeof index !== 'number') {
      throw new Error('index must be a number');
    }
    if (!fieldName || typeof fieldName !== 'string') {
      throw new Error('fieldName must be a non-empty string');
    }
    
    // Delegate to the new updateItem method for the actual work
    this.updateItem(index, fieldName, value);
  }

  /**
   * Toggles between edit and display mode for an item at the specified index.
   */
  public toggleEditMode(index: number): void {
    if (!this.shadowRoot) return;
    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${index}"]`
    ) as HTMLElement;
    if (!wrapper) return;
    const edit = wrapper.querySelector(".edit-container") as HTMLElement;
    const display = wrapper.querySelector("[data-index]") as HTMLElement;

    if (!edit || !display) return;
    const editBtn = wrapper.querySelector(".edit-array-item-btn") as HTMLButtonElement;

    const isHidden = edit.classList.contains("hidden");
    if (isHidden) {
      edit.classList.remove("hidden");
      display.classList.add("hidden");
      editBtn.textContent = this.getAttribute("save-label") || "Save";
    } else {
      // Use the centralized validation helper
      if (!this.validateItem(index)) {
        return; // Validation failed, stay in edit mode
      }

      edit.classList.add("hidden");
      display.classList.remove("hidden");
      editBtn.textContent = this.getAttribute("edit-label") || "Edit";

      // select the add button `${this.id}-add-btn`
      const addBtn = this.shadowRoot.querySelector(
        ".action-bar .btn-success"
      ) as HTMLElement;
      if (addBtn) addBtn.classList.remove("hidden");
    }
  }

  /**
   * Marks an item for deletion (legacy method that delegates to toggleDeletion).
   * @deprecated Use toggleDeletion() instead.
   */
  public markForDeletion(index: number): boolean {
    console.warn('EditArray: markForDeletion() is deprecated. Use toggleDeletion() instead.');
    return this.toggleDeletion(index);
  }

  /**
   * Called when observed attributes change.
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === "data") {
      if (newValue == null) {
        this.data_internal = [];
      } else {
        this.data_internal = deepClone(coerceArrayFromAttribute(newValue));
      }
      this.render();
      this.dispatchDataChange();
      return;
    }
    if (name === "array-field") this.render();
    if (name === "restore-label") this.updateRestoreButtonLabels();
  }

  connectedCallback(): void {
    const attr = this.getAttribute("data");
    if (attr && (!Array.isArray(this.data_internal) || this.data_internal.length === 0)) {
      this.data_internal = deepClone(coerceArrayFromAttribute(attr));
    }
    
    // Register delegated event listeners
    this.shadowRoot?.addEventListener("input", this.onInput);
    this.shadowRoot?.addEventListener("click", this.onDelegatedClick);
    
    this.render();
  }

  /**
   * Lifecycle hook – clean up event listeners when element is detached to avoid leaks in long‑lived test environments / SPAs.
   */
  disconnectedCallback(): void {
    if (this.shadowRoot) {
      this.shadowRoot.removeEventListener("input", this.onInput);
      this.shadowRoot.removeEventListener("click", this.onDelegatedClick);
    }
  }

  // Add a small helper to encapsulate the per-element logic previously inside the complex arrow function.
  private applyBindingsToNamedElement(element: HTMLElement, index: number, prefix: string | null, item: EditArrayItem | null): void {
    const name = element.getAttribute("name");
    if (!name) return;

    this.setElementNameIfNeeded(element, name, prefix);
    this.setDataAttributesForElement(element, name, index);
    this.populateElementValue(element, name, item);
  }

  // New small helpers to reduce complexity of main method
  private setElementNameIfNeeded(element: HTMLElement, name: string, prefix: string | null): void {
    if (!name) return;
    if (prefix && !name.includes(this.arrayField || '')) {
      element.setAttribute("name", `${prefix}.${name}`);
    }
  }

  private setDataAttributesForElement(element: HTMLElement, name: string, index: number): void {
    element.setAttribute("data-name", `${name}`);
    element.setAttribute("data-index", `${index}`);
  }

  private populateElementValue(element: HTMLElement, name: string, item: EditArrayItem | null): void {
    if (!item || typeof item !== "object" || !(name in item)) return;
    const raw = (item as Record<string, unknown>)[name];
    const valueStr = raw === null || raw === undefined ? '' : String(raw);

    if (
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA"
    ) {
      (element as FormElement).value = valueStr;
    } else {
      element.textContent = valueStr;
    }
  }
}

// Define the custom element
customElements.define("ck-edit-array", EditArray);

// Export all interfaces and types for external consumption
export {
  EditArray,
  EditArrayItem,
  ValidationResult,
  ValidationError,
  EditArrayEventDetail,
  ItemEventDetail,
  ItemUpdateEventDetail,
  ItemChangeEventDetail,
  EditArrayChangeEvent,
  EditArrayItemAddedEvent,
  EditArrayItemUpdatedEvent,
  EditArrayItemDeletedEvent,
  EditArrayItemChangeEvent,
  FormElement,
  ValidationPattern
};


// Default export for convenience
export default EditArray;

// Declare global custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'ck-edit-array': EditArray;
  }
}



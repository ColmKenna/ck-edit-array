// Deprecated legacy module shim.
// This file existed historically as the primary module. The modern source is `src/ck-edit-array.js`.
// Keep this shim temporarily to avoid breaking imports; it re-exports from the new module and
// logs a deprecation warning when evaluated.

// Legacy file removed — placeholder to avoid accidental imports during intermediate transitions.
// The implementation has been consolidated into `src/ck-edit-array.js`.
// If you truly want this file gone from the filesystem, remove it in your local/git environment.

// Intentionally empty to prevent legacy code from being used.

const EDIT_ARRAY_SHEET = (() => {
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

// Pure helper functions for array and naming operations
const coerceArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  
  // Handle plain objects by wrapping them in an array
  if (typeof value === 'object') return [value];
  
  // Try to coerce string values to array
  if (typeof value === 'string') {
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
    
    // For non-JSON strings, wrap in array (unless called from attribute parsing)
    return [trimmed];
  }
  
  // Coerce single values to single-item array
  return [value];
};

// Special version for attribute parsing that treats non-JSON strings as invalid
const coerceArrayFromAttribute = (value) => {
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

const buildNamePrefix = (arrayField, index) => {
  if (!arrayField || typeof arrayField !== 'string') return null;
  // Sanitize arrayField to ensure safe DOM operations
  const sanitized = arrayField.replace(/[^A-Za-z0-9_.-]/g, '_');
  return `${sanitized}[${index}]`;
};

const computeIdPrefix = (arrayField) => {
  if (!arrayField || typeof arrayField !== 'string') return "item";
  // Sanitize and convert to safe ID format
  return arrayField.replace(/[^A-Za-z0-9_-]/g, "_");
};

const isValidIndex = (value) => {
  return typeof value === "number" && !Number.isNaN(value);
};

/**
 * Creates a deep clone of an object to prevent external mutation.
 * @param {any} obj - The object to clone
 * @returns {any} Deep clone of the object
 */
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

/**
 * Tests pattern validation for an input element, with fallback for browser inconsistencies.
 * @param {HTMLInputElement} input - The input element to test
 * @returns {boolean} True if the input passes pattern validation
 */
const testPatternValidation = (input) => {
  if (!input || !input.validity?.patternMismatch || !input.value) {
    return input?.validity?.valid ?? true;
  }

  const patternSources = [];

  if (typeof input.getAttribute === 'function') {
    const attrPattern = input.getAttribute('pattern');
    if (attrPattern) patternSources.push(attrPattern);
  }

  if (input.pattern && !patternSources.includes(input.pattern)) {
    patternSources.push(input.pattern);
  }

  for (const source of patternSources) {
    try {
      if (new RegExp(source).test(input.value)) {
        return true;
      }
    } catch (e) {
      console.warn('EditArray: Invalid pattern regex:', e);
    }
  }

  if (patternSources.length === 0 && input.validity) {
    return input.validity.valid;
  }

  return false;
};

/**
 * Generates user-friendly validation messages with examples based on input constraints.
 * @param {HTMLInputElement} input - The input element to generate a message for
 * @returns {string} A helpful validation message with examples
 */
const getHelpfulValidationMessage = (input) => {
  if (!input || input.validity.valid) {
    return '';
  }

  const { validity, type, required, pattern, min, max, minLength, maxLength, placeholder } = input;
  const rawPatternAttr = typeof input.getAttribute === 'function'
    ? input.getAttribute('pattern')
    : null;
  const patternCandidates = [pattern, rawPatternAttr].filter(Boolean);
  
  // Required field validation
  if (validity.valueMissing && required) {
    return 'This field is required. Please enter a value.';
  }
  
  // Type-specific validation messages with examples
  if (validity.typeMismatch) {
    switch (type) {
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
  }
  
  // Pattern validation with examples from placeholder or common patterns
  if (validity.patternMismatch && patternCandidates.length) {
    // Use the shared validation function for consistency
    if (testPatternValidation(input)) {
      return ''; // Input is actually valid despite browser reporting pattern mismatch
    }
    
    // Try to extract example from placeholder
    if (placeholder && placeholder.trim()) {
      return `Please match the required format. Example: ${placeholder}`;
    }
    
    // Common pattern examples
    const commonPatterns = {
      // Phone patterns (single backslashes as stored by browser)
      '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}': '(555) 123-4567',
      '([0-9]{3}) [0-9]{3}-[0-9]{4}': '(555) 123-4567',
      '\\d{3}-\\d{3}-\\d{4}': '555-123-4567',
      '\\d{3}-[0-9]{3}-[0-9]{4}': '555-123-4567',
      '\\+1[0-9]{10}': '+15551234567',
      
      // Postal code patterns
      '[0-9]{5}': '12345',
      '[0-9]{5}-[0-9]{4}': '12345-6789',
      '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]': 'A1B 2C3',
      
      // Credit card patterns
      '[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}': '1234 5678 9012 3456',
      '[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}': '1234-5678-9012-3456',
      
      // Social security patterns
      '[0-9]{3}-[0-9]{2}-[0-9]{4}': '123-45-6789',
      
      // License plate patterns
      '[A-Z]{3}[0-9]{3}': 'ABC123',
      '[A-Z]{2}[0-9]{4}': 'AB1234',
      
      // Time patterns
      '[0-9]{2}:[0-9]{2}': '14:30',
      '[0-9]{1,2}:[0-9]{2} (AM|PM)': '2:30 PM',
      
      // Date patterns
      '[0-9]{4}-[0-9]{2}-[0-9]{2}': '2023-12-25',
      '[0-9]{2}/[0-9]{2}/[0-9]{4}': '12/25/2023',
      
      // Password patterns
      '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}': 'Example123',
      
      // Username patterns
      '[a-zA-Z0-9_]{3,16}': 'user_name123',
      
      // Currency patterns
      '\\$[0-9]+\\.[0-9]{2}': '$123.45',
      
      // Simple alphanumeric
      '[A-Za-z0-9]+': 'abc123',
      '[A-Z]{2,}': 'ABC',
      '[a-z]{2,}': 'abc',
      '[0-9]+': '123'
    };
    
    for (const candidate of patternCandidates) {
      const exampleValue = commonPatterns[candidate];
      if (exampleValue) {
        return `Please match the required format. Example: ${exampleValue}`;
      }
    }

    return `Please match the required format: ${patternCandidates[0]}`;
  }
  
  // Number range validation
  if (validity.rangeUnderflow && min !== null && min !== undefined) {
    return `Please enter a value greater than or equal to ${min}.`;
  }
  
  if (validity.rangeOverflow && max !== null && max !== undefined) {
    return `Please enter a value less than or equal to ${max}.`;
  }
  
  // String length validation
  if (validity.tooShort && minLength) {
    return `Please enter at least ${minLength} characters.`;
  }
  
  if (validity.tooLong && maxLength) {
    return `Please enter no more than ${maxLength} characters.`;
  }
  
  // Step mismatch (for number inputs with step attribute)
  if (validity.stepMismatch) {
    return 'Please enter a valid value.';
  }
  
  // Fallback to browser's default message
  return input.validationMessage || 'Please enter a valid value.';
};

const applyEditArrayStyles = (shadowRoot) => {
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
 * EditArray Web Component - A dynamic array editor with inline editing capabilities.
 * 
 * @class EditArray
 * @extends HTMLElement
 * 
 * @description
 * A web component that provides a rich interface for editing arrays of objects with:
 * - Inline editing with validation
 * - Add/remove/delete functionality  
 * - Slot-based templating for display and edit modes
 * - Event-driven architecture for data changes
 * - Accessibility support and keyboard navigation
 * 
 * @example
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
 * 
 * @attr {string} array-field - The field name for form submission (used for name attributes)
 * @attr {string} data - JSON string representation of the array data
 * @attr {string} edit-label - Label for the edit button (default: "Edit")
 * @attr {string} save-label - Label for the save button (default: "Save") 
 * @attr {string} delete-label - Label for the delete button (default: "Delete")
 * @attr {string} cancel-label - Label for the cancel button (default: "Cancel")
 */

/**
 * Slot Requirements and Conventions
 * @namespace EditArray Slots
 * 
 * @description
 * The EditArray component relies on two slots to define the display and editing templates:
 * 
 * **Display Slot (slot="display")**
 * - Used for read-only display of items
 * - Elements with `data-display-for="fieldName"` will automatically show field values
 * - Supports nested HTML structure for rich display formatting
 * - Example:
 *   ```html
 *   <div slot="display">
 *     <h3 data-display-for="title"></h3>
 *     <p data-display-for="description"></p>
 *   </div>
 *   ```
 * 
 * **Edit Slot (slot="edit")**
 * - Used for inline editing of items
 * - Form controls with `name` attributes will be bound to data fields
 * - Supports HTML5 validation (required, pattern, type, etc.)
 * - Validation errors are automatically displayed with `.error-message` styling
 * - Example:
 *   ```html
 *   <div slot="edit">
 *     <input name="title" required placeholder="Enter title">
 *     <textarea name="description" placeholder="Enter description"></textarea>
 *     <select name="category">
 *       <option value="work">Work</option>
 *       <option value="personal">Personal</option>
 *     </select>
 *   </div>
 *   ```
 * 
 * **Data Binding Conventions**
 * - Field names in the edit slot should match keys in the data objects
 * - The component automatically prefixes names with array-field for form submission
 * - IDs are automatically generated and prefixed to avoid conflicts
 * - Validation messages appear automatically next to invalid inputs
 */

/**
 * Custom Events
 * @namespace EditArray Events
 */

/**
 * Fired when the data array changes.
 * @event EditArray#change
 * @type {CustomEvent}
 * @property {Object} detail - Event detail object
 * @property {Array<Object>} detail.data - Copy of the current data array
 */

/**
 * Fired when a new item is added to the array.
 * @event EditArray#item-added  
 * @type {CustomEvent}
 * @property {Object} detail - Event detail object
 * @property {Object} detail.item - The added item
 * @property {number} detail.index - Index where the item was added
 * @property {Array<Object>} detail.data - Copy of the current data array
 */

/**
 * Fired when an existing item is updated.
 * @event EditArray#item-updated
 * @type {CustomEvent}
 * @property {Object} detail - Event detail object
 * @property {number} detail.index - Index of the updated item
 * @property {string} detail.fieldName - Name of the updated field
 * @property {any} detail.value - New value of the field
 * @property {any} detail.oldValue - Previous value of the field
 * @property {Object} detail.item - Copy of the updated item
 * @property {Array<Object>} detail.data - Copy of the current data array
 */

/**
 * Fired when an item is removed from the array.
 * @event EditArray#item-deleted
 * @type {CustomEvent}
 * @property {Object} detail - Event detail object
 * @property {Object} detail.item - The removed item
 * @property {number} detail.index - Index where the item was removed
 * @property {Array<Object>} detail.data - Copy of the current data array
 */

/**
 * Fired when an item's deletion status changes.
 * @event EditArray#item-change
 * @type {CustomEvent}
 * @property {Object} detail - Event detail object
 * @property {number} detail.index - Index of the item
 * @property {string} detail.action - The action performed ('toggle-deletion')
 * @property {boolean} detail.marked - Whether the item is marked for deletion
 * @property {Object} detail.item - Copy of the affected item
 * @property {Array<Object>} detail.data - Copy of the current data array
 */

class EditArray extends HTMLElement {
  /** @type {Array<Object>} Private data array holding the current items */
  #data = [];
  /** Private input event handler for efficient event delegation */
  #onInput = (event) => {
    const t = event.target;
    if (!t) return;
    
    // Extract data attributes that identify the field and item being edited
    const name = t.getAttribute("data-name");
    const indexStr = t.getAttribute("data-index");
    if (!name || !indexStr) return;
    
    const index = parseInt(indexStr, 10);
    if (Number.isNaN(index)) return;
    
    // Update the data model when form inputs change
    this.updateRecord(index, name, t.value);
  };

  /** Private click event handler for all buttons (edit, delete, cancel, add) */
  #onDelegatedClick = (event) => {
    const target = event.target;
    const action = target.getAttribute('data-action');
    if (!action) return;

    // Parse item index for actions that operate on specific items
    const indexStr = target.getAttribute('data-index');
    const index = indexStr ? parseInt(indexStr, 10) : null;

    // Prevent default behavior and event bubbling for button actions
    event.preventDefault();
    event.stopPropagation();

    switch (action) {
      case 'edit':
        if (index !== null && !Number.isNaN(index)) {
          this.toggleEditMode(index);
        }
        break;
      case 'delete':
        if (index !== null && !Number.isNaN(index)) {
          this.markForDeletion(index);
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
    
    shadow.innerHTML = `
  <div class="edit-array-container" id="${this.id}" role="region" aria-label="Array editor">
        <div class="edit-array-items" role="list" aria-label="Editable items"></div>
        <div class="action-bar"></div>
          </div>
    `;
    applyEditArrayStyles(shadow);
  }

  handleCancelAction(cancelButton) {
    // Find the wrapper element
    let wrapper = cancelButton.closest('.edit-array-item');
    if (!wrapper) return;

    // Get the index of the item being cancelled
    const indexStr = wrapper.getAttribute('data-index');
    const index = indexStr ? parseInt(indexStr, 10) : null;
    
    if (index !== null && !Number.isNaN(index) && index >= 0 && index < this.#data.length) {
      // Remove the specific item from data array
      this.#data.splice(index, 1);
      this.dispatchDataChange();
    } else {
      // Fallback: if we can't determine the index, remove the last item
      console.warn('EditArray: Could not determine item index for cancel action, removing last item');
      this.#data.pop();
      this.dispatchDataChange();
    }
    
    // Remove the wrapper from DOM
    wrapper.remove();
    
    // Show the add button again
    const addBtn = this.shadowRoot.querySelector(".action-bar .btn-success");
    if (addBtn) addBtn.classList.remove("hidden");
  }

  handleAddAction() {
    const itemsContainer = this.shadowRoot.querySelector(".edit-array-items");
    if (!itemsContainer) return;

    // Use the addItem method
    const newIndex = this.addItem({});
    
    // Render the new item
    this.renderItem(itemsContainer, {}, newIndex);
    this.toggleEditMode(newIndex);
    
    // Hide the add button
    const addBtn = this.shadowRoot.querySelector(".action-bar .btn-success");
    if (addBtn) addBtn.classList.add("hidden");

    // Clear any validation errors for the new item
    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${newIndex}"]`
    );
    if (!wrapper) return;
    const edit = wrapper.querySelector(".edit-container");
    if (!edit) return;
    edit
      .querySelectorAll(".error-message")
      .forEach((span) => (span.textContent = ""));
    edit
      .querySelectorAll("input, select, textarea")
      .forEach((input) => input.classList.remove("invalid"));
  }

  /**
   * Specifies which attributes should be observed for changes.
   * @static
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ["array-field", "data"];
  }

  /**
   * Validates the array-field attribute value for safety.
   * @private
   * @param {any} value - The value to validate
   * @returns {string|null} Validated string or null if invalid
   */
  validateArrayField(value) {
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
   * @returns {string|null} The array field name used for form submission
   */
  get arrayField() {
    return this.getAttribute("array-field");
  }
  
  /**
   * Sets the array-field attribute value.
   * @param {string|null} value - The array field name
   */
  set arrayField(value) {
    const validated = this.validateArrayField(value);
    validated == null
      ? this.removeAttribute("array-field")
      : this.setAttribute("array-field", validated);
  }

  /**
   * Dispatches a change event when the data array is modified.
   * @private
   * @fires EditArray#change
   */
  dispatchDataChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { data: deepClone(this.#data) },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Validates that an index is a valid number and optionally within bounds.
   * @private
   * @param {number} index - The index to validate
   * @param {boolean} [allowOutOfBounds=false] - Whether to allow out-of-bounds indices
   * @returns {boolean} True if valid
   * @throws {TypeError} If index is not a number
   * @throws {RangeError} If index is out of bounds and allowOutOfBounds is false
   */
  validateIndex(index, allowOutOfBounds = false) {
    if (typeof index !== "number" || Number.isNaN(index)) {
      throw new TypeError("index must be a number");
    }
    if (!allowOutOfBounds && (index < 0 || index >= this.#data.length)) {
      throw new RangeError(`index ${index} is out of bounds for array of length ${this.#data.length}`);
    }
    return true;
  }

  /**
   * Validates an item at a specific index, checking form validation and element existence.
   * @param {number} index - The index of the item to validate
   * @returns {boolean} True if the item is valid and has no validation errors
   */
  validateItem(index) {
    try {
      this.validateIndex(index);
    } catch (error) {
      console.warn(`EditArray: Invalid index ${index}:`, error.message);
      return false;
    }

    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${index}"]`
    );
    if (!wrapper) {
      console.warn(`EditArray: No wrapper found for index ${index}`);
      return false;
    }

    const editContainer = wrapper.querySelector(".edit-container");
    if (!editContainer) {
      console.warn(`EditArray: No edit container found for index ${index}`);
      return false;
    }

    // Check for validation errors in form inputs
    const invalidInputs = editContainer.querySelectorAll(
      "input:invalid, select:invalid, textarea:invalid"
    );
    
    let hasErrors = false;
    invalidInputs.forEach((input) => {
      // Use the shared pattern validation function
      const isActuallyValid = testPatternValidation(input);
      
      if (!isActuallyValid) {
        const errorSpan = input.nextElementSibling;
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
  }

  /**
   * Adds a new item to the array.
   * @param {Object} [item={}] - The item to add
   * @returns {number} The index of the newly added item
   * @fires EditArray#item-added
   */
  addItem(item = {}) {
    const newItem = deepClone(item);
    this.#data.push(newItem);
    const newIndex = this.#data.length - 1;
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-added', {
      detail: { 
        item: deepClone(newItem), 
        index: newIndex, 
        data: deepClone(this.#data) 
      },
      bubbles: true,
      composed: true
    }));
    return newIndex;
  }

  /**
   * Updates a specific field of an item at the given index.
   * @param {number} index - The index of the item to update
   * @param {string} fieldName - The name of the field to update
   * @param {any} value - The new value for the field
   * @throws {TypeError} If fieldName is not a non-empty string
   * @fires EditArray#item-updated
   */
  updateItem(index, fieldName, value) {
    // Allow out of bounds for updateItem to match original behavior
    if (!this.validateIndex(index, true)) {
      console.warn(`EditArray: Invalid index ${index} for updateItem`);
      return false;
    }
    if (typeof fieldName !== "string" || !fieldName) {
      throw new TypeError("fieldName must be a non-empty string");
    }
    
    // Extend array if needed (original behavior)
    while (this.#data.length <= index) {
      this.#data.push({});
    }
    
    // Initialize the record if it doesn't exist
    if (!this.#data[index]) {
      this.#data[index] = {};
    }
    
    const oldValue = this.#data[index][fieldName];
    this.#data[index][fieldName] = value;
    
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-updated', {
      detail: { 
        index, 
        fieldName, 
        value, 
        oldValue, 
        item: deepClone(this.#data[index]),
        data: deepClone(this.#data) 
      },
      bubbles: true,
      composed: true
    }));
    
    // Update display elements to reflect the change
    if (!this.shadowRoot) return true;
    
    // Cache the wrapper element to reduce DOM queries
    const wrapper = this.shadowRoot.querySelector(`.edit-array-item[data-index="${index}"]`);
    if (!wrapper) return true;
    
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    const expectedDataId = `${idPrefix}_${index}__${fieldName}`;
    
    // Update display elements within the cached wrapper
    wrapper
      .querySelectorAll(`[data-display-for="${fieldName}"]`)
      .forEach((el) => {
        el.textContent = value;
      });
    
    wrapper
      .querySelectorAll(`[data-id="${expectedDataId}"]`)
      .forEach((el) => {
        el.textContent = value;
      });
    
    return true;
  }

  /**
   * Removes an item at the specified index.
   * @param {number} index - The index of the item to remove
   * @returns {Object|null} The removed item, or null if index is invalid
   * @fires EditArray#item-deleted
   */
  removeItem(index) {
    try {
      if (!this.validateIndex(index)) {
        console.warn(`EditArray: Invalid index ${index} for removeItem`);
        return null;
      }
    } catch (error) {
      console.warn(`EditArray: Invalid index ${index} for removeItem:`, error.message);
      return null;
    }
    const removedItem = this.#data.splice(index, 1)[0];
    this.dispatchDataChange();
    this.dispatchEvent(new CustomEvent('item-deleted', {
      detail: { 
        item: deepClone(removedItem), 
        index, 
        data: deepClone(this.#data) 
      },
      bubbles: true,
      composed: true
    }));
    return removedItem;
  }

  /**
   * Toggles the deletion state of an item at the specified index.
   * @param {number} index - The index of the item to toggle
   * @returns {boolean} The new deletion state, or false if invalid
   * @fires EditArray#item-change
   */
  toggleDeletion(index) {
    // Check bounds but don't throw for out of bounds - return false gracefully
    if (typeof index !== "number" || Number.isNaN(index) || 
        index < 0 || index >= this.#data.length) {
      return false;
    }
    
    if (!this.shadowRoot) return false;
    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${index}"]`
    );
    if (!wrapper) return false;
    
    let marker = wrapper.querySelector("[data-is-deleted-marker]");
    
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
    
    if (this.#data[index]) {
      this.#data[index].isDeleted = newState;
    }
    this.dispatchDataChange();

    this.dispatchEvent(new CustomEvent('item-change', {
      detail: { 
        index, 
        action: 'toggle-deletion',
        marked: newState,
        item: deepClone(this.#data[index]),
        data: deepClone(this.#data) 
      },
      bubbles: true,
      composed: true
    }));
    
    return newState;
  }

  /**
   * Gets the current data array.
   * @returns {Array<Object>} A copy of the current data array
   */
  get data() {
    return deepClone(this.#data);
  }

  /**
   * Coerces a value to an array format.
   * @param {any} value - The value to coerce
   * @returns {Array} The coerced array
   */
  coerceToArray(value) {
    return coerceArray(value);
  }

  /**
   * Sets the data array and updates the component.
   * @param {Array|string|any} value - The new data array or value to coerce
   */
  set data(value) {
    const coerced = this.coerceToArray(value);
    this.#data = deepClone(coerced);
    
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
   * Called when observed attributes change.
   * @param {string} name - The attribute name
   * @param {string|null} oldValue - The old attribute value
   * @param {string|null} newValue - The new attribute value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data") {
      if (newValue == null) {
        this.#data = [];
      } else {
        this.#data = deepClone(coerceArrayFromAttribute(newValue));
      }
      this.render();
      this.dispatchDataChange();
      return;
    }
    if (name === "array-field") this.render();
  }

  connectedCallback() {
    const attr = this.getAttribute("data");
    if (attr && (!Array.isArray(this.#data) || this.#data.length === 0)) {
      this.#data = deepClone(coerceArrayFromAttribute(attr));
    }
    
    // Register delegated event listeners
    this.shadowRoot.addEventListener("input", this.#onInput);
    this.shadowRoot.addEventListener("click", this.#onDelegatedClick);
    
    this.render();
  }

  /**
   * Lifecycle hook – clean up event listeners when element is detached to avoid leaks in long‑lived test environments / SPAs.
   */
  disconnectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.removeEventListener("input", this.#onInput);
      this.shadowRoot.removeEventListener("click", this.#onDelegatedClick);
    }
  }

  /**
   * Creates a clone of the edit slot template for a specific item.
   * @private
   * @param {number} index - The index of the item
   * @param {Object} item - The item data
   * @returns {Element|null} The cloned template element, or null if slot is missing
   */
  editSlotTemplate(index, item) {
    if (!isValidIndex(index))
      throw new TypeError("index must be a number");
    const slot = this.querySelector('[slot="edit"]');
    if (!slot) {
      console.warn('EditArray: Missing [slot="edit"] template element');
      return null;
    }
    const clone = slot.cloneNode(true);
    clone.setAttribute("data-index", String(index));
    const prefix = buildNamePrefix(this.arrayField, index);
    
    // Process all form elements with name attributes for data binding
    clone.querySelectorAll("[name]").forEach((el) => {
      const name = el.getAttribute("name");
      if (!name) return;
      
      // Set up form submission names with proper array notation
      if (prefix && !name.includes(this.arrayField))
        el.setAttribute("name", `${prefix}.${name}`);
        
      // Add data attributes for event handling and data binding
      el.setAttribute("data-name", `${name}`);
      el.setAttribute("data-index", `${index}`);
      
      // Populate form elements with existing data values
      if (item && typeof item === "object" && name in item) {
        if (
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA"
        )
          el.value = item[name];
        else el.textContent = item[name];
      }
    });
    
    // Process elements with IDs to ensure uniqueness across items
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    clone.querySelectorAll("[id]").forEach((el) => {
      const id = el.getAttribute("id");
      if (!id) return;
      // Generate unique IDs using pattern: {arrayField}_{index}__{originalId}
      el.setAttribute("id", `${idPrefix}_${index}__${id}`);
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
   * @private
   * @param {number} index - The index of the item
   * @param {Object} item - The item data
   * @returns {Element|null} The cloned template element, or null if slot is missing
   */
  displaySlotTemplate(index, item) {
    if (!isValidIndex(index))
      throw new TypeError("index must be a number");
    const slot = this.querySelector('[slot="display"]');
    if (!slot) {
      console.warn('EditArray: Missing [slot="display"] template element');
      return null;
    }
    const clone = slot.cloneNode(true);
    clone.setAttribute("data-index", String(index));
    const prefix = buildNamePrefix(this.arrayField, index);
    clone.querySelectorAll("[name]").forEach((el) => {
      const name = el.getAttribute("name");
      if (!name) return;
      if (prefix && !name.includes(this.arrayField))
        el.setAttribute("name", `${prefix}.${name}`);
    });
    const idPrefix = this.arrayField
      ? this.arrayField.replace(/\./g, "_")
      : "item";
    clone.querySelectorAll("[id]").forEach((el) => {
      const id = el.getAttribute("id");
      if (!id) return;
      el.setAttribute("id", `${idPrefix}_${index}__${id}`);
    });
    if (item && typeof item === "object") {
      clone.querySelectorAll("[data-display-for]").forEach((el) => {
        const field = el.getAttribute("data-display-for");
        const prefixName = buildNamePrefix(this.arrayField, index) || "";
          el.setAttribute("data-index", `${index}`);
        el.setAttribute("data-id", `${computeIdPrefix(this.arrayField)}_${index}__${field}`);
        el.setAttribute("data-name", `${prefixName}.${field}`);
        if (!field) return;
        if (field in item) el.textContent = item[field];
      });
    }
    return clone;
  }

  /**
   * Updates a record field (legacy method that delegates to updateItem).
   * @deprecated Use updateItem() instead
   * @param {number} index - The index of the item to update
   * @param {string} fieldName - The name of the field to update
   * @param {any} value - The new value for the field
   */
  /**
   * Updates a field for an item (legacy method that maintains throwing behavior).
   * @deprecated Use updateItem() instead
   * @param {number} index - The index of the item to update
   * @param {string} fieldName - The field name to update
   * @param {*} value - The new value for the field
   * @throws {Error} When index is not a number or fieldName is not a non-empty string
   */
  updateRecord(index, fieldName, value) {
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
   * @param {number} index - The index of the item to toggle
   */
  toggleEditMode(index) {
    if (!this.shadowRoot) return;
    const wrapper = this.shadowRoot.querySelector(
      `.edit-array-item[data-index="${index}"]`
    );
    if (!wrapper) return;
    const edit = wrapper.querySelector(".edit-container");
    const display = wrapper.querySelector("[data-index]");

    if (!edit || !display) return;
    const editBtn = wrapper.querySelector(".edit-array-item-btn");

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
      );
      if (addBtn) addBtn.classList.remove("hidden");
    }
  }

  /**
   * Marks an item for deletion (legacy method that delegates to toggleDeletion).
   * @deprecated Use toggleDeletion() instead
   * @param {number} index - The index of the item to mark for deletion
   * @returns {boolean} The new deletion state
   */
  markForDeletion(index) {
    // Issue deprecation warning
    console.warn('EditArray: markForDeletion() is deprecated. Use toggleDeletion() instead.');
    
    // Delegate to the new toggleDeletion method
    return this.toggleDeletion(index);
  }

  /**
   * Renders a single item in the list with display and edit templates.
   * @private
   * @param {Element} container - The container to append the item to
   * @param {Object} item - The item data
   * @param {number} index - The index of the item
   * @returns {Element} The created wrapper element
   */
  renderItem(container, item, index) {
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
    const deleteBtn = this.createDeleteButton(index);
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

    createCancelButton(_wrapper) {
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent =
            this.getAttribute("cancel-label") || "Cancel";
        cancelBtn.className = "btn btn-sm btn-danger";
        cancelBtn.setAttribute('data-action', 'cancel');
        cancelBtn.setAttribute('aria-label', 'Cancel adding item');
        return cancelBtn;
    }

    createDeleteButton(index) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = this.getAttribute("delete-label") || "Delete";
        deleteBtn.className = "btn btn-sm btn-danger delete-array-item-btn";
        deleteBtn.setAttribute('data-action', 'delete');
        deleteBtn.setAttribute('data-index', String(index));
        deleteBtn.setAttribute('aria-label', `Delete item ${index + 1}`);
        return deleteBtn;
    }

    createEditButton(index) {
        const editBtn = document.createElement("button");
        editBtn.textContent = this.getAttribute("edit-label") || "Edit";
        editBtn.className = "btn btn-sm btn-primary edit-array-item-btn";
        editBtn.setAttribute('data-action', 'edit');
        editBtn.setAttribute('data-index', String(index));
        editBtn.setAttribute('aria-label', `Edit item ${index + 1}`);
        return editBtn;
    }

    render() {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector(
      ".edit-array-container"
    );
    if (!container) return;

    const actionBar = container.querySelector(".action-bar");
    const itemsContainer = container.querySelector(".edit-array-items");
    if (!itemsContainer) return;
    itemsContainer.innerHTML = "";

    if (!Array.isArray(this.#data) || this.#data.length === 0) return;

    this.#data.forEach((item, index) =>
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
}

// Define the custom element
customElements.define("ck-edit-array", EditArray);

export { EditArray };

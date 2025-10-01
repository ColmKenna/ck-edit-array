```typescript
/**
 * EditArray Web Component TypeScript Definitions
 * Auto-generated from component implementation
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
    'ck-edit-array': EditArrayElement;
    }
  }
}

export interface EditArrayElement extends HTMLElement {
  /** The field name for form submission (used for name attributes) */
  'array-field'?: string;
  /** JSON string representation of the array data */
  data?: string;
  /** Label for the edit button (default: "Edit") */
  'edit-label'?: string;
  /** Label for the save button (default: "Save") */
  'save-label'?: string;
  /** Label for the delete button (default: "Delete") */
  'delete-label'?: string;
  /** Label for the cancel button (default: "Cancel") */
  'cancel-label'?: string;
}

export interface EditArrayEventDetail {
  /** Copy of the current data array */
  data: Array<Record<string, any>>;
}

export interface EditArrayItemEventDetail extends EditArrayEventDetail {
  /** Index of the affected item */
  index: number;
  /** Copy of the affected item */
  item: Record<string, any>;
}

export interface EditArrayItemUpdatedEventDetail extends EditArrayItemEventDetail {
  /** Name of the updated field */
  fieldName: string;
  /** New value of the field */
  value: any;
  /** Previous value of the field */
  oldValue: any;
}

export interface EditArrayItemChangeEventDetail extends EditArrayItemEventDetail {
  /** The action performed */
  action: 'toggle-deletion';
  /** Whether the item is marked for deletion */
  marked: boolean;
}

export interface EditArrayCustomEvents {
  /** Fired when the data array changes */
  'change': CustomEvent<EditArrayEventDetail>;
  /** Fired when a new item is added */
  'item-added': CustomEvent<EditArrayItemEventDetail>;
  /** Fired when an item is updated */
  'item-updated': CustomEvent<EditArrayItemUpdatedEventDetail>;
  /** Fired when an item is deleted */
  'item-deleted': CustomEvent<EditArrayItemEventDetail>;
  /** Fired when an item's deletion status changes */
  'item-change': CustomEvent<EditArrayItemChangeEventDetail>;
}

/**
 * EditArray Web Component Class
 * 
 * A dynamic array editor with inline editing capabilities.
 */
export declare class EditArray extends HTMLElement {
  /** Gets the array-field attribute value */
  get arrayField(): string | null;
  /** Sets the array-field attribute value */
  set arrayField(value: string | null);

  /** Gets the current data array */
  get data(): Array<Record<string, any>>;
  /** Sets the data array and updates the component */
  set data(value: Array<any> | string | any);

  /**
   * Adds a new item to the array
   * @param item - The item to add
   * @returns The index of the newly added item
   */
  addItem(item?: Record<string, any>): number;

  /**
   * Updates a specific field of an item at the given index
   * @param index - The index of the item to update
   * @param fieldName - The name of the field to update
   * @param value - The new value for the field
   */
  updateItem(index: number, fieldName: string, value: any): boolean;

  /**
   * Removes an item at the specified index
   * @param index - The index of the item to remove
   * @returns The removed item
   */
  removeItem(index: number): Record<string, any> | null;

  /**
   * Toggles the deletion state of an item at the specified index
   * @param index - The index of the item to toggle
   * @returns The new deletion state
   */
  toggleDeletion(index: number): boolean;

  /**
   * Validates an item at a specific index
   * @param index - The index of the item to validate
   * @returns True if the item is valid
   */
  validateItem(index: number): boolean;

  /**
   * Toggles between edit and display mode for an item
   * @param index - The index of the item to toggle
   */
  toggleEditMode(index: number): void;

  /**
   * Coerces a value to an array format
   * @param value - The value to coerce
   * @returns The coerced array
   */
  coerceToArray(value: any): Array<any>;

  // Legacy methods (deprecated)
  /**
   * @deprecated Use updateItem() instead
   */
  updateRecord(index: number, fieldName: string, value: any): void;

  /**
   * @deprecated Use toggleDeletion() instead
   */
  markForDeletion(index: number): boolean;
}

// Augment the global HTMLElementTagNameMap
declare global {
  interface HTMLElementTagNameMap {
    'ck-edit-array': EditArray;
  }

  interface HTMLElementEventMap extends EditArrayCustomEvents {}
}

export default EditArray;
```

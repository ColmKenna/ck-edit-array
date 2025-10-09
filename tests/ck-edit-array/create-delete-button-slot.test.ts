/**
 * Test suite for createDeleteButton slot template support
 * Tests for enhanced createDeleteButton() method with slot template integration
 * 
 * This file contains FAILING tests that will be implemented in task 4.1
 */

import { EditArray } from '../../src/ck-edit-array';

describe('EditArray - createDeleteButton Slot Template Support', () => {
  let element: EditArray;
  let container: HTMLElement;

  beforeAll(() => {
    // Define custom element if not already defined
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  beforeEach(() => {
    // Create fresh element and container
    container = document.createElement('div');
    document.body.appendChild(container);

    element = document.createElement('ck-edit-array') as EditArray;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('createDeleteButton with slot templates', () => {
    it('should use slotted delete button template when available', () => {
      // Setup: Element with custom delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete" class="custom-delete-btn">
            <i class="icon-trash"></i>
            <span>Remove</span>
          </button>
        </div>
      `;

      // Test: Create delete button should use the slotted template
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.classList.contains('custom-delete-btn')).toBe(true);
      expect(deleteButton.querySelector('i.icon-trash')).not.toBeNull();
      expect(deleteButton.querySelector('span')).not.toBeNull();
      expect(deleteButton.getAttribute('data-action')).toBe('delete');
      expect(deleteButton.getAttribute('data-index')).toBe('0');
      expect(deleteButton.getAttribute('aria-label')).toBe('Delete item 1');
    });

    it('should enhance slotted delete button with proper attributes and classes', () => {
      // Setup: Element with minimal delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete" class="my-custom-delete">Custom Delete</button>
        </div>
      `;

      // Test: Enhanced button should have both custom and standard classes
      const deleteButton = (element as any).createDeleteButton(2, { name: 'Test' });
      
      expect(deleteButton.classList.contains('my-custom-delete')).toBe(true);
      expect(deleteButton.classList.contains('btn')).toBe(true);
      expect(deleteButton.classList.contains('btn-sm')).toBe(true);
      expect(deleteButton.classList.contains('btn-danger')).toBe(true);
      expect(deleteButton.classList.contains('delete-array-item-btn')).toBe(true);
      expect(deleteButton.getAttribute('data-action')).toBe('delete');
      expect(deleteButton.getAttribute('data-index')).toBe('2');
      expect(deleteButton.getAttribute('aria-label')).toBe('Delete item 3');
    });

    it('should fallback to programmatic creation when no delete template exists', () => {
      // Setup: Element with buttons slot but no delete button
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Edit</button>
          <button data-action="add">Add</button>
        </div>
      `;

      // Test: Should create programmatic delete button
      const deleteButton = (element as any).createDeleteButton(1, { name: 'Test' });
      
      expect(deleteButton.textContent).toBe('Delete');
      expect(deleteButton.classList.contains('btn')).toBe(true);
      expect(deleteButton.classList.contains('btn-sm')).toBe(true);
      expect(deleteButton.classList.contains('btn-danger')).toBe(true);
      expect(deleteButton.classList.contains('delete-array-item-btn')).toBe(true);
      expect(deleteButton.getAttribute('data-action')).toBe('delete');
      expect(deleteButton.getAttribute('data-index')).toBe('1');
      expect(deleteButton.getAttribute('aria-label')).toBe('Delete item 2');
    });

    it('should fallback to programmatic creation when no buttons slot exists', () => {
      // Setup: Element with no buttons slot
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
      `;

      // Test: Should create programmatic delete button
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.textContent).toBe('Delete');
      expect(deleteButton.classList.contains('btn')).toBe(true);
      expect(deleteButton.classList.contains('btn-sm')).toBe(true);
      expect(deleteButton.classList.contains('btn-danger')).toBe(true);
      expect(deleteButton.classList.contains('delete-array-item-btn')).toBe(true);
      expect(deleteButton.getAttribute('data-action')).toBe('delete');
      expect(deleteButton.getAttribute('data-index')).toBe('0');
      expect(deleteButton.getAttribute('aria-label')).toBe('Delete item 1');
    });

    it('should preserve original template content when cloning', () => {
      // Setup: Element with complex delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete" id="original-delete" title="Delete this item">
            <i class="fas fa-trash"></i>
            <span class="button-text">Delete Item</span>
            <small class="help-text">Click to remove</small>
          </button>
        </div>
      `;

      // Test: Cloned button should preserve all content and attributes
      const deleteButton = (element as any).createDeleteButton(1, { name: 'Test' });
      
      expect(deleteButton.getAttribute('title')).toBe('Delete this item');
      expect(deleteButton.querySelector('i.fas.fa-trash')).not.toBeNull();
      expect(deleteButton.querySelector('span.button-text')).not.toBeNull();
      expect(deleteButton.querySelector('span.button-text')?.textContent).toBe('Delete Item');
      expect(deleteButton.querySelector('small.help-text')).not.toBeNull();
      expect(deleteButton.querySelector('small.help-text')?.textContent).toBe('Click to remove');
      
      // Should not modify the original template
      const originalTemplate = element.querySelector('[slot="buttons"] button[data-action="delete"]');
      expect(originalTemplate?.getAttribute('data-index')).toBeNull();
      expect(originalTemplate?.getAttribute('aria-label')).toBeNull();
    });

    it('should handle custom delete-label attribute', () => {
      // Setup: Element with custom delete label
      element.setAttribute('delete-label', 'Remove');
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Custom Delete</button>
        </div>
      `;

      // Test: Should use custom label in aria-label
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.getAttribute('aria-label')).toBe('Remove item 1');
    });

    it('should handle different index values correctly', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Different indices should produce correct attributes
      const deleteButton0 = (element as any).createDeleteButton(0, { name: 'Test' });
      expect(deleteButton0.getAttribute('data-index')).toBe('0');
      expect(deleteButton0.getAttribute('aria-label')).toBe('Delete item 1');

      const deleteButton5 = (element as any).createDeleteButton(5, { name: 'Test' });
      expect(deleteButton5.getAttribute('data-index')).toBe('5');
      expect(deleteButton5.getAttribute('aria-label')).toBe('Delete item 6');

      const deleteButton10 = (element as any).createDeleteButton(10, { name: 'Test' });
      expect(deleteButton10.getAttribute('data-index')).toBe('10');
      expect(deleteButton10.getAttribute('aria-label')).toBe('Delete item 11');
    });

    it('should return different instances for multiple calls', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Multiple calls should return different instances
      const deleteButton1 = (element as any).createDeleteButton(0, { name: 'Test' });
      const deleteButton2 = (element as any).createDeleteButton(1, { name: 'Test' });
      
      expect(deleteButton1).not.toBe(deleteButton2);
      expect(deleteButton1.getAttribute('data-index')).toBe('0');
      expect(deleteButton2.getAttribute('data-index')).toBe('1');
    });
  });

  describe('Delete/Restore text updates based on item state', () => {
    it('should show delete text for normal items', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">
            <span class="btn-text">Delete</span>
          </button>
        </div>
      `;

      // Test: Normal item should show delete text
      const normalItem = { name: 'Test', isDeleted: false };
      const deleteButton = (element as any).createDeleteButton(0, normalItem);
      
      expect(deleteButton.getAttribute('aria-label')).toBe('Delete item 1');
    });

    it('should show restore text for deleted items', () => {
      // Setup: Element with delete button template and custom restore label
      element.setAttribute('restore-label', 'Restore');
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">
            <span class="btn-text">Delete</span>
          </button>
        </div>
      `;

      // Test: Deleted item should show restore text
      const deletedItem = { name: 'Test', isDeleted: true };
      const deleteButton = (element as any).createDeleteButton(0, deletedItem);
      
      expect(deleteButton.getAttribute('aria-label')).toBe('Restore item 1');
    });

    it('should support text updates for enhanced delete buttons', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">
            <span class="btn-text">Delete</span>
          </button>
        </div>
      `;

      // Test: Enhanced button should support text updates
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      // Should be able to update text content
      const textSpan = deleteButton.querySelector('.btn-text');
      expect(textSpan).not.toBeNull();
      
      // Simulate text update (like what would happen in toggleDeletion)
      if (textSpan) {
        textSpan.textContent = 'Restore';
        expect(textSpan.textContent).toBe('Restore');
      }
    });

    it('should handle buttons without specific text elements', () => {
      // Setup: Element with simple delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete Item</button>
        </div>
      `;

      // Test: Should be able to update textContent directly
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.textContent).toBe('Delete Item');
      
      // Should support direct text updates
      deleteButton.textContent = 'Restore Item';
      expect(deleteButton.textContent).toBe('Restore Item');
    });

    it('should preserve button structure during text updates', () => {
      // Setup: Element with complex delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">
            <i class="icon-delete"></i>
            <span class="btn-text">Delete</span>
            <small class="help">Click to delete</small>
          </button>
        </div>
      `;

      // Test: Text updates should preserve other elements
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      const textSpan = deleteButton.querySelector('.btn-text');
      const icon = deleteButton.querySelector('i.icon-delete');
      const help = deleteButton.querySelector('small.help');
      
      expect(textSpan?.textContent).toBe('Delete');
      expect(icon).not.toBeNull();
      expect(help?.textContent).toBe('Click to delete');
      
      // Update text
      if (textSpan) {
        textSpan.textContent = 'Restore';
      }
      
      // Other elements should remain unchanged
      expect(deleteButton.querySelector('i.icon-delete')).not.toBeNull();
      expect(deleteButton.querySelector('small.help')?.textContent).toBe('Click to delete');
      expect(textSpan?.textContent).toBe('Restore');
    });

    it('should handle null or undefined item parameter', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Should handle null item
      const deleteButtonNull = (element as any).createDeleteButton(0, null);
      expect(deleteButtonNull.getAttribute('aria-label')).toBe('Delete item 1');

      // Test: Should handle undefined item
      const deleteButtonUndefined = (element as any).createDeleteButton(0, undefined);
      expect(deleteButtonUndefined.getAttribute('aria-label')).toBe('Delete item 1');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle invalid index values gracefully', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Should handle negative indices
      const deleteButtonNegative = (element as any).createDeleteButton(-1, { name: 'Test' });
      expect(deleteButtonNegative.getAttribute('data-index')).toBe('-1');
      expect(deleteButtonNegative.getAttribute('aria-label')).toBe('Delete item 0');

      // Test: Should handle non-numeric indices
      const deleteButtonNaN = (element as any).createDeleteButton(NaN, { name: 'Test' });
      expect(deleteButtonNaN.getAttribute('data-index')).toBe('NaN');
    });

    it('should handle malformed button templates', () => {
      // Setup: Element with button template missing data-action
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button class="delete-btn">No Action Attribute</button>
        </div>
      `;

      // Test: Should fallback to programmatic creation
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.textContent).toBe('Delete');
      expect(deleteButton.classList.contains('btn')).toBe(true);
      expect(deleteButton.classList.contains('btn-danger')).toBe(true);
    });

    it('should handle empty buttons slot', () => {
      // Setup: Element with empty buttons slot
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <!-- Empty slot -->
        </div>
      `;

      // Test: Should fallback to programmatic creation
      const deleteButton = (element as any).createDeleteButton(0, { name: 'Test' });
      
      expect(deleteButton.textContent).toBe('Delete');
      expect(deleteButton.classList.contains('btn')).toBe(true);
      expect(deleteButton.classList.contains('btn-danger')).toBe(true);
    });

    it('should handle items with complex isDeleted states', () => {
      // Setup: Element with delete button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Should handle truthy isDeleted values
      const deletedItem1 = { name: 'Test', isDeleted: 1 };
      const deleteButton1 = (element as any).createDeleteButton(0, deletedItem1);
      expect(deleteButton1.getAttribute('aria-label')).toBe('Restore item 1');

      // Test: Should handle falsy isDeleted values
      const deletedItem2 = { name: 'Test', isDeleted: 0 };
      const deleteButton2 = (element as any).createDeleteButton(0, deletedItem2);
      expect(deleteButton2.getAttribute('aria-label')).toBe('Delete item 1');

      // Test: Should handle string isDeleted values
      const deletedItem3 = { name: 'Test', isDeleted: 'true' };
      const deleteButton3 = (element as any).createDeleteButton(0, deletedItem3);
      expect(deleteButton3.getAttribute('aria-label')).toBe('Restore item 1');
    });
  });
});
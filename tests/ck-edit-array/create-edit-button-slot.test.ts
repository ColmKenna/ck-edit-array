/**
 * Test suite for createEditButton slot template support
 * Tests for enhanced createEditButton() method with slot template integration
 * 
 * This file contains FAILING tests that will be implemented in task 3.1
 */

import { EditArray } from '../../src/ck-edit-array';

describe('EditArray - createEditButton Slot Template Support', () => {
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

  describe('createEditButton with slot templates', () => {
    it('should use slotted edit button template when available', () => {
      // Setup: Element with custom edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" class="custom-edit-btn">
            <i class="icon-edit"></i>
            <span>Modify</span>
          </button>
        </div>
      `;

      // Test: Create edit button should use the slotted template
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.classList.contains('custom-edit-btn')).toBe(true);
      expect(editButton.querySelector('i.icon-edit')).not.toBeNull();
      expect(editButton.querySelector('span')).not.toBeNull();
      expect(editButton.getAttribute('data-action')).toBe('edit');
      expect(editButton.getAttribute('data-index')).toBe('0');
      expect(editButton.getAttribute('aria-label')).toBe('Edit item 1');
    });

    it('should enhance slotted edit button with proper attributes and classes', () => {
      // Setup: Element with minimal edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" class="my-custom-class">Custom Edit</button>
        </div>
      `;

      // Test: Enhanced button should have both custom and standard classes
      const editButton = (element as any).createEditButton(2);
      
      expect(editButton.classList.contains('my-custom-class')).toBe(true);
      expect(editButton.classList.contains('btn')).toBe(true);
      expect(editButton.classList.contains('btn-sm')).toBe(true);
      expect(editButton.classList.contains('btn-primary')).toBe(true);
      expect(editButton.classList.contains('edit-array-item-btn')).toBe(true);
      expect(editButton.getAttribute('data-action')).toBe('edit');
      expect(editButton.getAttribute('data-index')).toBe('2');
      expect(editButton.getAttribute('aria-label')).toBe('Edit item 3');
    });

    it('should fallback to programmatic creation when no edit template exists', () => {
      // Setup: Element with buttons slot but no edit button
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="delete">Delete</button>
          <button data-action="add">Add</button>
        </div>
      `;

      // Test: Should create programmatic edit button
      const editButton = (element as any).createEditButton(1);
      
      expect(editButton.textContent).toBe('Edit');
      expect(editButton.classList.contains('btn')).toBe(true);
      expect(editButton.classList.contains('btn-sm')).toBe(true);
      expect(editButton.classList.contains('btn-primary')).toBe(true);
      expect(editButton.classList.contains('edit-array-item-btn')).toBe(true);
      expect(editButton.getAttribute('data-action')).toBe('edit');
      expect(editButton.getAttribute('data-index')).toBe('1');
      expect(editButton.getAttribute('aria-label')).toBe('Edit item 2');
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

      // Test: Should create programmatic edit button
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.textContent).toBe('Edit');
      expect(editButton.classList.contains('btn')).toBe(true);
      expect(editButton.classList.contains('btn-sm')).toBe(true);
      expect(editButton.classList.contains('btn-primary')).toBe(true);
      expect(editButton.classList.contains('edit-array-item-btn')).toBe(true);
      expect(editButton.getAttribute('data-action')).toBe('edit');
      expect(editButton.getAttribute('data-index')).toBe('0');
      expect(editButton.getAttribute('aria-label')).toBe('Edit item 1');
    });

    it('should preserve original template content when cloning', () => {
      // Setup: Element with complex edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" id="original-edit" title="Edit this item">
            <i class="fas fa-edit"></i>
            <span class="button-text">Edit Item</span>
            <small class="help-text">Click to modify</small>
          </button>
        </div>
      `;

      // Test: Cloned button should preserve all content and attributes
      const editButton = (element as any).createEditButton(1);
      
      expect(editButton.getAttribute('title')).toBe('Edit this item');
      expect(editButton.querySelector('i.fas.fa-edit')).not.toBeNull();
      expect(editButton.querySelector('span.button-text')).not.toBeNull();
      expect(editButton.querySelector('span.button-text')?.textContent).toBe('Edit Item');
      expect(editButton.querySelector('small.help-text')).not.toBeNull();
      expect(editButton.querySelector('small.help-text')?.textContent).toBe('Click to modify');
      
      // Should not modify the original template
      const originalTemplate = element.querySelector('[slot="buttons"] button[data-action="edit"]');
      expect(originalTemplate?.getAttribute('data-index')).toBeNull();
      expect(originalTemplate?.getAttribute('aria-label')).toBeNull();
    });

    it('should handle custom edit-label attribute', () => {
      // Setup: Element with custom edit label
      element.setAttribute('edit-label', 'Modify');
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Custom Edit</button>
        </div>
      `;

      // Test: Should use custom label in aria-label
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.getAttribute('aria-label')).toBe('Modify item 1');
    });

    it('should handle different index values correctly', () => {
      // Setup: Element with edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Edit</button>
        </div>
      `;

      // Test: Different indices should produce correct attributes
      const editButton0 = (element as any).createEditButton(0);
      expect(editButton0.getAttribute('data-index')).toBe('0');
      expect(editButton0.getAttribute('aria-label')).toBe('Edit item 1');

      const editButton5 = (element as any).createEditButton(5);
      expect(editButton5.getAttribute('data-index')).toBe('5');
      expect(editButton5.getAttribute('aria-label')).toBe('Edit item 6');

      const editButton10 = (element as any).createEditButton(10);
      expect(editButton10.getAttribute('data-index')).toBe('10');
      expect(editButton10.getAttribute('aria-label')).toBe('Edit item 11');
    });

    it('should return different instances for multiple calls', () => {
      // Setup: Element with edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Edit</button>
        </div>
      `;

      // Test: Multiple calls should return different instances
      const editButton1 = (element as any).createEditButton(0);
      const editButton2 = (element as any).createEditButton(1);
      
      expect(editButton1).not.toBe(editButton2);
      expect(editButton1.getAttribute('data-index')).toBe('0');
      expect(editButton2.getAttribute('data-index')).toBe('1');
    });
  });

  describe('Edit/Save text updates on enhanced buttons', () => {
    it('should support text updates for enhanced edit buttons', () => {
      // Setup: Element with edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">
            <span class="btn-text">Edit</span>
          </button>
        </div>
      `;

      // Test: Enhanced button should support text updates
      const editButton = (element as any).createEditButton(0);
      
      // Should be able to update text content
      const textSpan = editButton.querySelector('.btn-text');
      expect(textSpan).not.toBeNull();
      
      // Simulate text update (like what would happen in toggleEditMode)
      if (textSpan) {
        textSpan.textContent = 'Save';
        expect(textSpan.textContent).toBe('Save');
      }
    });

    it('should handle buttons without specific text elements', () => {
      // Setup: Element with simple edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Edit Item</button>
        </div>
      `;

      // Test: Should be able to update textContent directly
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.textContent).toBe('Edit Item');
      
      // Should support direct text updates
      editButton.textContent = 'Save Item';
      expect(editButton.textContent).toBe('Save Item');
    });

    it('should preserve button structure during text updates', () => {
      // Setup: Element with complex edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">
            <i class="icon-edit"></i>
            <span class="btn-text">Edit</span>
            <small class="help">Click to edit</small>
          </button>
        </div>
      `;

      // Test: Text updates should preserve other elements
      const editButton = (element as any).createEditButton(0);
      
      const textSpan = editButton.querySelector('.btn-text');
      const icon = editButton.querySelector('i.icon-edit');
      const help = editButton.querySelector('small.help');
      
      expect(textSpan?.textContent).toBe('Edit');
      expect(icon).not.toBeNull();
      expect(help?.textContent).toBe('Click to edit');
      
      // Update text
      if (textSpan) {
        textSpan.textContent = 'Save';
      }
      
      // Other elements should remain unchanged
      expect(editButton.querySelector('i.icon-edit')).not.toBeNull();
      expect(editButton.querySelector('small.help')?.textContent).toBe('Click to edit');
      expect(textSpan?.textContent).toBe('Save');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle invalid index values gracefully', () => {
      // Setup: Element with edit button template
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit">Edit</button>
        </div>
      `;

      // Test: Should handle negative indices
      const editButtonNegative = (element as any).createEditButton(-1);
      expect(editButtonNegative.getAttribute('data-index')).toBe('-1');
      expect(editButtonNegative.getAttribute('aria-label')).toBe('Edit item 0');

      // Test: Should handle non-numeric indices
      const editButtonNaN = (element as any).createEditButton(NaN);
      expect(editButtonNaN.getAttribute('data-index')).toBe('NaN');
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
          <button class="edit-btn">No Action Attribute</button>
        </div>
      `;

      // Test: Should fallback to programmatic creation
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.textContent).toBe('Edit');
      expect(editButton.classList.contains('btn')).toBe(true);
      expect(editButton.classList.contains('btn-primary')).toBe(true);
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
      const editButton = (element as any).createEditButton(0);
      
      expect(editButton.textContent).toBe('Edit');
      expect(editButton.classList.contains('btn')).toBe(true);
      expect(editButton.classList.contains('btn-primary')).toBe(true);
    });
  });
});
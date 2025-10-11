/**
 * Test suite for slot template discovery functionality
 * Tests for getSlottedButtonTemplate() and hasButtonsSlot() methods
 * 
 * This file contains FAILING tests that will be implemented in task 1.1
 */

import { EditArray } from '../../src/ck-edit-array';

describe('EditArray - Slot Template Discovery', () => {
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

  describe('getSlottedButtonTemplate()', () => {
    it('should return null when no buttons slot exists', () => {
      // Setup: Element with no buttons slot
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
      `;

      // Test: Try to get edit button template
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).toBeNull();
    });

    it('should return null when buttons slot exists but no matching action', () => {
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

      // Test: Try to get edit button template
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).toBeNull();
    });

    it('should return button element when matching action exists', () => {
      // Setup: Element with buttons slot containing edit button
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" class="custom-edit">Edit Item</button>
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Get edit button template
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).not.toBeNull();
      expect(template.tagName.toLowerCase()).toBe('button');
      expect(template.getAttribute('data-action')).toBe('edit');
      expect(template.classList.contains('custom-edit')).toBe(true);
      expect(template.textContent).toBe('Edit Item');
    });

    it('should return first matching button when multiple buttons have same action', () => {
      // Setup: Element with duplicate action buttons
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" class="first-edit">First Edit</button>
          <button data-action="edit" class="second-edit">Second Edit</button>
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Get edit button template (should return first one)
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).not.toBeNull();
      expect(template.classList.contains('first-edit')).toBe(true);
      expect(template.classList.contains('second-edit')).toBe(false);
      expect(template.textContent).toBe('First Edit');
    });

    it('should work with all supported action types', () => {
      // Setup: Element with all button types
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="edit" class="custom-edit">Edit</button>
          <button data-action="delete" class="custom-delete">Delete</button>
          <button data-action="cancel" class="custom-cancel">Cancel</button>
          <button data-action="add" class="custom-add">Add</button>
        </div>
      `;

      // Test: Get each button type
      const editTemplate = (element as any).getSlottedButtonTemplate('edit');
      expect(editTemplate).not.toBeNull();
      expect(editTemplate.classList.contains('custom-edit')).toBe(true);

      const deleteTemplate = (element as any).getSlottedButtonTemplate('delete');
      expect(deleteTemplate).not.toBeNull();
      expect(deleteTemplate.classList.contains('custom-delete')).toBe(true);

      const cancelTemplate = (element as any).getSlottedButtonTemplate('cancel');
      expect(cancelTemplate).not.toBeNull();
      expect(cancelTemplate.classList.contains('custom-cancel')).toBe(true);

      const addTemplate = (element as any).getSlottedButtonTemplate('add');
      expect(addTemplate).not.toBeNull();
      expect(addTemplate.classList.contains('custom-add')).toBe(true);
    });

    it('should ignore non-button elements with data-action attributes', () => {
      // Setup: Element with non-button elements having data-action
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <div data-action="edit">Not a button</div>
          <span data-action="delete">Also not a button</span>
          <button data-action="add">Real button</button>
        </div>
      `;

      // Test: Should not find edit or delete templates (non-buttons)
      const editTemplate = (element as any).getSlottedButtonTemplate('edit');
      expect(editTemplate).toBeNull();

      const deleteTemplate = (element as any).getSlottedButtonTemplate('delete');
      expect(deleteTemplate).toBeNull();

      // Test: Should find add template (real button)
      const addTemplate = (element as any).getSlottedButtonTemplate('add');
      expect(addTemplate).not.toBeNull();
      expect(addTemplate.tagName.toLowerCase()).toBe('button');
    });

    it('should handle buttons without data-action attributes', () => {
      // Setup: Element with buttons missing data-action
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button class="no-action">No Action</button>
          <button data-action="">Empty Action</button>
          <button data-action="edit">Valid Edit</button>
        </div>
      `;

      // Test: Should not find buttons without proper data-action
      const noActionTemplate = (element as any).getSlottedButtonTemplate('');
      expect(noActionTemplate).toBeNull();

      // Test: Should find valid edit button
      const editTemplate = (element as any).getSlottedButtonTemplate('edit');
      expect(editTemplate).not.toBeNull();
      expect(editTemplate.textContent).toBe('Valid Edit');
    });

    it('should handle nested button structures', () => {
      // Setup: Element with nested button structure
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <div class="button-group">
            <button data-action="edit" class="nested-edit">
              <i class="icon-edit"></i>
              <span>Edit Item</span>
            </button>
          </div>
          <button data-action="delete">Delete</button>
        </div>
      `;

      // Test: Should find nested button
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).not.toBeNull();
      expect(template.classList.contains('nested-edit')).toBe(true);
      expect(template.querySelector('i.icon-edit')).not.toBeNull();
      expect(template.querySelector('span')).not.toBeNull();
    });

    it('should handle case-sensitive action matching', () => {
      // Setup: Element with mixed case actions
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <button data-action="Edit">Capitalized Edit</button>
          <button data-action="DELETE">Uppercase Delete</button>
          <button data-action="edit">Lowercase Edit</button>
        </div>
      `;

      // Test: Should match exact case
      const editTemplate = (element as any).getSlottedButtonTemplate('edit');
      expect(editTemplate).not.toBeNull();
      expect(editTemplate.textContent).toBe('Lowercase Edit');

      const capitalEditTemplate = (element as any).getSlottedButtonTemplate('Edit');
      expect(capitalEditTemplate).not.toBeNull();
      expect(capitalEditTemplate.textContent).toBe('Capitalized Edit');

      const deleteTemplate = (element as any).getSlottedButtonTemplate('delete');
      expect(deleteTemplate).toBeNull(); // Should not match uppercase DELETE
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed slot structure', () => {
      // Setup: Element with malformed buttons slot
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          <!-- Comment -->
          <button data-action="edit">Edit</button>
          <!-- Another comment -->
        </div>
      `;

      // Test: Should still find valid button despite comments
      const template = (element as any).getSlottedButtonTemplate('edit');
      expect(template).not.toBeNull();
      expect(template.textContent).toBe('Edit');
    });

    it('should handle buttons slot with mixed content', () => {
      // Setup: Element with mixed content in buttons slot
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="name"></span>
        </div>
        <div slot="edit">
          <input name="name" required>
        </div>
        <div slot="buttons">
          Some text content
          <button data-action="edit">Edit</button>
          <p>Some paragraph</p>
          <button data-action="delete">Delete</button>
          More text
        </div>
      `;

      // Test: Should find buttons despite mixed content
      const editTemplate = (element as any).getSlottedButtonTemplate('edit');
      expect(editTemplate).not.toBeNull();
      expect(editTemplate.textContent).toBe('Edit');

      const deleteTemplate = (element as any).getSlottedButtonTemplate('delete');
      expect(deleteTemplate).not.toBeNull();
      expect(deleteTemplate.textContent).toBe('Delete');
    });

    it('should return null for invalid action parameter', () => {
      // Setup: Element with valid buttons slot
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

      // Test: Invalid action parameters
      expect((element as any).getSlottedButtonTemplate(null)).toBeNull();
      expect((element as any).getSlottedButtonTemplate(undefined)).toBeNull();
      expect((element as any).getSlottedButtonTemplate('')).toBeNull();
    });
  });
});
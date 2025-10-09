/**
 * Test suite for button enhancement system
 * Tests for enhanceButtonWithAttributes(), getButtonClasses(), and getButtonAriaLabel() methods
 * 
 * This file contains FAILING tests that will be implemented in task 2.1
 */

import { EditArray } from '../../src/ck-edit-array';

describe('EditArray - Button Enhancement System', () => {
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

  describe('getButtonClasses()', () => {
    it('should return correct classes for edit action', () => {
      const classes = (element as any).getButtonClasses('edit');
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-sm');
      expect(classes).toContain('btn-primary');
      expect(classes).toContain('edit-array-item-btn');
    });

    it('should return correct classes for delete action', () => {
      const classes = (element as any).getButtonClasses('delete');
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-sm');
      expect(classes).toContain('btn-danger');
      expect(classes).toContain('delete-array-item-btn');
    });

    it('should return correct classes for cancel action', () => {
      const classes = (element as any).getButtonClasses('cancel');
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-sm');
      expect(classes).toContain('btn-danger');
    });

    it('should return correct classes for add action', () => {
      const classes = (element as any).getButtonClasses('add');
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-success');
    });

    it('should return default classes for unknown action', () => {
      const classes = (element as any).getButtonClasses('unknown');
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-sm');
    });

    it('should handle null or undefined action', () => {
      const nullClasses = (element as any).getButtonClasses(null);
      expect(nullClasses).toContain('btn');
      expect(nullClasses).toContain('btn-sm');

      const undefinedClasses = (element as any).getButtonClasses(undefined);
      expect(undefinedClasses).toContain('btn');
      expect(undefinedClasses).toContain('btn-sm');
    });
  });

  describe('getButtonAriaLabel()', () => {
    it('should return correct aria-label for edit action with index', () => {
      const label = (element as any).getButtonAriaLabel('edit', 0);
      expect(label).toBe('Edit item 1');
    });

    it('should return correct aria-label for delete action with index', () => {
      const label = (element as any).getButtonAriaLabel('delete', 2);
      expect(label).toBe('Delete item 3');
    });

    it('should return correct aria-label for cancel action without index', () => {
      const label = (element as any).getButtonAriaLabel('cancel');
      expect(label).toBe('Cancel adding item');
    });

    it('should return correct aria-label for add action without index', () => {
      const label = (element as any).getButtonAriaLabel('add');
      expect(label).toBe('Add new item');
    });

    it('should handle custom button labels from attributes', () => {
      element.setAttribute('edit-label', 'Modify');
      element.setAttribute('delete-label', 'Remove');
      element.setAttribute('cancel-label', 'Abort');

      const editLabel = (element as any).getButtonAriaLabel('edit', 1);
      expect(editLabel).toBe('Modify item 2');

      const deleteLabel = (element as any).getButtonAriaLabel('delete', 0);
      expect(deleteLabel).toBe('Remove item 1');

      const cancelLabel = (element as any).getButtonAriaLabel('cancel');
      expect(cancelLabel).toBe('Abort adding item');
    });

    it('should handle restore action with custom restore-label', () => {
      element.setAttribute('restore-label', 'Bring Back');
      const label = (element as any).getButtonAriaLabel('restore', 1);
      expect(label).toBe('Bring Back item 2');
    });

    it('should handle invalid index values', () => {
      const negativeLabel = (element as any).getButtonAriaLabel('edit', -1);
      expect(negativeLabel).toBe('Edit item 0');

      const nullLabel = (element as any).getButtonAriaLabel('edit', null);
      expect(nullLabel).toBe('Edit item');

      const undefinedLabel = (element as any).getButtonAriaLabel('edit', undefined);
      expect(undefinedLabel).toBe('Edit item');
    });

    it('should handle unknown action types', () => {
      const label = (element as any).getButtonAriaLabel('unknown', 0);
      expect(label).toBe('unknown item 1');
    });
  });

  describe('enhanceButtonWithAttributes()', () => {
    let testButton: HTMLButtonElement;

    beforeEach(() => {
      testButton = document.createElement('button');
      testButton.textContent = 'Original Text';
      testButton.className = 'existing-class';
    });

    it('should enhance edit button with correct attributes', () => {
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 2);
      
      expect(enhanced.getAttribute('data-action')).toBe('edit');
      expect(enhanced.getAttribute('data-index')).toBe('2');
      expect(enhanced.getAttribute('aria-label')).toBe('Edit item 3');
      expect(enhanced.classList.contains('existing-class')).toBe(true);
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-sm')).toBe(true);
      expect(enhanced.classList.contains('btn-primary')).toBe(true);
      expect(enhanced.classList.contains('edit-array-item-btn')).toBe(true);
    });

    it('should enhance delete button with correct attributes', () => {
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'delete', 1);
      
      expect(enhanced.getAttribute('data-action')).toBe('delete');
      expect(enhanced.getAttribute('data-index')).toBe('1');
      expect(enhanced.getAttribute('aria-label')).toBe('Delete item 2');
      expect(enhanced.classList.contains('existing-class')).toBe(true);
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-sm')).toBe(true);
      expect(enhanced.classList.contains('btn-danger')).toBe(true);
      expect(enhanced.classList.contains('delete-array-item-btn')).toBe(true);
    });

    it('should enhance cancel button without index', () => {
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'cancel');
      
      expect(enhanced.getAttribute('data-action')).toBe('cancel');
      expect(enhanced.getAttribute('data-index')).toBeNull();
      expect(enhanced.getAttribute('aria-label')).toBe('Cancel adding item');
      expect(enhanced.classList.contains('existing-class')).toBe(true);
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-sm')).toBe(true);
      expect(enhanced.classList.contains('btn-danger')).toBe(true);
    });

    it('should enhance add button without index', () => {
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'add');
      
      expect(enhanced.getAttribute('data-action')).toBe('add');
      expect(enhanced.getAttribute('data-index')).toBeNull();
      expect(enhanced.getAttribute('aria-label')).toBe('Add new item');
      expect(enhanced.classList.contains('existing-class')).toBe(true);
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-success')).toBe(true);
    });

    it('should preserve existing attributes and classes', () => {
      testButton.setAttribute('id', 'my-button');
      testButton.setAttribute('title', 'Custom tooltip');
      testButton.classList.add('custom-class', 'another-class');
      
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      expect(enhanced.getAttribute('id')).toBe('my-button');
      expect(enhanced.getAttribute('title')).toBe('Custom tooltip');
      expect(enhanced.classList.contains('existing-class')).toBe(true);
      expect(enhanced.classList.contains('custom-class')).toBe(true);
      expect(enhanced.classList.contains('another-class')).toBe(true);
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-primary')).toBe(true);
    });

    it('should not duplicate existing classes', () => {
      testButton.classList.add('btn', 'btn-primary');
      
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      const btnClasses = Array.from(enhanced.classList).filter(cls => cls === 'btn');
      expect(btnClasses.length).toBe(1);
      
      const primaryClasses = Array.from(enhanced.classList).filter(cls => cls === 'btn-primary');
      expect(primaryClasses.length).toBe(1);
    });

    it('should handle button with no existing classes', () => {
      const bareButton = document.createElement('button');
      bareButton.textContent = 'Bare Button';
      
      const enhanced = (element as any).enhanceButtonWithAttributes(bareButton, 'delete', 1);
      
      expect(enhanced.classList.contains('btn')).toBe(true);
      expect(enhanced.classList.contains('btn-sm')).toBe(true);
      expect(enhanced.classList.contains('btn-danger')).toBe(true);
      expect(enhanced.classList.contains('delete-array-item-btn')).toBe(true);
    });

    it('should return a new button instance (clone)', () => {
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      expect(enhanced).not.toBe(testButton);
      expect(enhanced.textContent).toBe(testButton.textContent);
      expect(enhanced.tagName).toBe('BUTTON');
    });

    it('should handle complex nested button content', () => {
      testButton.innerHTML = '<i class="icon-edit"></i><span>Edit Item</span>';
      
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      expect(enhanced.querySelector('i.icon-edit')).not.toBeNull();
      expect(enhanced.querySelector('span')).not.toBeNull();
      expect(enhanced.querySelector('span')?.textContent).toBe('Edit Item');
    });

    it('should handle invalid parameters gracefully', () => {
      // Test with null button
      expect(() => {
        (element as any).enhanceButtonWithAttributes(null, 'edit', 0);
      }).toThrow();

      // Test with non-button element
      const div = document.createElement('div');
      expect(() => {
        (element as any).enhanceButtonWithAttributes(div, 'edit', 0);
      }).toThrow();

      // Test with invalid action
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, '', 0);
      expect(enhanced.getAttribute('data-action')).toBe('');
    });
  });

  describe('Class Merging Behavior', () => {
    let testButton: HTMLButtonElement;

    beforeEach(() => {
      testButton = document.createElement('button');
    });

    it('should merge classes without duplicates', () => {
      testButton.className = 'btn custom-btn btn-primary';
      
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      const classes = Array.from(enhanced.classList);
      const btnCount = classes.filter(cls => cls === 'btn').length;
      const primaryCount = classes.filter(cls => cls === 'btn-primary').length;
      
      expect(btnCount).toBe(1);
      expect(primaryCount).toBe(1);
      expect(enhanced.classList.contains('custom-btn')).toBe(true);
    });

    it('should handle conflicting button type classes', () => {
      testButton.className = 'btn btn-danger custom-class';
      
      // When enhancing as edit button (should be primary), existing danger class should remain
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      expect(enhanced.classList.contains('btn-danger')).toBe(true);
      expect(enhanced.classList.contains('btn-primary')).toBe(true);
      expect(enhanced.classList.contains('custom-class')).toBe(true);
    });

    it('should preserve order of existing classes', () => {
      testButton.className = 'first-class second-class third-class';
      
      const enhanced = (element as any).enhanceButtonWithAttributes(testButton, 'edit', 0);
      
      const classes = Array.from(enhanced.classList);
      const firstIndex = classes.indexOf('first-class');
      const secondIndex = classes.indexOf('second-class');
      const thirdIndex = classes.indexOf('third-class');
      
      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });
  });
});
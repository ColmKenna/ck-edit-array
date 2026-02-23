/**
 * CSS Parts test suite for EditArray web component
 * Tests that all Shadow DOM elements expose the correct `part` attributes
 * for external styling via ::part() selectors.
 */

import { EditArray, EditArrayItem } from '../../src/ck-edit-array';

const createSampleItem = (overrides: Partial<EditArrayItem> = {}): EditArrayItem => ({
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
});

const createSampleArray = (count: number = 2): EditArrayItem[] =>
  Array.from({ length: count }, (_, i) =>
    createSampleItem({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })
  );

describe('CSS Parts - External Styling Support', () => {
  let element: EditArray;
  let container: HTMLElement;

  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    container = document.createElement('div');
    document.body.appendChild(container);

    element = document.createElement('ck-edit-array') as EditArray;
    element.innerHTML = `
      <div slot="display">
        <span data-display-for="name"></span> - <span data-display-for="email"></span>
      </div>
      <div slot="edit">
        <label for="name-input">Name</label>
        <input id="name-input" name="name" required>
        <label for="email-input">Email</label>
        <input id="email-input" name="email" type="email" required>
      </div>
    `;

    container.appendChild(element);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    container.remove();
  });

  describe('Constructor-level parts', () => {
    it('assigns part="container" to the edit-array-container div', () => {
      const containerEl = element.shadowRoot!.querySelector('.edit-array-container');
      expect(containerEl).toBeTruthy();
      expect(containerEl!.getAttribute('part')).toBe('container');
    });

    it('assigns part="items-container" to the edit-array-items div', () => {
      const itemsEl = element.shadowRoot!.querySelector('.edit-array-items');
      expect(itemsEl).toBeTruthy();
      expect(itemsEl!.getAttribute('part')).toBe('items-container');
    });

    it('assigns part="action-bar" to the action-bar div', () => {
      const actionBar = element.shadowRoot!.querySelector('.action-bar');
      expect(actionBar).toBeTruthy();
      expect(actionBar!.getAttribute('part')).toBe('action-bar');
    });
  });

  describe('renderItem-level parts', () => {
    beforeEach(() => {
      element.data = createSampleArray(1);
    });

    it('assigns part="item" to each .edit-array-item wrapper', () => {
      const items = element.shadowRoot!.querySelectorAll('.edit-array-item');
      expect(items.length).toBeGreaterThan(0);
      items.forEach(item => {
        expect(item.getAttribute('part')).toBe('item');
      });
    });

    it('assigns part="edit-container" to each .edit-container div', () => {
      const editContainers = element.shadowRoot!.querySelectorAll('.edit-container');
      expect(editContainers.length).toBeGreaterThan(0);
      editContainers.forEach(ec => {
        expect(ec.getAttribute('part')).toBe('edit-container');
      });
    });

    it('assigns part="display-container" to each display clone wrapper', () => {
      // The display clone is the first child of .edit-array-item that has slot="display"
      const items = element.shadowRoot!.querySelectorAll('.edit-array-item');
      expect(items.length).toBeGreaterThan(0);
      items.forEach(item => {
        const displayEl = item.querySelector('[slot="display"]');
        expect(displayEl).toBeTruthy();
        expect(displayEl!.getAttribute('part')).toBe('display-container');
      });
    });

    it('assigns part="button-bar" to each button bar div', () => {
      // The button bar is the last child div of .edit-array-item that contains buttons
      const items = element.shadowRoot!.querySelectorAll('.edit-array-item');
      expect(items.length).toBeGreaterThan(0);
      items.forEach(item => {
        // The button bar contains buttons with data-action attributes
        const buttons = item.querySelectorAll('button[data-action]');
        expect(buttons.length).toBeGreaterThan(0);
        // The button bar is the parent of these buttons
        const buttonBar = buttons[0].parentElement;
        expect(buttonBar).toBeTruthy();
        expect(buttonBar!.getAttribute('part')).toBe('button-bar');
      });
    });
  });

  describe('editSlotTemplate-level parts', () => {
    beforeEach(() => {
      element.data = createSampleArray(1);
      // Toggle edit mode to make the edit container visible (though part should be set regardless)
    });

    it('assigns part="input" to cloned input elements inside the edit container', () => {
      const editContainer = element.shadowRoot!.querySelector('.edit-container');
      expect(editContainer).toBeTruthy();
      const inputs = editContainer!.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach(input => {
        expect(input.getAttribute('part')).toBe('input');
      });
    });

    it('assigns part="label" to cloned label elements inside the edit container', () => {
      const editContainer = element.shadowRoot!.querySelector('.edit-container');
      expect(editContainer).toBeTruthy();
      const labels = editContainer!.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      labels.forEach(label => {
        expect(label.getAttribute('part')).toBe('label');
      });
    });
  });

  describe('editSlotTemplate with select and textarea', () => {
    beforeEach(() => {
      // Use a template that includes select and textarea elements
      element.innerHTML = `
        <div slot="display">
          <span data-display-for="role"></span>
          <span data-display-for="bio"></span>
        </div>
        <div slot="edit">
          <select name="role">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <textarea name="bio"></textarea>
        </div>
      `;
      element.data = createSampleArray(1);
    });

    it('assigns part="select" to cloned select elements', () => {
      const editContainer = element.shadowRoot!.querySelector('.edit-container');
      expect(editContainer).toBeTruthy();
      const selects = editContainer!.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
      selects.forEach(select => {
        expect(select.getAttribute('part')).toBe('select');
      });
    });

    it('assigns part="textarea" to cloned textarea elements', () => {
      const editContainer = element.shadowRoot!.querySelector('.edit-container');
      expect(editContainer).toBeTruthy();
      const textareas = editContainer!.querySelectorAll('textarea');
      expect(textareas.length).toBeGreaterThan(0);
      textareas.forEach(textarea => {
        expect(textarea.getAttribute('part')).toBe('textarea');
      });
    });
  });

  describe('render-level parts', () => {
    beforeEach(() => {
      element.data = createSampleArray(1);
    });

    it('assigns part="add-button" to the add new item button', () => {
      const addBtn = element.shadowRoot!.querySelector('.action-bar button[data-action="add"]');
      expect(addBtn).toBeTruthy();
      expect(addBtn!.getAttribute('part')).toBe('add-button');
    });
  });

  describe('Multiple items', () => {
    beforeEach(() => {
      element.data = createSampleArray(3);
    });

    it('assigns part attributes to all items consistently', () => {
      const items = element.shadowRoot!.querySelectorAll('.edit-array-item');
      expect(items.length).toBe(3);

      items.forEach(item => {
        expect(item.getAttribute('part')).toBe('item');

        const editContainer = item.querySelector('.edit-container');
        expect(editContainer!.getAttribute('part')).toBe('edit-container');

        const displayEl = item.querySelector('[slot="display"]');
        expect(displayEl!.getAttribute('part')).toBe('display-container');
      });
    });
  });
});

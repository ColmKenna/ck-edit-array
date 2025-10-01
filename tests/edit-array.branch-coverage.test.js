/**
 * Additional branch coverage tests for the EditArray component.
 */

import { EditArray } from '../src/ck-edit-array.js';

const flushMicrotasks = () => new Promise(resolve => setTimeout(resolve, 0));

describe('EditArray Component - Branch Coverage Enhancements', () => {
  let host;
  let element;

  beforeEach(() => {
    document.body.innerHTML = '';
    host = document.createElement('div');
    document.body.appendChild(host);

  element = document.createElement('ck-edit-array');
    element.innerHTML = `
      <div slot="display">
        <span data-display-for="name"></span>
        <span data-display-for="email"></span>
      </div>
      <div slot="edit">
        <input name="name" required>
        <input name="email" type="email" required>
      </div>
    `;

    host.appendChild(element);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (host?.parentNode) {
      host.parentNode.removeChild(host);
    }
  });

  test('add/cancel flow falls back when wrapper index metadata is missing', async () => {
    element.data = [{ name: 'Existing' }];
    await flushMicrotasks();

    const changeSpy = jest.fn();
    element.addEventListener('change', changeSpy);

    const addButton = element.shadowRoot?.querySelector('.action-bar [data-action="add"]');
    expect(addButton).toBeTruthy();

    addButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushMicrotasks();

    // Ensure the new wrapper exists
    const newlyRendered = element.shadowRoot?.querySelector('.edit-array-item[data-index="1"]');
    expect(newlyRendered).toBeTruthy();

    // Remove metadata to trigger fallback branch inside handleCancelAction
    newlyRendered?.removeAttribute('data-index');
    const cancelButton = newlyRendered?.querySelector('[data-action="cancel"]');
    expect(cancelButton).toBeTruthy();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    cancelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushMicrotasks();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: Could not determine item index for cancel action')
    );
    expect(element.data).toHaveLength(1);
    expect(changeSpy).toHaveBeenCalled();
  });

  test('delete button delegates through markForDeletion with warning', async () => {
    element.data = [{ name: 'Row' }];
    await flushMicrotasks();

    const toggleSpy = jest.spyOn(element, 'toggleDeletion').mockReturnValue(true);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const deleteButton = element.shadowRoot?.querySelector('[data-action="delete"]');
    expect(deleteButton).toBeTruthy();

    deleteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushMicrotasks();

    expect(toggleSpy).toHaveBeenCalledWith(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: markForDeletion() is deprecated')
    );
  });

  test('validateArrayField warns about unsafe characters and setter removes attribute', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    element.arrayField = 'customer data';
    expect(element.getAttribute('array-field')).toBe('customer data');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('contains unsafe characters')
    );

    warnSpy.mockClear();

    element.arrayField = null;
    expect(element.hasAttribute('array-field')).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('validateItem handles missing wrapper gracefully', () => {
    element.data = [{ name: 'ghost' }];
    const wrapper = element.shadowRoot?.querySelector('.edit-array-item');
    wrapper?.remove();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = element.validateItem(0);

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: No wrapper found for index 0')
    );
  });

  test('validateItem handles missing edit container gracefully', () => {
    element.data = [{ name: 'ghost' }];
    const wrapper = element.shadowRoot?.querySelector('.edit-array-item');
    const editContainer = wrapper?.querySelector('.edit-container');
    editContainer?.remove();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = element.validateItem(0);

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: No edit container found for index 0')
    );
  });

  test('updateItem warns when validateIndex reports failure', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const validateSpy = jest.spyOn(element, 'validateIndex').mockReturnValue(false);

    const result = element.updateItem(0, 'name', 'value');

    expect(result).toBe(false);
    expect(validateSpy).toHaveBeenCalledWith(0, true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: Invalid index 0 for updateItem')
    );
  });

  test('updateItem creates object when existing entry is nullish', () => {
    element.data = [null];
    element.updateItem(0, 'name', 'Value');

    const currentData = element.data;
    expect(currentData[0]).toEqual({ name: 'Value' });
  });

  test('removeItem returns null when validateIndex signals failure', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const validateSpy = jest.spyOn(element, 'validateIndex').mockReturnValue(false);

    const result = element.removeItem(0);

    expect(result).toBeNull();
    expect(validateSpy).toHaveBeenCalledWith(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: Invalid index 0 for removeItem')
    );
  });

  test('data setter removes attribute when array becomes empty', () => {
    element.setAttribute('data', '["preset"]');
    element.data = [];

    expect(element.hasAttribute('data')).toBe(false);
  });

  test('data setter logs when JSON.stringify fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const bigIntValue = BigInt(42);

    element.data = [bigIntValue];

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('EditArray: Failed to stringify data for attribute'),
      expect.any(TypeError)
    );
  });

  test('attributeChangedCallback resets data when data attribute removed', () => {
    element.data = [{ name: 'persist' }];
    const renderSpy = jest.spyOn(element, 'render');
    element.removeAttribute('data');

    expect(element.data).toEqual([]);
    expect(renderSpy).toHaveBeenCalled();
  });

  test('attributeChangedCallback rerenders when array-field changes', () => {
    const renderSpy = jest.spyOn(element, 'render');
    element.setAttribute('array-field', 'users');

    expect(element.getAttribute('array-field')).toBe('users');
    expect(renderSpy).toHaveBeenCalled();
  });
});

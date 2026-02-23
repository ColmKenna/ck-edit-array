/**
 * Tests to ensure action buttons expose `part` attributes so consumers can style
 * them via ::part(). This is the RED phase test that should fail until
 * implementation is added in the component.
 */
import { EditArray } from '../../src/ck-edit-array';

describe('button part attributes', () => {
  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  it('programmatic buttons include appropriate part attributes', () => {
    const el = document.createElement('ck-edit-array') as any;
    document.body.appendChild(el);
    // Set data so render() creates items and action bar
    el.data = [{ name: 'Alice' }];
    const shadow = (el as HTMLElement).shadowRoot as ShadowRoot;
    expect(shadow).toBeTruthy();

    const edit = shadow.querySelector('button[data-action="edit"]') as HTMLButtonElement;
    const del = shadow.querySelector('button[data-action="delete"]') as HTMLButtonElement;
    const add = shadow.querySelector('.action-bar button[data-action="add"]') as HTMLButtonElement;

    expect(edit).toBeTruthy();
    expect(del).toBeTruthy();
    expect(add).toBeTruthy();

    // Expect part attributes to exist (implementation added these)
    expect(edit.getAttribute('part')).toBe('edit-button');
    expect(del.getAttribute('part')).toBe('delete-button');
    expect(add.getAttribute('part')).toBe('add-button');

  // Action bar should expose a part for external styling
  const actionBar = shadow.querySelector('.action-bar') as HTMLElement;
  expect(actionBar).toBeTruthy();
  expect(actionBar.getAttribute('part')).toBe('action-bar');

    el.remove();
  });

  it('slotted button templates are enhanced with part attributes', () => {
    const el = document.createElement('ck-edit-array') as any;
    el.innerHTML = `
      <div slot="buttons">
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    `;
    document.body.appendChild(el);
    el.data = [{ name: 'Bob' }];
    const shadow = (el as HTMLElement).shadowRoot as ShadowRoot;
    const edit = shadow.querySelector('button[data-action="edit"]') as HTMLButtonElement;
    const del = shadow.querySelector('button[data-action="delete"]') as HTMLButtonElement;

    expect(edit).toBeTruthy();
    expect(del).toBeTruthy();

    expect(edit.getAttribute('part')).toBe('edit-button');
    expect(del.getAttribute('part')).toBe('delete-button');

    el.remove();
  });
});

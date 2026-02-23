import { EditArray } from '../../src/ck-edit-array';

describe('ck-edit-array accessibility', () => {
  let el: EditArray;

  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  beforeEach(() => {
    el = document.createElement('ck-edit-array') as EditArray;
    el.innerHTML = `
      <div slot="display">
        <span data-display-for="name"></span>
      </div>
      <div slot="edit">
        <input name="name" required />
      </div>
    `;
    document.body.appendChild(el);
    el.data = [{ name: 'Alice' }];
  });

  afterEach(() => {
    el.remove();
  });

  it('renders semantic container and list roles', () => {
    const shadow = el.shadowRoot!;
    const region = shadow.querySelector('.edit-array-container') as HTMLElement;
    const list = shadow.querySelector('.edit-array-items') as HTMLElement;
    expect(region?.getAttribute('role')).toBe('region');
    expect(list?.getAttribute('role')).toBe('list');
  });

  it('marks each item as listitem with aria-label', () => {
    const item = el.shadowRoot!.querySelector('.edit-array-item') as HTMLElement;
    expect(item?.getAttribute('role')).toBe('listitem');
    expect(item?.getAttribute('aria-label')).toMatch(/Item\s+1/);
  });

  it('ensures action buttons have accessible names', () => {
    const wrapper = el.shadowRoot!.querySelector('.edit-array-item')!;
    const editBtn = wrapper.querySelector('button[data-action="edit"]') as HTMLButtonElement;
    const deleteBtn = wrapper.querySelector('button[data-action="delete"]') as HTMLButtonElement;
    expect(editBtn?.getAttribute('aria-label')).toMatch(/Edit item/);
    expect(deleteBtn?.getAttribute('aria-label')).toMatch(/Delete item/);
  });
});

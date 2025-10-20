import { EditArray } from '../../src/ck-edit-array';

describe('ck-edit-array security', () => {
  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  it('does not interpret HTML in data fields (uses textContent)', () => {
    const el = document.createElement('ck-edit-array') as EditArray;
    el.innerHTML = `
      <div slot="display">
        <span data-display-for="name"></span>
      </div>
      <div slot="edit">
        <input name="name" />
      </div>
    `;
    document.body.appendChild(el);
    el.data = [{ name: '<img src=x onerror=alert(1)>' }];

    const span = el.shadowRoot!.querySelector('[data-display-for="name"]') as HTMLElement;
    expect(span.textContent).toBe('<img src=x onerror=alert(1)>');
    expect((span as HTMLElement).innerHTML).toBe('&lt;img src=x onerror=alert(1)&gt;');
    el.remove();
  });

  it('does not allow HTML injection via updateItem', () => {
    const el = document.createElement('ck-edit-array') as EditArray;
    el.innerHTML = `
      <div slot="display">
        <span data-display-for="name"></span>
      </div>
      <div slot="edit">
        <input name="name" />
      </div>
    `;
    document.body.appendChild(el);
    el.data = [{}];
    el.updateItem(0, 'name', '<script>alert(1)</script>');

    const span = el.shadowRoot!.querySelector('[data-display-for="name"]') as HTMLElement;
    expect(span.textContent).toBe('<script>alert(1)</script>');
    expect(span.innerHTML).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    el.remove();
  });
});

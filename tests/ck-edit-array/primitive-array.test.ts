import { EditArray } from '../../src/ck-edit-array';

describe('Primitive array naming (primitive-array attribute)', () => {
  let element: EditArray;
  let container: HTMLElement;

  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    element = document.createElement('ck-edit-array') as EditArray;
    element.setAttribute('array-field', 'client.uris');

    // Provide minimal templates
    element.innerHTML = `
      <div slot="display">
        <span data-display-for="value"></span>
      </div>
      <div slot="edit">
        <input name="value" />
      </div>
    `;

    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  it('defaults to dotted child property naming (backward compat)', () => {
    element.data = [{ value: 'https://a.example' }];

    const input = element.shadowRoot?.querySelector('.edit-container input[name]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.getAttribute('name')).toBe('client.uris[0].value');
  });

  it('when primitive-array is set, generates client.uris[0] (no .value)', () => {
    element.setAttribute('primitive-array', '');
    element.data = [{ value: 'https://b.example' }];

    const input = element.shadowRoot?.querySelector('.edit-container input[name]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.getAttribute('name')).toBe('client.uris[0]');
  });

  it('still updates data via data-name="value" binding on input', () => {
    element.setAttribute('primitive-array', '');
    element.data = [{ value: 'one' }];

    const input = element.shadowRoot?.querySelector('.edit-container input[name]') as HTMLInputElement;
    expect(input).toBeTruthy();
    // Ensure the delegated input handler will see data-name="value"
    expect(input.getAttribute('data-name')).toBe('value');
  });

  it('applies direct name to display elements with [name] only when present', () => {
    // Add a named element into display for coverage
    element.innerHTML = `
      <div slot="display">
        <input name="value" />
        <span data-display-for="value"></span>
      </div>
      <div slot="edit">
        <input name="value" />
      </div>
    `;

    element.setAttribute('primitive-array', '');
    element.data = [{ value: 'uri' }];

  const sel = '.edit-array-item [data-index] input[name]';
  const displayNamed = element.shadowRoot?.querySelector(sel) as HTMLInputElement;
    // In primitive mode, display named inputs should also get prefix without ".value"
    expect(displayNamed?.getAttribute('name')).toBe('client.uris[0]');
  });
});

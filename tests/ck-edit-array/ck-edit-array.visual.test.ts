import { EditArray } from '../../src/ck-edit-array';

/**
 * Visual Regression Harness (Documentation)
 *
 * This suite provides a smoke test and comments explaining how to integrate
 * image snapshot tools if desired (e.g., jest-image-snapshot or playwright).
 */

describe('ck-edit-array visual harness (smoke)', () => {
  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  it('renders one item with display/edit areas and buttons', () => {
    const el = document.createElement('ck-edit-array') as EditArray;
    el.innerHTML = `
      <div slot="display"><span data-display-for="name"></span></div>
      <div slot="edit"><input name="name" /></div>
    `;
    document.body.appendChild(el);
    el.data = [{ name: 'Visual' }];

    const wrapper = el.shadowRoot!.querySelector('.edit-array-item');
    expect(wrapper).toBeTruthy();
    const buttons = wrapper!.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Guidance: To capture snapshots, render in a real browser (Playwright/Puppeteer)
    // and compare screenshots of el.shadowRoot.host. Keep CSS variables stable.
    el.remove();
  });
});

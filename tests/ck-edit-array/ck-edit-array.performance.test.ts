import { EditArray } from '../../src/ck-edit-array';

describe('ck-edit-array performance (sanity)', () => {
  beforeAll(() => {
    if (!customElements.get('ck-edit-array')) {
      customElements.define('ck-edit-array', EditArray);
    }
  });

  it('renders 50 items within a reasonable time in jsdom', () => {
    const el = document.createElement('ck-edit-array') as EditArray;
    el.innerHTML = `
      <div slot="display"><span data-display-for="v"></span></div>
      <div slot="edit"><input name="v" /></div>
    `;
    document.body.appendChild(el);

    const data = Array.from({ length: 50 }, (_, i) => ({ v: `Item ${i}` }));
    const start = performance.now();
    el.data = data;
    const end = performance.now();

    // jsdom timings vary by machine; assert not exorbitant
    expect(end - start).toBeLessThan(1500);
    el.remove();
  });
});

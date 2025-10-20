import '../env.js';
import '../../src/index';

/**
 * Tests for the new action bar flex layout attribute.
 * Attribute name: `action-bar-justify`
 * Accepted values: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
 * Behavior: Applies corresponding justify-content on the internal `.action-bar` flex container.
 * Default: 'start'
 */

describe('Action Bar Layout Attribute', () => {
  let element: HTMLElement;

  const getShadowStyles = (): string => {
    const root = (element as any).shadowRoot as ShadowRoot | null;
    if (!root) return '';

    const adopted = (root as any).adoptedStyleSheets as CSSStyleSheet[] | undefined;
    if (Array.isArray(adopted) && adopted.length > 0) {
      return adopted
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules ?? []).map((rule: any) => rule.cssText).join('\n');
          } catch (_err) {
            return (sheet as any).toString?.() ?? '';
          }
        })
        .join('\n');
    }

    return (root.querySelector('style')?.textContent) ?? '';
  };

  beforeEach(() => {
    element = document.createElement('ck-edit-array');
    document.body.appendChild(element);
    // Provide minimal templates so render() can proceed without warnings
    const display = document.createElement('div');
    display.setAttribute('slot', 'display');
    display.innerHTML = '<span data-display-for="name"></span>';
    element.appendChild(display);

    const edit = document.createElement('div');
    edit.setAttribute('slot', 'edit');
    edit.innerHTML = '<input name="name" />';
    element.appendChild(edit);

    // seed with one item so action bar is present and render occurs
    (element as any).data = [{ name: 'Alice' }];
  });

  afterEach(() => {
    element.remove();
  });

  it('exposes an action bar container with part and class', async () => {
    const actionBar = (element.shadowRoot as ShadowRoot).querySelector('.action-bar') as HTMLElement;
    expect(actionBar).toBeTruthy();
    expect(actionBar.getAttribute('part')).toBe('action-bar');
  });

  it('supports attribute reflection and default', () => {
    // default should behave like start
    expect((element as any).actionBarJustify ?? 'start').toBe('start');

    // set attribute to center
    element.setAttribute('action-bar-justify', 'center');
    expect(element.getAttribute('action-bar-justify')).toBe('center');
    expect((element as any).actionBarJustify).toBe('center');
  });

  it('defines justify-content rules in the shadow stylesheet', () => {
    const styles = getShadowStyles();
    // presence of action bar base display
    expect(styles).toContain('.action-bar');
    // rules for each supported variant
    expect(styles).toContain(':host([action-bar-justify="start"]) .action-bar');
    expect(styles).toContain(':host([action-bar-justify="center"]) .action-bar');
    expect(styles).toContain(':host([action-bar-justify="end"]) .action-bar');
    expect(styles).toContain(':host([action-bar-justify="space-between"]) .action-bar');
    expect(styles).toContain(':host([action-bar-justify="space-around"]) .action-bar');
    expect(styles).toContain(':host([action-bar-justify="space-evenly"]) .action-bar');
  });

  it('applies the correct justify-content for various values', () => {
    const root = (element.shadowRoot as ShadowRoot);
    const actionBar = root.querySelector('.action-bar') as HTMLElement;

    const setAndCheck = (val: string, expected: string) => {
      element.setAttribute('action-bar-justify', val);
      // Since jsdom does not compute styles, we verify via class/attribute and stylesheet presence
      expect(element.getAttribute('action-bar-justify')).toBe(val);
      // additionally ensure style rules contain expected justify-content token
      const styles = getShadowStyles();
      expect(styles).toContain(`:host([action-bar-justify="${val}"]) .action-bar`);
      expect(styles).toContain(`justify-content: ${expected}`);
      expect(actionBar).toBeTruthy();
    };

    setAndCheck('start', 'flex-start');
    setAndCheck('center', 'center');
    setAndCheck('end', 'flex-end');
    setAndCheck('space-between', 'space-between');
    setAndCheck('space-around', 'space-around');
    setAndCheck('space-evenly', 'space-evenly');
  });

  it('sanitizes/ignores unsupported values by removing attribute via setter', () => {
    (element as any).actionBarJustify = 'bogus';
    // invalid should remove attribute and revert to default getter behavior
    expect(element.hasAttribute('action-bar-justify')).toBe(false);
    expect((element as any).actionBarJustify).toBe('start');
  });
});

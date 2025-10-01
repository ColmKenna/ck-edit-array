# EditArray Web Component Refactor Plan

## Overview
- **Purpose**: keep `<ck-edit-array>` reliable while preparing for richer data-editing scenarios.
- **Primary goals**:
  - Simplify the component by teasing apart validation, rendering, and event concerns.
  - Preserve current behaviour while hardening lifecycle, error handling, and state invariants.
  - Improve testability, accessibility, and documentation for both internal and external consumers.
- **Current pain points**:
  - Duplicate lifecycle definitions override teardown logic and risk memory leaks.
  - Deprecated `updateRecord()` and `markForDeletion()` remain callable, muddying the API surface.
  - Heavy DOM churn stems from repeated `querySelector` calls and full re-renders on incremental updates.
  - Tight attribute-to-state coupling triggers redundant renders whenever the `data` attribute changes.
  - Validation helpers live inside the component, making reuse and focused testing awkward.
  - Event delegation relies on fragile `data-*` attributes scattered across cloned templates.

## Roadmap at a Glance
| Phase | Focus | Key outcomes |
| --- | --- | --- |
| 1 | Stabilize core surface | Clean lifecycle, predictable API, consistent errors |
| 2 | Module separation | Dedicated validation, rendering, and utility layers |
| 3 | Eventing & delegation | Abortable listeners, resilient action routing |
| 4 | State & data flow | Explicit item state, groundwork for history |
| 5 | Rendering & performance | Fewer DOM queries, granular updates, cached templates |
| 6 | Forms & validation UX | Deterministic names, centralized messaging |
| 7 | Accessibility & UX | Stronger ARIA, focus management, loading feedback |
| 8 | Styling & theming | Shadow parts and reduced-motion support |
| 9 | Security & data hygiene | Safe string handling and pattern guards |
| 10 | Testing & documentation | Coverage, migration guidance, and types |
| 11 | Optional enhancements | Drag & drop, filtering, keyboard support |

### Phase 1 – Stabilize Core Surface
- **1.1 Lifecycle cleanup (P0)** – Remove the duplicate `disconnectedCallback`, centralize teardown logic, and prepare the hook for AbortController-driven listener removal.
- **1.2 Attribute/state decoupling (P0)** – Treat the `data` attribute as ingress only; avoid reflecting state back to the attribute and deep-clone before storing internal state.
- **1.3 Error-handling baseline (P0)** – Ensure public methods throw typed errors (`TypeError`, `RangeError`, `ValidationError`) while internal helpers return `{ success, error }` results.
- **1.4 Deprecated API gating (P0)** – Wrap `updateRecord()` and `markForDeletion()` with warnings that redirect to the new API, annotate with `@deprecated`, and document the v2 removal path.
- **1.5 Index validation guard (P1)** – Consolidate index validation into a single helper that short-circuits on invalid input while keeping explicit throws for developer diagnostics.
- **1.6 Method naming alignment (P1)** – Standardize public methods (`addItem`, `updateItem`, `removeItem`, `toggleDeletion`) and underscore-prefixed helpers, then mirror the changes in docs and types.

### Phase 2 – Module Separation
- **2.1 Validation service extraction (P0)** – Move `testPatternValidation`, `getHelpfulValidationMessage`, and related helpers into a `ValidationService` module with dedicated unit tests.
- **2.2 DOM renderer abstraction (P1)** – Create a `DOMRenderer` responsible for cloning `display`/`edit` templates, caching them, and applying updates outside the component class.
- **2.3 Event manager wrapper (P1)** – Introduce an `EventManager` to centralize delegated input/click handling so the component describes intent instead of wiring listeners inline.
- **2.4 Utility module breakup (P2)** – Relocate pure helpers such as `coerceArray` and `deepClone` into a shared utilities module to shrink the component and aid testing.

### Phase 3 – Eventing & Delegation
- **3.1 Abortable listeners (P0)** – Instantiate `AbortController` in `connectedCallback`, bind listeners with `{ signal }`, and abort in `disconnectedCallback` to prevent leaks.
- **3.2 Delegated click normalization (P0)** – Use `event.target.closest('[data-action]')`, stop propagation, and rely on `dataset` to read actions and indices safely.
- **3.3 Central action guards (P1)** – Add helpers (e.g., `getActionIndex`) that validate numeric indices once, improving error messages and reducing inline parsing.
- **3.4 Input debouncing (P1)** – Debounce `#onInput` by ~150 ms to limit redundant updates while maintaining responsive UX.
- **3.5 Immutable event payloads (P1)** – Deep-clone and `Object.freeze` event detail objects before dispatching `change`-family events to protect consumers from accidental mutation.

### Phase 4 – State & Data Flow
- **4.1 Explicit item state model (P1)** – Track items as objects `{ data, mode, isDeleted, isDirty, validationErrors }` instead of inferring state from the DOM.
- **4.2 Command history groundwork (P2)** – Introduce a command pattern abstraction that can later power `undo()` / `redo()` while remaining opt-in for now.

### Phase 5 – Rendering & Performance
- **5.1 DOM query reduction (P0)** – Cache frequently accessed nodes (list container, action bar) so repeated `querySelector` calls disappear.
- **5.2 Fragment-based rendering (P0)** – Build lists inside a `DocumentFragment` and call `replaceChildren` once per render to minimize layout thrash.
- **5.3 Granular update hooks (P1)** – Provide `shouldUpdate(index)` and targeted refresh paths so only changed items rerender.
- **5.4 Template caching (P1)** – Cache sanitized clones of the `display` and `edit` slot content during `connectedCallback` for fast reuse.
- **5.5 Stable item keys (P1)** – Assign deterministic `data-key` values to each item to aid debugging and future diffing.
- **5.6 Element cache maps (P1)** – Store per-item nodes in `WeakMap`s to accelerate toggles, validation updates, and focus moves.

### Phase 6 – Forms & Validation UX
- **6.1 Deterministic name/id builder (P1)** – Centralize generation of `name`/`id` attributes so display and edit templates remain in sync.
- **6.2 Delegated validation events (P1)** – Handle blur/input validation through the centralized event manager to avoid per-field listeners.
- **6.3 Centralized error regions (P1)** – Prebuild an `.error-region` per item and direct validation messages there for consistent ARIA wiring.
- **6.4 Validation messaging polish (P1)** – Have `ValidationService` return structured results (`{ valid, messages }`) so UI copy and logging stay coherent.

### Phase 7 – Accessibility & UX
- **7.1 ARIA toggles (P1)** – Reflect edit/display mode via `aria-expanded`, manage focus on mode switches, and keep keyboard navigation predictable.
- **7.2 Live region updates (P1)** – Add `aria-live` announcements for add/remove/validation events so screen readers receive timely feedback.
- **7.3 Button semantics (P1)** – Synchronize visible labels with `aria-label` text whenever button state changes.
- **7.4 Deletion state affordance (P1)** – Expose deletion toggles via `aria-pressed` or descriptive `aria-describedby` messaging.
- **7.5 Loading state feedback (P1)** – Provide a `loading` attribute that disables interactions and communicates async progress.

### Phase 8 – Styling & Theming
- **8.1 Shadow parts exposure (P1)** – Add `part` attributes for list items, buttons, and error messages so hosts can style via `::part(...)`.
- **8.2 Reduced-motion support (P1)** – Respect `@media (prefers-reduced-motion: reduce)` by disabling non-essential animations and transitions.

### Phase 9 – Security & Data Hygiene
- **9.1 String handling discipline (P1)** – Continue relying on `textContent` and document sanitization expectations for any future HTML-rich content.
- **9.2 Pattern safety & caching (P1)** – Wrap dynamic `RegExp` creation in try/catch and cache compiled patterns to avoid runtime errors and redundant work.

### Phase 10 – Testing & Documentation
- **10.1 Unit test coverage (P0)** – Add Jest/Web Test Runner coverage for empty render, add/edit/delete flows, validation messaging, event payload integrity, attribute parsing, and lifecycle attach/detach.
- **10.2 Slot contract tests (P1)** – Verify behaviour when slots are missing or misconfigured and ensure generated IDs/names remain unique.
- **10.3 Documentation refresh (P1)** – Expand README/JSDoc with usage examples, custom event diagrams, migration notes, and troubleshooting guidance.
- **10.4 Type annotations (P1)** – Provide `EditArrayItem` typedefs and keep `.d.ts` definitions aligned with the final public API.

### Phase 11 – Optional Enhancements
- **11.1 Drag & drop reordering (P2)** – Enable visual reordering and emit `item-reordered` events.
- **11.2 Filtering & sorting hooks (P2)** – Support predicate/compare functions while keeping the original dataset intact.
- **11.3 Batch operations (P2)** – Allow bulk update/remove/toggle actions against a set of indices.
- **11.4 Undo/redo API (P2)** – Surface `undo()` / `redo()` built on the command history groundwork.
- **11.5 Keyboard shortcuts (P2)** – Offer Enter-to-save and Esc-to-cancel flows alongside existing buttons.

## Priority Index
- **P0**: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 5.1, 5.2, 10.1.
- **P1**: 1.5, 1.6, 2.2, 2.3, 3.3, 3.4, 3.5, 4.1, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 9.1, 9.2, 10.2, 10.3, 10.4.
- **P2**: 2.4, 4.2, 11.1, 11.2, 11.3, 11.4, 11.5.

## Breaking Changes to Assess for v2
- Remove the deprecated `updateRecord()` and `markForDeletion()` methods once migration guidance is published.
- Reshape event detail payloads to the new frozen structure while documenting the change.
- Rename internal CSS classes after `part` attributes exist to avoid unexpected downstream styling breaks.
- Make validation opt-in (or configurable) instead of automatic while providing clear upgrade instructions.

## Reference Snippets
### Delegated click guard
```js
#onDelegatedClick = (event) => {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  event.preventDefault();
  event.stopPropagation();
  const action = btn.dataset.action;
  const index = Number.isInteger(parseInt(btn.dataset.index, 10))
    ? parseInt(btn.dataset.index, 10)
    : null;
  // switch (action) { ... }
};
```

### Attribute/state decoupling
```js
set data(value) {
  const next = deepClone(this.coerceToArray(value));
  if (JSON.stringify(this.#data) === JSON.stringify(next)) return;
  this.#data = next;
  this.render();
  this.dispatchDataChange();
}
attributeChangedCallback(name, _old, next) {
  if (name === 'data') {
    this.#data = deepClone(this.coerceToArray(next));
    this.render();
    this.dispatchDataChange();
  }
}
```

### Unified disconnectedCallback
```js
disconnectedCallback() {
  const sr = this.shadowRoot;
  if (!sr) return;
  sr.removeEventListener('input', this.#onInput);
  sr.removeEventListener('click', this.#onDelegatedClick);
  this.#abort?.abort();
}
```

# EditArray Behavioral Test Plan

### 1. Module Overview
- Delivers an `<ck-edit-array>` custom element that lets consumers display, edit, and manage array-based datasets via display/edit slots.
- Supports adding items, in-place updates, deletion toggles, and validation-driven edit/save flows with automatic CustomEvent notifications.
- Depends on browser Custom Elements, Shadow DOM, constructable stylesheets (with inline `<style>` fallback), HTML form validation, and console availability for warnings.
- Exposes observable state through the shadow DOM structure, `data`/`array-field` attributes, button labels, hidden deletion markers, and bubbling events such as `change`, `item-added`, `item-updated`, `item-deleted`, and `item-change`.
- Risk areas include JSON parsing of attributes, availability of slot templates, adoptedStyleSheets support, consumer-provided field names, and DOM presence required for delegated event listeners.

### 2. Function & Method Inventory

#### `coerceArray(value)` – Normalizes arbitrary input into an array representation for the data model.

**Inputs**
- **Parameters**: `value` (any) – Accepts arrays, plain objects, primitives, JSON strings, or nullish values.
- **Preconditions**: None.
- **Context dependencies**: Relies on `JSON.parse` and `console.warn` when attempting to parse JSON strings.

**Observable Outputs**
- **Return value**: Array; returns the original array when input is already an array, wraps non-array values, returns `[]` for nullish or trimmed-empty strings.
- **Thrown exceptions**: None; malformed JSON is caught.
- **Side effects**:
  - **Console**: Warns with `EditArray: Failed to parse data attribute as JSON array` when JSON parsing fails.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Call with an array and confirm the same array reference is returned unchanged.
- Pass a plain object and confirm the result is `[object]`.
- Provide a JSON string representing an array or object and confirm it parses to an array (wrapping non-array objects).

##### ✅ **Boundary & Edge Cases**
- Supply empty string or whitespace-only string and verify the result is `[]`.
- Provide a stringified single object (`"{\"x\":1}"`) and confirm it wraps into `[parsedObject]`.
- Pass a Date instance or other non-plain object and confirm it wraps in a single-element array.

##### ✅ **Invalid Inputs**
- Pass malformed JSON (`"[{]"`) and confirm it returns `[]` without throwing.
- Provide a symbol or function and confirm they are wrapped in an array rather than rejected.
- Pass numeric primitives and confirm they are wrapped in an array.

##### ✅ **Asynchronous Behavior**
- Not applicable; function is synchronous with immediate return.

##### ✅ **Side Effect Verification**
- Assert that malformed JSON triggers exactly one `console.warn` with the documented message.
- Confirm that successful parses do not produce console output.

##### ✅ **Error Handling Tests**
- Verify malformed JSON never throws and always returns `[]`.
- Verify no other parameter type causes exceptions.

#### `coerceArrayFromAttribute(value)` – Parses attribute values into arrays with stricter JSON expectations.

**Inputs**
- **Parameters**: `value` (any) – Typically string attribute values but tolerates arrays/objects.
- **Preconditions**: Intended for attribute parsing context where malformed strings should be rejected.
- **Context dependencies**: Uses `JSON.parse`, `console.warn`, and falls back to `coerceArray` for non-string values.

**Observable Outputs**
- **Return value**: Array; returns parsed array, wraps parsed single object, returns `[]` for blank strings or invalid JSON, and mirrors `coerceArray` for non-string inputs.
- **Thrown exceptions**: None; parse errors are caught.
- **Side effects**:
  - **Console**: Warns with `EditArray: Failed to parse data attribute as JSON array` when string parsing fails.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide a JSON array string and confirm it returns the parsed array.
- Provide a JSON object string and confirm the result wraps the object in an array.
- Pass an actual array and confirm it returns the same array instance.

##### ✅ **Boundary & Edge Cases**
- Use empty string or whitespace-only string and confirm it returns `[]`.
- Provide a JSON string with extraneous whitespace and ensure trimming occurs before parsing.
- Pass numbers or booleans and verify they are coerced via `coerceArray`.

##### ✅ **Invalid Inputs**
- Supply a non-JSON string (`"foo"`) and confirm the return is `[]` and a warning is emitted.
- Pass malformed JSON and verify outcome matches blank array with warning.
- Provide `null`/`undefined` and confirm the result is `[]`.

##### ✅ **Asynchronous Behavior**
- Not applicable; fully synchronous.

##### ✅ **Side Effect Verification**
- Ensure malformed attributes trigger the warning exactly once per call.
- Confirm valid JSON strings produce no console output.

##### ✅ **Error Handling Tests**
- Verify no input causes an exception.
- Confirm malformed strings never leak parsing errors.

#### `buildNamePrefix(arrayField, index)` – Produces the sanitized name prefix used for form field names.

**Inputs**
- **Parameters**: `arrayField` (string) – Name used for grouping; `index` (number) – Item index.
- **Preconditions**: Requires a non-empty string `arrayField` and numeric `index` to produce a prefix.
- **Context dependencies**: Uses regex replacement for sanitizing characters.

**Observable Outputs**
- **Return value**: String in the form `sanitizedField[index]`, or `null` when `arrayField` is falsy or not a string.
- **Thrown exceptions**: None.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide `arrayField="users"` and `index=0` and confirm the output `users[0]`.
- Use field names containing dots (`"users.address"`) and confirm non-allowed characters convert to underscores.

##### ✅ **Boundary & Edge Cases**
- Test with `index` equal to a large number to ensure formatting remains consistent.
- Provide `arrayField` with leading/trailing whitespace and confirm it is sanitized (whitespace converted to `_`).

##### ✅ **Invalid Inputs**
- Pass `arrayField=null` or empty string and confirm the result is `null`.
- Provide a non-numeric `index` (e.g., string) and confirm the numeric coercion still appears in the bracketed portion without throwing.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- No side effects; confirm repeated calls are idempotent.

##### ✅ **Error Handling Tests**
- Confirm no inputs cause exceptions; unexpected types simply produce `null` or stringified index.

#### `computeIdPrefix(arrayField)` – Generates the sanitized prefix used for IDs inside the component.

**Inputs**
- **Parameters**: `arrayField` (string|null) – Name used in IDs.
- **Preconditions**: None; handles null/undefined.
- **Context dependencies**: Relies on regex replacements.

**Observable Outputs**
- **Return value**: Sanitized string with illegal characters replaced by `_`, or `"item"` when `arrayField` is missing or not a string.
- **Thrown exceptions**: None.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide `arrayField="users"` and confirm the returned prefix `users`.
- Provide `arrayField="users.emails"` and confirm the result `users_emails`.

##### ✅ **Boundary & Edge Cases**
- Use field names containing spaces or symbols and ensure they are converted to underscores.
- Pass extremely long field names and verify the string is returned without truncation.

##### ✅ **Invalid Inputs**
- Pass `null`/`undefined` and confirm the default `"item"` is returned.
- Provide non-string types (number, object) and ensure the fallback to `"item"`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- No side effects; confirm multiple calls are stable for identical inputs.

##### ✅ **Error Handling Tests**
- Confirm no exceptions are thrown for any input type.

#### `isValidIndex(value)` – Determines whether a value qualifies as a usable numeric index.

**Inputs**
- **Parameters**: `value` (any) – Candidate index value.
- **Preconditions**: None.
- **Context dependencies**: Relies on `Number.isNaN`.

**Observable Outputs**
- **Return value**: Boolean `true` when `value` is a number and not `NaN`; otherwise `false`.
- **Thrown exceptions**: None.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide integers (0, 5) and confirm it returns `true`.
- Provide floating numbers that are not `NaN` and confirm they return `true` (mirrors current contract).

##### ✅ **Boundary & Edge Cases**
- Test with `Number.POSITIVE_INFINITY` and confirm it returns `true` (document current behavior).
- Provide negative numbers and confirm they still return `true`, signaling downstream bounds checks are needed.

##### ✅ **Invalid Inputs**
- Pass strings, objects, or `NaN` and confirm the result is `false`.
- Pass `null`/`undefined` and confirm the result is `false`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- No side effects to verify.

##### ✅ **Error Handling Tests**
- Confirm no inputs cause exceptions.

#### `deepClone(obj)` – Creates a deep copy of plain objects, arrays, and dates to prevent external mutation.

**Inputs**
- **Parameters**: `obj` (any) – Value to clone.
- **Preconditions**: None.
- **Context dependencies**: Uses recursion and `Object.prototype.hasOwnProperty`.

**Observable Outputs**
- **Return value**: Deep copy for arrays and plain objects, duplicate Date instances, or the same value for primitives/non-objects.
- **Thrown exceptions**: None for supported structures; circular references would cause recursion overflow (documented risk).
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Clone nested objects/arrays and verify the returned value equals the source but is not the same reference.
- Clone a Date instance and confirm the new Date has the same timestamp but is a unique object.

##### ✅ **Boundary & Edge Cases**
- Clone empty arrays/objects and confirm empty structures are returned.
- Clone objects containing `undefined` or `null` values and verify they are preserved.
- Clone deeply nested objects to ensure recursion depth functions as expected.

##### ✅ **Invalid Inputs**
- Pass primitives (string, number) and confirm the value is returned unchanged.
- Document that circular references will cause a stack overflow (test should expect a thrown RangeError).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure original objects remain unchanged after modifying the clone.

##### ✅ **Error Handling Tests**
- Verify circular references throw and surface the runtime error.

#### `testPatternValidation(input)` – Evaluates pattern validity for form controls with improved browser consistency.

**Inputs**
- **Parameters**: `input` (`HTMLInputElement`) – Control under validation.
- **Preconditions**: Element should expose `validity`, `pattern`, and `value` properties.
- **Context dependencies**: Uses `RegExp` construction and `console.warn` on invalid regex strings.

**Observable Outputs**
- **Return value**: Boolean mirroring `input.validity.valid`, or explicit regex test result when browser reports pattern mismatch.
- **Thrown exceptions**: Propagates if `input` is falsy or lacks `validity` (contract violation).
- **Side effects**:
  - **Console**: Warns `EditArray: Invalid pattern regex:` when `RegExp` construction fails.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide input with valid pattern/value and confirm it returns `true`.
- Provide input with actual pattern mismatch and ensure it returns `false`.
- Provide input where browser reports mismatch but regex test passes, ensuring function returns `true`.

##### ✅ **Boundary & Edge Cases**
- Test with empty value (should rely on native validity) and confirm return matches `validity.valid`.
- Provide inputs with very long pattern strings to ensure performance remains acceptable.

##### ✅ **Invalid Inputs**
- Pass an input whose `pattern` is invalid (e.g., `"["`) and confirm it warns and returns `false`.
- Pass `null` and expect a thrown TypeError due to missing properties (document requirement for valid element).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Verify invalid regex patterns emit exactly one console warning and do not throw.

##### ✅ **Error Handling Tests**
- Confirm malformed regex strings do not propagate errors beyond returning `false`.
- Confirm contract violation (non-element parameter) throws, highlighting the need for valid inputs.

#### `getHelpfulValidationMessage(input)` – Produces user-friendly validation feedback based on native validity states.

**Inputs**
- **Parameters**: `input` (`HTMLInputElement`) – Form control to inspect.
- **Preconditions**: Control must expose standard HTML validity properties; should reside in DOM for placeholder/attributes to exist.
- **Context dependencies**: Uses `testPatternValidation`, relies on `placeholder`, `type`, `min`, `max`, etc.

**Observable Outputs**
- **Return value**: String containing specific guidance, or empty string when control is valid.
- **Thrown exceptions**: Propagates if `input` is null or lacks validity interface.
- **Side effects**: None beyond delegating to `testPatternValidation`.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide valid input and ensure it returns an empty string.
- Trigger `valueMissing` on required input and verify the required message appears.
- Trigger `typeMismatch` for email/url/tel/date/time/number and confirm the appropriate example message is returned.

##### ✅ **Boundary & Edge Cases**
- Provide placeholder-based pattern mismatch and ensure the placeholder text is embedded in the guidance.
- Trigger `rangeUnderflow`/`rangeOverflow` and confirm min/max are echoed.
- Trigger `tooShort`/`tooLong` to ensure length guidance is accurate.
- Test with pattern matching to built-in `commonPatterns` map and confirm the example text matches the map entry.

##### ✅ **Invalid Inputs**
- Pass control with invalid regex pattern to confirm it defers to fallback or placeholder messaging.
- Pass `null`/`undefined` and document that it throws; verify tests guard against improper usage.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure interacting with `testPatternValidation` does not double-log warnings; message generation should not alter DOM.

##### ✅ **Error Handling Tests**
- Verify no additional errors are thrown for unsupported validity states; ensures fallback message is returned.

#### `applyEditArrayStyles(shadowRoot)` – Injects component styles into the shadow DOM via adopted sheets or `<style>` fallback.

**Inputs**
- **Parameters**: `shadowRoot` (`ShadowRoot|null`) – Target container for styles.
- **Preconditions**: Requires a valid shadow root; silently exits otherwise.
- **Context dependencies**: Uses `CSSStyleSheet`, `adoptedStyleSheets`, DOM APIs, and `document.createElement`.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: Swallows errors when assigning `adoptedStyleSheets`; should not throw.
- **Side effects**:
  - **DOM**: Adds `EDIT_ARRAY_SHEET` to `adoptedStyleSheets` when supported, or prepends a `<style>` element containing the CSS.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- In environment supporting constructable stylesheets, confirm the sheet appears in `shadowRoot.adoptedStyleSheets` after invocation.
- In fallback environments, ensure a `<style>` tag containing `EDIT_ARRAY_CSS` is inserted as the first child.

##### ✅ **Boundary & Edge Cases**
- Call with `shadowRoot=null` and confirm it exits without error or DOM change.
- Simulate `adoptedStyleSheets` assignment throwing (e.g., read-only array) and verify it falls back to `<style>` injection.

##### ✅ **Invalid Inputs**
- Pass non-shadow objects (regular elements) and confirm method throws or gracefully exits depending on DOM API behavior (document expected DOMException).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Validate that invoking twice does not duplicate `<style>` nodes when adoptive mode succeeds; fallback should prepend additional styles—document for potential deduping tests.

##### ✅ **Error Handling Tests**
- Ensure errors from unsupported APIs are caught, preventing crashes in older browsers.

#### `new EditArray()` / `constructor` – Instantiates the custom element with default shadow DOM structure and handlers.

**Inputs**
- **Parameters**: None directly; implicitly uses element attributes.
- **Preconditions**: Custom element must be defined via `customElements.define` before DOM usage.
- **Context dependencies**: Requires DOM environment capable of creating shadow roots.

**Observable Outputs**
- **Return value**: A constructed `EditArray` element with attached shadow DOM.
- **Thrown exceptions**: DOM will throw if shadow DOM creation unsupported.
- **Side effects**:
  - **DOM**: Injects base template containing `.edit-array-container`, `.edit-array-items`, and `.action-bar` inside the shadow root.
  - **Other**: Applies component styles by calling `applyEditArrayStyles`.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Create element via `document.createElement('edit-array')` and confirm shadow DOM contains the expected container structure.
- Ensure the action bar and items container exist with appropriate roles (`role="region"`, `role="list"`).

##### ✅ **Boundary & Edge Cases**
- Instantiate multiple components and ensure each has isolated shadow DOM and styles.
- Verify constructor executes without attributes and leaves internal data as empty array.

##### ✅ **Invalid Inputs**
- Attempt instantiation in an environment lacking shadow DOM and document the resulting DOMException (contract requirement).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Confirm styles are applied once per instance and no duplicate nodes appear in successive constructions.

##### ✅ **Error Handling Tests**
- Ensure constructor does not swallow exceptions from `applyEditArrayStyles`—tests should observe fallback behavior.

#### `handleCancelAction(cancelButton)` – Cancels the creation of a new item, removing data and restoring UI state.

**Inputs**
- **Parameters**: `cancelButton` (`HTMLButtonElement`) – Button inside item wrapper initiating cancel.
- **Preconditions**: Button must reside within `.edit-array-item[data-index]`; component requires populated `#data` and event wiring.
- **Context dependencies**: Uses DOM traversal (`closest`), relies on shadow root structure, dispatches events.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None.
- **Side effects**:
  - **DOM**: Removes the wrapper from the shadow DOM; unhides the add button.
  - **Data**: Removes the matching item from `#data` (or last item when index missing).
  - **Events**: Dispatches `change` via `dispatchDataChange`.
  - **Console**: Warns when index cannot be determined.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Trigger on a newly added empty item and confirm the item is removed from DOM and data; add button becomes visible.
- Verify `change` event fires with updated data array after removal.

##### ✅ **Boundary & Edge Cases**
- Cancel with index `0` when multiple items exist and ensure only targeted item is removed.
- Invoke when wrapper is missing `data-index` to confirm fallback behavior removes last item and logs warning (covered by Jest in `EditArray Component - Branch Coverage Enhancements › add/cancel flow falls back when wrapper index metadata is missing`).

##### ✅ **Invalid Inputs**
- Pass button not attached to wrapper and ensure method exits gracefully without data mutation.
- Pass `null` to confirm the method exits without throwing (document requirement for tests to guard usage).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Validate that `change` event detail contains deep-cloned data reflecting removal.
- Confirm add button class `hidden` is removed regardless of initial state.

##### ✅ **Error Handling Tests**
- Ensure missing index path logs warning but does not throw.

#### `handleAddAction()` – Initiates creation of a new item and prepares edit mode UI.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Shadow DOM must contain `.edit-array-items` and slots must be defined for rendering edits.
- **Context dependencies**: Calls `addItem`, `renderItem`, and `toggleEditMode`; relies on slot templates and buttons.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None expected when slots exist.
- **Side effects**:
  - **Data**: Adds an empty object to `#data`.
  - **DOM**: Appends new item wrapper, switches it into edit mode, hides the add button, clears validation errors for new inputs.
  - **Events**: Dispatches `item-added` and `change` events (from `addItem`).

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Click add button and confirm new wrapper appears with edit UI visible and display UI hidden.
- Verify `item-added` and `change` events bubble with new index/info.

##### ✅ **Boundary & Edge Cases**
- Call when the action bar already lacks add button (e.g., due to hidden state) and confirm method still hides button gracefully.
- Invoke when slot templates contain validation spans to ensure clearing logic empties error messages and removes `invalid` class.

##### ✅ **Invalid Inputs**
- Simulate missing `.edit-array-items` container to ensure method exits without throwing (document expectation to set up slots before use).
- Provide templates lacking inputs and confirm clearing loops do not throw.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure add button receives `hidden` class after invocation.
- Confirm error spans under new fields have empty text content.

##### ✅ **Error Handling Tests**
- Validate absence of wrappers/logging when `renderItem` fails to create nodes (e.g., slot missing) and that method still hides add button appropriately.

#### `EditArray.observedAttributes` – Declares attributes triggering `attributeChangedCallback`.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Static method executed by the browser.
- **Context dependencies**: None.

**Observable Outputs**
- **Return value**: Array `['array-field', 'data']`.
- **Thrown exceptions**: None.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Assert the static getter returns the exact array with both attributes.

##### ✅ **Boundary & Edge Cases**
- None; document immutability expectation by freezing copy to ensure subsequent modifications do not affect original.

##### ✅ **Invalid Inputs**
- Not applicable.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Not applicable.

##### ✅ **Error Handling Tests**
- Confirm no errors occur when accessing property.

#### `validateArrayField(value)` – Normalizes and warns about unsafe `array-field` attribute values.

**Inputs**
- **Parameters**: `value` (any) – Proposed attribute value.
- **Preconditions**: None.
- **Context dependencies**: Uses regex and `console.warn` for unsafe characters.

**Observable Outputs**
- **Return value**: String when value is non-null; returns stringified input even when unsafe while issuing warning.
- **Thrown exceptions**: None.
- **Side effects**:
  - **Console**: Warns when value contains characters outside `[A-Za-z0-9_-]`.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Pass safe value and confirm it returns the same string without warning.
- Pass numeric value and confirm it stringifies without warning.

##### ✅ **Boundary & Edge Cases**
- Provide empty string and confirm it returns empty string and no warning.
- Pass extremely long value to ensure it returns full string.

- Pass string with spaces or punctuation and confirm warning is emitted yet value returned unchanged (exercised by `EditArray Component - Branch Coverage Enhancements › validateArrayField warns about unsafe characters and setter removes attribute`).
- Provide `null` and confirm the method returns `null`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure warnings are logged exactly once for unsafe characters.

##### ✅ **Error Handling Tests**
- Confirm no inputs cause exceptions.

#### `arrayField` (getter/setter) – Exposes the `array-field` attribute used in form bindings.

**Inputs**
- **Parameters**: Setter accepts `value` (string|null).
- **Preconditions**: Element must be connected to observe attribute reflection.
- **Context dependencies**: Setter leverages `validateArrayField`, interacts with DOM attributes.

**Observable Outputs**
- **Return value**: Getter returns attribute value or `null`.
- **Thrown exceptions**: Setter does not throw; invalid values are sanitized and still applied.
- **Side effects**:
  - **DOM**: Setter updates or removes the `array-field` attribute, triggering re-render.
  - **Console**: Emits warning via `validateArrayField` when unsafe.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Set safe value and confirm attribute updates and getter reflects the change.
- Remove value by setting `null` and confirm attribute is removed and getter returns `null` (captured in `EditArray Component - Branch Coverage Enhancements › validateArrayField warns about unsafe characters and setter removes attribute`).

##### ✅ **Boundary & Edge Cases**
- Set value containing dot notation and confirm attribute retains dot but sanitization occurs during name prefix usage.
- Set same value repeatedly and confirm no redundant renders beyond initial call (may require mutation observer).

##### ✅ **Invalid Inputs**
- Set value with spaces and confirm attribute retains original string but warning logs.
- Set non-string (e.g., object) and confirm it stringifies.

##### ✅ **Asynchronous Behavior**
- Not applicable; attribute updates are synchronous.

##### ✅ **Side Effect Verification**
- Observe that setting attribute triggers re-render (verify DOM updates as expected).

##### ✅ **Error Handling Tests**
- Ensure setter never throws even when warnings occur.

#### `dispatchDataChange()` – Emits the high-level `change` event whenever data array mutates.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Component must have a shadow/root context; `#data` should represent current data.
- **Context dependencies**: Uses `CustomEvent`, depends on `deepClone`.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None.
- **Side effects**:
  - **Events**: Dispatches bubbling, composed `change` event with `detail.data` deep clone.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Spy on `change` event when data updates and confirm event detail contains deep-cloned array.
- Ensure event bubbles and crosses shadow boundary (`composed: true`).

##### ✅ **Boundary & Edge Cases**
- Dispatch when data array is empty and confirm detail contains empty array.
- Invoke multiple times in quick succession and ensure events fire for each call.

##### ✅ **Invalid Inputs**
- Not applicable; method takes no arguments but confirm it handles `#data=null` gracefully (should emit `null` clone).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Validate listeners receive unique clones (mutating event detail should not change internal data).

##### ✅ **Error Handling Tests**
- Confirm method does not throw when component is disconnected (event still dispatches on element).

#### `validateIndex(index, allowOutOfBounds = false)` – Ensures numerical indices are valid for data access.

**Inputs**
- **Parameters**: `index` (number) – Candidate index; `allowOutOfBounds` (boolean) – Flag permitting extension behavior.
- **Preconditions**: `#data` length informs bounds checking.
- **Context dependencies**: Throws `TypeError`/`RangeError` using built-in errors.

**Observable Outputs**
- **Return value**: Boolean `true` when validation succeeds.
- **Thrown exceptions**: Throws `TypeError` when index is not a number; throws `RangeError` when out of bounds and `allowOutOfBounds` is false.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Validate index within bounds and confirm it returns `true`.
- Validate out-of-bounds index with `allowOutOfBounds=true` and confirm it returns `true` without error.

##### ✅ **Boundary & Edge Cases**
- Test index `-1` and expect `RangeError` when `allowOutOfBounds` false.
- Test index equal to `data.length` with `allowOutOfBounds=false` to confirm `RangeError` message includes length.

##### ✅ **Invalid Inputs**
- Pass string index and confirm `TypeError` message `index must be a number`.
- Pass `NaN` and confirm `TypeError` is thrown.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- No side effects; confirm repeated validations do not mutate data.

##### ✅ **Error Handling Tests**
- Ensure thrown errors propagate (tests should capture and assert message content).

#### `validateItem(index)` – Runs HTML validation on the edit controls for a specific item.

**Inputs**
- **Parameters**: `index` (number) – Target item index.
- **Preconditions**: Requires rendered item with `.edit-container` containing form inputs.
- **Context dependencies**: Uses DOM queries, `testPatternValidation`, `getHelpfulValidationMessage`.

**Observable Outputs**
- **Return value**: Boolean `true` when all validations pass; `false` otherwise.
- **Thrown exceptions**: Catches index validation errors internally; logs warnings instead of throwing.
- **Side effects**:
  - **DOM**: Applies `invalid` class, `aria-invalid`, `aria-describedby`, and error span text on invalid inputs; focuses first invalid input.
  - **Console**: Warns when wrapper/edit container missing.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Validate item with all inputs meeting constraints and confirm it returns `true` without DOM changes.
- Ensure pre-existing error messages remain cleared when fields already valid.

##### ✅ **Boundary & Edge Cases**
- Validate item containing optional fields only and confirm no errors appear.
- Validate when some inputs have placeholder-specified patterns and ensure error text uses placeholder example.
- Validate when item has no inputs (e.g., slot missing) and confirm method warns and returns `false`.

##### ✅ **Invalid Inputs**
- Invoke with index out of bounds and ensure it logs warning and returns `false` without throwing.
- Validate when input contains pattern mismatch to check error span text and focus behavior.

##### ✅ **Asynchronous Behavior**
- Not applicable, but tests should assert focus happens synchronously.

##### ✅ **Side Effect Verification**
- Confirm that invalid inputs receive `invalid` class and `aria-*` attributes; verify they are removed once the field becomes valid.

##### ✅ **Error Handling Tests**
- Ensure missing wrapper/edit container triggers console warnings but not exceptions (verified by `EditArray Component - Branch Coverage Enhancements › validateItem handles missing wrapper/edit container gracefully`).

#### `addItem(item = {})` – Appends a new item to the data array and emits corresponding events.

**Inputs**
- **Parameters**: `item` (object) – Optional initial data for new entry.
- **Preconditions**: None; works with empty data array.
- **Context dependencies**: Uses `deepClone`, `dispatchDataChange`, `CustomEvent`.

**Observable Outputs**
- **Return value**: Number index of new item.
- **Thrown exceptions**: None.
- **Side effects**:
  - **Data**: Pushes deep-cloned `item` onto `#data`.
  - **Events**: Dispatches `change` and `item-added` events with cloned payloads.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Add object and confirm returned index equals previous length, and emitted events contain deep-cloned item/data.
- Add without argument and confirm new item is `{}` clone.

##### ✅ **Boundary & Edge Cases**
- Add item when data array is empty and confirm index `0`.
- Add item with nested objects and ensure clones prevent external mutation.

##### ✅ **Invalid Inputs**
- Pass primitive (string/number) and confirm it is accepted, deep cloned (wrap primitives by value) and events reflect value.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Verify event detail item and data are not references to internal `#data` (mutating detail does not affect component state).

##### ✅ **Error Handling Tests**
- No errors expected; confirm method remains safe when component disconnected.

#### `updateItem(index, fieldName, value)` – Updates a specific field in the data array and syncs UI.

**Inputs**
- **Parameters**: `index` (number), `fieldName` (string), `value` (any).
- **Preconditions**: Data may auto-extend; requires display elements for UI sync.
- **Context dependencies**: Uses `validateIndex`, `deepClone`, DOM queries, events.

**Observable Outputs**
- **Return value**: Boolean `true` on success, `false` when validation fails.
- **Thrown exceptions**: Throws `TypeError` if `fieldName` is missing/empty string.
- **Side effects**:
  - **Data**: Ensures record exists and sets field to value.
  - **Events**: Dispatches `change` and `item-updated` with old/new values and clones.
  - **DOM**: Updates display elements matching `data-display-for` and `data-id` selectors with new value.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Update existing item field and confirm data updates, display text updates, and events fire with correct detail.
- Update value to `null` and confirm display text becomes `""` (stringified) per DOM behavior.

##### ✅ **Boundary & Edge Cases**
- Update at index equal to current length (forcing array extension) and confirm new sparse entries become objects.
- Update when record slot currently holds `null` and ensure method creates an object before assignment (see `EditArray Component - Branch Coverage Enhancements › updateItem creates object when existing entry is nullish`).
- Update when no matching display elements exist and ensure no errors while data/events still update.
- Update when wrapper missing and confirm data/events update even though DOM query returns null.

##### ✅ **Invalid Inputs**
- Pass `fieldName=""` and confirm `TypeError` is thrown.
- Pass index as string and ensure `validateIndex` allows via coercion? (with allowOutOfBounds true) expecting `false`/warning per current behavior.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Confirm `item-updated` detail contains `oldValue` and `value`, plus cloned item/data.
- Ensure display element updates reflect new text content immediately.

##### ✅ **Error Handling Tests**
- Confirm invalid index triggers console warning and returns `false` without throwing (covered by `EditArray Component - Branch Coverage Enhancements › updateItem warns when validateIndex reports failure`).

#### `removeItem(index)` – Deletes an item from the data array and notifies listeners.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: Index must be valid within bounds.
- **Context dependencies**: Uses `validateIndex`, `deepClone`, events, console warnings.

**Observable Outputs**
- **Return value**: Removed item object or `undefined` when invalid; method returns `null` on invalid input.
- **Thrown exceptions**: Catches validation errors and converts to warnings.
- **Side effects**:
  - **Data**: Removes item from `#data`.
  - **Events**: Dispatches `change` and `item-deleted` with cloned payloads.
  - **Console**: Logs warning on invalid indices.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Remove existing item and confirm returned item matches prior data entry (deep clone) and events fire.
- Ensure `detail.index` matches removed index and `detail.data` reflects new array state.

##### ✅ **Boundary & Edge Cases**
- Remove last item and confirm data length decreases accordingly.
- Attempt to remove from empty array and confirm method returns `null` without throwing, logging warning.

- Pass negative index or non-number and confirm warning plus `null` return (asserted in `EditArray Component - Branch Coverage Enhancements › removeItem returns null when validateIndex signals failure`).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure `change` event detail uses deep clone (mutating detail does not affect component state).

##### ✅ **Error Handling Tests**
- Confirm invalid index errors are caught and converted to warnings, preventing exceptions.

#### `toggleDeletion(index)` – Toggles the deleted state of an item and updates UI markers.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: Item wrapper must be rendered with `data-index`.
- **Context dependencies**: Uses shadow DOM queries, expects hidden marker input or creates fallback.

**Observable Outputs**
- **Return value**: Boolean representing new deletion state, or `false` when index invalid/missing DOM.
- **Thrown exceptions**: None.
- **Side effects**:
  - **DOM**: Toggles `.deleted` class on wrapper; updates/creates hidden input `[data-is-deleted-marker]` with `value` "true"/"false".
  - **Events**: Dispatches `item-change` with action `toggle-deletion`.
  - **Data**: Does not change `#data` but provides cloned copy in event detail.
  - **Console**: Warns if marker missing and fallback created.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Toggle item currently not marked and confirm DOM class added, hidden value `"true"`, and event detail `marked=true`.
- Toggle again to ensure state reverts and event detail reports `marked=false`.

##### ✅ **Boundary & Edge Cases**
- Toggle when marker input absent to ensure fallback hidden input is created and message logged once.
- Toggle on item at index `0` and highest index to ensure query selectors operate correctly.

##### ✅ **Invalid Inputs**
- Pass index out of range and confirm method returns `false` without DOM changes or events.
- Pass `NaN` and confirm method returns `false`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Confirm event detail includes deep-cloned `item` and `data` objects.
- Ensure DOM class toggles align with hidden marker value.

##### ✅ **Error Handling Tests**
- Verify fallback creation does not throw even when wrapper lacks append permissions.

#### `data` (getter/setter) – Provides external access to the component’s data array while maintaining immutability.

**Inputs**
- **Parameters**: Setter accepts `value` (Array|string|any).
- **Preconditions**: None; setter coerces as needed.
- **Context dependencies**: Uses `coerceToArray`, `deepClone`, JSON serialization for attribute reflection, `dispatchDataChange`, and `render`.

**Observable Outputs**
- **Return value**: Getter returns deep clone of `#data`; setter returns `undefined`.
- **Thrown exceptions**: Setter catches JSON serialization errors, logging warnings instead of throwing.
- **Side effects**:
  - **Data**: Setter replaces `#data` with deep clone of coerced value.
  - **DOM**: Invokes `render` causing DOM update.
  - **Attributes**: Setter syncs the `data` attribute with JSON string or removes it when empty array.
  - **Events**: Invokes `dispatchDataChange`.
  - **Console**: Warns when JSON serialization fails.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Assign array of objects and confirm getter returns deep clone, DOM renders items, and attribute contains JSON string.
- Assign empty array and confirm `data` attribute removed, DOM clears items, and change event fires (verified in `EditArray Component - Branch Coverage Enhancements › data setter removes attribute when array becomes empty`).

##### ✅ **Boundary & Edge Cases**
- Assign data via JSON string to setter (non-array) and confirm it coerces/wraps as expected.
- Assign data containing Dates or complex objects and ensure cloning preserves structure (where supported).

##### ✅ **Invalid Inputs**
- Assign malformed JSON string and ensure coercion yields empty array plus warning (through `coerceArray`).
- Assign data containing unsupported primitives such as `BigInt` and confirm JSON stringify failure triggers warning while internal state still updates (see `EditArray Component - Branch Coverage Enhancements › data setter logs when JSON.stringify fails`).

##### ✅ **Asynchronous Behavior**
- Rendering occurs synchronously; confirm DOM updates happen without awaiting microtasks.

##### ✅ **Side Effect Verification**
- Observe emitted `change` event after setter invocation.
- Confirm DOM matches new data (correct number of `.edit-array-item` elements).

##### ✅ **Error Handling Tests**
- Ensure JSON serialization failures are caught and logged without throwing (asserted by the BigInt scenario in `EditArray Component - Branch Coverage Enhancements`).

#### `coerceToArray(value)` – Exposes `coerceArray` as an instance method for compatibility.

**Inputs**
- **Parameters**: `value` (any).
- **Preconditions**: None.
- **Context dependencies**: Delegates to `coerceArray`.

**Observable Outputs**
- **Return value**: Result of `coerceArray`.
- **Thrown exceptions**: Mirrors `coerceArray` (none).
- **Side effects**: Console warnings on invalid JSON.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Forward sample inputs and ensure outputs match `coerceArray` behavior.

##### ✅ **Boundary & Edge Cases**
- Confirm method remains available for backward compatibility even when called before connection.

##### ✅ **Invalid Inputs**
- Same as `coerceArray`; verify warnings propagate.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure warnings appear on the component instance (not global) when malformed JSON encountered.

##### ✅ **Error Handling Tests**
- Confirm no additional errors introduced.

#### `attributeChangedCallback(name, oldValue, newValue)` – Reacts to observed attribute changes and syncs data/rendering.

**Inputs**
- **Parameters**: `name` (string), `oldValue` (string|null), `newValue` (string|null).
- **Preconditions**: Component registered with observed attributes.
- **Context dependencies**: Uses `coerceArrayFromAttribute`, `deepClone`, `render`, `dispatchDataChange`.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None; catch logic ensures data array resets safely.
- **Side effects**:
  - **Data**: Updates `#data` to clone of parsed attribute.
  - **DOM**: Re-renders items when `data` or `array-field` changes.
  - **Events**: Dispatches `change` event whenever `data` attribute updates.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Set `data` attribute to JSON array and confirm component renders items and emits `change` exactly once per update.
- Remove `data` attribute and ensure data array resets to empty and component clears items (tracked by `EditArray Component - Branch Coverage Enhancements › attributeChangedCallback resets data when data attribute removed`).
- Update `array-field` attribute and confirm DOM re-renders with updated name/id prefixes (covered by `EditArray Component - Branch Coverage Enhancements › attributeChangedCallback rerenders when array-field changes`).

##### ✅ **Boundary & Edge Cases**
- Set `data` attribute to blank string and confirm data resets to empty array.
- Set attribute to JSON object string and confirm it wraps into array and re-renders.

##### ✅ **Invalid Inputs**
- Set `data` attribute to malformed JSON and confirm component falls back to empty array and emits warning (from coercion).

##### ✅ **Asynchronous Behavior**
- Attribute updates processed synchronously by browser; confirm no duplicate renders when attribute set to same value.

##### ✅ **Side Effect Verification**
- Validate `change` event detail contains clone of parsed data after attribute updates.

##### ✅ **Error Handling Tests**
- Ensure method handles repeated updates without throwing even when JSON parse fails.

#### `connectedCallback()` – Handles initial setup when component is inserted into DOM.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Component has optional `data` attribute; slots should already be in place.
- **Context dependencies**: Uses `coerceArrayFromAttribute`, attaches event listeners, triggers `render`.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None expected.
- **Side effects**:
  - **Data**: Initializes `#data` from `data` attribute if present.
  - **DOM**: Calls `render` populating shadow DOM.
  - **Events**: Registers delegated `input` and `click` listeners on shadow root.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Insert element with pre-populated `data` attribute and confirm data array, render, and listeners attach.
- Insert without data attribute and ensure render handles empty array (no items rendered, but action bar prepared on demand).

##### ✅ **Boundary & Edge Cases**
- Insert component multiple times (move in DOM) and ensure listeners not duplicated.
- Ensure calling `connectedCallback` after manual detachment reattaches listeners and re-renders.

##### ✅ **Invalid Inputs**
- Not applicable; lifecycle method baseline. Document expectation that missing slot templates will trigger warnings only when rendering items.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Verify event listeners respond to delegated events after connection.

##### ✅ **Error Handling Tests**
- Ensure JSON parse failures from attribute do not prevent connection.

#### `disconnectedCallback()` – Cleans up event listeners when component is removed.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Component previously connected.
- **Context dependencies**: Uses `removeEventListener` on shadow root.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None.
- **Side effects**:
  - **Other**: Removes delegated `input` and `click` listeners to avoid leaks.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Disconnect component and verify subsequent simulated `click`/`input` events in shadow DOM no longer trigger handlers.

##### ✅ **Boundary & Edge Cases**
- Call when shadow root already nullified and confirm no errors (method checks `this.shadowRoot`).

##### ✅ **Invalid Inputs**
- Not applicable.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure listeners are effectively removed by spying on handler invocation counts.

##### ✅ **Error Handling Tests**
- Confirm method executes safely even if called multiple times consecutively.

#### `editSlotTemplate(index, item)` – Clones the edit slot template and configures bindings for a particular item.

**Inputs**
- **Parameters**: `index` (number), `item` (object).
- **Preconditions**: Host must provide an element with `slot="edit"`.
- **Context dependencies**: Uses `querySelector`, `cloneNode`, `buildNamePrefix`, `testPatternValidation`, `getHelpfulValidationMessage`.

**Observable Outputs**
- **Return value**: Cloned element or `null` when slot missing.
- **Thrown exceptions**: Throws `TypeError` if `index` not a number; warns when slot missing.
- **Side effects**:
  - **DOM**: Creates clone, sets `data-index`, rewrites `name` attributes, unique IDs, attaches data attributes, inserts error span siblings, attaches event listeners on inputs.
  - **Console**: Warns when slot missing.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Provide valid slot template and confirm clone contains inputs with data attributes (`data-name`, `data-index`) and unique IDs/prefix.
- Verify inputs pre-populate values from `item` where keys exist.
- Ensure error spans are inserted after each input with `role="alert"` and `aria-live="polite"`.

##### ✅ **Boundary & Edge Cases**
- Clone when item lacks some fields and ensure only existing keys populate values.
- Use template with nested IDs to ensure prefixing occurs without collisions.

##### ✅ **Invalid Inputs**
- Call with non-numeric index and expect `TypeError`.
- Call when edit slot missing and ensure method logs warning and returns `null`.

##### ✅ **Asynchronous Behavior**
- Not applicable; event listeners attach synchronously but deliver behavior on future events (covered in integration tests).

##### ✅ **Side Effect Verification**
- Ensure event listeners (blur/input) update error spans when inputs become valid/invalid.

##### ✅ **Error Handling Tests**
- Confirm failure to create clone (e.g., slot not element) results in warning without crash.

#### `displaySlotTemplate(index, item)` – Clones the display slot template and populates fields for presentation.

**Inputs**
- **Parameters**: `index` (number), `item` (object).
- **Preconditions**: Slot `display` must exist.
- **Context dependencies**: Uses `buildNamePrefix`, `computeIdPrefix`.

**Observable Outputs**
- **Return value**: Clone or `null` when slot missing.
- **Thrown exceptions**: Throws `TypeError` for non-numeric index; warns when slot missing.
- **Side effects**:
  - **DOM**: Cloned element gets `data-index`, names adjusted, ID prefixes applied, `data-display-for` fields populated with item values.
  - **Console**: Warns when slot missing.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Clone display template and confirm spans with `data-display-for` show corresponding field values.
- Verify `data-id` attributes follow `{idPrefix}_{index}__{field}` format.

##### ✅ **Boundary & Edge Cases**
- Provide item missing some fields and confirm unmatched displays remain empty.
- Test with nested display elements containing `name` attributes to ensure they get prefixed appropriately.

##### ✅ **Invalid Inputs**
- Pass invalid index and expect `TypeError`.
- Remove display slot and confirm method logs warning and returns `null`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure clone is detached (not inserted) allowing tests to inspect before insertion.

##### ✅ **Error Handling Tests**
- Confirm method handles non-object `item` gracefully (no value population) without throwing.

#### `updateRecord(index, fieldName, value)` – Deprecated wrapper that throws legacy errors before delegating to `updateItem`.

**Inputs**
- **Parameters**: same as `updateItem`.
- **Preconditions**: Maintains legacy contract requiring numeric index and non-empty string `fieldName`.
- **Context dependencies**: Emits console warning, calls `updateItem`.

**Observable Outputs**
- **Return value**: `undefined` (result of `updateItem` not returned).
- **Thrown exceptions**: Throws generic `Error` when index not number or fieldName invalid.
- **Side effects**:
  - **Console**: Warns `updateRecord()` is deprecated.
  - **Data/Events/DOM**: Same as `updateItem` through delegation.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Call with valid inputs and confirm console warns once and underlying data/events behave identical to `updateItem`.

##### ✅ **Boundary & Edge Cases**
- Invoke on indices beyond length to ensure array extension still occurs via `updateItem`.

##### ✅ **Invalid Inputs**
- Pass non-numeric index and assert thrown Error message `index must be a number`.
- Pass empty `fieldName` and expect thrown Error `fieldName must be a non-empty string`.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure warning logged for every invocation, enabling tests to assert deprecation notice.

##### ✅ **Error Handling Tests**
- Confirm thrown errors do not trigger `updateItem` side effects when validation fails.

#### `toggleEditMode(index)` – Switches between display and edit states for a given item, enforcing validation on exit.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: Wrapper must exist with edit/display containers and edit button; validation requires inputs.
- **Context dependencies**: Uses DOM queries, `validateItem`.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None; fails silently when wrapper missing.
- **Side effects**:
  - **DOM**: Toggles `.hidden` class on edit/display containers; updates edit button text to save/edit labels; re-reveals add button after successful save.
  - **Console**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Toggle from display to edit and confirm edit container visible, display hidden, button text becomes save label.
- Toggle back after valid inputs and confirm validation passes, display visible, button text resets to edit label, add button reappears.

##### ✅ **Boundary & Edge Cases**
- Toggle on item lacking edit container and confirm method exits without errors.
- Ensure add button only becomes visible when validation succeeds; if validation fails, state remains in edit mode.

##### ✅ **Invalid Inputs**
- Call with invalid index (missing wrapper) and confirm no exception.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Confirm validation errors prevent closing edit mode and add button remains hidden.

##### ✅ **Error Handling Tests**
- Ensure no errors thrown when edit button text attributes missing (uses default strings).

#### `markForDeletion(index)` – Deprecated alias for `toggleDeletion` with deprecation warning.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: Same as `toggleDeletion`.
- **Context dependencies**: Emits warning, delegates to `toggleDeletion`.

**Observable Outputs**
- **Return value**: Boolean new state.
- **Thrown exceptions**: None.
- **Side effects**:
  - **Console**: Warns deprecation.
  - **DOM/Events**: Same as `toggleDeletion`.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Call and confirm it toggles deletion state identically while logging deprecation warning (asserted in `EditArray Component - Branch Coverage Enhancements › delete button delegates through markForDeletion with warning`).

##### ✅ **Boundary & Edge Cases**
- Invoke on already deleted item to ensure state toggles back.

##### ✅ **Invalid Inputs**
- Call with invalid index and confirm `false` returned and no events fired.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure warning logs for each use, enabling detection of legacy API usage.

##### ✅ **Error Handling Tests**
- Confirm no exceptions thrown even when toggle fails due to missing DOM.

#### `renderItem(container, item, index)` – Builds and appends the full wrapper for a single item, including buttons.

**Inputs**
- **Parameters**: `container` (Element), `item` (object), `index` (number).
- **Preconditions**: Container must exist; slots must be defined for clones.
- **Context dependencies**: Uses `displaySlotTemplate`, `editSlotTemplate`, creates buttons.

**Observable Outputs**
- **Return value**: Wrapper element appended to container.
- **Thrown exceptions**: Propagates errors from template methods (e.g., invalid index).
- **Side effects**:
  - **DOM**: Appends wrapper with display clone, edit container (hidden), edit/delete buttons, conditional cancel button for empty items.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Render item with content and confirm resulting wrapper structure includes display and edit sections plus edit/delete buttons.
- For empty `item`, verify cancel button is appended and `aria-label` attributes reflect index.

##### ✅ **Boundary & Edge Cases**
- Render when display template returns `null` and ensure wrapper lacks display but still renders edit controls.
- Render when edit template returns `null` and confirm wrapper still created with buttons.

##### ✅ **Invalid Inputs**
- Pass non-element container and expect DOM exception; document requirement for valid container.
- Pass invalid index resulting in thrown TypeError from template methods.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Verify wrapper `data-index` attribute matches index and `role="listitem"` is present.

##### ✅ **Error Handling Tests**
- Ensure failures in template cloning do not prevent button creation.

#### `createCancelButton(_wrapper)` – Generates the cancel button element used for new, unsaved items.

**Inputs**
- **Parameters**: `_wrapper` (Element) – Currently unused but reserved.
- **Preconditions**: Component attributes may supply custom label.

**Observable Outputs**
- **Return value**: Button element with text label.
- **Thrown exceptions**: None.
- **Side effects**: None (element not attached).

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Call and confirm returned button has class `btn btn-sm btn-danger`, `data-action="cancel"`, and `aria-label` referencing cancel action.
- Set `cancel-label` attribute before call and ensure text matches custom label.

##### ✅ **Boundary & Edge Cases**
- Invoke multiple times and ensure each button is newly created (different references).

##### ✅ **Invalid Inputs**
- None; method ignores parameter.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure button not auto-attached to DOM; caller controls placement.

##### ✅ **Error Handling Tests**
- Not applicable; no failure pathways.

#### `createDeleteButton(index)` – Produces the delete button element for an item.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: None; uses index for labeling.

**Observable Outputs**
- **Return value**: Button element.
- **Thrown exceptions**: None.
- **Side effects**: None (element creation only).

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Confirm button has classes, `data-action="delete"`, `data-index` string matches index, and `aria-label` includes 1-based position.
- Set `delete-label` attribute and ensure text updates.

##### ✅ **Boundary & Edge Cases**
- Provide large index and confirm label updates accordingly.

##### ✅ **Invalid Inputs**
- Pass non-number index and confirm string coercion results (e.g., `'NaN'`) without errors; document behavior.

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Ensure each call yields distinct element instance.

##### ✅ **Error Handling Tests**
- Not applicable.

#### `createEditButton(index)` – Produces the edit/save toggle button for an item.

**Inputs**
- **Parameters**: `index` (number).
- **Preconditions**: None.

**Observable Outputs**
- **Return value**: Button element.
- **Thrown exceptions**: None.
- **Side effects**: None.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Verify default text `Edit`, class names, `data-action="edit"`, `data-index`, and `aria-label` computed from index.
- Set `edit-label` attribute and ensure text honors attribute.

##### ✅ **Boundary & Edge Cases**
- Provide `index=0` and confirm aria-label `Edit item 1`.

##### ✅ **Invalid Inputs**
- Pass `NaN` and document attribute string `"NaN"` (contract expectation).

##### ✅ **Asynchronous Behavior**
- Not applicable.

##### ✅ **Side Effect Verification**
- Confirm each call returns a fresh element ready for DOM insertion.

##### ✅ **Error Handling Tests**
- Not applicable.

#### `render()` – Rebuilds the item list and action bar based on current data.

**Inputs**
- **Parameters**: None.
- **Preconditions**: Shadow DOM must contain `.edit-array-container`, `.edit-array-items`, and `.action-bar`.
- **Context dependencies**: Uses `renderItem`, DOM manipulation.

**Observable Outputs**
- **Return value**: None.
- **Thrown exceptions**: None when containers exist.
- **Side effects**:
  - **DOM**: Clears items container, repopulates wrappers for each data entry, recreates action bar with Add button when data not empty.
  - **Other**: Add button assigned ID `${this.id}-add-btn`.

**Test Scenarios**

##### ✅ **Happy Path Tests**
- Populate data with multiple items and ensure render creates matching number of wrappers and reinitializes action bar with Add button.
- Verify Add button receives ID even when host element lacks ID (resulting in `-add-btn`).

##### ✅ **Boundary & Edge Cases**
- Render when data array empty and confirm items container cleared and Add button is **not** rendered (documented behavior).
- Render after data setter invoked with identical array to ensure idempotent DOM (optional diff check).

##### ✅ **Invalid Inputs**
- Confirm absence of `.edit-array-items` container results in early return without exceptions (makes misconfiguration observable).

##### ✅ **Asynchronous Behavior**
- Not applicable; rendering is synchronous.

##### ✅ **Side Effect Verification**
- Ensure previous DOM nodes removed before re-render (no duplicates after repeated calls).

##### ✅ **Error Handling Tests**
- Confirm method handles slots returning `null` by still creating wrappers with available sections.

### 3. Async & Side Effect Integration Tests

#### **Concurrent Operations**
- Simulate rapid successive `handleAddAction` calls before previous additions exit edit mode; verify add button hides during each edit and data array gains entries sequentially without duplicate events.
- Trigger `toggleEditMode` on multiple items quickly (e.g., via delegated clicks) to ensure validation gating prevents simultaneous saves from conflicting and event order matches invocation order.

#### **Lifecycle & Cleanup**
- Connect component, register external listeners, then disconnect and ensure subsequent shadow DOM interactions (input/change) no longer trigger handlers, confirming cleanup.
- Instantiate and discard multiple components to verify no stray `<style>` nodes or event handlers remain in document.

#### **Stateful Interactions**
- Set `data` attribute while an item is in edit mode and confirm re-render resets UI consistently, without leaving orphaned validation classes.
- Toggle deletion state, then update the same item via `updateItem` to confirm data changes persist while DOM deletion state remains accurate.
- Remove item and ensure subsequent indices are updated in DOM (data-index attributes re-rendered), preventing stale references.

#### **Network Resilience**
- Not directly applicable; instead verify behavior when events bubble to potential network handlers: ensure repeated `change` events fire for manual `data` setter usage, enabling consumers to sync with network state.

### 4. Coverage Matrix

| Function | Return | Error | DOM | Network | Storage | Events | Timers | Console | Other |
|----------|--------|-------|-----|---------|---------|--------|--------|---------|-------|
| `coerceArray()` | ✓ | - | - | - | - | - | - | ✓ | - |
| `coerceArrayFromAttribute()` | ✓ | - | - | - | - | - | - | ✓ | - |
| `buildNamePrefix()` | ✓ | - | - | - | - | - | - | - | - |
| `computeIdPrefix()` | ✓ | - | - | - | - | - | - | - | - |
| `isValidIndex()` | ✓ | - | - | - | - | - | - | - | - |
| `deepClone()` | ✓ | ✓ | - | - | - | - | - | - | - |
| `testPatternValidation()` | ✓ | ✓ | - | - | - | - | - | ✓ | - |
| `getHelpfulValidationMessage()` | ✓ | ✓ | - | - | - | - | - | - | - |
| `applyEditArrayStyles()` | - | - | ✓ | - | - | - | - | - | - |
| `EditArray constructor` | - | ✓ | ✓ | - | - | - | - | - | - |
| `handleCancelAction()` | - | - | ✓ | - | - | ✓ | - | ✓ | - |
| `handleAddAction()` | - | - | ✓ | - | - | ✓ | - | - | - |
| `observedAttributes` | ✓ | - | - | - | - | - | - | - | - |
| `validateArrayField()` | ✓ | - | - | - | - | - | - | ✓ | - |
| `arrayField` getter | ✓ | - | - | - | - | - | - | - | - |
| `arrayField` setter | - | - | ✓ | - | - | - | - | ✓ | - |
| `dispatchDataChange()` | - | - | - | - | - | ✓ | - | - | - |
| `validateIndex()` | ✓ | ✓ | - | - | - | - | - | - | - |
| `validateItem()` | ✓ | - | ✓ | - | - | - | - | ✓ | - |
| `addItem()` | ✓ | - | - | - | - | ✓ | - | - | - |
| `updateItem()` | ✓ | ✓ | ✓ | - | - | ✓ | - | - | - |
| `removeItem()` | ✓ | - | - | - | - | ✓ | - | ✓ | - |
| `toggleDeletion()` | ✓ | - | ✓ | - | - | ✓ | - | ✓ | - |
| `data` getter | ✓ | - | - | - | - | - | - | - | - |
| `data` setter | - | - | ✓ | - | - | ✓ | - | ✓ | - |
| `coerceToArray()` | ✓ | - | - | - | - | - | - | ✓ | - |
| `attributeChangedCallback()` | - | - | ✓ | - | - | ✓ | - | ✓ | - |
| `connectedCallback()` | - | - | ✓ | - | - | - | - | - | ✓ |
| `disconnectedCallback()` | - | - | - | - | - | - | - | - | ✓ |
| `editSlotTemplate()` | ✓ | ✓ | ✓ | - | - | - | - | ✓ | - |
| `displaySlotTemplate()` | ✓ | ✓ | ✓ | - | - | - | - | ✓ | - |
| `updateRecord()` | - | ✓ | ✓ | - | - | ✓ | - | ✓ | - |
| `toggleEditMode()` | - | - | ✓ | - | - | - | - | - | - |
| `markForDeletion()` | ✓ | - | ✓ | - | - | ✓ | - | ✓ | - |
| `renderItem()` | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| `createCancelButton()` | ✓ | - | - | - | - | - | - | - | - |
| `createDeleteButton()` | ✓ | - | - | - | - | - | - | - | - |
| `createEditButton()` | ✓ | - | - | - | - | - | - | - | - |
| `render()` | - | - | ✓ | - | - | - | - | - | - |

### 5. Test Prioritization

#### 🔴 Critical (P0)
- Verify data setter/getter flows: setting `data`, rendering list, and ensuring `change` events emit deep clones.
- Validate `updateItem`/`removeItem` operations emit correct events and update DOM, including error handling for invalid inputs.
- Test `toggleEditMode` with validation failures to ensure users cannot save invalid data and add button remains hidden until resolution.
- Confirm lifecycle methods (`connectedCallback`, `disconnectedCallback`) attach/detach handlers correctly to prevent memory leaks or stale interactions.

#### 🟡 High (P1)
- Exercise attribute changes (`attributeChangedCallback`) with malformed JSON and ensure safe fallback plus warning.
- Validate deletion flow (`toggleDeletion`, `markForDeletion`) updates DOM markers, hidden inputs, and events consistently.
- Test `handleAddAction`/`handleCancelAction` interplay to ensure new-item workflows behave with repeated rapid operations.
- Confirm slot template cloning (`editSlotTemplate`, `displaySlotTemplate`) handles missing elements gracefully while logging warnings.

#### 🟢 Medium (P2)
- Assess helper utilities (`coerceArray`, `coerceArrayFromAttribute`, `buildNamePrefix`, `computeIdPrefix`) for edge input handling.
- Validate styling injection (`applyEditArrayStyles`) across browsers with/without constructable stylesheets.
- Exercise deprecated APIs (`updateRecord`, `markForDeletion`) ensuring warnings log and delegation works.
- Confirm button factory methods return correctly configured elements even with custom labels or unusual indices.

### 6. Open Questions
- Should `render()` display an Add button when the data array is empty, or is the current behavior (no add button until data exists) intentional?
- What is the expected behavior when `updateItem` receives an index beyond the current length—should silent array extension remain supported, or should it warn/fail?
- When `handleCancelAction` cannot resolve an index and removes the last item, is that fallback acceptable, or should it refuse to act?
- Are there requirements for handling circular data structures passed to the `data` setter, or should the setter reject them instead of logging a warning?
- Should helper methods such as `createDeleteButton` tolerate non-numeric indices, or should they enforce numeric validation?
- Are console warnings part of the public contract (needing assertion), or should they be suppressed in production builds?

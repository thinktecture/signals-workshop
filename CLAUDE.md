# Angular Frontend Guidelines

## TypeScript

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid `any`; use `unknown` when type is uncertain
- Always use `{}` for `if`/`else`/`for`/`while` blocks — no shorthand single-line bodies

## Angular

### Components

- Standalone components only — do NOT set `standalone: true` (it's the default in Angular v20+)
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on all components
- Use `input()` and `output()` functions instead of decorators
- Mark any property that should never be reassigned as `readonly`: `input()`, `model()`, `output()`, query properties (`viewChild`, etc.), `signal()`, `computed()`, `httpResource()`, `form()`, `inject()`
- Use `protected` on members only used by the template (signals, computed, httpResource, methods) — not on inputs/outputs/models, which are public API
- Put host bindings in the `host` object of `@Component`/`@Directive` — not `@HostBinding`/`@HostListener`
- Prefer inline templates for small components; external template paths are relative to the component TS file
- Use `class` bindings instead of `ngClass`; `style` bindings instead of `ngStyle`
- Implement lazy loading for feature routes
- Use `withComponentInputBinding()` in the router config so route parameters are bound as component inputs automatically — do NOT inject `ActivatedRoute` to read route params
- Use `[routerLink]` in templates for navigation — do NOT call `router.navigate()` imperatively unless the navigation is triggered by logic that cannot live in a template
- Use `NgOptimizedImage` for static images (does not work for inline base64)

### State

- Use signals for local state; `computed()` for derived state
- Do NOT use `mutate` on signals; use `update` or `set`
- Use Signal Forms — not Template-driven (ngModel) or Reactive forms (FormGroup/FormControl)
- Use `afterRenderEffect()` for DOM operations that depend on signal state — it tracks signals like `effect()` but runs after Angular has updated the DOM

### Async Reactivity

- Use `httpResource` for GET requests; the first argument must be a function: `() => '/api/path'`
  - Use `{ defaultValue: [] }` to avoid `undefined` for collection results
  - Return `undefined` from the URL function to skip the request (e.g. when no param is selected yet)
- Use `rxResource` for requests requiring Observable loaders

### Templates

- Use native control flow: `@if`, `@for`, `@switch` — not `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not write arrow functions in templates
- Do not assume globals like `new Date()` are available

### Services

- Single responsibility per service; use `providedIn: 'root'` for singletons
- Use `inject()` — not constructor injection

## Signal Forms

Signal Forms manage form state using Angular signals for automatic synchronization between data model and UI.

### Creating Forms (5 Steps)

1. **Define model as signal**:

   ```typescript
   model = signal({
     email: '',
     password: '',
   });
   ```

2. **Create form with `form()` function**:

   ```typescript
   myForm = form(this.model, (schema) => {
     required(schema.email);
     email(schema.email);
   });
   ```

3. **Bind with `[formField]` directive**:

   ```html
   <input [formField]="myForm.email" />
   ```

4. **Access field state**:

   ```typescript
   myForm.email(); // Returns FieldState
   myForm.email().value(); // Current value
   myForm.email().valid(); // Validation status
   myForm.email().touched(); // User interaction
   ```

5. **Update programmatically**:
   ```typescript
   myForm.email().value.set('new@email.com');
   // Model automatically updates
   ```

### Validation and Field Rules

Apply validators and field rules in the schema function. They all follow the same pattern — import from `@angular/forms/signals` and call inside the schema:

```typescript
import { disabled, form, FormField, hidden, readonly, required } from '@angular/forms/signals';

myForm = form(this.model, (schema) => {
  // Validators
  required(schema.field, { message: 'Required' });
  email(schema.field);
  minLength(schema.field, 5);
  maxLength(schema.field, 100);
  pattern(schema.field, /regex/);

  // Reactive field state — pass a signal getter as the condition
  disabled(schema.field, () => this.isLocked());
  readonly(schema.field, () => this.isReadonly());
  hidden(schema.field, () => this.isHidden());
});
```

- Do NOT use `[disabled]="..."` on elements that also have `[formField]` — this causes a compiler error (NG8022).
- The condition argument is a signal getter (arrow function that reads a signal).
- The arrow function can receive `{ value, valueOf }` as a parameter to reactively read field values:
  - `value()` — the current value of the field the rule is applied to
  - `valueOf(schemaPath.otherField)` — the current value of any other field in the form

```typescript
myForm = form(this.model, (schema) => {
  max(schema.quantity, ({ valueOf }) => {
    const item = valueOf(schema.item);
    return item === 'widget' ? 100 : 50;
  });
});
```

### Async Validation

Use `validateAsync` for async field validators (e.g. availability checks). The `factory` must return a `ResourceRef` — use Angular's `resource()` from `@angular/core`. The `params` signal receives `undefined` when validation shouldn't run (e.g. sync validators failed).

```typescript
import { resource } from '@angular/core';
import { validateAsync } from '@angular/forms/signals';

validateAsync(path.username, {
  params: (ctx) => ctx.value(),
  factory: (params) =>
    resource({
      params,
      loader: async ({ params: username }) => {
        // username is never undefined here - resource skips loader when params is undefined
        const result = await checkAvailability(username);
        return result.available;
      },
    }),
  onSuccess: (isAvailable) =>
    isAvailable ? null : { kind: 'username-taken', message: 'Username is already taken' },
  onError: () => ({ kind: 'check-failed', message: 'Could not check availability' }),
});
```

- `onSuccess` / `onError` return `TreeValidationResult`: `null | undefined | void` for no error, or `{ kind: string, message?: string, fieldTree?: FieldTree }` for an error.
- Async validation only runs after all sync validators for that field pass.
- While async validation is running, `fieldState.pending()` is `true`.

### Field State Signals

- `value()` - Current value
- `valid()` - Passes validators
- `touched()` - User focused/blurred
- `dirty()` - User modified
- `disabled()` - Field disabled
- `pending()` - Async validation in progress
- `submitting()` - Form submission in progress (field level reflects form)
- `errors()` - Validation errors

### Key Points

- Import: `import { form, FormField, required } from '@angular/forms/signals'`
- Imports: Add `FormField` to component imports
- Two-way binding happens automatically via signals
- Access form state by calling form as function: `myForm().invalid()`

## Accessibility

- Must pass all AXE checks
- Must follow WCAG AA minimums: focus management, color contrast, ARIA attributes

## Verification

After making changes, run `npm run prettier` to format, then `npm run build` and `npm run lint` to verify. The Angular compiler catches both TypeScript and template errors.

Use `agent-browser` to visually inspect the running app (dev server at `http://localhost:4200`):

```bash
agent-browser open http://localhost:4200   # navigate
agent-browser screenshot /tmp/out.png      # capture current view
agent-browser reload                       # reload after rebuild
agent-browser snapshot                     # accessibility tree (for element refs)
agent-browser click @e5                    # interact by ref
```

Run `agent-browser --help` for the full command reference.

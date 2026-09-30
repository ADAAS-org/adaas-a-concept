# Known issues & wanted features — @adaas/a-concept

Found while building apps on the framework. Each entry: what happens, where, and the workaround apps currently use.

_No open issues._

## Fixed

### C-F1. ASEID regexp rejected `_` (and accepted `|`) in ids (was C-1)
- The character classes were written as `[a-z|A-Z|0-9|-]`, so `|` was accepted and `_` was rejected. `generateASEID({ id: "wf_abc" })` succeeded, but `fromJSON` / `ASEID.compare` then threw on the same string.
- Fixed in `src/lib/ASEID/ASEID.class.ts`:
  - `ASEID.regexp` is now `^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+:[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.-]+(@v[0-9.]+|@lts)?$`.
  - Object construction now validates its parts too, so both paths agree:
    - The entity uses `entityRegexp` (allows `.`, e.g. `keydown.enter`).
    - The id and shard use `partRegexp` (no `.`, because `.` separates shard from id).
- The `fromJSON` → `fromRecord` override in the a-automation lib entities is no longer needed.
- Tests: `tests/ASEID.test.ts`.

### C-F2. Warn on duplicate `static entity` names in one scope (was C-2)
- `A_Scope` now warns once when two unrelated entity classes registered in a scope chain share the same `entity` name. Subclasses that inherit the name don't trigger it. Resolving by entity string is still first-match, so keep entity names unique.
- Test: `tests/A-Scope.test.ts`.

### C-F3. Warning when several copies of `@adaas/a-concept` are loaded
- `A_Context.getInstance()` sets a `globalThis[Symbol.for('adaas.a-concept.runtime')]` marker. It warns (`[a-concept] Multiple copies of @adaas/a-concept are loaded...`) when a different copy has already registered. A duplicate copy means separate contexts and metadata, so decorators from one copy are invisible to the other; see ARE-3 in `@adaas/are`. The check is skipped under jest.
- Test: `tests/A-Context.register.test.ts`.

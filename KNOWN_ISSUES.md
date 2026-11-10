# Known issues & wanted features — @adaas/a-concept

Found while building apps on the framework. Each entry: what happens, where, and the workaround apps currently use.

Reviewed 2026-11-10 against the source and the published `0.3.31`. Every open item has a test that shows it
(`it.failing` — it turns red the day the issue is fixed: then drop `.failing` and move the entry to Fixed).
"Next release" = fixed in this source tree, not yet on npm; npm `0.3.31` doesn't have it.

## Open

### C-2. An inherited `@A_Feature.Extend` step runs for only ONE of several sibling subclasses in a scope
- What: base `B` declares `@A_Feature.Extend({ name, scope: [X] })`; undecorated subclasses `B1`, `B2` are both registered in a scope. `A_Context.featureExtensions` iterates `_metaStorage` only, and a subclass gets its own meta only once `A_Context.meta(B1)` is called. So the step is collected once, with dependency `B`, and `B` resolves to the first in-scope descendant. `B2`'s step never runs.
- Where: `A_Context.collectScopedFeatureMetas` / `featureExtensions` (`src/lib/A-Context/A-Context.class.ts`).
- Repro: calling `A_Context.meta(B1); A_Context.meta(B2)` before the feature yields `B1.handler` + `B2.handler` (correct).
- Fix idea: materialise metas of in-scope component constructors (on `A_Scope.register`, or in `collectScopedFeatureMetas` for in-scope descendants of a meta owner).
- Workaround (A-OS agent packages, `A_OS_RemoteCommandExecutor`): each subclass declares its own scoped step and calls a protected helper of the base.
- Verified 2026-11-10: still open. Test: `tests/A-Feature.inherited-siblings.test.ts` (`it.failing`).

## Added — next release

### C-A1. Lazy loading: `@A_Dependency.Load(source?)`, `A_DependencyLoader`, `A_Scope.load`
- Why: an A-OS agent run scope loads installed apps' agent packages at run time, the server twin of the UI's `AreComponentResolver` (see `adaas-composer-new/A-OS-AGENT-GUIDE.md` §6, plan item P1-2).
- `A_DependencyLoader` (abstract `A_Fragment`, `load(dependency, scope) → Promise<classes | instances | undefined>`): register one in a scope or a parent scope. It owns transport, verification and memoization. Loaded code must share the host's `@adaas/a-concept` copy (see C-F3).
- `await scope.load(ctor | name | dependency, source?)`: returns the dependency if it already resolves. Otherwise it calls the loader and registers the result in THIS scope, then resolves. Concurrent loads of the same name+source share one call. It throws `A_ScopeError.ResolutionError` when there is no loader.
- `@A_Dependency.Load('pkg:x') @A_Inject(X)` on a feature step handler (`A_Dependency.Loaded` is an alias): before the step runs, `A_Stage` awaits `load` for missing loadable injections and registers the result in the feature's effective (caller) scope, so it outlives the feature. Without a loader, nothing changes (the injection is undefined, or `Required` throws). A loader failure fails the step with `A_StageError.ArgumentsResolutionError`.
- Limits:
  - Feature steps are collected when the feature starts, so a component loaded during a feature extends the NEXT features, not the running one. Load in an earlier step or feature (e.g. agent ASSEMBLE).
  - Constructor injections are not loaded (components have no constructors).
- Tests: `tests/A-Dependency.load.test.ts`.

## Fixed — next release

### C-F7. A non-`A_Error` thrown in a step could hang the feature (reported as a-frame F-12)
- `A_Stage.failed` did `new A_Error(error)`; for an `Error` from another realm (Node's `http` errors inside a jest
  vm, a worker) that constructor threw inside the stage's promise executor, so the promise never settled and the
  feature (e.g. `concept.load`) hung instead of failing.
- Fixed: `A_BasicTypeGuards.isError` recognises Errors of any realm (used by `A_Error` and its guards);
  `A_Stage.failed` wraps any thrown value without throwing; the async stage is a plain `then` chain, so it always
  settles.
- Tests: `tests/A-Error.test.ts`, `tests/A-Feature.errors.test.ts`.


### C-F1. ASEID regexp rejected `_` (and accepted `|`) in ids (was C-1)
- The character classes were written as `[a-z|A-Z|0-9|-]`, so `|` was accepted and `_` was rejected. `generateASEID({ id: "wf_abc" })` succeeded, but `fromJSON` / `ASEID.compare` then threw on the same string.
- Fixed in `src/lib/ASEID/ASEID.class.ts`:
  - `ASEID.regexp` is now `^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+:[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.-]+(@v[0-9.]+|@lts)?$`.
  - Only the string form (`new ASEID(string)`, `isASEID`, `fromJSON`) is strict. The entity may contain `.` (e.g. `keydown.enter`).
  - Object construction (`new ASEID({...})`, `generateASEID`) does NOT character-validate its parts, for backward compatibility. Runtime values such as `a-input:submit`, DOM ids and owner ASEIDs flow in there. The published **0.3.31 does throw here**, which broke ARE UIs (`@adaas/are` ≥ 0.0.29 sanitizes its attribute names, so ARE itself works on it); the source reverts that — next release. An ASEID built from non-canonical parts can still fail `isASEID(toString())`, so sanitize parts that must round-trip.
  - `ASEID.entityRegexp` and `ASEID.partRegexp` are exposed for callers that want to sanitize or check parts themselves.
- The `fromJSON` → `fromRecord` override in the a-automation lib entities is no longer needed for `_` ids.
- Tests: `tests/ASEID.test.ts`, plus `adaas-are-html/tests/EventPropagation.test.ts` (`@a-input:submit`).

### C-F4. Classes of the same name shared cached feature templates
- The scope fingerprint (the key of the feature-template cache) listed the
  allowed classes by name. Two classes of the same name — e.g. two versions
  of a package loaded into one long-running process — gave scopes the same
  fingerprint, so a scope could run the other class's steps and fail with
  "Unable to resolve component … from scope …".
- The fingerprint now keys each class by name plus a per-process identity
  (`A_Scope.classKey`).
- Test: `tests/A-Scope.same-name.test.ts`.

### C-F5. The feature-template cache missed for every nested scope (boot CPU)
- What: the cache key used `scope.fingerprint`, which covers the scope's whole
  content and its parent chain. Every nested scope (an ARE node's scope, a
  call's scope) adding only entities or fragments got its own key, so the same
  template was rebuilt per depth. A build also creates the caller's meta on
  first use, bumping the meta version after the key was taken, so the stored
  entry could never be hit again. The scope issuer, which `has()` counts for
  containers, wasn't part of the key at all.
- Fix: the key uses `A_Scope.featureFingerprint`: allowed components, a
  container issuer and imports through the parent chain. A scope adding none of
  those shares its parent's value. The template is stored under the key as it
  stands after the build.
- Effect (A-OS web shell boot, headless Chrome, 3 runs each): `featureTemplate`
  CPU 1.0–1.1 s → 0.21–0.35 s; first contentful paint 2.72–2.86 s →
  1.70–1.83 s; first app rendered 1.33 s → 0.85–0.88 s.
- Test: `tests/A-Scope.feature-fingerprint.test.ts`.

### C-F6. Feature-template misses re-ran every lookup from scratch
- What: each miss calls `scope.has()` for every meta, and `has()` walks the
  parent chain re-checking each scope's allowed sets (`findDescendantIn`); each
  meta's `extensions(callName)` re-tested every key's regex.
- Fix: `A_Scope.hasFlat` keeps the answers that come from the scope's own
  allowed sets per scope version (cleared on destroy); the issuer check (a
  container's scope) stays live. `A_Meta.find` keeps the keys matching each
  name until the key set changes (set / delete / clear / from); values are read
  fresh.
- Effect (A-OS web shell, GPU, 3 runs): first contentful paint 1.20–1.25 s →
  1.06–1.12 s; `collectScopedFeatureMetas` 128 → 48 ms.
- Test: `tests/A-Scope.lookup-caches.test.ts`.

## Fixed — released (0.3.31)

### C-F2. Warn on duplicate `static entity` names in one scope (was C-2)
- `A_Scope` now warns once when two unrelated entity classes registered in a scope chain share the same `entity` name. Subclasses that inherit the name don't trigger it. Resolving by entity string is still first-match, so keep entity names unique.
- Test: `tests/A-Scope.test.ts`.

### C-F3. Warning when several copies of `@adaas/a-concept` are loaded
- `A_Context.getInstance()` sets a `globalThis[Symbol.for('adaas.a-concept.runtime')]` marker. It warns (`[a-concept] Multiple copies of @adaas/a-concept are loaded...`) when a different copy has already registered. A duplicate copy means separate contexts and metadata, so decorators from one copy are invisible to the other; see ARE-3 in `@adaas/are`. The check is skipped under jest.
- Test: `tests/A-Context.register.test.ts`.

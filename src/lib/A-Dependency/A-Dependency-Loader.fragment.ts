import { A_Fragment } from "@adaas/a-concept/a-fragment";
import type { A_Scope } from "@adaas/a-concept/a-scope";
import type { A_Dependency } from "./A-Dependency.class";
import type { A_TYPES__A_DependencyLoaded } from "./A-Dependency.types";


/**
 * Pluggable hook a scope consults when a loadable dependency
 * (`@A_Dependency.Load()` or `scope.load(...)`) is not registered.
 *
 * Register a concrete loader in a scope (or a parent scope) to enable runtime /
 * lazy loading: fetch code from a package, a URL, a dynamic `import()`, … The
 * scope registers whatever the loader returns, so the dependency (and every
 * `@A_Feature.Extend` step of the loaded classes) takes part from then on.
 *
 * Implementations own the transport, verification and memoization (the same
 * source must not be fetched twice). Loaded code must share the host's
 * `@adaas/a-concept` instance, otherwise its metadata lands in another A_Context.
 *
 * Server-side twin of the ARE `AreComponentResolver`. Opt-in: without a loader
 * resolution is unchanged and a missing loadable dependency resolves to undefined.
 */
export abstract class A_DependencyLoader extends A_Fragment {

    /**
     * Load the classes / instances that satisfy the dependency.
     * Return `undefined` (or `[]`) when this loader can't provide it.
     *
     * @param dependency - the requested dependency (`name`, `target`, `source`)
     * @param scope - the scope that will register the result
     */
    abstract load(
        dependency: A_Dependency<any>,
        scope: A_Scope
    ): Promise<A_TYPES__A_DependencyLoaded | undefined>;
}

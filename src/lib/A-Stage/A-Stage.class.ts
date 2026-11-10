import {
    A_TYPES__A_Stage_Status,
    A_TYPES__A_StageStep,
    A_TYPES__Stage_Serialized
} from "./A-Stage.types";
import { A_Context } from "@adaas/a-concept/a-context";
import type { A_Feature } from "@adaas/a-concept/a-feature";
import type { A_Scope } from "@adaas/a-concept/a-scope";
import { A_StageError } from "./A-Stage.error";
import { A_Error, A_CONSTANTS__ERROR_CODES } from "@adaas/a-concept/a-error";
import { A_BasicTypeGuards } from "@adaas/a-concept/helpers/A_BasicTypeGuards.helper";
import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import type { A_TYPES__Container_Constructor } from "@adaas/a-concept/a-container";
import type { A_TYPES__Component_Constructor } from "@adaas/a-concept/a-component";
import type { A_TYPES__A_DependencyInjectable } from "@adaas/a-concept/a-dependency";
import type { A_Dependency } from "@adaas/a-concept/a-dependency";


/**
 * Per-step memo of `A_Stage.needsOwnScope()`. Steps are cached template objects,
 * so this is computed once per step definition.
 */
const _stepNeedsOwnScope = new WeakMap<A_TYPES__A_StageStep, boolean>();
/**
 * Per-step memo of the step handler's `@A_Dependency.Load()` injections
 * (empty for almost every step, so the sync fast path stays a single lookup).
 */
const _stepLoadables = new WeakMap<A_TYPES__A_StageStep, A_Dependency<any>[]>();


export class A_Stage {

    /**
     * The feature that owns this stage
     */
    private readonly _feature!: A_Feature;
    /**
     * Initial Instructions to process the stage
     */
    private readonly _definition!: A_TYPES__A_StageStep;
    /**
     * Possible errors during stage processing
     */
    private _error?: A_Error;
    /**
     * Indicates the current status of the stage
     */
    private _status: A_TYPES__A_Stage_Status = A_TYPES__A_Stage_Status.INITIALIZED;
    /**
     * Set once the loadable injections were loaded, so a loader that could not
     * provide a dependency does not cause another load round.
     */
    private _loaded: boolean = false;


    /**
     * A_Stage is a callable A_Function within A_Feature that should be run with specific parameters.
     * [!] Depending on the Stage Definition type sync/async function can be executed correspondingly.
     * 
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition. 
     */
    constructor(
        /**
         * The feature that owns this stage
         */
        feature: A_Feature,
        /**
         * The step definitions of the stage
         */
        step: A_TYPES__A_StageStep
    ) {
        this._feature = feature;
        this._definition = step;
    }

    /**
     * Returns the name of the stage
     */
    get name(): string {
        return this.toString();
    }
    /**
     * Returns the definition of the stage
     */
    get definition(): A_TYPES__A_StageStep {
        return this._definition;
    }
    /**
     * Returns the current status of the stage
     */
    get status(): A_TYPES__A_Stage_Status {
        return this._status;
    }
    /**
     * Returns the feature that owns this stage
     */
    get feature(): A_Feature {
        return this._feature;
    }
    /**
     * Returns true if the stage is processed (completed, failed, or skipped)
     */
    get isProcessed(): boolean {
        return this._status === A_TYPES__A_Stage_Status.COMPLETED
            || this._status === A_TYPES__A_Stage_Status.FAILED
            || this._status === A_TYPES__A_Stage_Status.SKIPPED;
    }
    /**
     * Returns the error of the stage
     */
    get error(): A_Error | undefined {
        return this._error;
    }

    /**
     * Resolves the arguments of the step
     * 
     * @param step 
     * @returns 
     */
    protected getStepArgs(
        scope: A_Scope,
        step: A_TYPES__A_StageStep
    ) {
        let resolverConstructor: A_TYPES__Container_Constructor | A_TYPES__Component_Constructor =
            (step.dependency.target as A_TYPES__Container_Constructor | A_TYPES__Component_Constructor)
            || scope.resolveConstructor(step.dependency.name);

        const caller = this._feature.caller?.component as any;

        return A_Context
            .meta(resolverConstructor)
            .injections(step.handler)
            .map(dependency => {
                switch (true) {
                    case A_TypeGuards.isCallerConstructor(dependency.target):
                        return this._feature.caller.component;

                    case A_TypeGuards.isFeatureConstructor(dependency.target):
                        return this._feature;

                    default: {
                        // Caller-aware shortcut: when an @A_Inject() target matches
                        // the caller's own class (or an ancestor of it), the caller
                        // IS the correct instance. Without this, scope.resolve(ctor)
                        // returns the first registered instance of that class — which
                        // is wrong for entities that can have multiple copies in
                        // the same scope.
                        if (caller && this.isCallerOfDependency(caller, dependency.target)) {
                            return caller;
                        }
                        // Wrap dependency-resolution failures so they surface as a
                        // typed A_StageError(ArgumentsResolutionError) instead of
                        // bubbling up untyped. The dependency name and handler are
                        // included in the description so investigators can spot the
                        // exact @A_Inject() target without reading a stack trace.
                        try {
                            return scope.resolve(dependency);
                        } catch (error) {
                            const depName = (dependency.target as any)?.name
                                ?? (dependency as any)?.name
                                ?? '<unknown>';
                            throw new A_StageError({
                                title: A_StageError.ArgumentsResolutionError,
                                description: `Failed to resolve @A_Inject(${depName}) for handler '${step.handler}' in stage ${this.name} (scope: ${scope.name}).`,
                                originalError: error,
                            });
                        }
                    }
                }
            })
    }


    /**
     * True if `caller` is an instance of (or subclass of) the dependency's target class.
     * Used to short-circuit instance resolution to the actual caller instead of
     * scope.resolve(ctor), which is not safe for components that may have multiple
     * instances of the same class registered in the same scope (e.g. A_Entity).
     */
    protected isCallerOfDependency(
        caller: any,
        target: Function | undefined
    ): boolean {
        if (!caller || !target || typeof target !== 'function') return false;
        if (caller.constructor === target) return true;
        try {
            return caller instanceof (target as any);
        } catch {
            return false;
        }
    }


    /**
     * Resolves the component of the step
     * 
     * @param step 
     * @returns 
     */
    protected getStepComponent(
        scope: A_Scope,
        step: A_TYPES__A_StageStep
    ) {
        const { dependency, handler } = step;

        // Caller-aware shortcut: if the step's dependency target matches the
        // caller's own class (or an ancestor of it), the caller IS the correct
        // instance. This is critical for A_Entity, where multiple instances of
        // the same class can be registered in one scope and scope.resolve(ctor)
        // would return whichever one was registered first.
        const caller = this._feature.caller?.component as any;
        if (caller && this.isCallerOfDependency(caller, dependency.target as Function)) {
            if (!caller[handler])
                throw new A_StageError(
                    A_StageError.CompileError,
                    `Handler ${handler} not found in ${caller.constructor.name}`
                );
            return caller;
        }

        let instance: A_TYPES__A_DependencyInjectable | undefined =
            (scope.resolve(dependency) || this.feature.scope.resolve(dependency)) as A_TYPES__A_DependencyInjectable


        if (!instance) {
            // Graceful skip: when a step targets an A_Entity class that is
            // *allowed* in the scope (so featureTemplate included it) but has
            // no instance registered, there is nothing to invoke per-instance.
            // Treat the stage as skipped instead of failing the whole feature.
            const depCtor = dependency.target as Function | undefined;
            if (depCtor && A_TypeGuards.isEntityConstructor(depCtor)) {
                return undefined;
            }

            throw new A_StageError(
                A_StageError.CompileError,
                `Unable to resolve component ${dependency.name} from scope ${scope.name}`
            );
        }

        if (!instance[handler])
            throw new A_StageError(
                A_StageError.CompileError,
                `Handler ${handler} not found in ${instance.constructor.name}`
            );

        return instance;
    }



    /**
     * Calls the handler of the step
     * 
     * @param step 
     * @returns 
     */
    protected callStepHandler(
        step: A_TYPES__A_StageStep,
        scope: A_Scope
    ): {
        component: any,
        method: string,
        params: any[]
    } | undefined {
        // 1) Resolve component (may be undefined for "skip this stage" scenarios,
        //    e.g. entity-class step with no instance registered in scope).
        const component = this.getStepComponent(scope, step);
        if (!component) return undefined;
        // 2) Resolve arguments
        const callArgs = this.getStepArgs(scope, step);

        // 3) Return the receiver + method name (NOT a bound function). The caller
        //    invokes `component[method](...params)`, which sets `this` to the
        //    component automatically — avoiding a per-step `.bind()` allocation
        //    on every feature execution (a hot path for per-node lifecycle hooks).
        return {
            component,
            method: step.handler,
            params: callArgs
        }
    }


    skip() {
        this._status = A_TYPES__A_Stage_Status.SKIPPED;
    }

    /**
     * True if resolving this step against the caller scope could differ from
     * resolving it against the feature's own (empty, inheriting) scope, i.e. the
     * step injects the scope itself, or uses flat / parent-offset / create /
     * multi-instance / query / by-name resolution. Conservative: anything not
     * provably equivalent returns true.
     */
    protected needsOwnScope(step: A_TYPES__A_StageStep): boolean {
        let result = _stepNeedsOwnScope.get(step);
        if (result !== undefined) return result;

        const resolverConstructor = step.dependency.target as A_TYPES__Container_Constructor | A_TYPES__Component_Constructor | undefined;

        try {
            result = !resolverConstructor
                || !A_Stage.isPlainLookup(step.dependency)
                || A_Context
                    .meta(resolverConstructor)
                    .injections(step.handler)
                    .some(dependency =>
                        !A_TypeGuards.isCallerConstructor(dependency.target)
                        && !A_TypeGuards.isFeatureConstructor(dependency.target)
                        && !A_Stage.isPlainLookup(dependency)
                    );
        } catch {
            // Let the regular path (getStepComponent / getStepArgs) report errors.
            result = true;
        }

        _stepNeedsOwnScope.set(step, result);
        return result;
    }

    private static isPlainLookup(dependency: A_Dependency<any>): boolean {
        const target = dependency.target;
        if (typeof target !== 'function' || A_TypeGuards.isScopeConstructor(target))
            return false;

        const strategy = dependency.resolutionStrategy;
        if (strategy.flat || strategy.create || strategy.parent !== 0 || strategy.pagination.count !== 1)
            return false;

        for (const _ in strategy.query) return false;
        return true;
    }


    /**
     * The step handler's injections marked with `@A_Dependency.Load()`.
     */
    protected loadableInjections(
        scope: A_Scope,
        step: A_TYPES__A_StageStep
    ): A_Dependency<any>[] {
        let result = _stepLoadables.get(step);
        if (result) return result;

        const target = step.dependency.target as A_TYPES__Container_Constructor | A_TYPES__Component_Constructor | undefined;

        try {
            const resolverConstructor = target || scope.resolveConstructor(step.dependency.name);

            result = resolverConstructor
                ? A_Context
                    .meta(resolverConstructor as any)
                    .injections(step.handler)
                    .filter(dependency => dependency.load)
                : [];
        } catch {
            // Let the regular path (getStepComponent / getStepArgs) report errors.
            result = [];
        }

        // By-name steps may resolve to different constructors per scope: memoize only typed steps.
        if (target)
            _stepLoadables.set(step, result);

        return result;
    }

    /**
     * Loads the missing `@A_Dependency.Load()` injections, then processes the stage.
     */
    protected async loadAndProcess(
        loadScope: A_Scope,
        pending: A_Dependency<any>[],
        scope?: A_Scope
    ): Promise<void> {
        try {
            await Promise.all(pending.map(dependency => loadScope.load(dependency)));
        } catch (error) {
            const loadError = new A_StageError({
                title: A_StageError.ArgumentsResolutionError,
                description: `Failed to load ${pending.map(d => d.name).join(', ')} for handler '${this._definition.handler}' in stage ${this.name} (scope: ${loadScope.name}).`,
                originalError: error,
            });

            this.failed(loadError);

            if (this._definition.throwOnError) return;

            throw loadError;
        }

        this._loaded = true;

        await this.process(scope);
    }


    /**
     * This method processes the stage by executing all the steps
     * 
     * @param scope - Scope to be used to resolve the steps dependencies
     */
    process(
        /**
         * Scope to be used to resolve the steps dependencies
         */
        scope?: A_Scope,
    ): Promise<void> | void {

        if (!this.isProcessed && !this._loaded) {
            // Lazy loading: `@A_Dependency.Load()` injections that are not in the
            // scope yet are loaded (and registered in the caller scope) first.
            const loadables = this.loadableInjections(
                A_TypeGuards.isScopeInstance(scope) ? scope : this._feature.effectiveScope,
                this._definition
            );

            if (loadables.length) {
                const loadScope = A_TypeGuards.isScopeInstance(scope)
                    ? scope
                    : this._feature.effectiveScope;

                const pending = loadables.filter(dependency => loadScope.needsLoad(dependency));

                if (pending.length) {
                    this._status = A_TYPES__A_Stage_Status.PROCESSING;
                    return this.loadAndProcess(loadScope, pending, scope);
                }
            }
        }

        const targetScope = A_TypeGuards.isScopeInstance(scope)
            ? scope
            : this._feature.stepScope(this.needsOwnScope(this._definition));

        if (!this.isProcessed) {
            this._status = A_TYPES__A_Stage_Status.PROCESSING;

            const call = this.callStepHandler(this._definition, targetScope);

            // No callable component (e.g. entity-class step with no instance
            // registered) → skip this stage gracefully.
            if (!call) {
                this.skip();
                return;
            }

            const { component, method, params } = call;

            const result = component[method](...params);

            if (A_TypeGuards.isPromiseInstance(result)) {

                // A plain promise chain (not `new Promise(async …)`): anything
                // thrown while recording the failure still rejects the stage
                // instead of leaving it pending forever.
                return result.then(
                    () => this.completed(),
                    (error) => {
                        // Propagate the error AS-IS so the sync and async
                        // paths behave identically. `failed()` records it on
                        // the stage for in-process introspection.
                        this.failed(error);

                        if (!this._definition.throwOnError) throw error;
                    });
            } else {
                this.completed();
            }
        }

    }


    // ==========================================
    // ============ Status methods =============
    // ==========================================

    protected completed() {
        this._status = A_TYPES__A_Stage_Status.COMPLETED;
    }

    protected failed(
        error: Error | A_Error | any
    ) {
        // Preserve the original error instance when it is already an A_Error
        // (or subclass). Wrapping with `new A_Error(error)` here used to flatten
        // the domain title into UNEXPECTED_ERROR and erase any structured fields
        // a subclass had attached. Only wrap other throwables; values that are
        // neither an Error nor a message (numbers, plain objects, undefined)
        // are kept as the original error.
        this._error = error instanceof A_Error
            ? error
            : A_BasicTypeGuards.isError(error) || A_BasicTypeGuards.isString(error)
                ? new A_Error(error)
                : new A_Error({
                    title: A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR,
                    description: String(error),
                    originalError: error,
                });

        this._status = A_TYPES__A_Stage_Status.FAILED;
    }



    // ==========================================
    // ============ Serialization ===============
    // ==========================================
    /**
     * Serializes the stage to JSON
     * 
     */
    toJSON(): A_TYPES__Stage_Serialized {
        return {
            name: this.name,
            status: this.status,
        }
    }

    /**
     * Returns a string representation of the stage
     * 
     * @returns 
     */
    toString() {
        return `A-Stage(${this._feature.name}::${this._definition.behavior}@${this._definition.handler})`;
    }
}   
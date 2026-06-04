import {
    A_TYPES__A_Stage_Status,
    A_TYPES__A_StageStep,
    A_TYPES__Stage_Serialized
} from "./A-Stage.types";
import { A_Context } from "@adaas/a-concept/a-context";
import type { A_Feature } from "@adaas/a-concept/a-feature";
import type { A_Scope } from "@adaas/a-concept/a-scope";
import { A_StageError } from "./A-Stage.error";
import { A_Error } from "@adaas/a-concept/a-error";
import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import type { A_TYPES__Container_Constructor } from "@adaas/a-concept/a-container";
import type { A_TYPES__Component_Constructor } from "@adaas/a-concept/a-component";
import type { A_TYPES__A_DependencyInjectable } from "@adaas/a-concept/a-dependency";



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
                        return scope.resolve(dependency);
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
        handler: Function,
        params: any[]
    } | undefined {
        // 1) Resolve component (may be undefined for "skip this stage" scenarios,
        //    e.g. entity-class step with no instance registered in scope).
        const component = this.getStepComponent(scope, step);
        if (!component) return undefined;
        // 2) Resolve arguments
        const callArgs = this.getStepArgs(scope, step);

        // 3) Call handler
        return {
            handler: component[step.handler].bind(component),
            params: callArgs
        }
    }


    skip() {
        this._status = A_TYPES__A_Stage_Status.SKIPPED;
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

        const targetScope = A_TypeGuards.isScopeInstance(scope)
            ? scope
            : this._feature.scope;

        if (!this.isProcessed) {
            this._status = A_TYPES__A_Stage_Status.PROCESSING;

            const call = this.callStepHandler(this._definition, targetScope);

            // No callable component (e.g. entity-class step with no instance
            // registered) → skip this stage gracefully.
            if (!call) {
                this.skip();
                return;
            }

            const { handler, params } = call;

            const result = handler(...params);

            if (A_TypeGuards.isPromiseInstance(result)) {

                return new Promise<void>(
                    async (resolve, reject) => {
                        try {
                            await result;

                            this.completed();

                            return resolve();
                        } catch (error) {
                            const wrappedError = new A_Error(error as any);

                            this.failed(wrappedError);

                            if (this._definition.throwOnError) {
                                return resolve();
                            } else {
                                return reject(wrappedError);
                            }
                        }
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
        this._error = new A_Error(error);

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
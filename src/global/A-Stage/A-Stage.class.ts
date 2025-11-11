import {
    A_TYPES__A_Stage_Status,
    A_TYPES__A_StageStep,
    A_TYPES__Stage_Serialized
} from "./A-Stage.types";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_StageError } from "./A-Stage.error";
import { A_Error } from "../A-Error/A_Error.class";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_TYPES__ScopeResolvableComponents } from "../A-Scope/A-Scope.types";
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";



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
     * Promise that will be resolved when the stage is Processed
     */
    private _processed: Promise<void> | undefined;


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
    protected async getStepArgs(
        scope: A_Scope,
        step: A_TYPES__A_StageStep
    ) {
        let resolverConstructor: A_TYPES__Container_Constructor | A_TYPES__Component_Constructor;

        switch (true) {
            case A_TypeGuards.isContainerInstance(step.component):
                resolverConstructor = step.component.constructor as A_TYPES__Container_Constructor;
                break;

            case A_TypeGuards.isString(step.component):
                resolverConstructor = scope.resolveConstructor(step.component);
                break;

            default:
                resolverConstructor = step.component;
                break;
        }


        return Promise
            .all(A_Context
                .meta(resolverConstructor)
                .injections(step.handler)
                .map(async arg => {
                    switch (true) {
                        case A_TypeGuards.isCallerConstructor(arg.target):
                            return this._feature.caller.component;

                        case A_TypeGuards.isScopeConstructor(arg.target):
                            return scope;

                        case A_TypeGuards.isFeatureConstructor(arg.target):
                            return this._feature;

                        case A_TypeGuards.isEntityConstructor(arg.target) && 'instructions' in arg && !!arg.instructions:
                            return scope.resolve(arg.target, arg.instructions)

                        default: {
                            const { target, require, create, defaultArgs } = arg;

                            let dependency = scope.resolve(target as any);

                            if (create && !dependency && A_TypeGuards.isAllowedForDependencyDefaultCreation(target)) {
                                const newDependency = new target(...defaultArgs);

                                scope.register(newDependency);
                                return newDependency;
                            }

                            if (require && !dependency) {
                                throw new A_StageError(
                                    A_StageError.ArgumentsResolutionError,
                                    `Unable to resolve required argument ${A_CommonHelper.getComponentName(arg.target)} for stage ${this.name} in scope ${scope.name}`
                                );
                            }

                            return scope.resolve(arg.target)
                        }
                    }
                })
            )
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
        const { component, handler } = step;

        let instance: A_TYPES__ScopeResolvableComponents | undefined

        switch (true) {
            case A_TypeGuards.isContainerInstance(component):
                instance = component;
                break;

            case A_TypeGuards.isString(component):
                instance = scope.resolve(component);
                break;

            default:
                instance = scope.resolve(component);
                break;
        }

        if (!instance)
            throw new A_StageError(A_StageError.CompileError, `Unable to resolve component ${typeof component === 'string' ? component : component.name} from scope ${scope.name}`);

        if (!instance[handler])
            throw new A_StageError(A_StageError.CompileError, `Handler ${handler} not found in ${instance.constructor.name}`);

        return instance;
    }



    /**
     * Calls the handler of the step
     * 
     * @param step 
     * @returns 
     */
    protected async callStepHandler(
        step: A_TYPES__A_StageStep,
        scope: A_Scope
    ) {
        // 1) Resolve component
        const component = await this.getStepComponent(scope, step);
        // 2) Resolve arguments
        const callArgs = await this.getStepArgs(scope, step);

        // 3) Call handler
        return await component[step.handler](...callArgs);
    }


    skip() {
        this._status = A_TYPES__A_Stage_Status.SKIPPED;
    }


    /**
     * This method processes the stage by executing all the steps
     * 
     * @param scope - Scope to be used to resolve the steps dependencies
     */
    async process(
        /**
         * Scope to be used to resolve the steps dependencies
         */
        scope?: A_Scope,
    ): Promise<void> {

        const targetScope = A_TypeGuards.isScopeInstance(scope)
            ? scope
            : this._feature.scope;

        if (!this._processed)
            this._processed = new Promise<void>(
                async (resolve, reject) => {
                    try {
                        this._status = A_TYPES__A_Stage_Status.PROCESSING;

                        if (this._definition.behavior === 'sync') {
                            // in case we have to wait for the result
                            await this.callStepHandler(this._definition, targetScope);
                        } else {
                            // in case we don't have to wait for the result
                            this.callStepHandler(this._definition, targetScope);
                        }

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

        return this._processed;
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
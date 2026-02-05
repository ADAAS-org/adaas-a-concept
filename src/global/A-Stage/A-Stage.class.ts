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
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";
import { A_TYPES__A_DependencyInjectable } from "../A-Dependency/A-Dependency.types";



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
                        return scope.resolve(dependency);
                    }
                }
            })
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

        let instance: A_TYPES__A_DependencyInjectable | undefined =
            (scope.resolve(dependency) || this.feature.scope.resolve(dependency)) as A_TYPES__A_DependencyInjectable


        if (!instance)
            throw new A_StageError(
                A_StageError.CompileError,
                `Unable to resolve component ${dependency.name} from scope ${scope.name}`
            );

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
    } {
        // 1) Resolve component
        const component = this.getStepComponent(scope, step);
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

            const { handler, params } = this.callStepHandler(this._definition, targetScope);

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
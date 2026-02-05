import {
    A_TYPES__Feature_Init,
    A_TYPES__Feature_InitWithComponent,
    A_TYPES__Feature_InitWithTemplate,
    A_TYPES__FeatureAvailableComponents,
    A_TYPES__FeatureState,
} from "./A-Feature.types";
import { A_Feature_Define } from "@adaas/a-concept/global/A-Feature/A-Feature-Define.decorator";
import { A_Feature_Extend } from "@adaas/a-concept/global/A-Feature/A-Feature-Extend.decorator";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { A_StepsManager } from "@adaas/a-concept/global/A-StepManager/A-StepManager.class";
import { A_StageError } from "../A-Stage/A-Stage.error";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_FeatureError } from "./A-Feature.error";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Caller } from "../A-Caller/A_Caller.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Component } from "../A-Component/A-Component.class";


/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 * 
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods 
 * across the different, distributed components
 * 
 */
export class A_Feature<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {

    // =============================================================================
    // --------------------------- Static Methods ---------------------------------
    // =============================================================================
    /**
     * Define a new A-Feature
     */
    static get Define(): typeof A_Feature_Define {
        return A_Feature_Define;
    }

    /**
     * Extend an existing A-Feature
     */
    static get Extend(): typeof A_Feature_Extend {
        return A_Feature_Extend;
    }
    // =============================================================================
    // --------------------------- Internal Properties ----------------------------
    // =============================================================================
    /**
     * The name of the Feature
     */
    protected _name!: string;
    /**
     * List of stages that are part of this Feature
     */
    protected _stages: Array<A_Stage> = [];
    /**
     * The Stage currently being processed
     */
    protected _current?: A_Stage;
    /**
     * Actual Index of the current Stage being processed
     */
    protected _index: number = 0;
    /**
     * Steps Manager to organize the steps into stages
     */
    protected _SM!: A_StepsManager;
    /**
     * The Caller that initiated the Feature call
     */
    protected _caller!: A_Caller<T>;
    /**
     * The current state of the Feature
     */
    protected _state: A_TYPES__FeatureState = A_TYPES__FeatureState.INITIALIZED;
    /**
     * The error that caused the Feature to be interrupted
     */
    protected _error?: A_FeatureError



    /**
     * A-Feature is a pipeline distributed by multiple components that can be easily attached or detached from the scope. 
     * Feature itself does not have scope, but attached to the caller who dictates how feature should be processed. 
     * 
     * Comparing to A-Command Feature does not store any state except statuses for better analysis. 
     * 
     * [!] Note: If A-Feature should have result use A-Fragment 
     * 
     * @param params 
     */
    constructor(
        /**
         * Feature Initialization parameters
         */
        params: A_TYPES__Feature_Init<T>
    ) {
        this.validateParams(params);

        const initializer = this.getInitializer(params);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, params);
    }


    /**
     * The name of the Feature
     */
    get name(): string { return this._name; }
    /**
     * The error that caused the Feature to be interrupted
     */
    get error(): A_FeatureError | undefined { return this._error; }
    /**
     * The current state of the Feature
     */
    get state(): A_TYPES__FeatureState { return this._state; }
    /**
     * Sets the current state of the Feature
     */
    get index(): number { return this._index; }
    /**
     * Returns the current A-Feature Stage
     */
    get stage(): A_Stage | undefined { return this._current; }
    /**
     * The Caller that initiated the Feature call
     */
    get caller(): A_Caller<T> { return this._caller; }
    /**
     * The Scope allocated for the Feature Execution
     */
    get scope(): A_Scope { return A_Context.scope(this); }
    /**
     * The number of stages in the feature
     */
    get size(): number {
        return this._stages.length;
    }

    /**
     * This method checks if the A-Feature is done
     * 
     * @returns 
     */
    get isDone(): boolean {
        return !this.stage
            || this._index >= this._stages.length;
    }
    /**
     * Indicates whether the feature has been processed (completed, failed, or interrupted)
     */
    get isProcessed(): boolean {
        return this.state === A_TYPES__FeatureState.COMPLETED
            || this.state === A_TYPES__FeatureState.FAILED
            || this.state === A_TYPES__FeatureState.INTERRUPTED;
    }
    /**
     * Iterator to iterate over the steps of the feature
     * 
     * @returns 
     */
    [Symbol.iterator](): Iterator<A_Stage, any> {
        return {
            next: (): IteratorResult<A_Stage, any> => {
                if (!this.isDone) {
                    this._current = this._stages[this._index];
                    this._index++;

                    return {
                        value: this._current,
                        done: false
                    };
                } else {
                    this._current = undefined; // Reset current on end

                    return {
                        value: undefined,
                        done: true
                    };
                }
            }
        };
    }

    // ============================================================================
    // ------------------------ Initialization Methods ----------------------------
    // ============================================================================
    /**
     * Validates the provided parameters for A-Feature initialization
     * 
     * @param params 
     */
    protected validateParams(
        params: A_TYPES__Feature_Init<T>
    ) {
        if (!params || typeof params !== 'object') {
            throw new A_FeatureError(
                A_FeatureError.FeatureInitializationError,
                `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`
            );
        }
    }
    /**
     * Returns the appropriate initializer method based on the provided parameters
     * 
     * @param params 
     * @returns 
     */
    protected getInitializer(
        params: A_TYPES__Feature_Init<T>
    ): (param1: any) => void | (() => void) {

        switch (true) {
            case !('template' in params):
                return this.fromComponent;

            case 'template' in params:
                return this.fromTemplate;
            default:
                throw new A_FeatureError(
                    A_FeatureError.FeatureInitializationError,
                    `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`
                );
        }
    }
    /**
     * Initializes the A-Feature from the provided template
     * 
     * @param params 
     */
    protected fromTemplate(
        params: A_TYPES__Feature_InitWithTemplate<T>
    ) {
        if (!params.template || !Array.isArray(params.template)) {
            throw new A_FeatureError(
                A_FeatureError.FeatureInitializationError,
                `Invalid A-Feature template provided of type: ${typeof params.template} with value: ${JSON.stringify(params.template).slice(0, 100)}...`
            );
        }

        if (!params.component && (!params.scope || !(params.scope instanceof A_Scope))) {
            throw new A_FeatureError(
                A_FeatureError.FeatureInitializationError,
                `Invalid A-Feature scope provided of type: ${typeof params.scope} with value: ${JSON.stringify(params.scope).slice(0, 100)}...`
            );
        }

        // 1) save feature name
        this._name = params.name;

        // 2) get scope from where feature is called
        // 2) get scope from where feature is called
        let componentScope: A_Scope | undefined;
        //  uses to extend a component scope if component is not registered in the context
        let externalScope: A_Scope | undefined = params.scope;

        try {
            if (params.component)
                componentScope = A_Context.scope(params.component);
        } catch (error) {
            if (!externalScope)
                throw error;
        }

        if (componentScope && externalScope && !externalScope.isInheritedFrom(componentScope)) {
            externalScope.inherit(componentScope);
        }

        // 3) create caller wrapper for the simple injection of the caller component
        //   - Just to prevent issues with undefined caller in features without component
        //   - TODO: maybe would be better to allow passing caller in params?
        this._caller = new A_Caller<T>(params.component || new A_Component() as T);

        // 4) allocate new scope for the feature
        const scope = A_Context.allocate(this);

        // 5) ensure that the scope of the caller component is inherited by the feature scope
        scope.inherit(componentScope || externalScope!);

        // 6) create steps manager to organize steps into stages
        this._SM = new A_StepsManager(params.template);

        // 7) create stages from the steps
        this._stages = this._SM.toStages(this);

        // 8) set the first stage as current
        this._current = this._stages[0];
    }
    /**
     * Initializes the A-Feature from the provided component
     * 
     * @param params 
     */
    protected fromComponent(
        params: A_TYPES__Feature_InitWithComponent<T>
    ) {
        if (!params.component || !A_TypeGuards.isAllowedForFeatureDefinition(params.component)) {
            throw new A_FeatureError(
                A_FeatureError.FeatureInitializationError,
                `Invalid A-Feature component provided of type: ${typeof params.component} with value: ${JSON.stringify(params.component).slice(0, 100)}...`
            );
        }

        // 1) save feature name
        this._name = params.name;

        // 2) get scope from where feature is called
        let componentScope: A_Scope | undefined;
        //  uses to extend a component scope if component is not registered in the context
        let externalScope: A_Scope | undefined = params.scope;

        try {
            componentScope = A_Context.scope(params.component);
        } catch (error) {
            if (!externalScope)
                throw error;
        }

        if (componentScope && externalScope && !externalScope.isInheritedFrom(componentScope)) {
            externalScope.inherit(componentScope);
        }

        // 3) create caller wrapper for the simple injection of the caller component
        this._caller = new A_Caller<T>(params.component);

        // 4) allocate new scope for the feature
        const scope = A_Context.allocate(this);

        // 5) ensure that the scope of the caller component is inherited by the feature scope
        scope.inherit(componentScope || externalScope!);

        // 6) retrieve the template from the context
        const template = A_Context.featureTemplate(this._name, this._caller.component, scope);

        // 7) create steps manager to organize steps into stages
        this._SM = new A_StepsManager(template);

        // 8) create stages from the steps
        this._stages = this._SM.toStages(this);

        // 9) set the first stage as current
        this._current = this._stages[0];
    }


    // ============================================================================
    // ----------------------- Main Processing Methods ----------------------------
    // ============================================================================
    /**
     * This method processes the feature by executing all the stages
     * 
     */
    process(
        /**
         * Optional scope to be used to resolve the steps dependencies
         * If not provided, the scope of the caller component will be used
         */
        scope?: A_Scope,
    ): Promise<void> | void {
        try {
            // It seems like this is a bad idea to enforce scope inheritance here
            // ---------------------------------------------------------------
            // if (scope && !scope.isInheritedFrom(A_Context.scope(this)))
            //     scope.inherit(A_Context.scope(this));

            if (this.isProcessed)
                return;

            this._state = A_TYPES__FeatureState.PROCESSING;

            // Convert iterator to array to get all stages
            const stages = Array.from(this);
            
            return this.processStagesSequentially(stages, scope, 0);

        } catch (error) {
            this.failed(new A_FeatureError({
                title: A_FeatureError.FeatureProcessingError,
                description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${this.stage?.name || 'N/A'}.`,
                stage: this.stage,
                originalError: error
            }));
        }
    }

    /**
     * Process stages one by one, ensuring each stage completes before starting the next
     */
    private processStagesSequentially(
        stages: A_Stage[], 
        scope: A_Scope | undefined, 
        index: number
    ): Promise<void> | void {
        try {
            // If we've processed all stages, complete the feature
            if (index >= stages.length) {
                this.completed();
                return;
            }

            const stage = stages[index];
            const result = stage.process(scope);

            if (A_TypeGuards.isPromiseInstance(result)) {
                // Async stage - return promise that processes remaining stages
                return result.then(() => {
                    return this.processStagesSequentially(stages, scope, index + 1);
                }).catch(error => {
                    this.failed(new A_FeatureError({
                        title: A_FeatureError.FeatureProcessingError,
                        description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${stage.name}.`,
                        stage: stage,
                        originalError: error
                    }));
                });
            } else {
                // Sync stage - continue to next stage immediately
                return this.processStagesSequentially(stages, scope, index + 1);
            }
        } catch (error) {
            this.failed(new A_FeatureError({
                title: A_FeatureError.FeatureProcessingError,
                description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${this.stage?.name || 'N/A'}.`,
                stage: this.stage,
                originalError: error
            }));
        }
    }
    /**
     * This method moves the feature to the next stage
     * 
     * @param stage 
     */
    next(stage) {
        const stageIndex = this._stages.indexOf(stage);

        this._index = stageIndex + 1;

        if (this._index >= this._stages.length) {
            this.completed();
        }
    }
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     * 
     * @param result 
     * @returns 
     */
    completed(): void {
        if (this.isProcessed) return;


        this._state = A_TYPES__FeatureState.COMPLETED;

        this.scope.destroy();
    }
    /**
     * This method marks the feature as failed and throws an error
     * Uses to mark the feature as failed
     * 
     * @param error 
     */
    failed(error: A_FeatureError) {
        if (this.isProcessed) return;

        this._state = A_TYPES__FeatureState.FAILED;

        this._error = error;

        this.scope.destroy();

        throw this._error;
    }
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     * 
     * @param error 
     */
    async interrupt(
        /**
         * The reason of feature interruption
         */
        reason?: string | A_StageError | Error
    ) {
        if (this.isProcessed) return;

        this._state = A_TYPES__FeatureState.INTERRUPTED;

        switch (true) {
            case A_TypeGuards.isString(reason):
                this._error = new A_FeatureError(A_FeatureError.Interruption, reason);
                break;

            case A_TypeGuards.isErrorInstance(reason):
                this._error = new A_FeatureError({
                    code: A_FeatureError.Interruption,
                    title: reason.title,
                    description: reason.description,
                    stage: this.stage,
                    originalError: reason
                });
                break;

            default:
                break;
        }


        this.scope.destroy();
    }


    /**
     * Allows to chain the feature to another feature. 
     * In this case the parent feature scope (if new not provided), stages, caller will be used.
     * 
     * [!] Note: Chained feature will use the same caller as the parent feature.
     * 
     * @param feature 
     */
    chain(
        /**
         * A Feature to be chained
         */
        feature: A_Feature,
        /**
         * Optional scope to be used for the chained feature.
         */
        scope?: A_Scope
    )
    chain<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents>(
        /**
         * Component whose feature should be chained
         */
        component: A_TYPES__FeatureAvailableComponents,
        /**
         * A Feature Name to be chained
         */
        feature: string,
        /**
         * Optional scope to be used for the chained feature.
         */
        scope?: A_Scope
    )
    chain<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents>(
        param1: A_TYPES__FeatureAvailableComponents | A_Feature,
        param2?: string | A_Scope,
        param3?: A_Scope
    ) {
        let feature: A_Feature;
        let scope: A_Scope | undefined;

        if (param1 instanceof A_Feature) {
            feature = param1;
            scope = param2 instanceof A_Scope ? param2 : undefined;
        } else {
            feature = new A_Feature({
                name: param2 as string,
                component: param1 as T
            });
            scope = param3 instanceof A_Scope ? param3 : undefined;
        }

        const featureScope = scope || this.scope;

        // create new caller for the chained feature
        feature._caller = this._caller;

        return feature.process(featureScope);
    }




    toString(): string {
        return `A-Feature(${this.caller.component?.constructor?.name || 'Unknown'}::${this.name})`;
    }
}
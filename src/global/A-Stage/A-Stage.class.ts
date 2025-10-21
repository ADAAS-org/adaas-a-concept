import {
    A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status,
    A_TYPES__A_StageStep, A_TYPES__A_StageStepProcessingExtraParams
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
import { A_TYPES__InjectableConstructors } from "@adaas/a-concept/global/A-Inject/A-Inject.types";



export class A_Stage {

    private readonly _feature!: A_Feature;
    private readonly _steps!: A_TYPES__A_StageStep[];
    private _error?: Error | A_Error | any;


    /**
     * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
     * Each stage may contain one or more functions. 
     * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
     * 
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition. 
     */
    constructor(
        feature: A_Feature,
        steps: A_TYPES__A_StageStep[] = []
    ) {
        this._feature = feature;
        this._steps = steps;
    }

    status: A_TYPES__A_Stage_Status = A_TYPES__A_Stage_Status.INITIALIZED;

    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;




    get name(): string {
        return this.toString();
    }

    get before(): string[] {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), [] as string[]);
    }

    get after(): string[] {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), [] as string[]);
    }

    get steps(): A_TYPES__A_StageStep[] {
        return this._steps;
    }

    get asyncSteps(): A_TYPES__A_StageStep[] {
        return this._steps.filter(step => step.behavior === 'async');
    }

    get syncSteps(): A_TYPES__A_StageStep[] {
        return this._steps.filter(step => step.behavior === 'sync');
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

                        case A_TypeGuards.isEntityConstructor(arg.target) && 'instructions' in arg:
                            return scope.resolve(arg.target, arg.instructions)

                        default:
                            return scope.resolve(arg.target)
                    }
                })
            )
    }


    /**
     * Adds a step to the stage
     * 
     * @param step 
     * @returns 
     */
    add(
        step: A_TYPES__A_StageStep
    ): this {
        this._steps.push(step);

        return this;
    }


    /**
     * Resolves the component of the step
     * 
     * @param step 
     * @returns 
     */
    protected getStepInstance(
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
        const instance = await this.getStepInstance(scope, step);
        const callArgs = await this.getStepArgs(scope, step);

        return await instance[step.handler](...callArgs);
    }


    skip() {
        this.status = A_TYPES__A_Stage_Status.SKIPPED;
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
    ): Promise<void>
    async process(
        /**
         * Extra parameters to control the steps processing
         */
        params?: Partial<A_TYPES__A_StageStepProcessingExtraParams>
    ): Promise<void>
    async process(
        /**
         * Scope to be used to resolve the steps dependencies
         */
        param1?: A_Scope | Partial<A_TYPES__A_StageStepProcessingExtraParams>,
        /**
         * Extra parameters to control the steps processing
         */
        param2?: Partial<A_TYPES__A_StageStepProcessingExtraParams>
    ): Promise<void> {

        const scope = A_TypeGuards.isScopeInstance(param1)
            ? param1
            : A_Context.scope(this._feature);

        const params = A_TypeGuards.isScopeInstance(param1)
            ? param2
            : param1;


        if (!this.processed)
            this.processed = new Promise<void>(
                async (resolve, reject) => {
                    try {
                        this.status = A_TYPES__A_Stage_Status.PROCESSING;

                        if (params?.steps && params.steps.length) {
                            params.steps.forEach(step => this.add(step));
                        }

                        const syncSteps = this.syncSteps.filter(params?.filter || (() => true));
                        const asyncSteps = this.asyncSteps.filter(params?.filter || (() => true));

                        // Run sync _steps
                        await Promise
                            .all([

                                // Run async _steps that are independent of each other
                                ...asyncSteps.map(step => this.callStepHandler(step, scope)),

                                // Run sync _steps that are dependent on each other
                                new Promise<void>(
                                    async (r, j) => {
                                        try {
                                            for (const step of syncSteps) {
                                                // console.log(' - -> Processing stage step:', step.handler, ' with Regexp: ', step.name);

                                                await this.callStepHandler(step, scope);

                                                // console.log(' - -> Finished processing stage step:', step.handler);
                                            }

                                            return r();
                                        } catch (error) {

                                            return j(error);
                                        }
                                    }
                                )
                            ]);

                        this.completed();

                        return resolve();
                    } catch (error) {
                        this.failed(error);

                        return reject(error);
                    }
                });


        return this.processed;
    }


    // ==========================================
    // ============ Status methods =============
    // ==========================================

    protected completed() {
        this.status = A_TYPES__A_Stage_Status.COMPLETED;
    }

    protected failed(
        error: Error | A_Error | any
    ) {
        this._error = error;

        this.status = A_TYPES__A_Stage_Status.FAILED;
    }



    // ==========================================
    // ============ Serialization ===============
    // ==========================================
    /**
     * Serializes the stage to JSON
     * 
     */
    toJSON(): A_TYPES__A_Stage_JSON {
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
        return [
            this._feature.name,
            '::a-stage:',
            '[sync:',
            this
                .syncSteps
                .map(s => typeof s.component === 'string' ? s.component : s.component.name + '.' + s.handler)
                .join(' -> '),
            ']',
            '[async:',
            this
                .asyncSteps
                .map(s => typeof s.component === 'string' ? s.component : s.component.name + '.' + s.handler)
                .join(' -> '),
            ']'
        ].join('');
    }
}   
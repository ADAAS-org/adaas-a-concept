import { A_CommonHelper, A_Error } from "@adaas/a-utils";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status, A_TYPES__A_StageStep, A_TYPES__A_StageStepProcessingExtraParams } from "./A-Stage.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_Scope } from "../A-Scope/A-Scope.class";


/**
 * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
 * Each stage may contain one or more functions. 
 * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
 * 
 * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition. 
 */
export class A_Stage {



    constructor(
        private feature: A_Feature,
        private _steps: A_TYPES__A_StageStep[] = []
    ) {

    }

    status: A_TYPES__A_Stage_Status = A_TYPES__A_Stage_Status.INITIALIZED;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;


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
        step: A_TYPES__A_StageStep,
        scope: A_Scope
    ) {

        return Promise
            .all(A_Context
                .meta(
                    step.component instanceof A_Container
                        ? step.component.constructor
                        : step.component
                )
                .injections(step.handler)
                .map(async arg => {
                    if (A_CommonHelper.isInheritedFrom(arg.target, A_Feature))
                        return this.feature;

                    return scope
                        .merge(A_Context.scope(this.feature))
                        .resolve(arg.target)
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
    protected getStepInstance(step: A_TYPES__A_StageStep) {
        const { component, handler } = step;


        // TODO: probably would be better to do it another way. let's think about it
        const instance = component instanceof A_Container
            ? component
            : A_Context.scope(this.feature).resolve(component);

        if (!instance)
            throw new Error(`Unable to resolve component ${component.name}`);

        if (!instance[handler])
            throw new Error(`Handler ${handler} not found in ${instance.constructor.name}`);

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
        const instance = await this.getStepInstance(step);
        const callArgs = await this.getStepArgs(step, scope);

        return instance[step.handler](...callArgs);
    }


    /**
     * Runs async all the _steps of the stage
     * 
     * @returns 
     */
    async process(
        /**
         * Scope to be used to resolve the steps dependencies
         */
        scope: A_Scope = new A_Scope({}, {}),
        params?: Partial<A_TYPES__A_StageStepProcessingExtraParams>
    ): Promise<void> {
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
                                                await this.callStepHandler(step, scope);
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


    /**
     * Skips the stage
     * 
     */
    skip() {
        this.status = A_TYPES__A_Stage_Status.SKIPPED;

        this.feature.next(this);
    }




    // ==========================================
    // ============ Status methods =============
    // ==========================================

    protected completed() {
        this.status = A_TYPES__A_Stage_Status.COMPLETED;

        this.feature.next(this);
    }

    protected failed(
        error: Error | A_Error | unknown
    ) {
        this.status = A_TYPES__A_Stage_Status.FAILED;

        this.feature.failed(error);
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
            name: 'A_Stage',
            status: this.status,
        }
    }
}   
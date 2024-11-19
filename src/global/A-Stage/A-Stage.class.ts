import { A_CommonHelper, A_Error } from "@adaas/a-utils";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status, A_TYPES__A_StageStep } from "./A-Stage.types";
import { A_Container } from "../A-Container/A-Container.class";



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
        private steps: A_TYPES__A_StageStep[] = []
    ) {

    }

    status: A_TYPES__A_Stage_Status = A_TYPES__A_Stage_Status.INITIALIZED;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;


    get before(): string[] {
        return this.steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), [] as string[]);
    }

    get after(): string[] {
        return this.steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), [] as string[]);
    }


    /**
     * Resolves the arguments of the step
     * 
     * @param step 
     * @returns 
     */
    protected async getStepArgs(step: A_TYPES__A_StageStep) {
        return step.args.map(async arg =>
            // In case if the target is a feature step then pass the current feature
            A_CommonHelper.isInheritedFrom(arg.target, A_Feature)
                ? this
                : A_Context.scope(this.feature).resolve(arg.target)
        );
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
        this.steps.push(step);

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
    protected async getStepHandler(step: A_TYPES__A_StageStep) {

        const instance = this.getStepInstance(step);
        const callArgs = await this.getStepArgs(step);

        return instance[step.handler](...callArgs);

    }


    /**
     * Runs async all the steps of the stage
     * 
     * @returns 
     */
    async process(): Promise<void> {
        if (!this.processed)
            this.processed = new Promise<void>(
                async (resolve, reject) => {
                    try {
                        this.status = A_TYPES__A_Stage_Status.PROCESSING;

                        const syncSteps = this.steps.filter(step => step.behavior === 'sync');
                        const asyncSteps = this.steps.filter(step => step.behavior === 'async');

                        // Run sync steps

                        await Promise
                            .all([

                                // Run async steps that are independent of each other
                                ...asyncSteps.map(step => this.getStepHandler(step)),

                                // Run sync steps that are dependent on each other
                                new Promise<void>(
                                    async (r, j) => {
                                        try {
                                            for (const step of syncSteps) {
                                                await this.getStepHandler(step);
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
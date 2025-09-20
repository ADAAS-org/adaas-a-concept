import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature_Define } from "@adaas/a-concept/decorators/A-Feature/A-Feature-Define.decorator";
import { A_Feature_Extend } from "@adaas/a-concept/decorators/A-Feature/A-Feature-Extend.decorator";
import { A_TYPES__FeatureConstructor, A_TYPES__FeatureState, } from "./A-Feature.types";
import { A_Error, A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__A_Feature_Extend } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { StepsManager } from "@adaas/a-concept/helpers/StepsManager.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_StageError } from "../A-Stage/A-Stage.error";
import { A_FeatureCaller } from "./A-FeatureCaller.class";

/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 * 
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods 
 * across the different, distributed components
 * 
 */
export class A_Feature {


    /**
     * Define a new A-Feature
     */
    static get Define(): typeof A_Feature_Define {
        return A_Feature_Define;
    }


    /**
     * Extend an existing A-Feature
     */
    static get Extend(): A_TYPES__A_Feature_Extend {
        return A_Feature_Extend;
    }


    // protected scope: A_Scope
    protected stages: Array<A_Stage> = [];
    protected _current?: A_Stage;
    protected _caller!: A_FeatureCaller;
    protected _index: number = 0;
    protected SM: StepsManager;

    state: A_TYPES__FeatureState = A_TYPES__FeatureState.INITIALIZED;

    result?: any
    error?: A_Error

    readonly name: string;
    readonly Scope!: A_Scope;


    constructor(
        params: A_TYPES__FeatureConstructor
    ) {
        this.name = params.name || this.constructor.name;
        this.Scope = params.scope

        this.SM = new StepsManager(params.steps);

        this.stages = this.SM.toStages(this);

        this._current = this.stages[0];

        this._caller = new A_FeatureCaller(params.caller);
    }


    /**
     * Returns the current A-Feature Stage
     * 
     */
    get stage(): A_Stage | undefined {
        return this._current;
    }


    get Caller(): A_FeatureCaller {
        return this._caller;
    }


    /**
     * Custom iterator to iterate over the steps of the feature
     * 
     * @returns 
     */
    [Symbol.iterator](): Iterator<A_Stage, any> {
        return {
            // Custom next method
            next: (): IteratorResult<A_Stage, any> => {
                if (!this.isDone()) {

                    this._current = this.stages[this._index];

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




    /**
     * This method checks if the A-Feature is done
     * 
     * @returns 
     */
    isDone(): boolean {
        return !this.stage
            || this._index >= this.stages.length
            || this.state === A_TYPES__FeatureState.COMPLETED
            || this.state === A_TYPES__FeatureState.FAILED;
    }



    /**
     * This method moves the feature to the next stage
     * 
     * @param stage 
     */
    next(stage) {
        const stageIndex = this.stages.indexOf(stage);

        this._index = stageIndex + 1;

        if (this._index >= this.stages.length) {
            this.completed();
        }
    }


    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     * 
     * The result of the feature is a Scope Fragments
     * 
     * @param result 
     * @returns 
     */
    async completed<T extends any>(): Promise<T> {

        this.result = this.Scope.toJSON();

        this.state = A_TYPES__FeatureState.COMPLETED;

        return this.result;
    }


    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     * 
     * @param error 
     */
    async failed(
        error: Error | A_Error | unknown
    ) {
        this.error = error as A_Error;
        this.state = A_TYPES__FeatureState.FAILED;


        await this.errorHandler(error);
    }


    /**
     * This method processes the feature by executing all the stages
     * 
     */
    async process(
        scope?: A_Scope
    ) {
        // console.log('Processing feature:', this.name);

        if (this.isDone()) {
            return this.result;
        }

        try {
            this.state = A_TYPES__FeatureState.PROCESSING;

            for (const stage of this.stages) {
                // console.log('Processing stage:', stage.name);

                await stage.process();

                // console.log('Stage processed:', stage.name, 'Status:', stage.status);
            }


            return await this.completed();


        } catch (error) {

            return await this.failed(error);
        }

    }


    protected async errorHandler(error: Error | A_Error | unknown) {

        switch (true) {
            case error instanceof A_StageError:
                return; // Do nothing, already handled in the stage

            case error instanceof A_Error:
                throw error;

            default:
                throw error;
        }
    }
}
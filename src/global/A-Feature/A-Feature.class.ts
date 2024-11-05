import { A_Feature_Define } from "@adaas/a-concept/decorators/A-Feature/A-Feature-Define.decorator";
import { A_Feature_Extend } from "@adaas/a-concept/decorators/A-Feature/A-Feature-Extend.decorator";
import { A_TYPES__FeatureConstructor, A_TYPES__FeatureIteratorReturn, A_TYPES__FeatureState, A_TYPES__FeatureStep } from "./A-Feature.types";
import { A_Error, A_TYPES__Required } from "@adaas/a-utils";
import { A_Context } from "../A-Context/A-Context.class";



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
    static get Define() {
        return A_Feature_Define;
    }


    /**
     * Extend an existing A-Feature
     */
    static get Extend() {
        return A_Feature_Extend;
    }




    // protected scope: A_Scope
    protected steps: A_TYPES__FeatureStep[] = [];
    protected _current?: A_TYPES__FeatureStep;
    protected _index: number = 0;

    state: A_TYPES__FeatureState = A_TYPES__FeatureState.INITIALIZED;

    result?: any
    error?: A_Error

    constructor(
        params: A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps']>
    ) {
        // this.scope = params.scope;
        this.steps = params.steps;

        A_Context.allocate(this, params);

    }


    /**
     * Custom iterator to iterate over the steps of the feature
     * 
     * @returns 
     */
    [Symbol.iterator](): Iterator<A_TYPES__FeatureIteratorReturn, any> {
        return {
            // Custom next method
            next: (): IteratorResult<A_TYPES__FeatureIteratorReturn, any> => {
                if (this._index < this.steps.length) {
                    if (
                        (this.state as any) === A_TYPES__FeatureState.FAILED
                        ||
                        (this.state as any) === A_TYPES__FeatureState.COMPLETED
                    ) {
                        throw new Error('FEATURE_PROCESSING_INTERRUPTED');
                    }

                    this._current = this.steps[this._index];

                    const { component, handler, args } = this._current;

                    const instance = A_Context.scope(this).resolve(component);

                    return {
                        value: async () => {

                            if (instance[handler]) {
                                const callArgs = A_Context.scope(this).resolve(args.map(arg => arg.target));
                                await instance[handler](...callArgs);
                            }

                            this._index++;
                        },
                        done: false
                    };
                } else {
                    this._current = undefined; // Reset current on end
                    return { value: undefined, done: true };
                }
            }
        };
    }

    // Access the current element
    get current(): A_TYPES__FeatureStep | undefined {
        return this._current;
    }

    // Custom end strategy or stop condition (could be expanded if needed)
    isDone(): boolean {
        return this.current === null;
    }


    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     * 
     * @param result 
     * @returns 
     */
    async completed<T extends any>(
        ...result: T[]
    ): Promise<T> {

        this.result = result;
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



    async process() {
        try {
            this.state = A_TYPES__FeatureState.PROCESSING;

            for (const step of this) {
                await step();
            }

            await this.completed();

        } catch (error) {
            console.log('[!] Feature processing error:', error);

            await this.failed(error);
        }
    }


    protected async errorHandler(error: Error | A_Error | unknown) {
        switch (true) {
            case error instanceof A_Error:
                throw error;


            case error instanceof Error
                && error.message === 'FEATURE_PROCESSING_INTERRUPTED'
                && this.state === A_TYPES__FeatureState.FAILED:
                throw new A_Error({
                    message: 'FEATURE_PROCESSING_INTERRUPTED',
                    code: 'FEATURE_PROCESSING_INTERRUPTED',
                    data: {
                        feature: this
                    }
                });


            case error instanceof Error
                && error.message === 'FEATURE_PROCESSING_INTERRUPTED'
                && this.state === A_TYPES__FeatureState.COMPLETED:

                // Do nothing
                break;

            default:
                throw error;
        }
    }


}
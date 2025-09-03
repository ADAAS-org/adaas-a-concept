import { A_Abstraction_Extend } from "@adaas/a-concept/decorators/A-Abstraction/A-Abstraction-Extend.decorator";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_AbstractionConstructor, A_TYPES__AbstractionState } from "./A-Abstraction.types";
import { A_Error, A_TYPES__Required } from "@adaas/a-utils";
import { A_Scope } from "../A-Scope/A-Scope.class";


export class A_Abstraction {

    public name: string;
    protected features: A_Feature[] = [];
    protected _current?: A_Feature;
    protected _index: number = 0;

    state: A_TYPES__AbstractionState = A_TYPES__AbstractionState.INITIALIZED;
    error?: A_Error


    readonly Scope!: A_Scope;

    /**
     * Define a new A-Abstraction
     */
    static get Extend(): typeof A_Abstraction_Extend {
        return A_Abstraction_Extend;
    }


    constructor(
        /**
         * Parameters to define the A-Abstraction
         */
        params: A_TYPES__A_AbstractionConstructor
    ) {
        this.name = params.name;
        
        this.features = params.features.map(def => new A_Feature(def));

        this._current = this.features[0];
    }


    get feature(): A_Feature | undefined {
        return this._current;
    }


    [Symbol.iterator](): Iterator<A_Feature, any> {
        return {
            // Custom next method
            next: (): IteratorResult<A_Feature, any> => {
                if (!this.isDone()) {

                    this._current = this.features[this._index];

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
     * This method moves the feature to the next stage
     * 
     * @param stage 
     */
    next(stage) {
        const stageIndex = this.features.indexOf(stage);

        this._index = stageIndex + 1;

        if (this._index >= this.features.length) {
            this.completed();
        }
    }

    async completed(): Promise<void> {
        this.state = A_TYPES__AbstractionState.COMPLETED;
    }


    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     * 
     * @param error 
     */
    async failed(
        error: Error | A_Error | unknown
    ): Promise<void> {
        this.error = error as A_Error;
        this.state = A_TYPES__AbstractionState.FAILED;
    }


    /**
     * This method checks if the A-Feature is done
     * 
     * @returns 
     */
    isDone(): boolean {
        return !this.feature
            || this._index >= this.features.length
            || this.state === A_TYPES__AbstractionState.COMPLETED
            || this.state === A_TYPES__AbstractionState.FAILED;
    }


    async process() {
        if (this.isDone())
            return;
        try {
            this.state = A_TYPES__AbstractionState.PROCESSING;

            for (const feature of this.features) {

                await feature.process();
            }

            await this.completed();

        } catch (error) {
            await this.failed(error);
        }

    }
}
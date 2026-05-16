import { A_Abstraction_Extend } from "./A-Abstraction-Extend.decorator";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_TYPES__Abstraction_Init } from "./A-Abstraction.types";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Context } from "@adaas/a-concept/a-context";
import { A_TYPES__ConceptAbstractions } from "@adaas/a-concept/a-concept";
import type { A_Container } from "@adaas/a-concept/a-container";



export class A_Abstraction {

    /**
     * The name of the Abstraction e.g. 'deploy', 'start', 'test', etc.
     */
    protected _name: A_TYPES__ConceptAbstractions;
    /**
     * List of features that are part of this Abstraction
     */
    protected _featuresMap: Map<A_Container, A_Feature> = new Map();
    /**
     * The Feature currently being processed
     */
    protected _current?: A_Feature;
    /**
     * Actual Index of the current Feature being processed
     */
    protected _index: number = 0;


    /**
     * Allows to extends A-Abstraction with additional methods
     */
    static get Extend(): typeof A_Abstraction_Extend {
        return A_Abstraction_Extend;
    }

    /**
     * A-Abstraction is an object that is common for any application. 
     * By providing components and creating abstraction extensions it's possible to create a unique behavior of the whole solution.
     * 
     * Every application has basic abstractions like 'start', 'stop', 'deploy', 'test', etc. 
     * They can be easily extended with additional logic from both containers and components.
     * 
     * 
     * @param params 
     */
    constructor(
        /**
         * Parameters to define the A-Abstraction
         */
        params: A_TYPES__Abstraction_Init
    ) {
        this._name = params.name;

        params.containers.map(container => {
            const template = A_Context.abstractionTemplate(
                this._name,
                container
            );
            const feature = new A_Feature({
                name: this._name,
                component: container,
                template
            });
            this._featuresMap.set(container, feature);
            return feature;
        });

        this._current = this._featuresMap.values().next().value;
    }

    /**
     * Returns the name of the Abstraction
     */
    get name(): string { return this._name; }
    /**
     * Returns the current Feature being processed
     */
    get feature(): A_Feature | undefined {
        return this._current;
    }
    /**
     * This method checks if the A-Feature is done
     * 
     * @returns 
     */
    get isDone(): boolean {
        return !this.feature
            || this._index >= this._featuresMap.size

    }


    [Symbol.iterator](): Iterator<A_Feature, any> {
        return {
            // Custom next method
            next: (): IteratorResult<A_Feature, any> => {
                if (!this.isDone) {

                    this._current = Array.from(this._featuresMap.values())[this._index];

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
     * This method moves the Abstraction processing to the next Feature in the list
     * 
     * @param stage 
     */
    next(stage) {
        if (this._index >= this._featuresMap.size) {
            return;
        }

        const stageIndex = Array.from(this._featuresMap.values()).indexOf(stage);

        this._index = stageIndex + 1;
    }



    /**
     * Allows to process all stages of the Abstraction
     * 
     * @returns 
     */
    async process(
        /**
         * Allows to override the scope in which the Abstraction will be processed
         * 
         */
        scope?: A_Scope
    ) {
        if (this.isDone)
            return;

        for (const [container, feature] of this._featuresMap.entries()) {

            await feature.process(scope || container.scope);
        }
    }
}
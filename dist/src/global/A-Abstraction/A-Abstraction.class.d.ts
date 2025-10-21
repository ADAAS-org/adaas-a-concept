import { A_Abstraction_Extend } from "./A-Abstraction-Extend.decorator";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__Abstraction_Init } from "./A-Abstraction.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
export declare class A_Abstraction {
    /**
     * The name of the Abstraction e.g. 'deploy', 'start', 'test', etc.
     */
    protected _name: string;
    /**
     * List of features that are part of this Abstraction
     */
    protected _features: A_Feature[];
    /**
     * The Feature currently being processed
     */
    protected _current?: A_Feature;
    /**
     * Actual Index of the current Feature being processed
     */
    protected _index: number;
    /**
     * Allows to extends A-Abstraction with additional methods
     */
    static get Extend(): typeof A_Abstraction_Extend;
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
    params: A_TYPES__Abstraction_Init);
    /**
     * Returns the name of the Abstraction
     */
    get name(): string;
    /**
     * Returns the current Feature being processed
     */
    get feature(): A_Feature | undefined;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone(): boolean;
    [Symbol.iterator](): Iterator<A_Feature, any>;
    /**
     * This method moves the Abstraction processing to the next Feature in the list
     *
     * @param stage
     */
    next(stage: any): void;
    /**
     * Allows to process all stages of the Abstraction
     *
     * @returns
     */
    process(
    /**
     * Allows to override the scope in which the Abstraction will be processed
     *
     */
    scope?: A_Scope): Promise<void>;
}

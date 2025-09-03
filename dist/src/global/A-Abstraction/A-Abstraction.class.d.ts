import { A_Abstraction_Extend } from "../../decorators/A-Abstraction/A-Abstraction-Extend.decorator";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_AbstractionConstructor, A_TYPES__AbstractionState } from "./A-Abstraction.types";
import { A_Error } from "@adaas/a-utils";
import { A_Scope } from "../A-Scope/A-Scope.class";
export declare class A_Abstraction {
    name: string;
    protected features: A_Feature[];
    protected _current?: A_Feature;
    protected _index: number;
    state: A_TYPES__AbstractionState;
    error?: A_Error;
    readonly Scope: A_Scope;
    /**
     * Define a new A-Abstraction
     */
    static get Extend(): typeof A_Abstraction_Extend;
    constructor(
    /**
     * Parameters to define the A-Abstraction
     */
    params: A_TYPES__A_AbstractionConstructor);
    get feature(): A_Feature | undefined;
    [Symbol.iterator](): Iterator<A_Feature, any>;
    /**
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage: any): void;
    completed(): Promise<void>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    failed(error: Error | A_Error | unknown): Promise<void>;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    isDone(): boolean;
    process(): Promise<void>;
}

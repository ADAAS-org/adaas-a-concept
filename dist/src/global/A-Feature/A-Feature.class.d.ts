import { A_Feature_Define } from "../../decorators/A-Feature/A-Feature-Define.decorator";
import { A_TYPES__FeatureConstructor, A_TYPES__FeatureIteratorReturn, A_TYPES__FeatureState, A_TYPES__FeatureStep } from "./A-Feature.types";
import { A_Error, A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__A_Feature_Extend } from "../../decorators/A-Feature/A-Feature.decorator.types";
/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 *
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods
 * across the different, distributed components
 *
 */
export declare class A_Feature {
    /**
     * Define a new A-Feature
     */
    static get Define(): typeof A_Feature_Define;
    /**
     * Extend an existing A-Feature
     */
    static get Extend(): A_TYPES__A_Feature_Extend;
    protected steps: A_TYPES__FeatureStep[];
    protected _current?: A_TYPES__FeatureStep;
    protected _index: number;
    state: A_TYPES__FeatureState;
    result?: any;
    error?: A_Error;
    constructor(params: A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps']>);
    /**
     * Custom iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<A_TYPES__FeatureIteratorReturn, any>;
    get current(): A_TYPES__FeatureStep | undefined;
    isDone(): boolean;
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * @param result
     * @returns
     */
    completed<T extends any>(...result: T[]): Promise<T>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    failed(error: Error | A_Error | unknown): Promise<void>;
    process(): Promise<void>;
    protected errorHandler(error: Error | A_Error | unknown): Promise<void>;
}

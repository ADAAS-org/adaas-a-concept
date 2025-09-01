import { A_Feature_Define } from "../../decorators/A-Feature/A-Feature-Define.decorator";
import { A_TYPES__FeatureConstructor, A_TYPES__FeatureState } from "./A-Feature.types";
import { A_Error, A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__A_Feature_Extend } from "../../decorators/A-Feature/A-Feature.decorator.types";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { StepsManager } from "../../helpers/StepsManager.class";
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
    protected stages: Array<A_Stage>;
    protected _current?: A_Stage;
    protected _index: number;
    protected SM: StepsManager;
    state: A_TYPES__FeatureState;
    result?: any;
    error?: A_Error;
    readonly name: string;
    constructor(params: A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps']>);
    /**
     * Custom iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<A_Stage, any>;
    /**
     * Returns the current A-Feature Stage
     *
     */
    get stage(): A_Stage | undefined;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    isDone(): boolean;
    /**
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage: any): void;
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * The result of the feature is a Scope Fragments
     *
     * @param result
     * @returns
     */
    completed<T extends any>(): Promise<T>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    failed(error: Error | A_Error | unknown): Promise<void>;
    /**
     * This method processes the feature by executing all the stages
     *
     */
    process(): Promise<any>;
    protected errorHandler(error: Error | A_Error | unknown): Promise<void>;
}

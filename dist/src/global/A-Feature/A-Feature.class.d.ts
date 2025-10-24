import { A_TYPES__Feature_Init, A_TYPES__Feature_InitWithComponent, A_TYPES__Feature_InitWithTemplate, A_TYPES__FeatureAvailableComponents, A_TYPES__FeatureState } from "./A-Feature.types";
import { A_Feature_Define } from "./A-Feature-Define.decorator";
import { A_Feature_Extend } from "./A-Feature-Extend.decorator";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { A_StepsManager } from "../A-StepManager/A-StepManager.class";
import { A_StageError } from "../A-Stage/A-Stage.error";
import { A_FeatureError } from "./A-Feature.error";
import { A_Caller } from "../A-Caller/A_Caller.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 *
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods
 * across the different, distributed components
 *
 */
export declare class A_Feature<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {
    /**
     * Define a new A-Feature
     */
    static get Define(): typeof A_Feature_Define;
    /**
     * Extend an existing A-Feature
     */
    static get Extend(): typeof A_Feature_Extend;
    /**
     * The name of the Feature
     */
    protected _name: string;
    /**
     * List of stages that are part of this Feature
     */
    protected _stages: Array<A_Stage>;
    /**
     * The Stage currently being processed
     */
    protected _current?: A_Stage;
    /**
     * Actual Index of the current Stage being processed
     */
    protected _index: number;
    /**
     * Steps Manager to organize the steps into stages
     */
    protected _SM: A_StepsManager;
    /**
     * The Caller that initiated the Feature call
     */
    protected _caller: A_Caller<T>;
    /**
     * The current state of the Feature
     */
    protected _state: A_TYPES__FeatureState;
    /**
     * The error that caused the Feature to be interrupted
     */
    protected _error?: A_FeatureError;
    /**
     * A-Feature is a pipeline distributed by multiple components that can be easily attached or detached from the scope.
     * Feature itself does not have scope, but attached to the caller who dictates how feature should be processed.
     *
     * Comparing to A-Command Feature does not store any state except statuses for better analysis.
     *
     * [!] Note: If A-Feature should have result use A-Fragment
     *
     * @param params
     */
    constructor(
    /**
     * Feature Initialization parameters
     */
    params: A_TYPES__Feature_Init<T>);
    /**
     * The name of the Feature
     */
    get name(): string;
    /**
     * The error that caused the Feature to be interrupted
     */
    get error(): A_FeatureError | undefined;
    /**
     * The current state of the Feature
     */
    get state(): A_TYPES__FeatureState;
    /**
     * Sets the current state of the Feature
     */
    get index(): number;
    /**
     * Returns the current A-Feature Stage
     */
    get stage(): A_Stage | undefined;
    /**
     * The Caller that initiated the Feature call
     */
    get caller(): A_Caller<T>;
    /**
     * The Scope allocated for the Feature Execution
     */
    get scope(): A_Scope;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone(): boolean;
    /**
     * Iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<A_Stage, any>;
    /**
     * Validates the provided parameters for A-Feature initialization
     *
     * @param params
     */
    protected validateParams(params: A_TYPES__Feature_Init<T>): void;
    /**
     * Returns the appropriate initializer method based on the provided parameters
     *
     * @param params
     * @returns
     */
    protected getInitializer(params: A_TYPES__Feature_Init<T>): (param1: any) => void | (() => void);
    /**
     * Initializes the A-Feature from the provided template
     *
     * @param params
     */
    protected fromTemplate(params: A_TYPES__Feature_InitWithTemplate<T>): void;
    /**
     * Initializes the A-Feature from the provided component
     *
     * @param params
     */
    protected fromComponent(params: A_TYPES__Feature_InitWithComponent<T>): void;
    /**
     * This method processes the feature by executing all the stages
     *
     */
    process(
    /**
     * Optional scope to be used to resolve the steps dependencies
     * If not provided, the scope of the caller component will be used
     */
    scope?: A_Scope): Promise<void>;
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
     * @param result
     * @returns
     */
    completed(): Promise<void>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    interrupt(
    /**
     * The reason of feature interruption
     */
    reason?: string | A_StageError | Error): Promise<void>;
    toString(): string;
}

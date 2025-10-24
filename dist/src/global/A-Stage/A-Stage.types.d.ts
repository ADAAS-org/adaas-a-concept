import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
export declare enum A_TYPES__A_Stage_Status {
    /**
     * The stage is currently being processed
     */
    PROCESSING = "PROCESSING",
    /**
     * The stage has been completed
     */
    COMPLETED = "COMPLETED",
    /**
     * The stage has failed
     */
    FAILED = "FAILED",
    /**
     * The stage has been skipped
     */
    SKIPPED = "SKIPPED",
    /**
     * The stage has been paused
     */
    /**
     * The stage has been stopped
     */
    /**
     * The stage has been started
     */
    /**
     * The stage has been initialized
     */
    INITIALIZED = "INITIALIZED",
    /**
     * The stage has been aborted
     */
    ABORTED = "ABORTED"
}
export type A_TYPES_StageExecutionBehavior = 'async' | 'sync';
export type A_TYPES__A_StageStep = {
    /**
     * The component to be called
     */
    component: A_TYPES__Component_Constructor | A_Container | string;
    /**
     * The method to be called on the component
     */
    handler: string;
    /**
     * Original Feature Extension name
     *
     * [!] could be string or regex
     *
     */
    name: string;
    /**
     * In case its async it will be executed independently from the main thread.
     *
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     *
     */
    behavior: A_TYPES_StageExecutionBehavior;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    before: string[];
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    after: string[];
    /**
     * Indicates whether to throw an error if the step fails.
     *
     * [!] By default is true
     */
    throwOnError: boolean;
};
export type A_TYPES__Stage_Serialized = {
    /**
     * The name of the stage
     */
    name: string;
    /**
     *  The status of the stage
     *
     */
    status: A_TYPES__A_Stage_Status;
};
export type A_TYPES__A_StageStepProcessingExtraParams = {
    steps: A_TYPES__A_StageStep[];
    filter: (step: A_TYPES__A_StageStep) => boolean;
};

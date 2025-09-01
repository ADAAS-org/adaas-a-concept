import { A_Component } from "../A-Component/A-Component.class"
import { A_Container } from "../A-Container/A-Container.class"
import { A_TYPES__A_ExtendDecorator_BehaviorConfig } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types"



export enum A_TYPES__A_Stage_Status {
    /**
     * The stage is currently being processed
     */
    PROCESSING = 'PROCESSING',
    /**
     * The stage has been completed
     */
    COMPLETED = 'COMPLETED',
    /**
     * The stage has failed
     */
    FAILED = 'FAILED',
    /**
     * The stage has been skipped
     */
    SKIPPED = 'SKIPPED',
    /**
     * The stage has been paused
     */
    // PAUSED = 'PAUSED',
    /**
     * The stage has been stopped
     */
    // STOPPED = 'STOPPED',
    /**
     * The stage has been started
     */
    // STARTED = 'STARTED',
    /**
     * The stage has been initialized
     */
    INITIALIZED = 'INITIALIZED',
    /**
     * The stage has been reset
     */
    // RESET = 'RESET',
    /**
     * The stage has been resumed
     */
    // RESUMED = 'RESUMED',
    /**
     * The stage has been suspended
     */
    // SUSPENDED = 'SUSPENDED',
    /**
     * The stage has been terminated
     */
    // TERMINATED = 'TERMINATED',
    /**
     * The stage has been aborted
     */
    ABORTED = 'ABORTED'
}


export type A_TYPES__A_StageStep = {

    /**
     * The component to be called
     */
    component: typeof A_Component |  A_Container 

    /**
     * The method to be called on the component
     */
    handler: string,

    /**
     * Original Feature Extension name
     * 
     * [!] could be string or regex
     * 
     */
    name: string,

} & A_TYPES__A_ExtendDecorator_BehaviorConfig



export type A_TYPES__A_Stage_JSON = {

    /**
     * The name of the stage
     */
    name: string,

    /**
     *  The status of the stage
     * 
     */
    status: A_TYPES__A_Stage_Status,

}
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types"
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class"
import { A_Scope } from "../A-Scope/A-Scope.class"


export type A_TYPES__FeatureIteratorReturn<T extends any = any> = () => Promise<T>


export type A_TYPES__FeatureCallParams = {
    fragments: Array<A_Fragment>,
    entities: Array<A_Entity<any, any>>,
    components: Array<{ new(...args: any[]): any }>
}



export type A_TYPES__FeatureConstructor = {
    /**
     * Name of the A-Feature
     */
    name:string,
    /**
     * Steps that compose the A-Feature
     */
    steps: A_TYPES__A_StageStep[],
    /**
     * Scope in which the A-Feature will be executed
     */
    scope: A_Scope
}

export enum A_TYPES__FeatureState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",

    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}


// export type A_TYPES__FeatureStep = {
//     /**
//      * The component to be called
//      */
//     component: typeof A_Component,
//     /**
//      * The method to be called on the component
//      */
//     handler: string,
//     /**
//      * Original Feature Extension name
//      * 
//      * [!] could be string or regex
//      * 
//      */
//     name: string,
//     /**
//      * Arguments to be passed to the method
//      */
//     args: A_TYPES__A_InjectDecorator_Meta
// }
import { A_TYPES__A_InjectDecorator_Injectable, A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types"
import { A_Component } from "../A-Component/A-Component.class"
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types"
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Entity } from "index"


export type A_TYPES__FeatureIteratorReturn<T extends any = any> = () => Promise<T>


export type A_TYPES__FeatureCallParams<T extends string> = {
    fragments: Array<A_Fragment>,
    entities: Array<A_Entity<any, any, any>>,
    components: Array<{ new(...args: any[]): any }>
}



export type A_TYPES__FeatureConstructor = {
    steps: A_TYPES__A_StageStep[]
} & A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig

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
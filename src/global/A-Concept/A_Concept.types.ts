import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_TYPES__A_ExtendDecorator_BehaviorConfig } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";


export enum A_TYPES__ConceptStage {
    Run = 'run',
    Build = 'build',
    Publish = 'publish',
    Deploy = 'deploy',
    Load = 'load',
    Start = 'start',
    Stop = 'stop',
}


// export type A_TYPES__ConceptMeta = {
//     [A_TYPES__ConceptMetaKey.EXTENSIONS]: Map<string, A_TYPES__ConceptMeta_ExtensionItem>,
//     [A_TYPES__ConceptMetaKey.FEATURES]: any[],
//     // [A_TYPES__ConceptMetaKey.INJECTIONS]: Map<
//     //     // Where key is method name
//     //     Symbol | string,
//     //     // And value is Injection instructions
//     //     A_TYPES__ConceptMeta_InjectionParams
//     // >

// }

export enum A_TYPES__ConceptMetaKey {
    LIFECYCLE = 'a-component-extensions',
}


export interface A_TYPES__IConceptConstructor<
    T extends Array<A_Container<any>>
> {
    name: string,

    /**
     * A set of Context Fragments to register globally for the concept.
     * These fragments will be available in the global context.
     * 
     */
    fragments?: Array<A_Fragment>,


    /**
     * A set of Containers that the concept depends on. 
     * These containers will create a new Container for the concept.
     */
    containers?: T,


    /**
     * A set of external Concepts that can be used in the current Concept. 
     * To provide additional functionality or extend the current Concept.
     */
    // import?: Array<A_Concept>
}


/**
 * Uses as a transfer object to pass configurations to Feature constructor
 */
export type A_TYPES__ConceptAbstractionMeta = {
    /**
     * The name of original Extension Definition
     */
    name: string,
    /**
     * The name of the handler that will be used to apply the extension
     */
    handler: string,
    /**
     * The arguments that will be passed to the handler
     */
    args: A_TYPES__A_InjectDecorator_Meta
} & A_TYPES__A_ExtendDecorator_BehaviorConfig



/**
 * Uses to define the extension that will be applied to the Concept
 */
export type A_TYPES__ConceptAbstraction = {
    /**
     * The name of original Extension Definition
     */
    name: string,
    /**
     * The name of the handler that will be used to apply the extension
     */
    handler: string,
} & A_TYPES__A_ExtendDecorator_BehaviorConfig





// =======================================================================
// =======================================================================
// ===================== A CONCEPT LIFE CYCLE ============================
// =======================================================================
// =======================================================================

export type A_TYPES__ConceptStageParams = {
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): A_Component }>,
    entities: Array<{ new(...args: any[]): A_Entity }>
}


export type A_TYPES__ConceptCallParams<T extends string> = {
    name: T,
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): A_Component }>,
    entities: Array<{ new(...args: any[]): A_Entity<any, any, any> }>
}




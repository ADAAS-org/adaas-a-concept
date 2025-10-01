import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_TYPES__A_ExtendDecorator_BehaviorConfig } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";
import { A_Command } from "../A-Command/A-Command.class";


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
    T extends Array<A_Container>
> {
    name?: string,

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
     * A set of Entities that the concept can use. 
     * These components will be used in the concept.
     */
    entities?: Array<A_Entity>


    /**
     * A set of Components available for all containers and fragments in the concept. 
     * These components will be registered in the root scope of the concept.
     * 
     * [!] Note that these components will be available in all containers and fragments in the concept.
     */
    components?: Array<{ new(...args: any[]): A_Component }>


    /**
     * A set of Commands available for all containers and fragments in the concept. 
     * These commands will be registered in the root scope of the concept.
     * 
     * [!] Note that these commands will be available in all containers and fragments in the concept.
     */
    commands?: Array<{ new(...args: any[]): A_Command }>
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

export type A_TYPES__ConceptAbstractionCallParams = {
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): A_Component }>,
    entities: Array<A_Entity>
}


export type A_TYPES__ConceptCallParams<T extends string> = {
    name: T,
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): A_Component }>,
    entities: Array<{ new(...args: any[]): A_Entity }>
}




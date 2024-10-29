import { A_Container } from "../A-Container/A-Container.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";


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




// =======================================================================
// =======================================================================
// ===================== A CONCEPT LIFE CYCLE ============================
// =======================================================================
// =======================================================================

export type A_TYPES__ConceptStageParams = {
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): any }>
}


export type A_TYPES__ConceptCallParams<T extends string> = {
    name: T,
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): any }>
}
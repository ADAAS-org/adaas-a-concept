import { A_Container } from "../A-Container/A-Container.class";
import { A_Concept } from "./A-Concept.class";
import { A_TYPES__FeatureExtendDecoratorMeta } from "../A-Feature/A-Feature.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_TYPES__Fragment_Constructor } from "../A-Fragment/A-Fragment.types";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_TYPES__A_InjectDecorator_Meta } from "../A-Inject/A-Inject.types";
import { A_TYPES__Ctor } from "@adaas/a-concept/types/A_Common.types";


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Concept constructor type
 * Uses the generic type T to specify the type of the concept
 */
export type A_TYPES__Concept_Constructor<T = A_Concept> = A_TYPES__Ctor<T>;
/**
 * Concept initialization type
 * Uses the generic type T to specify the type of containers that the concept will use
 */
export type A_TYPES__Concept_Init<
    T extends Array<A_Container>
> = {
    /**
     * The name of the Concept
     * If name is not provided, will be used from environment variable A_CONCEPT_NAME
     * 
     * By default, the name of the Concept is 'a-concept'
     * 
     */
    name?: string,
    /**
     * A set of Context Fragments to register globally for the concept.
     * These fragments will be available in the global context.
     * 
     */
    fragments?: Array<InstanceType<A_TYPES__Fragment_Constructor>>,
    /**
     * A set of Containers that the concept depends on. 
     * These containers will create a new Container for the concept.
     */
    containers?: T,
    /**
     * A set of Entities that the concept can use. 
     * These components will be used in the concept.
     */
    entities?: Array<InstanceType<A_TYPES__Entity_Constructor> | A_TYPES__Entity_Constructor>
    /**
     * A set of Components available for all containers and fragments in the concept. 
     * These components will be registered in the root scope of the concept.
     * 
     * [!] Note that these components will be available in all containers and fragments in the concept.
     */
    components?: Array<A_TYPES__Component_Constructor>
}
/**
 * Concept serialized type
 */
export type A_TYPES__Concept_Serialized = {

};


// ============================================================================
// --------------------------- Meta Types -------------------------------------
// ============================================================================
/**
 * Uses as a transfer object to pass configurations to Feature constructor
 */
export type A_TYPES__ConceptAbstractionMeta = {
    /**
     * The arguments that will be passed to the handler
     */
    args: A_TYPES__A_InjectDecorator_Meta
} & A_TYPES__FeatureExtendDecoratorMeta



/**
 * Uses to define the extension that will be applied to the Concept
 */
export type A_TYPES__ConceptAbstraction = A_TYPES__FeatureExtendDecoratorMeta

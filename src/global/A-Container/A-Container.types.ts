import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/global/A-Inject/A-Inject.types";
import { A_TYPES__ConceptAbstraction, } from "../A-Concept/A-Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__Scope_Init } from "../A-Scope/A-Scope.types";
import { A_TYPES__ContainerMetaKey } from "./A-Container.constants";
import { A_Container } from "./A-Container.class";
import { A_TYPES__FeatureDefineDecoratorMeta, A_TYPES__FeatureExtendDecoratorBehaviorConfig, A_TYPES__FeatureExtendDecoratorMeta } from "../A-Feature/A-Feature.types";


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Container constructor type
 * Uses the generic type T to specify the type of the container
 */
export type A_TYPES__Container_Constructor<T = A_Container> = new (...args: any[]) => T;
/**
 * Container initialization type
 */
export type A_TYPES__Container_Init = {
    /**
     * The extra name for the container (optional)
     */
    name?: string,
} & A_TYPES__Scope_Init;
/**
 * Container serialized type
 */
export type A_TYPES__Container_Serialized = {
    /**
     * The ASEID of the container
     */
    aseid: string
};



// =======================================================================
// ----------------------- A CONTAINER META-------------------------------
// =======================================================================
/**
 * Meta information stored in each Container
 */
export type A_TYPES__ContainerMeta = {
    /**
     * Extensions applied to the component per handler
     */
    [A_TYPES__ContainerMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[]
    }>,
    [A_TYPES__ContainerMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         * 
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta
    }>
    [A_TYPES__ContainerMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__ConceptAbstraction[]
    }>,
    [A_TYPES__ContainerMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         * 
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta
    }>
}


export type A_TYPES__ContainerMetaExtension = {
    /**
     * The name of original Extension Definition
     */
    name: string,
    /**
     * The name of the handler that will be used to apply the extension
     */
    handler: string,
} & A_TYPES__FeatureExtendDecoratorBehaviorConfig
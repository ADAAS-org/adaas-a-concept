import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/global/A-Inject/A-Inject.types"
import { A_Meta } from "../A-Meta/A-Meta.class"
import { A_TYPES__ConceptAbstraction } from "../A-Concept/A-Concept.types"
import { A_Component } from "./A-Component.class"
import { A_TYPES__ComponentMetaKey } from "./A-Component.constants"
import { A_TYPES__FeatureDefineDecoratorMeta,  A_TYPES__FeatureExtendDecoratorMeta } from "../A-Feature/A-Feature.types"
import { A_TYPES__Ctor } from "@adaas/a-concept/types/A_Common.types"






// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Component constructor type
 * Uses the generic type T to specify the type of the component
 */
export type A_TYPES__Component_Constructor<T = A_Component> = A_TYPES__Ctor<T>;
/**
 * Component initialization type
 */
export type A_TYPES__Component_Init = any;
/**
 * Component serialized type
 */
export type A_TYPES__Component_Serialized = {
    /**
     * The ASEID of the component
     */
    aseid: string
};



// ============================================================================
// --------------------------- Meta Types -------------------------------------
// ============================================================================
/**
 * Component meta type
 */
export type A_TYPES__ComponentMeta = {
    /**
     * Extensions applied to the component per handler
     */
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[]
    }>,
    /**
     * Features defined on the component per handler
     */
    [A_TYPES__ComponentMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         * 
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta
    }>
    /**
     * Injections defined on the component per handler
     */
    [A_TYPES__ComponentMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         * 
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta
    }>
    /**
     *  Abstractions extended by the component per handler
     */
    [A_TYPES__ComponentMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key is the name of the stage
         * 
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__ConceptAbstraction[]
    }>
}



export type A_TYPES__ComponentMetaExtension = A_TYPES__FeatureExtendDecoratorMeta



import { A_Meta } from "@adaas/a-concept/a-meta";
import { A_Entity } from "./A-Entity.class";
import { ASEID } from "@adaas/a-concept/aseid";
import { A_TYPES__EntityMetaKey } from "./A-Entity.constants";
import { A_TYPES__FeatureDefineDecoratorMeta, A_TYPES__FeatureExtendDecoratorMeta } from "@adaas/a-concept/a-feature";
import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/a-inject";
import { A_TYPES__Ctor } from "@adaas/a-concept/types";


/**
 * Entity interface
 */
export interface A_TYPES__IEntity {
    /**
     * The ASEID of the entity
     */
    aseid: ASEID
};

// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Entity constructor type
 * Uses the generic type T to specify the type of the entity
 */
export type A_TYPES__Entity_Constructor<T = A_Entity> = A_TYPES__Ctor<T>;
/**
 * Entity initialization type
 */
export type A_TYPES__Entity_Init = any;
/**
 * Entity serialized type
 */
export type A_TYPES__Entity_Serialized = {
    /**
     * The ASEID of the entity
     */
    aseid: string
};



// ============================================================================
// --------------------------- Meta Types -------------------------------------
// ============================================================================
/**
 * Entity meta type
 */
export type A_TYPES__EntityMeta = {
    [A_TYPES__EntityMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[]

    }>, case


    [A_TYPES__EntityMetaKey.FEATURES]: A_Meta<{
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
    [A_TYPES__EntityMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         * 
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta
    }>
}







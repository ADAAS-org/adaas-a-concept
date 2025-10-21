import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_Entity } from "./A-Entity.class";
import { ASEID } from "../ASEID/ASEID.class";
import { A_TYPES__EntityMetaKey } from "./A-Entity.constants";
import { A_TYPES__FeatureDefineDecoratorMeta, A_TYPES__FeatureExtendDecoratorMeta } from "../A-Feature/A-Feature.types";
/**
 * Entity interface
 */
export interface A_TYPES__IEntity {
    /**
     * The ASEID of the entity
     */
    aseid: ASEID;
}
/**
 * Entity constructor type
 * Uses the generic type T to specify the type of the entity
 */
export type A_TYPES__Entity_Constructor<T = A_Entity> = new (...args: any[]) => T;
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
    aseid: string;
};
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
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[];
    }>;
    case: any;
    [A_TYPES__EntityMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta;
    }>;
};

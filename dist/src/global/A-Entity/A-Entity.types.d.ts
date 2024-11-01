import { ASEID } from "@adaas/a-utils";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
export type A_TYPES__EntityCallParams<T extends string> = {
    name: T;
    fragments: Array<A_Fragment>;
    components: Array<{
        new (...args: any[]): any;
    }>;
};
export type A_TYPES__EntityBaseMethods = [
    A_TYPES__EntityBaseMethod.SAVE,
    A_TYPES__EntityBaseMethod.UPDATE,
    A_TYPES__EntityBaseMethod.DESTROY,
    A_TYPES__EntityBaseMethod.LOAD
];
export declare enum A_TYPES__EntityBaseMethod {
    SAVE = "save",
    UPDATE = "update",
    DESTROY = "destroy",
    LOAD = "load"
}
export interface A_TYPES__IEntity {
    /**
     * The ASEID of the entity
     */
    aseid: ASEID;
}
export type A_TYPES__Entity_JSON = {
    /**
     * The ASEID of the entity
     */
    aseid: string;
};
export type A_TYPES__EntityMeta = {
    [A_TYPES__EntityMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__EntityMeta_ExtensionItem[];
    }>;
    case: any;
    [A_TYPES__EntityMetaKey.FEATURES]: any[];
};
export declare enum A_TYPES__EntityMetaKey {
    EXTENSIONS = "a-component-extensions",
    FEATURES = "a-component-features"
}
export type A_TYPES__EntityMeta_ExtensionItem = {
    name: string;
    handler: string;
};

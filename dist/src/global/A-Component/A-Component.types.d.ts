import { A_TYPES__A_InjectDecorator_Meta } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__A_DefineDecorator_Meta, A_TYPES__A_ExtendDecorator_BehaviorConfig, A_TYPES__A_ExtendDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
import { A_TYPES__ConceptAbstraction } from "../A-Concept/A_Concept.types";
export type A_TYPES__ComponentConstructor<_Exports extends Array<String> = any> = {
    exports: _Exports;
};
export type A_TYPES__ComponentCallParams<T extends string> = {
    name: T;
    fragments: Array<A_Fragment>;
    components: Array<{
        new (...args: any[]): any;
    }>;
};
export type A_TYPES__ComponentMeta = {
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__A_ExtendDecorator_Meta[];
    }>;
    [A_TYPES__ComponentMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__A_DefineDecorator_Meta;
    }>;
    [A_TYPES__ComponentMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta;
    }>;
    [A_TYPES__ComponentMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key is the name of the stage
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__ConceptAbstraction[];
    }>;
};
export declare enum A_TYPES__ComponentMetaKey {
    EXTENSIONS = "a-component-extensions",
    FEATURES = "a-component-features",
    INJECTIONS = "a-component-injections",
    ABSTRACTIONS = "a-component-abstractions"
}
export type A_TYPES__ComponentMetaExtension = {
    /**
     * The name of original Extension Definition
     */
    name: string;
    /**
     * The name of the handler that will be used to apply the extension
     */
    handler: string;
} & A_TYPES__A_ExtendDecorator_BehaviorConfig;

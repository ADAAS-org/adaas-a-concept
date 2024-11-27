import { A_TYPES__A_InjectDecorator_Meta } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_TYPES__ConceptAbstraction } from "../A-Concept/A_Concept.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_TYPES__A_DefineDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
export type A_TYPES__ContainerConstructor<_Exports extends Array<String>> = {
    name?: string;
    exports: _Exports;
} & A_TYPES__ScopeConstructor;
export type A_TYPES__ContainerCallParams<T extends string> = {
    name: T;
    fragments: Array<A_Fragment>;
    components: Array<{
        new (...args: any[]): any;
    }>;
};
export type A_TYPES__ContainerMeta = {
    [A_TYPES__ContainerMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__A_DefineDecorator_Meta;
    }>;
    [A_TYPES__ContainerMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__ConceptAbstraction[];
    }>;
    [A_TYPES__ContainerMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta;
    }>;
};
export declare enum A_TYPES__ContainerMetaKey {
    FEATURES = "a-container-features",
    INJECTIONS = "a-container-injections",
    ABSTRACTIONS = "a-container-abstractions"
}
export type A_TYPES__ContainerMeta_FeatureItem = {
    name: string;
    container: string;
    handler: string;
};

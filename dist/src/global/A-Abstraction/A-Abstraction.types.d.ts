import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
export type A_TYPES__A_AbstractionConstructor = {
    /**
     * Name of the A-Abstraction
     */
    name: string;
    /**
     * Features that compose the A-Abstraction
     */
    features: Array<A_TYPES__FeatureConstructor>;
    /**
     * Scope in which the A-Abstraction will be executed
     */
    scope: A_Scope;
};
export declare enum A_TYPES__AbstractionState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

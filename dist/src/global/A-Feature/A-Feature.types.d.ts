import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
export type A_TYPES__FeatureConstructor = {
    steps: A_TYPES__FeatureStep[];
} & A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig;
export declare enum A_TYPES__FeatureState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export type A_TYPES__FeatureStep = {
    component: {
        new (...args: any[]): any;
    };
    handler: string;
    args: any[];
};

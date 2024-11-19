import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
export type A_TYPES__FeatureIteratorReturn<T extends any = any> = () => Promise<T>;
export type A_TYPES__FeatureConstructor = {
    steps: A_TYPES__A_StageStep[];
} & A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig;
export declare enum A_TYPES__FeatureState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

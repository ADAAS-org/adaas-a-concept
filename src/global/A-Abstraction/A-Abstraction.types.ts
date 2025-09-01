import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";



export type A_TYPES__A_AbstractionConstructor = {
    name: string,
    features: Array<A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps']>>
} & A_TYPES__ScopeConstructor



export enum A_TYPES__AbstractionState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",

    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}
import { A_Component } from "../A-Component/A-Component.class"
import { A_TYPES__ComponentMeta_InjectionParam, A_TYPES__ComponentMeta_InjectionParams } from "../A-Component/A-Component.types"
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types"


export type A_TYPES__FeatureIteratorReturn<T extends any = any> = () => Promise<T>


export type A_TYPES__FeatureConstructor = {
    steps: A_TYPES__FeatureStep[]
} & A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig

export enum A_TYPES__FeatureState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",

    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}


export type A_TYPES__FeatureStep = {
    component: typeof A_Component,
    handler: string,
    args: A_TYPES__ComponentMeta_InjectionParams
}
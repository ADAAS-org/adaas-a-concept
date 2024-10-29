import { A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";



export type A_TYPES__ContainerConstructor<_Exports extends Array<String>> = {
    name?: string,
    exports: _Exports,
} & A_TYPES__ScopeConstructor


export type A_TYPES__ContainerCallParams<T extends string> = {
    name: T,
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): any }>
}

export type A_TYPES__ContainerMeta = {
    [A_TYPES__ContainerMetaKey.FEATURES]: Map<string, A_TYPES__ContainerMeta_FeatureItem>
    [A_TYPES__ContainerMetaKey.STAGES]: Map<string, A_TYPES__ContainerMeta_StageExtension>
}


export enum A_TYPES__ContainerMetaKey {
    FEATURES = 'a-container-features',
    STAGES = 'a-container-stages',
}

export type A_TYPES__ContainerMeta_StageExtension = {
    name: A_TYPES__ConceptStage,
    handler: string,
}


export type A_TYPES__ContainerMeta_FeatureItem = {
    name: string,
    container: string,
    handler: string,
}
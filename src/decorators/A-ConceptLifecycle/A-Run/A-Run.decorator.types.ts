import { A_TYPES__A_CONCEPT_RootRunParams } from "@adaas/a-concept/global/A-Concept/A_Concept.types"
import { A_TYPES__ConceptLifecycle_MethodDeclarationConfig } from "../A-ConceptLifecycle.decorator.types"

export type A_TYPES__A_RunDecoratorDescriptor =
    TypedPropertyDescriptor<(
        params: A_TYPES__A_CONCEPT_RootRunParams
    ) => any>
    |
    TypedPropertyDescriptor<(
    ) => any>
    |
    TypedPropertyDescriptor<(
        params: A_TYPES__A_CONCEPT_RootRunParams
    ) => Promise<any>>
    |
    TypedPropertyDescriptor<(
    ) => Promise<any>>


export type A_TYPES__A_RunDecoratorConfig = {

} & A_TYPES__ConceptLifecycle_MethodDeclarationConfig


export type A_TYPES__A_RunDecoratorStorageInstruction = {
    handler: string,
    config: A_TYPES__A_RunDecoratorConfig
}

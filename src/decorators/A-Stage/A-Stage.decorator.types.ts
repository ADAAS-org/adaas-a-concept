import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class"
import { A_TYPES__ConceptStage } from "@adaas/a-concept/global/A-Concept/A_Concept.types"

export type A_TYPES__A_StageDecoratorDescriptor =

    TypedPropertyDescriptor<() => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => Promise<any>>
    |
    TypedPropertyDescriptor<() => Promise<any>>


export type A_TYPES__A_StageDecoratorConfig = {
}




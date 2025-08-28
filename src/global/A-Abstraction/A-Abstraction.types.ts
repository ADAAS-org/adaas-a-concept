import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";



export type A_TYPES__A_AbstractionConstructor = {
    name: string,
    definition: A_TYPES__AbstractionDefinition
} & A_TYPES__ScopeConstructor



export type A_TYPES__AbstractionDefinition = Array<{
    container: A_Container<any>
    steps: Array<A_TYPES__A_StageStep>
}>
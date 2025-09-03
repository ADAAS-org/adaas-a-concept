import { A_Container } from "../A-Container/A-Container.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ConceptStage } from "./A_Concept.types";
import { A_TYPES__A_AbstractionConstructor } from "../A-Abstraction/A-Abstraction.types";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
export declare class A_ConceptMeta extends A_Meta<any> {
    private containers;
    private base;
    constructor(containers: Array<A_Container>, base: A_Container);
    abstractionDefinition(method: A_TYPES__ConceptStage, scope: A_Scope): A_TYPES__A_AbstractionConstructor;
    abstraction(method: A_TYPES__ConceptStage, scope: A_Scope): A_Abstraction;
}

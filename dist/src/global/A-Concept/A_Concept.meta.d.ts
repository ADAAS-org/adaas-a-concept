import { A_Container } from "../A-Container/A-Container.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ConceptAbstractionCallParams, A_TYPES__ConceptStage } from "./A_Concept.types";
import { A_TYPES__A_AbstractionConstructor } from "../A-Abstraction/A-Abstraction.types";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
export declare class A_ConceptMeta extends A_Meta<any> {
    private containers;
    private base;
    constructor(containers: Array<A_Container>, base: A_Container);
    abstractionDefinition(method: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ConceptAbstractionCallParams>): A_TYPES__Required<Partial<A_TYPES__A_AbstractionConstructor>, ['features']>;
    abstraction(method: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ConceptAbstractionCallParams>): A_Abstraction;
}

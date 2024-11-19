import { A_TYPES__ConceptAbstractionMeta, A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ContainerMeta } from "./A-Container.types";
export declare class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: A_TYPES__ConceptStage): A_TYPES__ConceptAbstractionMeta[];
}

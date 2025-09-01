import { A_TYPES__A_InjectDecorator_Meta } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_TYPES__ConceptAbstractionMeta, A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ContainerMeta } from "./A-Container.types";
import { A_TYPES__A_DefineDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
export declare class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler: string): A_TYPES__A_InjectDecorator_Meta;
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta>;
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: A_TYPES__ConceptStage): A_TYPES__ConceptAbstractionMeta[];
}

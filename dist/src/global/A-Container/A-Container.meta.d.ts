import { A_TYPES__ContainerMeta, A_TYPES__ContainerMetaExtension } from "./A-Container.types";
import { A_TYPES__A_InjectDecorator_Meta } from "../A-Inject/A-Inject.types";
import { A_TYPES__ConceptAbstractionMeta } from "../A-Concept/A-Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__FeatureDefineDecoratorMeta } from "../A-Feature/A-Feature.types";
import { A_TYPES__ConceptAbstractions } from "../A-Concept/A-Concept.constants";
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
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta>;
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: A_TYPES__ConceptAbstractions): A_TYPES__ConceptAbstractionMeta[];
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature: string): A_TYPES__ContainerMetaExtension[];
}

import { A_TYPES__A_InjectDecorator_Meta } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_TYPES__ConceptAbstractionMeta } from "../A-Concept/A_Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ComponentMeta, A_TYPES__ComponentMetaExtension } from "./A-Component.types";
import { A_TYPES__A_DefineDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
export declare class A_ComponentMeta extends A_Meta<A_TYPES__ComponentMeta> {
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler: string): A_TYPES__A_InjectDecorator_Meta;
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature: string): A_TYPES__ComponentMetaExtension[];
    /**
     * Returns all features defined in the Component
     *
     * @returns
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta>;
    /**
     * Returns a set of instructions to run proper methods in Component during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: any): A_TYPES__ConceptAbstractionMeta[];
}
